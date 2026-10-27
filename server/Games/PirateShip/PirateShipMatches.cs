using System.Collections.Concurrent;
using System.Net.WebSockets;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using Archive.Engine.Games.PirateShip;

namespace Archive.Server.Games.PirateShip;

/// <summary>
/// Online matches through the lobby (games/lobby/docs/CONTRACT-V3.md). A match is one shared game on the server: a seed
/// made here, the default options, and both players' answers in order, replayed on every change exactly like the solo
/// sessions, so dice and hidden hands never leave the server: each socket gets <see cref="PsGame.View"/> for its own seat.
/// The host is seat 0, the guest seat 1. Players and spectators each keep one WebSocket (`/api/pirate-ship/match`, plain
/// JSON; ASP.NET's own WebSockets, so no extra package):
///   client → server: {"type":"join","match":"&lt;32 hex&gt;","token":"&lt;match token&gt;"} then {"type":"choose","option":n}
///   server → client: {"type":"state", ...} after every change, to everyone watching; {"type":"error","message":...}
/// Who sits where comes only from the token: its seat claim the first time, then the user id, so a reload or a
/// reconnect (even with a plain lobby token after the match token has run out) gets the same seat back. The game posts
/// match.started once both are seated and exactly one match.finished, with stable ids (m-&lt;id&gt;-start / -end).
/// Each match is saved as match-&lt;id&gt;.json beside the solo saves, so a restart doesn't lose it.
/// Board-kit pattern (_template/board-kit): Liar's Dice's LdMatches (socket, per-seat views) with Morris's saved matches.
/// Only <see cref="Replay"/>, the view and the decision are game-specific.
/// </summary>
public sealed partial class PirateShipMatches(string saves)
{
    [GeneratedRegex("^[0-9a-f]{32}$")]
    private static partial Regex MatchId();

    static readonly JsonSerializerOptions Json = PirateShipModule.JsonOptions;

    /// <summary>What a match is, saved as JSON as is.</summary>
    public sealed record SavedMatch(string Id, int Seed, LobbyToken?[] Players, List<int> Inputs, bool Started, bool Reported);

    sealed class Match(SavedMatch saved)
    {
        public SavedMatch Saved { get; set; } = saved;
        public List<Watcher> Watchers { get; } = [];
        public Lock Gate { get; } = new();
    }

    /// <summary>One open socket: which seat (null = spectator), and how many events it has been sent.</summary>
    sealed class Watcher(WebSocket socket, int? seat, SemaphoreSlim sendGate)
    {
        public WebSocket Socket { get; } = socket;
        public int? Seat { get; } = seat;
        public int Seen { get; set; }
        /// <summary>A socket takes one send at a time; replies and other players' broadcasts share this.</summary>
        public SemaphoreSlim SendGate { get; } = sendGate;
    }

    readonly ConcurrentDictionary<string, Match> _matches = new();

    /// <summary>Runs one socket until it closes. <paramref name="headerPlayer"/> is the lobby token from the request, if any.</summary>
    public async Task Serve(WebSocket socket, LobbyToken? headerPlayer, CancellationToken ct)
    {
        Match? match = null;
        Watcher? me = null;
        var sendGate = new SemaphoreSlim(1, 1);
        try
        {
            while (socket.State == WebSocketState.Open && !ct.IsCancellationRequested)
            {
                var text = await Receive(socket, ct);
                if (text is null) break;
                Message? msg;
                try { msg = JsonSerializer.Deserialize<Message>(text, Json); }
                catch (JsonException) { await SendError(socket, sendGate, "bad message"); continue; }
                if (msg is null) continue;

                if (msg.Type == "join" && me is null)
                {
                    var joined = Join(msg, headerPlayer, socket, sendGate, out var error);
                    if (joined is null) { await SendError(socket, sendGate, error!); continue; }
                    (match, me) = joined.Value;
                    await Broadcast(match, reset: me);
                }
                else if (msg.Type == "choose" && match is not null && me is not null)
                {
                    var error = Choose(match, me, msg.Option);
                    if (error is not null) await SendError(socket, sendGate, error);
                    else await Broadcast(match, reset: null);
                }
                else await SendError(socket, sendGate, me is null ? "join a match first" : "unknown message");
            }
        }
        catch (WebSocketException) { }
        catch (OperationCanceledException) { }
        finally
        {
            if (match is not null && me is not null) lock (match.Gate) match.Watchers.Remove(me);
            // Answer the client's close, or close ours if the server is the one ending it.
            if (socket.State is WebSocketState.Open or WebSocketState.CloseReceived)
                try { await socket.CloseOutputAsync(WebSocketCloseStatus.NormalClosure, "bye", CancellationToken.None); } catch (WebSocketException) { }
        }
    }

    (Match, Watcher)? Join(Message msg, LobbyToken? headerPlayer, WebSocket socket, SemaphoreSlim sendGate, out string? error)
    {
        error = null;
        if (msg.Match is not { } id || !MatchId().IsMatch(id)) { error = "no such match"; return null; }
        var t = Lobby.Verify(msg.Token) ?? headerPlayer;
        if (t is null) { error = "sign in through the lobby to play this match"; return null; }

        var claim = t.Match == id ? t.Seat : null;
        var seatClaim = claim switch { "host" => 0, "guest" => 1, _ => (int?)null };
        // A token naming a match we don't know yet starts it; anyone else needs the match to exist already.
        var match = Find(id) ?? (seatClaim is not null
            ? _matches.GetOrAdd(id, _ => new Match(new SavedMatch(id, Random.Shared.Next(1, int.MaxValue), new LobbyToken?[2], [], false, false)))
            : null);
        if (match is null) { error = "this match hasn't started"; return null; }

        lock (match.Gate)
        {
            var s = match.Saved;
            int? seat = null;
            for (var i = 0; i < 2; i++) if (s.Players[i]?.User == t.User) seat = i;
            if (seat is null && seatClaim is { } c)
            {
                if (s.Players[c] is not null) { error = "that seat is taken"; return null; }
                s.Players[c] = t;
                seat = c;
            }
            if (seat is null && claim != "spectator") { error = "you're not in this match"; return null; }   // a stranger

            var me = new Watcher(socket, seat, sendGate);
            match.Watchers.Add(me);
            if (!s.Started && s.Players[0] is { } host && s.Players[1] is { } guest)
            {
                s = s with { Started = true };   // both seated: play begins and the lobby stops the no-show clock
                Lobby.PostEvent($"m-{id}-start", "match.started", null, null, new { match = id, host = host.User, guest = guest.User });
            }
            match.Saved = s;
            Save(s);
            return (match, me);
        }
    }

    string? Choose(Match match, Watcher me, int option)
    {
        if (me.Seat is not { } seat) return "spectators can't move";
        lock (match.Gate)
        {
            var s = match.Saved;
            if (!s.Started) return "waiting for the other player";
            var g = Replay(s);
            if (g.Result is not null) return "the match is over";
            if (g.Waiting is not { } d || d.Player != seat) return "it's not your turn";
            if (option < 0 || option >= d.Options.Count) return "that option isn't offered";
            s.Inputs.Add(option);
            var after = Replay(s);
            if (after.Result is { } r && !s.Reported)
            {
                s = s with { Reported = true };   // exactly one match.finished per match
                Lobby.PostEvent($"m-{s.Id}-end", "match.finished", null, null, new
                {
                    match = s.Id,
                    winner = r.Winner is { } w ? s.Players[w]!.User : null,
                    loser = r.Winner is { } l ? s.Players[1 - l]!.User : null,
                    draw = r.Winner is null,
                    turns = after.Turn,
                    reason = r.Reason,
                });
            }
            match.Saved = s;
            Save(s);
            return null;
        }
    }

    /// <summary>The match's game: everyone's answers from one list, so nothing ever searches here.</summary>
    static PsGame Replay(SavedMatch s)
    {
        var both = new PsInputDecider(s.Inputs);
        var g = new PsGame(new PsOptions(), s.Seed, [both, both]);
        g.RunUntilInput();
        return g;
    }

    /// <summary>Sends the match to everyone watching it: the events each hasn't seen, or the whole log to <paramref name="reset"/>.</summary>
    static async Task Broadcast(Match match, Watcher? reset)
    {
        List<(Watcher W, byte[] Body)> sends = [];
        lock (match.Gate)
        {
            var s = match.Saved;
            var g = Replay(s);
            foreach (var w in match.Watchers)
            {
                var fresh = w == reset;
                var events = Modules.GameEventDto.Of(fresh ? g.Log.All : g.Log.Since(w.Seen));
                w.Seen = g.Log.Count;
                sends.Add((w, JsonSerializer.SerializeToUtf8Bytes(new
                {
                    type = "state",
                    id = s.Id,
                    mode = "online",
                    you = w.Seat,
                    seat = w.Seat switch { 0 => "host", 1 => "guest", _ => "spectator" },
                    names = s.Players.Select(p => p?.Nickname).ToArray(),
                    started = s.Started,
                    view = g.View(w.Seat),   // each socket sees only what its seat may see
                    events,
                    reset = fresh,
                    decision = s.Started ? PirateShipModule.DecisionDto(g) : null,
                    result = g.Result,
                    canUndo = false,
                }, Json)));
            }
        }
        foreach (var (w, body) in sends) await Send(w, body);
    }

    Match? Find(string id)
    {
        if (_matches.TryGetValue(id, out var m)) return m;
        var path = Path.Combine(saves, $"match-{id}.json");
        if (!File.Exists(path)) return null;
        try
        {
            var saved = JsonSerializer.Deserialize<SavedMatch>(File.ReadAllText(path), Json);
            return saved is null ? null : _matches.GetOrAdd(id, _ => new Match(saved));
        }
        catch (JsonException) { return null; }
    }

    void Save(SavedMatch s)
    {
        try { File.WriteAllText(Path.Combine(saves, $"match-{s.Id}.json"), JsonSerializer.Serialize(s, Json)); }
        catch (IOException) { /* the in-memory match still works */ }
    }

    static async Task Send(Watcher w, byte[] body)
    {
        await w.SendGate.WaitAsync();
        try
        {
            if (w.Socket.State == WebSocketState.Open)
                await w.Socket.SendAsync(body, WebSocketMessageType.Text, true, CancellationToken.None);
        }
        catch (WebSocketException) { }
        finally { w.SendGate.Release(); }
    }

    static Task SendError(WebSocket socket, SemaphoreSlim gate, string message) =>
        Send(new Watcher(socket, null, gate), JsonSerializer.SerializeToUtf8Bytes(new { type = "error", message }, Json));

    static async Task<string?> Receive(WebSocket socket, CancellationToken ct)
    {
        var buffer = new byte[4096];
        using var ms = new MemoryStream();
        while (true)
        {
            var r = await socket.ReceiveAsync(buffer, ct);
            if (r.MessageType == WebSocketMessageType.Close) return null;
            ms.Write(buffer, 0, r.Count);
            if (ms.Length > 16_384) return null;   // messages are tiny; anything bigger is not ours
            if (r.EndOfMessage) return Encoding.UTF8.GetString(ms.ToArray());
        }
    }

    sealed record Message(string? Type, string? Match, string? Token, int Option);
}
