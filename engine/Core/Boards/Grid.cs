namespace Archive.Engine.Core.Boards;

/// <summary>
/// A board of square cells (Tafl, Konane, Latrunculi, Surakarta, draughts-like games): pieces stand on cells, not
/// points. Cell index = row * Width + column; row 0 is rank 1 at the bottom, column 0 is file a on the left, so names
/// read a1..; any size (an 11×11 board has 121 cells, too many for one ulong, so positions are arrays or two masks).
/// Precomputes each cell's neighbour by direction and its rays (the cells in a line up to the edge), which sliding
/// moves walk until they meet a piece. Nothing here knows a game's rules; special cells (throne, corners) are the
/// game's own.
/// Board kit (_template/board-kit, TRADITIONAL_GAMES.md §5.1), after Hnefatafl's HnBoard; copied into the game when it
/// was stamped and the game's own from then on.
/// </summary>
public sealed class Grid
{
    /// <summary>Directions as (dx, dy), dy up the board: the four straight ones (0-3), then the four diagonals (4-7).</summary>
    public static readonly (int Dx, int Dy)[] Dirs = PointGraph.Dirs;
    public const int Orthogonal = 4;

    public int Width { get; }
    public int Height { get; }
    public int Count => Width * Height;
    public string[] Names { get; }
    /// <summary>Step[c, d]: the cell next to c along <see cref="Dirs"/>[d], or -1 off the board.</summary>
    public int[,] Step { get; }
    /// <summary>Rays[c][d]: the cells from c (not included) along direction d to the edge, nearest first.</summary>
    public int[][][] Rays { get; }

    public Grid(int width, int height)
    {
        Width = width;
        Height = height;
        Names = Enumerable.Range(0, Count).Select(i => $"{(char)('a' + i % width)}{i / width + 1}").ToArray();
        Step = new int[Count, Dirs.Length];
        Rays = new int[Count][][];
        for (var c = 0; c < Count; c++)
        {
            Rays[c] = new int[Dirs.Length][];
            for (var d = 0; d < Dirs.Length; d++)
            {
                var ray = new List<int>();
                int x = Col(c) + Dirs[d].Dx, y = Row(c) + Dirs[d].Dy;
                while (On(x, y)) { ray.Add(At(x, y)); x += Dirs[d].Dx; y += Dirs[d].Dy; }
                Rays[c][d] = [.. ray];
                Step[c, d] = ray.Count > 0 ? ray[0] : -1;
            }
        }
    }

    public int Row(int cell) => cell / Width;
    public int Col(int cell) => cell % Width;
    public bool On(int x, int y) => x >= 0 && y >= 0 && x < Width && y < Height;
    public int At(int x, int y) => On(x, y) ? y * Width + x : -1;
    public bool IsEdge(int cell) => Col(cell) == 0 || Row(cell) == 0 || Col(cell) == Width - 1 || Row(cell) == Height - 1;
    public bool IsCorner(int cell) => (Col(cell) == 0 || Col(cell) == Width - 1) && (Row(cell) == 0 || Row(cell) == Height - 1);
    /// <summary>The middle cell of an odd-sized board (a Tafl throne).</summary>
    public int Centre => At(Width / 2, Height / 2);

    /// <summary>The cell two steps along direction d (where a jump over Step[c, d] lands), or -1.</summary>
    public int Jump(int cell, int d) => Step[cell, d] is var q and >= 0 ? Step[q, d] : -1;

    /// <summary>Light or dark square: (row + column) even is dark, a1 being dark as on a chessboard.</summary>
    public bool IsDark(int cell) => (Row(cell) + Col(cell)) % 2 == 0;

    /// <summary>The empty cells a sliding piece reaches from <paramref name="cell"/> along direction d, stopping before
    /// the first cell <paramref name="blocked"/> says no to.</summary>
    public IEnumerable<int> Slide(int cell, int d, Func<int, bool> blocked)
    {
        foreach (var c in Rays[cell][d])
        {
            if (blocked(c)) yield break;
            yield return c;
        }
    }

    public int IndexOf(string name)
    {
        var i = Array.IndexOf(Names, name.Trim().ToLowerInvariant());
        return i >= 0 ? i : throw new ArgumentException($"no cell {name} on a {Width}x{Height} board");
    }

    public int[] Parse(string names) => names.Split(' ', StringSplitOptions.RemoveEmptyEntries).Select(IndexOf).ToArray();
}
