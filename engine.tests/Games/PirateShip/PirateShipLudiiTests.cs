using Archive.Engine.Core;
using Archive.Engine.Games.PirateShip;
using Archive.Engine.Tests.Conformance;
using Xunit.Abstractions;

namespace Archive.Engine.Tests.Games.PirateShip;

/// <summary>
/// Ludii as a referee (SOURCES.md row LU, utilities/ludii/README.md): Ludii's random games of the same game, replayed in
/// our engine, with our legal moves compared to Ludii's at every position. Skips where the traces are missing. For the
/// placeholder (three in a row) the traces are Ludii's "Tic-Tac-Toe.lud"; for the real game, add a line for it to
/// utilities/ludii/referee/make_traces.sh, run it, and rewrite the site map from traces/pirate-ship/topology.txt.
/// </summary>
public sealed class PirateShipLudiiTests(ITestOutputHelper output)
{
    const string Trace = "Tic-Tac-Toe - default.jsonl";

    /// <summary>Ludii's cell c is row c / 3 from the bottom, column c % 3 (topology.txt): our point a1..c3. Written by hand.</summary>
    static string Name(int cell) => $"{(char)('a' + cell % 3)}{cell / 3 + 1}";

    /// <summary>Ludii's players are 1 and 2; ours 0 and 1.</summary>
    static int Seat(int ludiiPlayer) => ludiiPlayer - 1;

    static LudiiReferee<PsPos> Referee(Func<PsPos, IEnumerable<string>>? ours = null)
    {
        var r = PirateShipHarness.Rules();
        return new LudiiReferee<PsPos>
        {
            Start = () => r.Start,
            Ours = ours ?? (p => r.Actions(p).Select(a => r.Board.Names[a.To])),
            // A placement is written from = to on the board.
            Theirs = (_, m) => m.IsPass || m.ToType != "Cell" ? null : Name(m.To),
            Apply = (p, key) => r.Apply(p, new PsAction((sbyte)r.Board.IndexOf(key))),
            Ended = (p, s) =>
            {
                var outcome = r.Outcome(p);
                int? ourWinner = outcome == SearchOutcome.Loss ? 1 - p.ToMove : null;
                int? ludiiWinner = s.Winner > 0 ? Seat(s.Winner) : null;
                return outcome == SearchOutcome.Ongoing ? $"Ludii ends the game (winner {s.Winner}); ours goes on"
                    : ourWinner != ludiiWinner ? $"winner: ours {ourWinner}, Ludii's {ludiiWinner}" : null;
            },
            SamePosition = (p, s) => s.Mover > 0 && Seat(s.Mover) != p.ToMove && !s.Over ? $"Ludii's mover {s.Mover}, ours seat {p.ToMove}" : null,
        };
    }

    [LudiiFact]
    public void Ludii_referee_legal_moves_match_at_every_position()
    {
        var file = LudiiTraces.File(Trace);
        Assert.True(File.Exists(file), $"no trace {file}");
        var referee = Referee().Run(file);
        output.WriteLine($"compared {referee.Compared} positions and {referee.Endings} endings; {referee.Differences.Count} differences");
        foreach (var d in referee.Differences.Take(20)) output.WriteLine(d);
        Assert.True(referee.Compared >= 100, $"only {referee.Compared} positions compared");   // a clean result must mean something (I-093)
        Assert.Empty(referee.Differences);
    }

    [LudiiFact]
    public void Ludii_referee_catches_a_broken_rule()
    {
        // Break one rule on purpose (the centre can't be taken): the referee must notice, or a clean run proves nothing.
        var r = PirateShipHarness.Rules();
        var referee = Referee(p => r.Actions(p).Where(a => r.Board.Names[a.To] != "b2").Select(a => r.Board.Names[a.To])).Run(LudiiTraces.File(Trace));
        Assert.NotEmpty(referee.Differences);
    }

    [Fact]
    public void Trace_lines_parse()
    {
        // A line in the shape LudiiTrace.java writes (made up here, not Ludii's data).
        var s = LudiiTrace.Parse("""{"game":3,"step":4,"mover":2,"phase":0,"over":false,"winner":0,"sites":[[0,"Cell",4,1,1,1,0]],"legal":[{"from":-1,"fromType":"Cell","to":-1,"toType":"Cell","mover":2},{"from":0,"fromType":"Cell","to":0,"toType":"Cell","mover":2}],"chosen":1}""");
        Assert.Equal((3, 4, 2), (s.Game, s.Step, s.Mover));
        Assert.Equal(new LudiiSite(0, "Cell", 4, 1, 1, 1, 0), s.Sites[0]);
        Assert.True(s.Legal[0].IsPass);
        Assert.True(s.ChosenMove!.InPlace);
    }
}
