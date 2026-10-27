using Archive.Engine.Core;
using Archive.Engine.Games.PirateShip;
using static Archive.Engine.Tests.Games.PirateShip.PirateShipHarness;

namespace Archive.Engine.Tests.Games.PirateShip;

/// <summary>
/// One test per rule and per D-row in files/pirate-ship/RULES.md, named after the D-row (D2_...) so the progress page counts
/// it, plus a negative test wherever a rule could misfire. These cover the placeholder; replace them with the game's.
/// </summary>
public sealed class PirateShipRuleTests
{
    [Fact]
    public void D1_seat_0_moves_first_unless_the_option_says_otherwise()
    {
        Assert.Equal(0, Play(new PsFirstOption(), new PsFirstOption()).Log.All.OfType<PsPlaced>().First().Player);
        Assert.Equal(1, Play(new PsFirstOption(), new PsFirstOption(), new PsOptions(FirstPlayer: 1)).Log.All.OfType<PsPlaced>().First().Player);
    }

    [Fact]
    public void D2_three_in_a_row_wins()
    {
        var g = Script("a1", "a2", "b1", "b2", "c1");
        Assert.Equal(new PsResult(0, "three in a row"), g.Result);
        Assert.Equal(PirateShipHarness.Rules().Board.Mask("a1", "b1", "c1"),
            PointGraphMask(g.Log.All.OfType<PsGameEnded>().Single().Line!));
    }

    [Fact]
    public void D2_a_diagonal_counts()
    {
        var r = PirateShipHarness.Rules();
        Assert.Equal(SearchOutcome.Loss, r.Outcome(Pos(r, "a1 b2 c3", "a2 a3", toMove: 1)));
    }

    [Fact]
    public void D2_negative_a_bent_three_is_not_a_line()
    {
        var r = PirateShipHarness.Rules();
        Assert.Equal(SearchOutcome.Ongoing, r.Outcome(Pos(r, "a1 b1 b2", "c1 a3", toMove: 1)));
    }

    [Fact]
    public void D3_a_full_board_with_no_line_is_a_draw()
    {
        // Rank 1: x o x, rank 2: x o o, rank 3: o x x. No line for either side.
        var g = Script("a1", "b1", "c1", "b2", "a2", "c2", "b3", "a3", "c3");
        Assert.Equal(new PsResult(null, "the board is full"), g.Result);
    }

    [Fact]
    public void Hard_ai_takes_a_win_and_blocks_a_loss()
    {
        var r = PirateShipHarness.Rules();
        var search = new Negamax<PsPos, PsAction>(r, ttBits: 12);
        Assert.Equal(r.Board.IndexOf("c1"), search.Best(Pos(r, "a1 b1", "a3 b3", toMove: 0), 9, 100_000).Best.To);   // win now
        Assert.Equal(r.Board.IndexOf("c3"), search.Best(Pos(r, "a1 c2", "a3 b3", toMove: 0), 9, 100_000).Best.To);   // block
        Assert.Equal(0, search.Best(r.Start, 9, 1_000_000).Score);   // perfect play draws
    }

    [Fact]
    public void Answers_replay_through_the_recorded_decider()
    {
        var answers = new List<int> { 4 };
        var rec = new PsRecorded(answers, [null, new PsAi(PsLevel.Hard)]);
        var g = new PsGame(PsOptions.Default, 3, [rec, rec]);
        g.RunUntilInput();
        Assert.Equal(2, answers.Count);   // the computer's reply was appended
        Assert.Equal(0, g.Waiting!.Player);
    }

    static ulong PointGraphMask(int[] points) => Archive.Engine.Core.Boards.PointGraph.ToMask(points);
}
