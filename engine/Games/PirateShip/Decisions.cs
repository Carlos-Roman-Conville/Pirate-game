namespace Archive.Engine.Games.PirateShip;

/// <summary>What kind of choice a decision is (for the screen and the AI). Add the game's kinds: Throw, Move, Take…</summary>
public enum PsAsk { Place }

/// <summary>
/// Every choice in the game goes through one of these: the engine asks the deciding player to pick one of the
/// options (by index). <see cref="Options"/> are notation labels; <see cref="Points"/> the same options as board
/// points (or cells, or steps), in the same order, so the screen highlights them and never works out what's legal.
/// A dice game asks Throw first (one option), then Move, so a throw is a recorded answer too.
/// </summary>
public sealed record PsDecision(int Player, PsAsk Kind, string Prompt, IReadOnlyList<string> Options, IReadOnlyList<int> Points)
{
    public override string ToString() => $"P{Player} {Kind}: {Prompt} [{string.Join(" | ", Options)}]";
}

/// <summary>Answers decisions for one or more players.</summary>
public interface IPsDecider
{
    int Choose(PsGame game, PsDecision d);
}

/// <summary>Thrown when a human has to answer a decision that isn't in the answers yet: the game waits for it.</summary>
public sealed class PsNeedInput(PsDecision decision) : Exception($"waiting for {decision}")
{
    public PsDecision Decision { get; } = decision;
}

/// <summary>
/// The recorded-inputs pattern: a game's answers, for every seat, consumed in order. When they run out, a computer seat
/// answers with its AI and the answer is appended (so a replay never searches twice); a human seat makes the game wait.
/// A game is seed + options + these answers, replayed on every request; undo is cutting the list back.
/// </summary>
public sealed class PsRecorded(List<int> answers, IPsDecider?[] computer) : IPsDecider
{
    int _next;
    public int Used => _next;
    /// <summary>Every decision asked so far, in answer order (Asked[i] is what answers[i] answered).</summary>
    public List<PsDecision> Asked { get; } = [];

    public int Choose(PsGame game, PsDecision d)
    {
        Asked.Add(d);
        if (_next < answers.Count) return answers[_next++];
        if (computer[d.Player] is not { } ai) throw new PsNeedInput(d);
        var pick = ai.Choose(game, d);
        answers.Add(pick);
        _next++;
        return pick;
    }
}

/// <summary>Answers from a list only, for every seat (online matches and tests); waits when they run out.</summary>
public sealed class PsInputDecider(IReadOnlyList<int> inputs) : IPsDecider
{
    int _next;
    public int Used => _next;

    public int Choose(PsGame game, PsDecision d)
    {
        if (_next >= inputs.Count) throw new PsNeedInput(d);
        return inputs[_next++];
    }
}

/// <summary>Always the first option (tests).</summary>
public sealed class PsFirstOption : IPsDecider
{
    public int Choose(PsGame game, PsDecision d) => 0;
}

/// <summary>A uniformly random option from its own seeded stream (sims, the conformance suite's random player).</summary>
public sealed class PsRandom(int seed) : IPsDecider
{
    readonly Archive.Engine.Core.Rng _rng = new(seed);
    public int Choose(PsGame game, PsDecision d) => _rng.Stream("Random").Next(d.Options.Count);
}

/// <summary>Picks options by notation label, then the first option (tests: "b2", "a1").</summary>
public sealed class PsScript : IPsDecider
{
    readonly Queue<string> _moves = new();
    public PsScript Then(params string[] moves) { foreach (var m in moves) _moves.Enqueue(m); return this; }
    public int Left => _moves.Count;

    public int Choose(PsGame game, PsDecision d)
    {
        if (_moves.Count == 0) return 0;
        var want = _moves.Dequeue();
        var i = d.Options.ToList().IndexOf(want);
        if (i < 0) throw new InvalidOperationException($"'{want}' isn't offered: {d}");
        return i;
    }
}
