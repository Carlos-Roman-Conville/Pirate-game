using Archive.Engine.Games.PirateShip;
using Archive.Engine.Tests.Conformance;
using Xunit.Abstractions;

namespace Archive.Engine.Tests.Games.PirateShip;

/// <summary>
/// The board kit's conformance suite pointed at this game (TRADITIONAL_GAMES.md §5.3): fuzz, replay identity, known
/// counts, AI strength, redaction. The gates are inherited from <see cref="BoardConformance"/>; this class only says how
/// to play a game. When the real rules replace the placeholder, update the counts and, for a luck-heavy game, the
/// strength gate and its D-row.
/// </summary>
public sealed class PirateShipSimTests(ITestOutputHelper output) : BoardConformance(output)
{
    protected override int Levels => 3;
    protected override bool Solved => true;   // three in a row: equal play draws

    static IPsDecider Player(int who, int seed, int seat) =>
        who == Random ? new PsRandom(seed * 2 + seat) : new PsAi((PsLevel)who);

    static string Fingerprint(PsGame g) =>
        $"{g.Pos}|{g.Log.Count}|{g.Result}|{string.Join(",", g.Log.All.Select(e => e.ToString()))}";

    protected override Played Play(int seed, int seat0, int seat1)
    {
        var g = new PsGame(PsOptions.Default, seed, [Player(seat0, seed, 0), Player(seat1, seed, 1)]);
        g.RunUntilInput();
        return new Played(g.Result?.Winner, g.Result is not null, g.Result is null && g.Waiting is { Options.Count: 0 }, Fingerprint(g));
    }

    protected override (string Live, string Replayed) RecordAndReplay(int seed)
    {
        var answers = new List<int>();
        var live = new PsRecorded(answers, [new PsAi(PsLevel.Medium), new PsRandom(seed)]);
        var a = new PsGame(PsOptions.Default, seed, [live, live]);
        a.RunUntilInput();
        var replay = new PsRecorded(answers, [null, null]);   // no AI: the answers alone must carry the game
        var b = new PsGame(PsOptions.Default, seed, [replay, replay]);
        b.RunUntilInput();
        return (Fingerprint(a), Fingerprint(b));
    }

    // Three in a row from the empty board, stopping at a finished game: the well-known 255,168 games split by length.
    protected override IEnumerable<(int Plies, long Count)> KnownCounts =>
        [(1, 9), (2, 72), (3, 504), (4, 3024), (5, 15120), (6, 54720), (7, 148176), (8, 200448), (9, 127872)];

    protected override long Count(int plies)
    {
        var r = PirateShipHarness.Rules();
        return Perft(r, r.Start, plies);

        static long Perft(PsRules r, PsPos p, int depth)
        {
            if (depth == 0) return 1;
            long n = 0;
            foreach (var a in r.Actions(p)) n += Perft(r, r.Apply(p, a), depth - 1);
            return n;
        }
    }

    protected override TimeSpan SlowestMove(int seed)
    {
        var slowest = new Slowest();
        var timed = new Timing(new PsAi(PsLevel.Hard), slowest);
        new PsGame(PsOptions.Default, seed, [timed, timed]).RunUntilInput();
        return slowest.Value;
    }

    sealed class Timing(IPsDecider inner, Slowest slowest) : IPsDecider
    {
        public int Choose(PsGame game, PsDecision d) => slowest.Time(() => inner.Choose(game, d));
    }
}
