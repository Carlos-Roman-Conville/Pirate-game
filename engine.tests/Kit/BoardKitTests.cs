using Archive.Engine.Core;
using Archive.Engine.Core.Boards;

namespace Archive.Engine.Tests.Kit;

/// <summary>
/// The board kit's own parts (engine/Core/Boards, Dice.cs, Search.cs), checked against boards and odds the finished
/// traditional games use. A game that deletes a kit file it doesn't need deletes its tests here too.
/// </summary>
public sealed class BoardKitTests
{
    [Fact]
    public void Cross_holds_33_points_in_one_mask()   // ISSUES I-077: Morris's 32-point mask couldn't
    {
        var plain = PointGraph.Cross(PointGraph.Diagonals.None);
        Assert.Equal(33, plain.Count);
        Assert.Equal((1ul << 33) - 1, plain.All);
        var d4 = plain.IndexOf("d4");
        Assert.Equal(4, plain.Neighbours[d4].Length);
        Assert.Equal(plain.IndexOf("d6"), plain.Jump(plain.IndexOf("d4"), 2));   // up two
        Assert.Equal(-1, plain.Step[plain.IndexOf("c1"), 1]);                     // b1 is cut away
        var diag = PointGraph.Cross(PointGraph.Diagonals.Alquerque);
        Assert.Equal(8, diag.Neighbours[diag.IndexOf("d4")].Length);
        Assert.Equal(3, diag.Neighbours[diag.IndexOf("d1")].Length);              // odd point: no diagonals
    }

    [Fact]
    public void Alquerque_5x5_is_the_Bagh_Chal_board()
    {
        var g = PointGraph.Grid(5, 5, PointGraph.Diagonals.Alquerque);
        Assert.Equal(25, g.Count);
        Assert.Equal(40 + 16, g.Edges.Count);   // 40 straight lines, one diagonal per unit square
        Assert.Equal(8, g.Neighbours[g.IndexOf("c3")].Length);
        Assert.Equal(3, g.Neighbours[g.IndexOf("a1")].Length);
        Assert.Equal(3, g.Neighbours[g.IndexOf("b1")].Length);
    }

    [Fact]
    public void Morris_boards_match_the_rule_books()
    {
        var nine = PointGraph.Morris(3, cornerLines: false);
        Assert.Equal(24, nine.Count);
        Assert.Equal(32, nine.Edges.Count);
        Assert.Equal(16, nine.Lines.Count);
        Assert.Equal("a7", nine.Names[0]);
        Assert.Equal("d6", nine.Names[9]);
        Assert.Equal(2, nine.LinesThrough[0].Length);   // a corner sits on two mills
        var twelve = PointGraph.Morris(3, cornerLines: true);
        Assert.Equal(40, twelve.Edges.Count);
        Assert.Equal(20, twelve.Lines.Count);
        Assert.Equal(16, PointGraph.Morris(2, cornerLines: false).Count);   // six men's morris
    }

    [Fact]
    public void Point_graph_refuses_more_than_64_points()
    {
        var coords = Enumerable.Range(0, 65).Select(i => (i, 0)).ToList();
        Assert.Throws<ArgumentException>(() => new PointGraph(65, 1, coords, []));
    }

    [Fact]
    public void Grid_rays_stop_at_the_edge()
    {
        var g = new Grid(11, 11);
        Assert.Equal("f6", g.Names[g.Centre]);
        Assert.Equal(5, g.Rays[g.Centre][0].Length);
        Assert.True(g.IsCorner(g.IndexOf("k11")));
        Assert.False(g.IsCorner(g.IndexOf("k10")));
        Assert.Equal(-1, g.Step[g.IndexOf("a1"), 1]);
        var blockers = new HashSet<int> { g.IndexOf("f9") };
        Assert.Equal(new[] { "f7", "f8" }, g.Slide(g.Centre, 2, blockers.Contains).Select(c => g.Names[c]));
        Assert.Equal(g.IndexOf("c3"), g.Jump(g.IndexOf("a1"), 4));
    }

    // The Royal Game of Ur's routes (UrTrack): four private cells, eight shared, two private.
    static Track UrTrack()
    {
        (int, int)[] Route(int side) =>
            [(3, side), (2, side), (1, side), (0, side), .. Enumerable.Range(0, 8).Select(c => (c, 1)), (7, side), (6, side)];
        return new Track([Route(2), Route(0)], safe: [(0, 0), (6, 0), (3, 1), (0, 2), (6, 2)]);
    }

    [Fact]
    public void Track_shares_the_middle_row()
    {
        var t = UrTrack();
        Assert.Equal(20, t.Cells.Count);
        Assert.Equal(14, t.Length(0));
        Assert.Equal(15, t.Off(0));
        Assert.Equal(6, t.Meets(0, 6, other: 1));         // the same cell is step 6 for both
        Assert.Equal(-1, t.Meets(0, 3, other: 1));        // private cells never meet
        Assert.True(t.IsSafe(0, 8));                      // the central rosette
        Assert.True(t.IsShared(t.Cell(1, 5)));
        Assert.False(t.IsShared(t.Cell(1, 13)));
        Assert.Equal(-1, t.Target(0, 13, 3, exactOff: true));
        Assert.Equal(15, t.Target(0, 13, 3, exactOff: false));
        Assert.Equal(new[] { 2, 3, 4 }, t.Path(1, 4));
    }

    [Fact]
    public void Dice_odds_tables()
    {
        Assert.Equal(new (int, double)[] { (0, 1 / 16.0), (1, 4 / 16.0), (2, 6 / 16.0), (3, 4 / 16.0), (4, 1 / 16.0) }, Dice.Binary(4).Odds);   // Ur
        var senet = Dice.Sticks(4, blankValue: 5);
        Assert.Equal(1 / 16.0, senet.P(5));
        Assert.Equal(0, senet.P(0));
        Assert.Equal(6 / 36.0, Dice.D6(2).P(7), 12);
        Assert.Equal(1.0, Dice.Cowries(7, up => up == 0 ? 25 : up).Odds.Sum(o => o.P), 12);
        Assert.Throws<ArgumentException>(() => Dice.Custom("bad", 1, 2, f => f[0], [(1, 0.4), (2, 0.4)]));
    }

    [Fact]
    public void A_throw_replays_from_the_seed_and_can_be_forced()
    {
        var sticks = Dice.Sticks(4, blankValue: 5);
        Assert.Equal(sticks.Roll(new Rng(9).Stream("Dice")), sticks.Roll(new Rng(9).Stream("Dice")), new ThrowEq());
        var rng = new Rng(1);
        rng.ForceDice("Dice", 1, 1, 1, 1);   // every stick blank side up
        Assert.Equal(5, sticks.Roll(rng.Stream("Dice")).Value);
    }

    sealed class ThrowEq : IEqualityComparer<Throw>
    {
        public bool Equals(Throw? a, Throw? b) => a!.Value == b!.Value && a.Faces.SequenceEqual(b.Faces);
        public int GetHashCode(Throw t) => t.Value;
    }

    [Fact]
    public void Pits_sow_round_and_skip_the_emptied_pit()
    {
        var pits = new Pits();
        var board = new int[12];
        board[0] = 12;
        var path = new List<int>();
        Assert.Equal(1, pits.Sow(board, 0, skipOrigin: true, path));   // 11 pits, then round past pit 0 to pit 1
        Assert.Equal(0, board[0]);
        Assert.Equal(2, board[1]);
        Assert.Equal(12, path.Count);
        Assert.Equal(12, pits.RowSum(board, 0) + pits.RowSum(board, 1));
    }

    // A toy dice race for the expectiminimax: each side has one counter; a throw of one binary die (0 or 1) may be
    // taken (advance) or refused (stay); reaching 3 wins.
    readonly record struct Race(int A, int B, int ToMove);

    sealed class RaceRules : IChanceRules<Race, bool>
    {
        public IReadOnlyList<(int Value, double P)> Odds(Race pos) => Dice.Binary(1).Odds;
        public List<bool> Actions(Race pos, int roll) => roll == 0 ? [] : [false, true];
        public Race Apply(Race pos, int roll, bool advance) =>
            (pos.ToMove == 0 ? pos with { A = pos.A + (advance ? roll : 0) } : pos with { B = pos.B + (advance ? roll : 0) }) with { ToMove = 1 - pos.ToMove };
        public Race Pass(Race pos, int roll) => pos with { ToMove = 1 - pos.ToMove };
        public int ToMove(Race pos) => pos.ToMove;
        public int? Winner(Race pos) => pos.A >= 3 ? 0 : pos.B >= 3 ? 1 : null;
        public double Evaluate(Race pos, int seat) => seat == 0 ? pos.A - pos.B : pos.B - pos.A;
    }

    [Fact]
    public void Expectiminimax_takes_the_winning_step_and_averages_throws()
    {
        var search = new Expectiminimax<Race, bool>(new RaceRules());
        Assert.Equal(1, search.Best(new Race(2, 0, 0), 1, [false, true], depth: 2));   // advancing wins now
        Assert.Equal(1, search.Best(new Race(0, 0, 0), 1, [false, true], depth: 4));
        // Depth 1 from (1, 0) with side 1 to throw: half the time 1 moves to 1 (value 0), half it can't (value 1).
        Assert.Equal(0.5, search.BeforeThrow(new Race(1, 0, 1), 1, me: 0), 12);
    }

    // Negamax on Nim (take 1 or 2 from a pile; taking the last stone wins): multiples of 3 lose for the side to move.
    readonly record struct Nim(int Stones, int ToMove);

    sealed class NimRules : IRules<Nim, int>
    {
        public List<int> Actions(Nim pos) => pos.Stones >= 2 ? [1, 2] : pos.Stones == 1 ? [1] : [];
        public Nim Apply(Nim pos, int take) => new(pos.Stones - take, 1 - pos.ToMove);
        public int ToMove(Nim pos) => pos.ToMove;
        public SearchOutcome Outcome(Nim pos) => pos.Stones == 0 ? SearchOutcome.Loss : SearchOutcome.Ongoing;
        public ulong Hash(Nim pos) => (ulong)(pos.Stones * 2 + pos.ToMove) * 0x9E3779B97F4A7C15ul;
        public int Evaluate(Nim pos) => 0;
    }

    [Theory]
    [InlineData(4, 1)]
    [InlineData(5, 2)]
    [InlineData(7, 1)]
    public void Negamax_solves_nim(int stones, int take)
    {
        var (best, score) = new Negamax<Nim, int>(new NimRules(), ttBits: 10).Best(new Nim(stones, 0), 20, 100_000);
        Assert.Equal(take, best);
        Assert.True(score > Negamax<Nim, int>.Win - 1000);
    }
}
