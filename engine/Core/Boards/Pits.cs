namespace Archive.Engine.Core.Boards;

/// <summary>
/// A mancala board (Oware, Bao, Kalah): <see cref="Seats"/> rows of <see cref="PerSeat"/> pits in one ring, sown
/// counter-clockwise. Pit index = seat * PerSeat + i, so seat 0's row comes first and the ring goes on into seat 1's.
/// Stores (captured seeds) are the game's own. Sowing here is the plain loop; captures, feeding and grand-slam rules
/// are the game's. Allocation-free, so a search can call it in its hot path.
/// Board kit (_template/board-kit, TRADITIONAL_GAMES.md §5.1), after Oware's SowCore; copied into the game when it was
/// stamped and the game's own from then on.
/// </summary>
public sealed class Pits(int seats = 2, int perSeat = 6)
{
    public int Seats { get; } = seats;
    public int PerSeat { get; } = perSeat;
    public int Count => Seats * PerSeat;

    public int Owner(int pit) => pit / PerSeat;
    public int First(int seat) => seat * PerSeat;
    public bool IsOwn(int seat, int pit) => Owner(pit) == seat;
    public int Next(int pit) => (pit + 1) % Count;
    public int Prev(int pit) => (pit + Count - 1) % Count;

    /// <summary>Seeds in a seat's row.</summary>
    public int RowSum(ReadOnlySpan<int> pits, int seat)
    {
        var n = 0;
        for (var i = 0; i < PerSeat; i++) n += pits[First(seat) + i];
        return n;
    }

    /// <summary>
    /// Lifts every seed from <paramref name="start"/> and drops them one per pit going round; with
    /// <paramref name="skipOrigin"/> (Oware's 12+ seed rule) the emptied pit is passed over. Returns the last pit sown.
    /// <paramref name="path"/>, when given, gets each pit sown in order (for events and animation).
    /// </summary>
    public int Sow(Span<int> pits, int start, bool skipOrigin, List<int>? path = null)
    {
        var seeds = pits[start];
        if (seeds == 0) throw new InvalidOperationException("sowing an empty pit");
        pits[start] = 0;
        var at = start;
        while (seeds > 0)
        {
            at = Next(at);
            if (skipOrigin && at == start) continue;
            pits[at]++;
            seeds--;
            path?.Add(at);
        }
        return at;
    }
}
