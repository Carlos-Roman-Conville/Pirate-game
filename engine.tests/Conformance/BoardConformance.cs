using System.Diagnostics;
using Xunit.Abstractions;

namespace Archive.Engine.Tests.Conformance;

/// <summary>
/// The board kit's conformance suite (lobby/TRADITIONAL_GAMES.md §5.3), one generic class every board game points at its
/// own engine by subclassing it once (engine.tests/Games/&lt;Id&gt;/&lt;Id&gt;SimTests.cs). xUnit runs the inherited facts on
/// the subclass. Gates:
///   1. Fuzz: random vs random from many seeds (and the weakest AI vs random): every game ends, no engine error, and
///      no unfinished position offers zero options.
///   2. Replay: the same seed and players give the same game twice, and recorded answers alone replay a game to the
///      identical state and event log.
///   3. Known counts: positions (or move sequences) reachable N plies from the start, checked once by hand and frozen
///      here (perft); a game with no countable tree says why in <see cref="NoKnownCountsBecause"/>.
///   4. AI strength: each level wins at least <see cref="StrengthGate.VsRandom"/> of its decisive games against a random
///      player over 200 seat-swapped games; each level beats the one below it over 100; the strongest answers in under a
///      second. Luck-heavy games (Senet, Pachisi, Goose, Liar's Dice) can't reach 95%: they set the measured level and the
///      RULES.md D-row that records it (ISSUES I-082).
///   5. Redaction: a seat's view never holds another seat's hidden data (<see cref="Leaks"/>; trivially true without any).
/// Contract tests (lobby manifest, tokens, exactly one match.finished) live beside it in &lt;Id&gt;MatchTests.cs.
/// Board kit (_template/board-kit): copied into the game when it was stamped and the game's own from then on.
/// </summary>
public abstract class BoardConformance(ITestOutputHelper output)
{
    /// <summary>A player for <see cref="Play"/>: <see cref="Random"/> or an AI level 0 (weakest) .. Levels - 1.</summary>
    public const int Random = -1;

    /// <summary>One game as the suite sees it. Fingerprint is anything that tells two games apart (final position and
    /// event count, or the event log as text). Stuck: the game stopped unfinished with no option to pick.</summary>
    public sealed record Played(int? Winner, bool Ended, bool Stuck, string Fingerprint);

    /// <summary>The strength gate. VsRandom is the share of decisive games each level must win against random.</summary>
    public sealed record StrengthGate(double VsRandom, string? Ruling = null)
    {
        public static StrengthGate Standard { get; } = new(0.95);
        /// <summary>A luck-heavy game: the measured level, recorded as RULES.md <paramref name="ruling"/>.</summary>
        public static StrengthGate LuckHeavy(double measured, string ruling) => new(measured, ruling);
    }

    /// <summary>How many AI levels the game has (easy, medium, hard = 3).</summary>
    protected abstract int Levels { get; }

    /// <summary>Plays a whole game from <paramref name="seed"/>: each seat <see cref="Random"/> (seeded from the seed and
    /// the seat) or an AI level. Must be thread-safe (new game and new players per call): the suite runs games in parallel.</summary>
    protected abstract Played Play(int seed, int seat0, int seat1);

    /// <summary>Plays a game with every answer recorded, then replays it from the seed and the answers alone; returns
    /// both fingerprints (the server's solo and match sessions work exactly this way).</summary>
    protected abstract (string Live, string Replayed) RecordAndReplay(int seed);

    /// <summary>Known counts: (plies, count) pairs from the start position.</summary>
    protected virtual IEnumerable<(int Plies, long Count)> KnownCounts => [];
    /// <summary>The count for <paramref name="plies"/> from the start (perft), when <see cref="KnownCounts"/> has any.</summary>
    protected virtual long Count(int plies) => throw new NotSupportedException();
    /// <summary>Why the game has no known counts (a dice game whose tree is chance), or null.</summary>
    protected virtual string? NoKnownCountsBecause => null;

    protected virtual StrengthGate Strength => StrengthGate.Standard;
    /// <summary>True for a game small enough to be solved (the placeholder's three in a row): equal levels draw, so the
    /// ladder asks only "never worse" instead of "more wins than losses".</summary>
    protected virtual bool Solved => false;
    protected virtual int FuzzSeeds => 500;
    protected virtual TimeSpan MoveLimit => TimeSpan.FromSeconds(1);
    /// <summary>The slowest single answer of the strongest level over one AI-vs-AI game from <paramref name="seed"/>.</summary>
    protected abstract TimeSpan SlowestMove(int seed);
    /// <summary>Anything a seat's view shows of another seat's hidden data over a game from <paramref name="seed"/>; empty is right.</summary>
    protected virtual IEnumerable<string> Leaks(int seed) => [];

    [Fact]
    public void Fuzz_every_game_ends_and_never_sticks()
    {
        var bad = new System.Collections.Concurrent.ConcurrentBag<string>();
        Parallel.For(1, FuzzSeeds + 1, seed =>
        {
            Check(seed, Play(seed, Random, Random));
            if (seed <= 50) Check(seed, Play(seed, 0, Random));
        });
        Assert.True(bad.IsEmpty, string.Join("; ", bad.Take(10)));

        void Check(int seed, Played p)
        {
            if (p.Stuck) bad.Add($"seed {seed}: stuck with no option");
            else if (!p.Ended) bad.Add($"seed {seed}: didn't end");
        }
    }

    [Fact]
    public void Replay_is_identical()
    {
        for (var seed = 1; seed <= 10; seed++)
        {
            Assert.Equal(Play(seed, Levels - 1, Random).Fingerprint, Play(seed, Levels - 1, Random).Fingerprint);
            var (live, replayed) = RecordAndReplay(seed);
            Assert.Equal(live, replayed);
        }
    }

    [Fact]
    public void Known_counts_from_the_start()
    {
        var known = KnownCounts.ToList();
        if (known.Count == 0)
        {
            Assert.True(NoKnownCountsBecause is { Length: > 0 }, "give KnownCounts (checked by hand once) or NoKnownCountsBecause");
            output.WriteLine($"no known counts: {NoKnownCountsBecause}");
            return;
        }
        foreach (var (plies, count) in known) Assert.Equal(count, Count(plies));
    }

    [Fact]
    public void Each_level_beats_random()
    {
        for (var level = 0; level < Levels; level++)
        {
            var (wins, losses) = Match(level, Random, 200);
            var share = wins + losses == 0 ? 1.0 : wins / (double)(wins + losses);
            output.WriteLine($"level {level} vs random: {wins} won, {losses} lost, {share:P0} of decisive games");
            Assert.True(share >= Strength.VsRandom,
                $"level {level} won {share:P0} of decisive games against random, gate {Strength.VsRandom:P0}{(Strength.Ruling is { } r ? $" ({r})" : "")}");
        }
    }

    [Fact]
    public void Each_level_beats_the_one_below()
    {
        for (var level = 1; level < Levels; level++)
        {
            var (wins, losses) = Match(level, level - 1, 100);
            output.WriteLine($"level {level} vs {level - 1}: {wins} won, {losses} lost");
            if (Solved) Assert.True(wins >= losses, $"level {level} lost more than it won against level {level - 1}");
            else Assert.True(wins > losses, $"level {level} won {wins} and lost {losses} against level {level - 1}");
        }
    }

    [Fact]
    public void Strongest_level_answers_in_time()
    {
        var slowest = SlowestMove(5);
        output.WriteLine($"slowest answer {slowest.TotalMilliseconds:F0} ms");
        Assert.True(slowest < MoveLimit, $"slowest answer took {slowest.TotalMilliseconds:F0} ms");
    }

    [Fact]
    public void Views_never_show_another_seats_hidden_data()
    {
        for (var seed = 1; seed <= 20; seed++) Assert.Empty(Leaks(seed));
    }

    /// <summary>Wins and losses for <paramref name="a"/> against <paramref name="b"/>, seats swapped every other game, in parallel.</summary>
    (int Wins, int Losses) Match(int a, int b, int games)
    {
        int wins = 0, losses = 0;
        Parallel.For(0, games, i =>
        {
            var seed = 1000 + i;
            var aSeat = i % 2;
            var p = aSeat == 0 ? Play(seed, a, b) : Play(seed, b, a);
            if (p.Winner == aSeat) Interlocked.Increment(ref wins);
            else if (p.Winner is not null) Interlocked.Increment(ref losses);
        });
        return (wins, losses);
    }

    /// <summary>Keeps the slowest of the times it is given (thread-safe), for <see cref="SlowestMove"/>.</summary>
    protected sealed class Slowest
    {
        long _ticks;
        public TimeSpan Value => TimeSpan.FromTicks(Interlocked.Read(ref _ticks));

        public T Time<T>(Func<T> answer)
        {
            var sw = Stopwatch.StartNew();
            var a = answer();
            var t = sw.Elapsed.Ticks;
            long seen;
            while (t > (seen = Interlocked.Read(ref _ticks)) && Interlocked.CompareExchange(ref _ticks, t, seen) != seen) { }
            return a;
        }
    }
}
