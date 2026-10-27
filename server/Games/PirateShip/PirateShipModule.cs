using System.Collections.Concurrent;
using System.Text.Json;
using System.Text.Json.Serialization;
using Archive.Engine.Games.PirateShip;
using Archive.Server.Modules;

namespace Archive.Server.Games.PirateShip;

/// <summary>
/// Pirate Ship against the computer or two players on one screen. A game is its seed, its options and every answer so
/// far (both seats, the computer's included, so a replay never searches again); every request replays it from those,
/// so the engine needs no save format and a game can't drift. Sessions are kept in memory and written to
/// server/saves/pirate-ship/ (gitignored) so a restart doesn't lose them; ARCHIVE_SAVES_DIR moves them (tests).
/// Routes: POST games, GET games/{id}, POST games/{id}/choose, POST games/{id}/undo, and the online match socket
/// (PirateShipMatches.cs). A signed-in lobby player's game against the computer reports match.started and match.finished
/// (contract v2, server/Lobby.cs). Board-kit pattern (_template/board-kit), after Nine Men's Morris's module.
/// </summary>
public sealed class PirateShipModule : IGameModule, IBoardModule
{
    public string Id => "pirate-ship";
    public string Name => "Pirate Ship";
    public string Summary => "working title · Rex's original";
    public string[] Features => ["solo", "hotseat", "match"];
    public string? Image => "icon.svg";   // web/public/icon.svg, an original drawing

    public static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web)
    {
        Converters = { new JsonStringEnumConverter() },
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,   // a draw has no winner key: the screen checks == null
    };

    /// <summary>What a session is: everything needed to replay it, saved as JSON as is. User and Match are the
    /// signed-in lobby player who started it (null for a guest).</summary>
    public sealed record Saved(int Seed, PsOptions Options, string Mode, PsLevel Level, int ComputerSide, List<int> Answers, string? User = null, string? Match = null);

    sealed class Session(Saved saved)
    {
        public Saved Saved { get; } = saved;
        public int Seen { get; set; }
        public Lock Gate { get; } = new();
    }

    readonly ConcurrentDictionary<string, Session> _games = new();
    string _saves = "";
    PirateShipMatches _matches = null!;

    public void AddServices(IServiceCollection services, ModuleContext context)
    {
        _saves = Environment.GetEnvironmentVariable("ARCHIVE_SAVES_DIR") is { Length: > 0 } dir
            ? Path.Combine(dir, Id) : Path.Combine(context.RepoRoot, "server", "saves", Id);
        Directory.CreateDirectory(_saves);
        _matches = new PirateShipMatches(_saves);
    }

    public void MapEndpoints(RouteGroupBuilder api)
    {
        // Online matches (contract v3): one WebSocket per player or spectator.
        api.Map("/match", async (HttpContext ctx) =>
        {
            if (!ctx.WebSockets.IsWebSocketRequest) return Results.BadRequest("WebSocket only");
            using var socket = await ctx.WebSockets.AcceptWebSocketAsync();
            await _matches.Serve(socket, ctx.Items["player"] as LobbyToken, ctx.RequestAborted);
            return Results.Empty;
        });

        api.MapPost("/games", (NewGameRequest? req, HttpContext ctx) =>
        {
            var player = ctx.Items["player"] as LobbyToken;
            req ??= new NewGameRequest();
            var hotseat = req.Mode == "hotseat";
            var human = req.HumanSide is 1 ? 1 : 0;
            var saved = new Saved(req.Seed ?? Random.Shared.Next(1, int.MaxValue), new PsOptions(), hotseat ? "hotseat" : "computer",
                req.Level ?? PsLevel.Medium, hotseat ? -1 : 1 - human, [], player?.User, player?.Match);
            var id = Guid.NewGuid().ToString("N")[..12];
            var session = new Session(saved);
            _games[id] = session;
            if (saved.User is { } user && !hotseat)
                Lobby.PostEvent($"{id}-started", "match.started", user, saved.Match, new { mode = "ai", level = saved.Level.ToString(), opponent = "ai" });
            lock (session.Gate)
            {
                var (g, _) = Replay(saved);
                Save(id, saved);
                return View(id, session, g);
            }
        });

        api.MapGet("/games/{id}", (string id) =>
        {
            if (Find(id) is not { } session) return Results.NotFound("no such game");
            lock (session.Gate)
            {
                session.Seen = 0;   // a reload gets the whole log
                return View(id, session, Replay(session.Saved).Game);
            }
        });

        api.MapPost("/games/{id}/choose", (string id, ChooseRequest req) =>
        {
            if (Find(id) is not { } session) return Results.NotFound("no such game");
            lock (session.Gate)
            {
                var s = session.Saved;
                var (before, _) = Replay(s);
                if (before.Waiting is not { } d || d.Player == s.ComputerSide) return Results.BadRequest("nothing to answer");
                if (req.Option < 0 || req.Option >= d.Options.Count) return Results.BadRequest("that option isn't offered");
                s.Answers.Add(req.Option);
                var (g, _) = Replay(s);   // the computer's replies are appended to the answers here
                Save(id, s);
                if (g.Result is { } r) Finished(id, s, g, r);
                return View(id, session, g);
            }
        });

        // Takes back the last decision a human answered, with everything after it (the computer's reply). A game whose
        // turn is several decisions (move then take, a jump chain, throw then move) cuts back to the turn's first one.
        api.MapPost("/games/{id}/undo", (string id) =>
        {
            if (Find(id) is not { } session) return Results.NotFound("no such game");
            lock (session.Gate)
            {
                var s = session.Saved;
                var (_, asked) = Replay(s);
                var cut = -1;
                for (var i = Math.Min(asked.Count, s.Answers.Count) - 1; i >= 0; i--)
                    if (asked[i].Player != s.ComputerSide && StartsTurn(asked[i])) { cut = i; break; }
                if (cut < 0) return Results.BadRequest("nothing to take back");
                s.Answers.RemoveRange(cut, s.Answers.Count - cut);
                var (g, _) = Replay(s);
                Save(id, s);
                session.Seen = 0;
                return View(id, session, g);
            }
        });
    }

    /// <summary>True for a decision that starts a human's turn (where undo may cut back to). Morris: not a Take.</summary>
    static bool StartsTurn(PsDecision d) => d.Kind == PsAsk.Place;

    /// <summary>
    /// Lobby contract v2: a signed-in player's game against the computer reports its result (the computer is "ai").
    /// Same-screen games are one person playing both sides, so they report nothing. The event id is the game's, so a
    /// retry, or finishing again after an undo, is stored once by the lobby.
    /// </summary>
    static void Finished(string id, Saved s, PsGame g, PsResult r)
    {
        if (s.User is not { } user || s.ComputerSide is not (0 or 1)) return;
        string? winner = r.Winner is not { } w ? null : w == s.ComputerSide ? "ai" : user;
        string? loser = r.Winner is not { } l ? null : l == s.ComputerSide ? user : "ai";
        Lobby.PostEvent($"{id}-finished", "match.finished", user, s.Match, new
        {
            winner, loser, draw = r.Winner is null, turns = g.Turn, mode = "ai", level = s.Level.ToString(), reason = r.Reason,
        });
    }

    Session? Find(string id)
    {
        if (_games.TryGetValue(id, out var s)) return s;
        if (!System.Text.RegularExpressions.Regex.IsMatch(id, "^[a-f0-9]{12}$")) return null;
        var path = Path.Combine(_saves, id + ".json");
        if (!File.Exists(path)) return null;
        try
        {
            var saved = JsonSerializer.Deserialize<Saved>(File.ReadAllText(path), JsonOptions);
            return saved is null ? null : _games.GetOrAdd(id, _ => new Session(saved));
        }
        catch (JsonException) { return null; }
    }

    void Save(string id, Saved s)
    {
        try { File.WriteAllText(Path.Combine(_saves, id + ".json"), JsonSerializer.Serialize(s, JsonOptions)); }
        catch (IOException) { /* the in-memory session still works */ }
    }

    /// <summary>Plays the game again from its seed and answers; the engine stops where a human must answer.</summary>
    static (PsGame Game, List<PsDecision> Asked) Replay(Saved s)
    {
        var ai = new IPsDecider?[2];
        if (s.ComputerSide is 0 or 1) ai[s.ComputerSide] = new PsAi(s.Level);
        var rec = new PsRecorded(s.Answers, ai);
        var g = new PsGame(s.Options, s.Seed, [rec, rec]);
        g.RunUntilInput();
        return (g, rec.Asked);
    }

    /// <summary>The decision for the screen: prompt, labels, and the same options as board points.</summary>
    public static object? DecisionDto(PsGame g) =>
        g.Waiting is { } d ? new { d.Player, d.Kind, d.Prompt, d.Options, d.Points } : null;

    static IResult View(string id, Session session, PsGame g)
    {
        var s = session.Saved;
        var reset = session.Seen == 0;   // the whole log (new game, reload, undo): the screen starts its board and log over
        var events = GameEventDto.Of(g.Log.Since(session.Seen));
        session.Seen = g.Log.Count;
        return Results.Json(new
        {
            id,
            mode = s.Mode,
            level = s.Level,
            computerSide = s.ComputerSide,
            reset,
            view = g.View(s.ComputerSide is 0 or 1 ? 1 - s.ComputerSide : null),
            events,
            decision = g.Waiting is { } d && d.Player != s.ComputerSide ? DecisionDto(g) : null,
            result = g.Result,
            canUndo = s.Answers.Count > 0,
        }, JsonOptions);
    }

    public sealed record NewGameRequest(int? Seed = null, string? Mode = null, PsLevel? Level = null, int? HumanSide = null);
    public sealed record ChooseRequest(int Option);
}
