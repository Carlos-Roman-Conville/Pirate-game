using System.Numerics;
using Archive.Engine.Core;
using Archive.Engine.Core.Boards;

namespace Archive.Engine.Games.PirateShip;

/// <summary>
/// The rules as pure functions on <see cref="PsPos"/> (RULES.md §2-§6). <see cref="PsGame"/> runs turns and asks
/// deciders on top of this; <see cref="PsAi"/> searches with it through the board kit's <see cref="Negamax{TPos,TAction}"/>.
/// Placeholder: three in a row on a 3×3 grid; a full board with no line is a draw.
/// </summary>
public sealed class PsRules : IRules<PsPos, PsAction>
{
    public PsOptions Options { get; }
    public PointGraph Board { get; }
    readonly ulong[,] _z;
    readonly ulong _zSide;

    public PsRules(PsOptions options)
    {
        Options = options;
        // The lines that win: rows, columns and both diagonals (RULING D2).
        var g = PointGraph.Grid(3, 3, PointGraph.Diagonals.All);
        int[][] lines =
        [
            [g.At(0, 0), g.At(1, 0), g.At(2, 0)], [g.At(0, 1), g.At(1, 1), g.At(2, 1)], [g.At(0, 2), g.At(1, 2), g.At(2, 2)],
            [g.At(0, 0), g.At(0, 1), g.At(0, 2)], [g.At(1, 0), g.At(1, 1), g.At(1, 2)], [g.At(2, 0), g.At(2, 1), g.At(2, 2)],
            [g.At(0, 0), g.At(1, 1), g.At(2, 2)], [g.At(2, 0), g.At(1, 1), g.At(0, 2)],
        ];
        Board = new PointGraph(3, 3, g.Coords, g.Edges, lines);

        // Zobrist keys from a fixed generator, so hashes are the same in every process (repetition, transposition table).
        var x = 0x9E3779B97F4A7C15ul;
        ulong Next() { x += 0x9E3779B97F4A7C15ul; var z = x; z = (z ^ (z >> 30)) * 0xBF58476D1CE4E5B9ul; z = (z ^ (z >> 27)) * 0x94D049BB133111EBul; return z ^ (z >> 31); }
        _z = new ulong[2, Board.Count];
        for (var s = 0; s < 2; s++) for (var p = 0; p < Board.Count; p++) _z[s, p] = Next();
        _zSide = Next();
    }

    public PsPos Start => new(0, 0, Options.FirstPlayer);   // RULING D1

    public List<PsAction> Actions(PsPos pos)
    {
        var list = new List<PsAction>();
        if (Outcome(pos) != SearchOutcome.Ongoing) return list;
        foreach (var p in PointGraph.Points(Board.All & ~pos.Occupied)) list.Add(new PsAction((sbyte)p));
        return list;
    }

    public PsPos Apply(PsPos pos, PsAction a)
    {
        var s = pos.ToMove;
        return pos.With(s, pos.Mask(s) | 1ul << a.To) with { ToMove = 1 - s };
    }

    public int ToMove(PsPos pos) => pos.ToMove;

    /// <summary>The line a side has completed, or null.</summary>
    public int[]? LineOf(PsPos pos, int side)
    {
        for (var i = 0; i < Board.LineMask.Count; i++)
            if ((pos.Mask(side) & Board.LineMask[i]) == Board.LineMask[i]) return Board.Lines[i];
        return null;
    }

    public SearchOutcome Outcome(PsPos pos)
    {
        if (LineOf(pos, 1 - pos.ToMove) is not null) return SearchOutcome.Loss;   // the side that just moved made a line
        if (LineOf(pos, pos.ToMove) is not null) return SearchOutcome.Win;
        return pos.Occupied == Board.All ? SearchOutcome.Draw : SearchOutcome.Ongoing;
    }

    public ulong Hash(PsPos pos)
    {
        var h = pos.ToMove == 1 ? _zSide : 0;
        for (var s = 0; s < 2; s++)
            foreach (var p in PointGraph.Points(pos.Mask(s))) h ^= _z[s, p];
        return h;
    }

    /// <summary>Lines still open to the side to move minus lines open to the other side.</summary>
    public int Evaluate(PsPos pos)
    {
        int s = pos.ToMove, o = 1 - s, score = 0;
        foreach (var line in Board.LineMask)
        {
            int mine = BitOperations.PopCount(pos.Mask(s) & line), theirs = BitOperations.PopCount(pos.Mask(o) & line);
            if (theirs == 0) score += mine * mine;
            if (mine == 0) score -= theirs * theirs;
        }
        return score;
    }

    /// <summary>The centre, then corners, then edges: points on more lines first.</summary>
    public int OrderKey(PsPos pos, PsAction a) => -Board.LinesThrough[a.To].Length;
}
