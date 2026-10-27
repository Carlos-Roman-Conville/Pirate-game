namespace Archive.Engine.Core.Boards;

/// <summary>
/// A race track (Ur, Senet, Pachisi, Game of the Goose): each seat has a route, a list of board cells its pieces walk
/// in order. Steps count along a seat's own route: 0 is waiting to enter, 1..Length(seat) are the route's cells, and
/// Off(seat) = Length + 1 is borne off. Routes may share cells (Ur's middle row, Pachisi's outer loop, one common track
/// in Senet and Goose), so "is anyone else here" is a cell question: <see cref="Meets"/> turns my step into the other
/// seat's step on the same cell. Safe cells (rosettes, castles) and any other named cells are sets of cells; what they
/// do is the game's rule.
/// Board kit (_template/board-kit, TRADITIONAL_GAMES.md §5.1), after Ur's UrTrack and Senet's SeTrack; copied into the
/// game when it was stamped and the game's own from then on.
/// </summary>
public sealed class Track
{
    public const int Start = 0;

    /// <summary>The board's distinct cells as drawing coordinates (column, row); a cell id is an index into this.</summary>
    public IReadOnlyList<(int Col, int Row)> Cells { get; }
    /// <summary>Route[seat][step - 1] is the cell id of that seat's step.</summary>
    public IReadOnlyList<int[]> Route { get; }
    public int Seats => Route.Count;
    readonly HashSet<int> _safe;
    readonly int[][] _stepOf;     // [seat][cell] → step, or -1 when the seat's route doesn't pass the cell
    readonly int[] _users;        // how many seats' routes pass each cell

    public Track(IReadOnlyList<IReadOnlyList<(int Col, int Row)>> routes, IEnumerable<(int Col, int Row)>? safe = null)
    {
        if (routes.Count == 0) throw new ArgumentException("at least one route");
        var cells = new List<(int, int)>();
        var ids = new Dictionary<(int, int), int>();
        int Id((int, int) c) { if (!ids.TryGetValue(c, out var i)) { i = cells.Count; cells.Add(c); ids[c] = i; } return i; }
        Route = routes.Select(r => r.Select(Id).ToArray()).ToArray();
        Cells = cells;
        _safe = (safe ?? []).Select(c => ids.TryGetValue(c, out var i) ? i : throw new ArgumentException($"safe cell {c} is on no route")).ToHashSet();
        _stepOf = Route.Select(r =>
        {
            var s = Enumerable.Repeat(-1, cells.Count).ToArray();
            for (var k = 0; k < r.Length; k++)
            {
                if (s[r[k]] >= 0) throw new ArgumentException("a route passes a cell twice");
                s[r[k]] = k + 1;
            }
            return s;
        }).ToArray();
        _users = Enumerable.Range(0, cells.Count).Select(c => _stepOf.Count(s => s[c] >= 0)).ToArray();
    }

    /// <summary>One route every seat shares (Senet, Goose): steps are the same cells for everyone.</summary>
    public static Track Shared(IReadOnlyList<(int Col, int Row)> route, int seats, IEnumerable<(int Col, int Row)>? safe = null) =>
        new(Enumerable.Repeat(route, seats).ToArray(), safe);

    public int Length(int seat) => Route[seat].Length;
    public int Off(int seat) => Route[seat].Length + 1;

    /// <summary>The cell id of a seat's step 1..Length.</summary>
    public int Cell(int seat, int step) =>
        step >= 1 && step <= Length(seat) ? Route[seat][step - 1] : throw new ArgumentOutOfRangeException(nameof(step));

    public (int Col, int Row) Xy(int seat, int step) => Cells[Cell(seat, step)];

    /// <summary>The seat's step on a cell, or -1 when its route doesn't pass it.</summary>
    public int StepOf(int seat, int cell) => _stepOf[seat][cell];

    /// <summary>True when more than one seat's route passes the cell (pieces there can meet).</summary>
    public bool IsShared(int cell) => _users[cell] > 1;
    public bool IsSafe(int cell) => _safe.Contains(cell);
    public bool IsSafe(int seat, int step) => step >= 1 && step <= Length(seat) && _safe.Contains(Cell(seat, step));

    /// <summary>The <paramref name="other"/> seat's step on the cell <paramref name="seat"/> reaches at <paramref name="step"/>,
    /// or -1 (off the board, or not a cell they share).</summary>
    public int Meets(int seat, int step, int other)
    {
        if (step < 1 || step > Length(seat)) return -1;
        return _stepOf[other][Cell(seat, step)];
    }

    /// <summary>
    /// Where a piece on <paramref name="from"/> ends after <paramref name="roll"/> steps: a step on the route, Off, or -1
    /// when it overshoots and <paramref name="exactOff"/> asks for the exact count to bear off.
    /// </summary>
    public int Target(int seat, int from, int roll, bool exactOff)
    {
        var to = from + roll;
        if (to <= Off(seat)) return to;
        return exactOff ? -1 : Off(seat);
    }

    /// <summary>The steps a piece passes going from <paramref name="from"/> to <paramref name="to"/> (to included), for animation.</summary>
    public IEnumerable<int> Path(int from, int to)
    {
        var dir = Math.Sign(to - from);
        for (var s = from + dir; dir != 0; s += dir)
        {
            yield return s;
            if (s == to) yield break;
        }
    }
}
