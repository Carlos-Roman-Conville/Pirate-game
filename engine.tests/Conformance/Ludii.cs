using System.Globalization;
using System.Text.Json;

namespace Archive.Engine.Tests.Conformance;

// Ludii as a referee (utilities/ludii/README.md): utilities/ludii/referee/make_traces.sh plays random games in Ludii
// and writes every position with Ludii's legal moves; a game's PirateShipLudiiTests replays them in our engine and compares
// legal moves at every step. Nothing of Ludii's is in this repo (CC BY-NC-ND 4.0): the traces are read from outside it
// at test time, and the site map is written by hand from topology.txt. On a machine without the traces the tests skip,
// so the four checks pass anywhere. Never change a rule just to match Ludii: a difference is our bug (fix it, with a
// rule test) or a ruleset choice (a D-row naming both sources, and the referee follows Ludii past that case, counted).
// Board kit (_template/board-kit), after the referee tests of Morris, Ur, Oware, Bagh-Chal, Fox and Geese and
// Hnefatafl (ISSUES I-093 to I-096); the game's own once stamped.
//
// Trace quirks the six games found (read these before calling a difference our bug):
// - A line's sites are the position before Ludii throws: the dice shown on line k+1 are line k's throw (I-094).
// - A move with from = to on the board is a placement (Morris, three in a row) or a bear-off (Ur, Senet): the map says.
// - "Can't move" is a single legal move with from = -1 (a pass); the next line is over (I-096).
// - A ruleset with no options plays the default code even if its text differs (I-095); compare trace sizes first.
// - A clean result can mean the comparison never ran: assert a minimum of positions compared, and break one rule on
//   purpose once to see the test fail (I-093).

/// <summary>Where the traces are: LUDII_TRACES, default E:\AI Programs\utilities\ludii\traces; this game's are in pirate-ship/.</summary>
public static class LudiiTraces
{
    public const string GameFolder = "pirate-ship";
    public static string Root => Environment.GetEnvironmentVariable("LUDII_TRACES") is { Length: > 0 } d ? d : @"E:\AI Programs\utilities\ludii\traces";
    public static string Folder => Path.Combine(Root, GameFolder);
    public static string SkipReason => $"no Ludii traces at {Folder} (set LUDII_TRACES; see utilities/ludii/README.md)";
    public static string File(string name) => Path.Combine(Folder, name);
}

/// <summary>A fact that skips, saying why, where this game's Ludii traces are missing (xUnit 2 skips only from the attribute, I-093).</summary>
public sealed class LudiiFactAttribute : FactAttribute
{
    public LudiiFactAttribute() { if (!Directory.Exists(LudiiTraces.Folder)) Skip = LudiiTraces.SkipReason; }
}

/// <summary>The same for a theory (one case per ruleset file).</summary>
public sealed class LudiiTheoryAttribute : TheoryAttribute
{
    public LudiiTheoryAttribute() { if (!Directory.Exists(LudiiTraces.Folder)) Skip = LudiiTraces.SkipReason; }
}

/// <summary>One piece on a site: container 0 is the board, higher containers hands and dice; Who is Ludii's player
/// (1, 2, ...); State holds a die's value.</summary>
public sealed record LudiiSite(int Container, string Type, int Site, int What, int Who, int Count, int State);

/// <summary>A legal move as Ludii writes it. From = -1 is a pass.</summary>
public sealed record LudiiMove(int From, string FromType, int To, string ToType, int Mover)
{
    public bool IsPass => From < 0;
    public bool InPlace => From == To && FromType == ToType;
}

/// <summary>One trace line: the position (Sites) before the mover acts, Ludii's legal moves, and the index it chose
/// (-1 on the last line). Players are Ludii's: 1, 2, ...; Winner 0 is none.</summary>
public sealed record LudiiStep(int Game, int Step, int Mover, int Phase, bool Over, int Winner,
    IReadOnlyList<LudiiSite> Sites, IReadOnlyList<LudiiMove> Legal, int Chosen)
{
    public LudiiMove? ChosenMove => Chosen >= 0 && Chosen < Legal.Count ? Legal[Chosen] : null;
}

public static class LudiiTrace
{
    /// <summary>Every game in a trace file, each its steps in order.</summary>
    public static List<List<LudiiStep>> Load(string file) =>
        System.IO.File.ReadLines(file).Where(l => l.Length > 0).Select(Parse)
            .GroupBy(s => s.Game).OrderBy(g => g.Key).Select(g => g.OrderBy(s => s.Step).ToList()).ToList();

    public static LudiiStep Parse(string line)
    {
        using var doc = JsonDocument.Parse(line);
        var e = doc.RootElement;
        int Int(JsonElement x, string name, int fallback = 0) =>
            x.TryGetProperty(name, out var v) && v.ValueKind == JsonValueKind.Number ? v.GetInt32() : fallback;
        var sites = e.TryGetProperty("sites", out var ss)
            ? ss.EnumerateArray().Select(s => new LudiiSite(s[0].GetInt32(), s[1].ValueKind == JsonValueKind.String ? s[1].GetString()! : s[1].ToString(),
                s[2].GetInt32(), s[3].GetInt32(), s[4].GetInt32(), s[5].GetInt32(), s[6].GetInt32())).ToList()
            : [];
        var legal = e.GetProperty("legal").EnumerateArray().Select(m => new LudiiMove(Int(m, "from", -1), m.TryGetProperty("fromType", out var ft) ? ft.GetString() ?? "" : "",
            Int(m, "to", -1), m.TryGetProperty("toType", out var tt) ? tt.GetString() ?? "" : "", Int(m, "mover"))).ToList();
        return new LudiiStep(Int(e, "game"), Int(e, "step"), Int(e, "mover"), Int(e, "phase"),
            e.TryGetProperty("over", out var o) && o.GetBoolean(), Int(e, "winner"), sites, legal, Int(e, "chosen", -1));
    }
}

/// <summary>Ludii's board sites from topology.txt: kind (Cell, Vertex, Edge), index, coordinates, row and column.</summary>
public sealed record LudiiTopoSite(string Kind, int Index, double X, double Y, int Row, int Col);

public static class LudiiTopology
{
    /// <summary>The sites of one Ludii game in topology.txt (the first, or the section headed "## <paramref name="lud"/>").</summary>
    public static List<LudiiTopoSite> Load(string file, string? lud = null)
    {
        var list = new List<LudiiTopoSite>();
        var section = lud is null ? (bool?)null : false;
        foreach (var line in System.IO.File.ReadLines(file))
        {
            if (line.StartsWith("## "))
            {
                if (section is null && list.Count > 0) break;
                if (section is not null) section = line[3..].Trim() == lud;
                continue;
            }
            if (section == false || line.StartsWith('#') || line.Length == 0) continue;
            var p = line.Split('\t');
            if (p.Length < 6) continue;
            int Field(string s) => int.Parse(s[(s.IndexOf('=') + 1)..], CultureInfo.InvariantCulture);
            list.Add(new LudiiTopoSite(p[0], int.Parse(p[1], CultureInfo.InvariantCulture), double.Parse(p[2], CultureInfo.InvariantCulture),
                double.Parse(p[3], CultureInfo.InvariantCulture), Field(p[4]), Field(p[5])));
        }
        return list;
    }
}

/// <summary>
/// A generic referee loop for games whose turns map one Ludii step to one of our decisions. The game supplies the hooks;
/// a game whose turn is several Ludii steps (Morris's move then take, a jump chain, a throw then a move) writes its own
/// loop with the reader above, as Morris, Ur and Fox and Geese did.
/// </summary>
public sealed class LudiiReferee<TPos>
{
    /// <summary>The start position for a game (the same options as Ludii's ruleset).</summary>
    public required Func<TPos> Start { get; init; }
    /// <summary>Our legal moves at a position, each as a comparable key (notation such as "b2" or "a1-a4").</summary>
    public required Func<TPos, IEnumerable<string>> Ours { get; init; }
    /// <summary>A Ludii move as the same key, through the game's site map; null leaves it out (a pass, a dice site).</summary>
    public required Func<LudiiStep, LudiiMove, string?> Theirs { get; init; }
    /// <summary>Our position after the move with this key.</summary>
    public required Func<TPos, string, TPos> Apply { get; init; }
    /// <summary>At a line Ludii marks over: null when we agree the game ended (and on the winner), else what differs.</summary>
    public required Func<TPos, LudiiStep, string?> Ended { get; init; }
    /// <summary>Optional: a check of the position itself against the line's sites (null when they agree).</summary>
    public Func<TPos, LudiiStep, string?>? SamePosition { get; init; }

    public int Compared { get; private set; }
    public int Endings { get; private set; }
    public List<string> Differences { get; } = [];

    /// <summary>Replays every game in the file; stops a game at its first difference.</summary>
    public LudiiReferee<TPos> Run(string file)
    {
        foreach (var game in LudiiTrace.Load(file))
        {
            var pos = Start();
            foreach (var s in game)
            {
                var where = $"{Path.GetFileName(file)} game {s.Game} step {s.Step}";
                var ours = Ours(pos).Distinct().Order().ToList();
                // Ludii plays "can't move" as passes (from = -1) before it marks the game over (I-096): where we have
                // no move and Ludii only passes, the game has ended for both; compare the ending here.
                var onlyPasses = s.Legal.Count > 0 && s.Legal.All(m => m.IsPass);
                if (s.Over || (onlyPasses && ours.Count == 0))
                {
                    Endings++;
                    if (Ended(pos, s) is { } endDiff) Differences.Add($"{where}: {endDiff}");
                    break;
                }
                if (SamePosition?.Invoke(pos, s) is { } posDiff) { Differences.Add($"{where}: {posDiff}"); break; }
                var theirs = s.Legal.Select(m => Theirs(s, m)).OfType<string>().Distinct().Order().ToList();
                Compared++;
                if (!ours.SequenceEqual(theirs))
                {
                    Differences.Add($"{where}: only ours [{string.Join(" ", ours.Except(theirs))}] only Ludii's [{string.Join(" ", theirs.Except(ours))}]");
                    break;
                }
                if (s.ChosenMove is not { } chosen) break;   // the trace stopped (Ludii's step cap)
                var key = Theirs(s, chosen);
                if (key is not null) pos = Apply(pos, key);
            }
        }
        return this;
    }
}
