using Archive.Engine.Core;

namespace Archive.Engine.Games.PirateShip;

/// <summary>Rule options, fixed at setup; each value other than the default is a variant RULES.md names (RULING D1).</summary>
public sealed record PsOptions(int FirstPlayer = 0)
{
    public static PsOptions Default { get; } = new();
}

/// <summary>
/// The whole position, small and copied by value so the search makes and drops millions: each side's pieces as a bit
/// mask over the board's points, and whose turn it is. The placeholder game is three in a row on a 3×3 board
/// (replace it with the real game; keep the shape: masks, counts, side to move).
/// </summary>
public readonly record struct PsPos(ulong Mask0, ulong Mask1, int ToMove)
{
    public ulong Mask(int side) => side == 0 ? Mask0 : Mask1;
    public ulong Occupied => Mask0 | Mask1;
    public PsPos With(int side, ulong mask) => side == 0 ? this with { Mask0 = mask } : this with { Mask1 = mask };
}

/// <summary>One turn as the search sees it.</summary>
public readonly record struct PsAction(sbyte To);

/// <summary>Who won and why; Winner is null for a draw.</summary>
public sealed record PsResult(int? Winner, string Reason);

// Events the client plays back in order. One record per kind of thing that happens; the server sends them as { type, data }.
public sealed record PsGameStarted(int Seed, int FirstPlayer) : IGameEvent;
public sealed record PsPlaced(int Player, int Point, string Name) : IGameEvent;
public sealed record PsGameEnded(int? Winner, string Reason, int[]? Line) : IGameEvent;
