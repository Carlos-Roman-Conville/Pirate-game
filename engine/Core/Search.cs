namespace Archive.Engine.Core;

// Game-tree search for board games, behind small rules interfaces: a game writes its rules as pure functions on a
// small position value (a record struct of bit masks is best: the search copies millions) and gets negamax or
// expectiminimax for free. Deterministic: searches stop on a node count, never a clock, so the same position always
// gets the same move and a replay never differs. The computer's answers are recorded with the human's (the game's
// PsRecorded decider), so a replay never searches again.
// Board kit (_template/board-kit, TRADITIONAL_GAMES.md §5.1): negamax from Nine Men's Morris's NmSearch and Oware's
// OwSearch (iterative deepening, transposition table, node budget, repetition), expectiminimax from Ur's and Senet's
// BeforeThrow/AfterMove. Copied into the game when it was stamped and the game's own from then on.

/// <summary>How a position stands for the side to move.</summary>
public enum SearchOutcome { Ongoing, Win, Loss, Draw }

/// <summary>A game's rules as the negamax search sees them. One action is one ply (a whole turn: Morris's move and
/// take are one action); a ply that keeps the same side to move (an extra turn) is allowed.</summary>
public interface IRules<TPos, TAction> where TAction : struct, IEquatable<TAction>
{
    /// <summary>The legal actions; empty only when <see cref="Outcome"/> says the game is over.</summary>
    List<TAction> Actions(TPos pos);
    TPos Apply(TPos pos, TAction action);
    int ToMove(TPos pos);
    /// <summary>The result for the side to move, or Ongoing.</summary>
    SearchOutcome Outcome(TPos pos);
    /// <summary>A Zobrist-style hash that includes the side to move, the same in every process.</summary>
    ulong Hash(TPos pos);
    /// <summary>The position's worth for the side to move, well inside ±<see cref="Negamax{TPos,TAction}.Win"/>.</summary>
    int Evaluate(TPos pos);
    /// <summary>Move ordering: lower keys are searched first (captures first is the usual choice). Must be stable.</summary>
    int OrderKey(TPos pos, TAction action) => 0;
    /// <summary>The score, for the side to move, of a position already seen in the game or on the search path:
    /// 0 for a draw by repetition (Morris), or a rule's own count (Oware's cycle keeps each side's row).</summary>
    int Repeated(TPos pos) => 0;
}

/// <summary>
/// Negamax alpha-beta with iterative deepening and a transposition table, stopping on a node budget (the last finished
/// depth decides). A position seen earlier in the game (<c>history</c>) or earlier on the search path scores
/// <see cref="IRules{TPos,TAction}.Repeated"/>. Not thread-safe: one per AI.
/// </summary>
public sealed class Negamax<TPos, TAction>(IRules<TPos, TAction> rules, int ttBits = 20) where TAction : struct, IEquatable<TAction>
{
    public const int Win = 100_000;
    const int MateZone = Win - 1000;

    struct Entry
    {
        public ulong Key;
        public int Score;
        public sbyte Depth;
        public byte Flag;   // 0 empty, 1 exact, 2 lower bound, 3 upper bound
        public bool HasBest;
        public TAction Best;
    }

    readonly Entry[] _tt = new Entry[1 << ttBits];
    readonly ulong _ttMask = (1ul << ttBits) - 1;
    readonly ulong[] _path = new ulong[256];
    IReadOnlySet<ulong> _history = new HashSet<ulong>();
    long _nodes, _budget;
    bool _aborted;

    public long Nodes => _nodes;
    public int DepthReached { get; private set; }

    /// <summary>
    /// The best action from <paramref name="root"/>, searching deeper until <paramref name="maxDepth"/> or until
    /// <paramref name="nodeBudget"/> nodes are spent. <paramref name="only"/> limits the root (Morris uses it to pick a
    /// take once its move half is fixed). <paramref name="history"/> holds the hashes of positions the game has
    /// already been in (since the last irreversible move).
    /// </summary>
    public (TAction Best, int Score) Best(TPos root, int maxDepth, long nodeBudget, IReadOnlySet<ulong>? history = null, Func<TAction, bool>? only = null)
    {
        _history = history ?? new HashSet<ulong>();
        _nodes = 0;
        _budget = nodeBudget;
        _aborted = false;
        DepthReached = 0;
        var moves = rules.Actions(root);
        if (only is not null) moves = moves.Where(only).ToList();
        if (moves.Count == 0) throw new InvalidOperationException("no legal action to search");
        if (moves.Count == 1) return (moves[0], 0);
        Order(moves, root, null);

        var me = rules.ToMove(root);
        var best = moves[0];
        var bestScore = 0;
        _path[0] = rules.Hash(root);
        for (var depth = 1; depth <= maxDepth; depth++)
        {
            int alpha = -Win - 1, beta = Win + 1;
            var iterBest = moves[0];
            var iterScore = int.MinValue;
            foreach (var a in moves)
            {
                var s = Child(rules.Apply(root, a), me, depth - 1, alpha, beta, 1);
                if (_aborted) break;
                if (s > iterScore) { iterScore = s; iterBest = a; }
                if (s > alpha) alpha = s;
            }
            if (_aborted && depth > 1) break;
            best = iterBest;
            bestScore = iterScore;
            DepthReached = depth;
            moves.Remove(best);
            moves.Insert(0, best);   // best first for the next iteration
            if (Math.Abs(bestScore) >= MateZone) break;   // a forced result: deeper won't change it
            if (_aborted) break;
        }
        return (best, bestScore);
    }

    /// <summary>
    /// The value of <paramref name="pos"/> for its side to move, searched like <see cref="Best"/> but without choosing a
    /// move: for scoring one action's outcome (a card game's sampled worlds average these over deals, deck kit
    /// <c>Sampling.BestByAverage</c>). A finished position scores its outcome; otherwise the last finished depth decides.
    /// </summary>
    public int Value(TPos pos, int maxDepth, long nodeBudget, IReadOnlySet<ulong>? history = null)
    {
        _history = history ?? new HashSet<ulong>();
        _nodes = 0;
        _budget = nodeBudget;
        _aborted = false;
        DepthReached = 0;
        _path[0] = rules.Hash(pos);
        var value = 0;
        for (var depth = 0; depth <= maxDepth; depth++)
        {
            var v = Search(pos, depth, -Win - 1, Win + 1, 0);
            if (_aborted && depth > 0) break;
            value = v;
            DepthReached = depth;
            if (Math.Abs(value) >= MateZone || rules.Outcome(pos) != SearchOutcome.Ongoing) break;
            if (_aborted) break;
        }
        return value;
    }

    /// <summary>The value for <paramref name="side"/> of the position after its action: negated when the turn passed to the other side.</summary>
    public int ValueFor(int side, TPos after, int maxDepth, long nodeBudget, IReadOnlySet<ulong>? history = null)
    {
        var v = Value(after, maxDepth, nodeBudget, history);
        return rules.ToMove(after) == side ? v : -v;
    }

    /// <summary>A child's value for the parent's side to move: negated when the turn passes, kept on an extra turn.</summary>
    int Child(TPos child, int parentSide, int depth, int alpha, int beta, int ply) =>
        rules.ToMove(child) == parentSide
            ? Search(child, depth, alpha, beta, ply)
            : -Search(child, depth, -beta, -alpha, ply);

    int Search(TPos pos, int depth, int alpha, int beta, int ply)
    {
        if (++_nodes > _budget && DepthReached > 0) { _aborted = true; return 0; }

        switch (rules.Outcome(pos))
        {
            case SearchOutcome.Win: return Win - ply;    // sooner is better
            case SearchOutcome.Loss: return -Win + ply;
            case SearchOutcome.Draw: return 0;
        }

        var h = rules.Hash(pos);
        if (_history.Contains(h)) return rules.Repeated(pos);
        for (var i = ply - 1; i >= 0; i--) if (_path[i] == h) return rules.Repeated(pos);   // the hash holds the side to move
        if (depth <= 0 || ply >= _path.Length) return rules.Evaluate(pos);
        _path[ply] = h;

        ref var e = ref _tt[h & _ttMask];
        TAction? ttMove = null;
        if (e.Key == h && e.Flag != 0)
        {
            if (e.HasBest) ttMove = e.Best;
            if (e.Depth >= depth)
            {
                var ts = FromTt(e.Score, ply);
                if (e.Flag == 1) return ts;
                if (e.Flag == 2 && ts >= beta) return ts;
                if (e.Flag == 3 && ts <= alpha) return ts;
            }
        }

        var moves = rules.Actions(pos);
        if (moves.Count == 0) return rules.Evaluate(pos);   // Outcome should have caught this; don't crash a search
        Order(moves, pos, ttMove);
        var me = rules.ToMove(pos);
        var a0 = alpha;
        var best = int.MinValue;
        var bestMove = moves[0];
        foreach (var a in moves)
        {
            var s = Child(rules.Apply(pos, a), me, depth - 1, alpha, beta, ply + 1);
            if (_aborted) return 0;
            if (s > best) { best = s; bestMove = a; }
            if (s > alpha) alpha = s;
            if (alpha >= beta) break;
        }

        e = ref _tt[h & _ttMask];
        e.Key = h;
        e.Score = ToTt(best, ply);
        e.Depth = (sbyte)Math.Min(depth, 127);
        e.Flag = (byte)(best <= a0 ? 3 : best >= beta ? 2 : 1);
        e.HasBest = true;
        e.Best = bestMove;
        return best;
    }

    static int ToTt(int s, int ply) => s >= MateZone ? s + ply : s <= -MateZone ? s - ply : s;
    static int FromTt(int s, int ply) => s >= MateZone ? s - ply : s <= -MateZone ? s + ply : s;

    /// <summary>The table's move first, then by the rules' order key (stable, so deterministic).</summary>
    void Order(List<TAction> moves, TPos pos, TAction? tt)
    {
        var hasTt = tt is { } t && moves.Contains(t);
        var sorted = moves.OrderBy(a => hasTt && a.Equals(tt!.Value) ? int.MinValue : rules.OrderKey(pos, a)).ToList();
        moves.Clear();
        moves.AddRange(sorted);
    }
}

/// <summary>A dice game's rules as the expectiminimax search sees them: the side to move throws, then picks a move for
/// that throw. Works for any number of seats: every other seat is taken to play against the searching seat.</summary>
public interface IChanceRules<TPos, TAction>
{
    /// <summary>The throw the side to move is about to make: each value and its chance (<see cref="Dice.Odds"/>).</summary>
    IReadOnlyList<(int Value, double P)> Odds(TPos pos);
    /// <summary>The legal moves for this throw; empty means the throw is lost.</summary>
    List<TAction> Actions(TPos pos, int roll);
    /// <summary>The position after the move, with the next side to move set (the same side on an extra throw).</summary>
    TPos Apply(TPos pos, int roll, TAction action);
    /// <summary>The position after a throw with no legal move (usually: the turn passes).</summary>
    TPos Pass(TPos pos, int roll);
    int ToMove(TPos pos);
    /// <summary>The winning seat, or null while the game goes on.</summary>
    int? Winner(TPos pos);
    /// <summary>The position's worth for <paramref name="seat"/>, well inside ±<see cref="Expectiminimax{TPos,TAction}.Win"/>.</summary>
    double Evaluate(TPos pos, int seat);
}

/// <summary>
/// Expectiminimax over a throw's odds table, to a fixed number of moves. The searching seat maximises, every other
/// seat minimises, and each throw is averaged by its chance. Depth counts moves; use even depths in games where turns
/// alternate, because an odd depth ends the search on the mover's own move and plays worse (ISSUES I-082: Senet's hard
/// level at depth 3 lost to depth 2).
/// </summary>
public sealed class Expectiminimax<TPos, TAction>(IChanceRules<TPos, TAction> rules)
{
    public const double Win = 1_000_000;

    /// <summary>The index of the best of <paramref name="actions"/> for a throw of <paramref name="roll"/>, looking <paramref name="depth"/> moves ahead (1 = this move only).</summary>
    public int Best(TPos pos, int roll, IReadOnlyList<TAction> actions, int depth, Func<int, double>? noise = null)
    {
        var me = rules.ToMove(pos);
        var best = 0;
        var bestValue = double.NegativeInfinity;
        for (var i = 0; i < actions.Count; i++)
        {
            var v = AfterMove(pos, roll, actions[i], depth - 1, me) + (noise?.Invoke(i) ?? 0);
            if (v > bestValue) { bestValue = v; best = i; }
        }
        return best;
    }

    /// <summary>The value for <paramref name="me"/> of making the move and searching <paramref name="depth"/> more moves.</summary>
    public double AfterMove(TPos pos, int roll, TAction action, int depth, int me)
    {
        var child = rules.Apply(pos, roll, action);
        if (rules.Winner(child) is { } w) return w == me ? Win + depth : -Win - depth;   // sooner results count more
        return BeforeThrow(child, depth, me);
    }

    /// <summary>The expected value for <paramref name="me"/> with the side to move about to throw.</summary>
    public double BeforeThrow(TPos pos, int depth, int me)
    {
        if (depth <= 0) return rules.Evaluate(pos, me);
        var mover = rules.ToMove(pos);
        var total = 0.0;
        foreach (var (roll, p) in rules.Odds(pos))
        {
            if (p == 0) continue;
            var moves = rules.Actions(pos, roll);
            double value;
            if (moves.Count == 0) value = BeforeThrow(rules.Pass(pos, roll), depth - 1, me);
            else
            {
                value = mover == me ? double.NegativeInfinity : double.PositiveInfinity;
                foreach (var m in moves)
                {
                    var v = AfterMove(pos, roll, m, depth - 1, me);
                    value = mover == me ? Math.Max(value, v) : Math.Min(value, v);
                }
            }
            total += p * value;
        }
        return total;
    }
}

/// <summary>Deterministic noise for easy levels: a stream seeded by the game seed and the position, so a replay
/// repeats the same "mistakes" (and recorded answers never need it again anyway).</summary>
public static class SearchNoise
{
    public static Rng.RngStream For(int gameSeed, ulong positionHash, string stream = "AiNoise") =>
        new Rng(unchecked(gameSeed ^ (int)positionHash ^ (int)(positionHash >> 32))).Stream(stream);
}
