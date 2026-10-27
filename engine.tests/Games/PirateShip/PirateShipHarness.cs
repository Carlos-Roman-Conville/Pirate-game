using Archive.Engine.Games.PirateShip;

namespace Archive.Engine.Tests.Games.PirateShip;

/// <summary>Builds positions and games for the rule tests: points by notation name, scripted moves by label.</summary>
public static class PirateShipHarness
{
    public static PsRules Rules(PsOptions? o = null) => new(o ?? PsOptions.Default);

    /// <summary>A position from notation names: seat 0's pieces, seat 1's, and the side to move.</summary>
    public static PsPos Pos(PsRules r, string seat0, string seat1, int toMove) =>
        new(Mask(r, seat0), Mask(r, seat1), toMove);

    static ulong Mask(PsRules r, string names) =>
        names.Split(' ', StringSplitOptions.RemoveEmptyEntries).Aggregate(0ul, (m, n) => m | 1ul << r.Board.IndexOf(n));

    /// <summary>Plays a game to its end (or until a script runs out and a human would be asked).</summary>
    public static PsGame Play(IPsDecider seat0, IPsDecider seat1, PsOptions? o = null, int seed = 1)
    {
        var g = new PsGame(o ?? PsOptions.Default, seed, [seat0, seat1]);
        g.RunUntilInput();
        return g;
    }

    /// <summary>Plays a game from labels, both seats alternating as the game asks ("b2", "a1", …).</summary>
    public static PsGame Script(params string[] moves)
    {
        var s = new PsScript().Then(moves);
        return Play(s, s);
    }
}
