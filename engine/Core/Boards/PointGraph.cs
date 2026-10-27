using System.Numerics;

namespace Archive.Engine.Core.Boards;

/// <summary>
/// A board made of points joined by lines (Morris, Bagh-Chal, Fox and Geese, Mu Torere, Alquerque): each point has
/// grid coordinates for drawing and a name for notation, an adjacency list for sliding moves, "lines" (sets of points
/// that score together, such as mills) and, for points on a grid, a step table by direction so jumps are
/// <c>Step[Step[p, d], d]</c>. Up to 64 points, so a side's pieces fit in one <see cref="ulong"/> bit mask (the
/// 33-point cross fits; ISSUES I-077). Nothing here knows a game's rules.
/// Board kit (_template/board-kit, TRADITIONAL_GAMES.md §5.1): copied into the game when it was stamped; this copy is
/// the game's own. Built from Nine Men's Morris's PointGraph (uint, ≤ 32 points) and Fox and Geese's FgBoard (ulong,
/// direction steps).
/// </summary>
public sealed class PointGraph
{
    /// <summary>Directions as (dx, dy), dy up the board: the four straight ones, then the four diagonals.</summary>
    public static readonly (int Dx, int Dy)[] Dirs = [(1, 0), (-1, 0), (0, 1), (0, -1), (1, 1), (-1, 1), (1, -1), (-1, -1)];

    public int Count { get; }
    /// <summary>Grid size the coordinates live on (0..Width-1, 0..Height-1), for drawing.</summary>
    public int Width { get; }
    public int Height { get; }
    /// <summary>Coordinates per point: X from the left, Y from the bottom (row 1 of the notation is Y = 0).</summary>
    public IReadOnlyList<(int X, int Y)> Coords { get; }
    /// <summary>Notation name per point: column letter a.. from the left, row number 1.. from the bottom (a1, d7).</summary>
    public IReadOnlyList<string> Names { get; }
    public IReadOnlyList<int[]> Neighbours { get; }
    /// <summary>Neighbours of each point as a bit mask.</summary>
    public IReadOnlyList<ulong> NeighbourMask { get; }
    public IReadOnlyList<(int A, int B)> Edges { get; }
    public IReadOnlyList<int[]> Lines { get; }
    /// <summary>Each line as a bit mask.</summary>
    public IReadOnlyList<ulong> LineMask { get; }
    /// <summary>For each point, the masks of the lines through it.</summary>
    public IReadOnlyList<ulong[]> LinesThrough { get; }
    /// <summary>Step[p, d]: the point one edge along <see cref="Dirs"/>[d] from p, or -1 (no edge that way).
    /// Only edges whose ends differ by exactly one direction vector count, so a star (Mu Torere) has few steps.</summary>
    public int[,] Step { get; }
    /// <summary>Every point, as a mask.</summary>
    public ulong All { get; }

    readonly Dictionary<(int, int), int> _at = [];

    public PointGraph(int width, int height, IReadOnlyList<(int X, int Y)> coords, IEnumerable<(int A, int B)> edges, IEnumerable<int[]>? lines = null)
    {
        if (coords.Count > 64) throw new ArgumentException("at most 64 points");
        Width = width;
        Height = height;
        Count = coords.Count;
        Coords = coords;
        Names = coords.Select(c => $"{(char)('a' + c.X)}{c.Y + 1}").ToArray();
        for (var i = 0; i < Count; i++)
            if (!_at.TryAdd(coords[i], i)) throw new ArgumentException($"two points at {coords[i]}");
        All = Count == 64 ? ulong.MaxValue : (1ul << Count) - 1;

        var e = edges.Select(x => x.A < x.B ? x : (x.B, x.A)).Distinct().OrderBy(x => x.Item1).ThenBy(x => x.Item2).ToArray();
        foreach (var (a, b) in e)
            if (a < 0 || b >= Count || a == b) throw new ArgumentException($"bad edge {a}-{b}");
        Edges = e;
        var adj = Enumerable.Range(0, Count).Select(_ => new List<int>()).ToArray();
        foreach (var (a, b) in e) { adj[a].Add(b); adj[b].Add(a); }
        Neighbours = adj.Select(l => l.Order().ToArray()).ToArray();
        NeighbourMask = Neighbours.Select(ToMask).ToArray();

        Lines = (lines ?? []).Select(l => l.Order().ToArray()).ToArray();
        LineMask = Lines.Select(ToMask).ToArray();
        LinesThrough = Enumerable.Range(0, Count)
            .Select(p => LineMask.Where(m => (m & (1ul << p)) != 0).ToArray()).ToArray();

        Step = new int[Count, Dirs.Length];
        for (var p = 0; p < Count; p++)
            for (var d = 0; d < Dirs.Length; d++)
            {
                var q = At(coords[p].X + Dirs[d].Dx, coords[p].Y + Dirs[d].Dy);
                Step[p, d] = q >= 0 && (NeighbourMask[p] & (1ul << q)) != 0 ? q : -1;
            }
    }

    /// <summary>The point at (x, y), or -1.</summary>
    public int At(int x, int y) => _at.TryGetValue((x, y), out var i) ? i : -1;

    /// <summary>The point two steps along direction d (the landing point of a jump over Step[p, d]), or -1.</summary>
    public int Jump(int p, int d) => Step[p, d] is var q and >= 0 ? Step[q, d] : -1;

    public static ulong ToMask(IEnumerable<int> points)
    {
        var m = 0ul;
        foreach (var p in points) m |= 1ul << p;
        return m;
    }

    public ulong Mask(params string[] names) => ToMask(names.Select(IndexOf));

    /// <summary>The points in a mask, low to high.</summary>
    public static IEnumerable<int> Points(ulong mask)
    {
        for (var m = mask; m != 0; m &= m - 1) yield return BitOperations.TrailingZeroCount(m);
    }

    public int IndexOf(string name)
    {
        var i = Array.IndexOf((string[])Names, name.Trim().ToLowerInvariant());
        if (i < 0) throw new ArgumentException($"no point {name}");
        return i;
    }

    // ------------------------------------------------------------------ builders

    /// <summary>Which diagonals a grid board has: none, every one, or the Alquerque pattern (from points whose
    /// x + y is even, through squares whose four corners are all on the board).</summary>
    public enum Diagonals { None, All, Alquerque }

    /// <summary>
    /// A grid of points, width × height, joined across and up and down, with the chosen diagonals; <paramref name="on"/>
    /// cuts points away (a cross, a star). Points are numbered row by row from the bottom-left. Bagh-Chal is
    /// Grid(5, 5, Alquerque); Fox and Geese is <see cref="Cross"/>; Konane boards are cells, see <see cref="Grid"/>.
    /// </summary>
    public static PointGraph Grid(int width, int height, Diagonals diagonals, Func<int, int, bool>? on = null)
    {
        bool On(int x, int y) => x >= 0 && y >= 0 && x < width && y < height && (on?.Invoke(x, y) ?? true);
        var coords = new List<(int, int)>();
        for (var y = 0; y < height; y++)
            for (var x = 0; x < width; x++)
                if (On(x, y)) coords.Add((x, y));
        var index = coords.Select((c, i) => (c, i)).ToDictionary(t => t.c, t => t.i);
        var edges = new List<(int, int)>();
        foreach (var (x, y) in coords)
            foreach (var (dx, dy) in Dirs)
            {
                if (!index.TryGetValue((x + dx, y + dy), out var q)) continue;
                var diagonal = dx != 0 && dy != 0;
                if (diagonal && diagonals == Diagonals.None) continue;
                // A diagonal step keeps x + y's parity, so both ends are even points; the square's corners are the same from either end.
                if (diagonal && diagonals == Diagonals.Alquerque && !((x + y) % 2 == 0 && Square(x, y, dx, dy))) continue;
                edges.Add((index[(x, y)], q));
            }
        return new PointGraph(width, height, coords, edges);

        bool Square(int x, int y, int dx, int dy) => On(x, y) && On(x + dx, y) && On(x, y + dy) && On(x + dx, y + dy);
    }

    /// <summary>The 33-point cross (Fox and Geese, Solitaire): a 7×7 grid with its four 2×2 corners cut away.</summary>
    public static PointGraph Cross(Diagonals diagonals) =>
        Grid(7, 7, diagonals, (x, y) => x is >= 2 and <= 4 || y is >= 2 and <= 4);

    /// <summary>
    /// Morris boards: rings of eight points joined at their midpoints (and corners when <paramref name="cornerLines"/>,
    /// Twelve Men's Morris). Points are numbered ring by ring, outer first, each ring clockwise from its top-left corner;
    /// lines are the ring sides plus, with three rings, the cross lines (the mills).
    /// </summary>
    public static PointGraph Morris(int rings, bool cornerLines)
    {
        var size = rings * 2 + 1;
        var mid = rings;
        var coords = new List<(int, int)>();
        for (var r = 0; r < rings; r++)
        {
            int lo = r, hi = size - 1 - r;
            // top-left, top-middle, top-right, right-middle, bottom-right, bottom-middle, bottom-left, left-middle (Y up)
            coords.AddRange([(lo, hi), (mid, hi), (hi, hi), (hi, mid), (hi, lo), (mid, lo), (lo, lo), (lo, mid)]);
        }
        var edges = new List<(int, int)>();
        var lines = new List<int[]>();
        for (var r = 0; r < rings; r++)
        {
            var b = r * 8;
            for (var k = 0; k < 8; k++) edges.Add((b + k, b + (k + 1) % 8));
            for (var k = 0; k < 8; k += 2) lines.Add([b + k, b + k + 1, b + (k + 2) % 8]);
        }
        for (var k = 0; k < 8; k++)
        {
            if (k % 2 == 0 && !cornerLines) continue;
            for (var r = 0; r + 1 < rings; r++) edges.Add((r * 8 + k, (r + 1) * 8 + k));
            if (rings == 3) lines.Add([k, 8 + k, 16 + k]);
        }
        return new PointGraph(size, size, coords, edges, lines);
    }
}
