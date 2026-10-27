using System.Collections.Concurrent;
using System.Net;
using System.Net.Http.Json;
using System.Net.Sockets;
using System.Net.WebSockets;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Archive.Server;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;

namespace Archive.Engine.Tests.Games.PirateShip;

/// <summary>
/// The lobby contract end to end (TRADITIONAL_GAMES.md §5.3 gate 6): the real server in-process on a free port, a fake
/// lobby that checks each event's signature, and players holding match tokens signed with a test LOBBY_SECRET. Covers
/// the manifest, seats from tokens, spectators and strangers refused, and exactly one match.finished per match.
/// Board-kit pattern (_template/board-kit), after Royal Game of Ur's match tests.
/// </summary>
[Collection("lobby")]   // Lobby's secret is process-wide; these tests run one at a time
public sealed class PirateShipMatchTests : IAsyncLifetime
{
    const string Secret = "test-secret";
    WebApplication _server = null!, _lobby = null!;
    string _base = "";
    readonly ConcurrentQueue<JsonElement> _events = new();
    int _badSignatures;
    readonly string _saves = Path.Combine(Path.GetTempPath(), "board-kit-tests-" + Guid.NewGuid().ToString("N")[..8]);

    static int FreePort()
    {
        using var l = new TcpListener(IPAddress.Loopback, 0);
        l.Start();
        return ((IPEndPoint)l.LocalEndpoint).Port;
    }

    public async Task InitializeAsync()
    {
        var lobbyPort = FreePort();
        _lobby = WebApplication.CreateBuilder().Build();
        _lobby.Urls.Add($"http://127.0.0.1:{lobbyPort}");
        _lobby.MapPost("/api/events", async (HttpContext ctx) =>
        {
            using var ms = new MemoryStream();
            await ctx.Request.Body.CopyToAsync(ms);
            var body = ms.ToArray();
            var want = "sha256=" + Convert.ToHexString(HMACSHA256.HashData(Encoding.UTF8.GetBytes(Secret), body)).ToLowerInvariant();
            if (ctx.Request.Headers["X-Lobby-Signature"] != want) { Interlocked.Increment(ref _badSignatures); return Results.StatusCode(401); }
            _events.Enqueue(JsonDocument.Parse(body).RootElement.Clone());
            return Results.StatusCode(201);
        });
        await _lobby.StartAsync();

        Lobby.Configure(Secret, $"http://127.0.0.1:{lobbyPort}");
        Environment.SetEnvironmentVariable("ARCHIVE_SAVES_DIR", _saves);
        var port = FreePort();
        _server = ServerApp.Build([$"--urls=http://127.0.0.1:{port}"]);
        await _server.StartAsync();
        _base = $"127.0.0.1:{port}";
    }

    public async Task DisposeAsync()
    {
        await _server.StopAsync();
        await _lobby.StopAsync();
        Lobby.Configure(null, "http://127.0.0.1:5106");
        Environment.SetEnvironmentVariable("ARCHIVE_SAVES_DIR", null);
        try { Directory.Delete(_saves, recursive: true); } catch (IOException) { }
    }

    static string B64(byte[] b) => Convert.ToBase64String(b).TrimEnd('=').Replace('+', '-').Replace('/', '_');

    static string Token(string user, string? match, string? seat, string game = "pirate-ship")
    {
        var claims = new Dictionary<string, object?>
        {
            ["user"] = user, ["nickname"] = user.ToUpperInvariant(), ["roles"] = new[] { "member" }, ["game"] = game,
            ["match"] = match, ["exp"] = DateTimeOffset.UtcNow.AddMinutes(10).ToUnixTimeSeconds(),
        };
        if (seat is not null) claims["seat"] = seat;
        var payload = B64(JsonSerializer.SerializeToUtf8Bytes(claims));
        return payload + "." + B64(HMACSHA256.HashData(Encoding.UTF8.GetBytes(Secret), Encoding.ASCII.GetBytes(payload)));
    }

    static string NewMatchId() => Convert.ToHexString(RandomNumberGenerator.GetBytes(16)).ToLowerInvariant();

    /// <summary>One connected client: keeps the latest "state" and every "error" it was sent.</summary>
    sealed class Client : IAsyncDisposable
    {
        readonly ClientWebSocket _ws;
        readonly Task _reader;
        readonly Lock _gate = new();
        JsonElement? _state;
        readonly List<string> _errors = [];

        Client(ClientWebSocket ws) { _ws = ws; _reader = Read(); }

        public static async Task<Client> Join(string url, string match, string token)
        {
            var ws = new ClientWebSocket();
            await ws.ConnectAsync(new Uri(url), CancellationToken.None);
            var c = new Client(ws);
            await c.Send(new { type = "join", match, token });
            return c;
        }

        public Task Send(object msg) => _ws.SendAsync(JsonSerializer.SerializeToUtf8Bytes(msg), WebSocketMessageType.Text, true, CancellationToken.None);

        public JsonElement? State { get { lock (_gate) return _state; } }
        public List<string> Errors { get { lock (_gate) return [.. _errors]; } }

        async Task Read()
        {
            var buf = new byte[1 << 16];
            try
            {
                while (_ws.State == WebSocketState.Open)
                {
                    using var ms = new MemoryStream();
                    WebSocketReceiveResult r;
                    do { r = await _ws.ReceiveAsync(buf, CancellationToken.None); ms.Write(buf, 0, r.Count); } while (!r.EndOfMessage);
                    if (r.MessageType == WebSocketMessageType.Close) return;
                    var doc = JsonDocument.Parse(ms.ToArray()).RootElement.Clone();
                    lock (_gate)
                    {
                        if (doc.GetProperty("type").GetString() == "error") _errors.Add(doc.GetProperty("message").GetString()!);
                        else _state = doc;
                    }
                }
            }
            catch (WebSocketException) { }
        }

        public async ValueTask DisposeAsync()
        {
            try { await _ws.CloseAsync(WebSocketCloseStatus.NormalClosure, "bye", CancellationToken.None); } catch (WebSocketException) { }
            await _reader;
            _ws.Dispose();
        }
    }

    static async Task Until(Func<bool> done, string what)
    {
        for (var i = 0; i < 200 && !done(); i++) await Task.Delay(25);
        Assert.True(done(), $"timed out waiting for {what}");
    }

    string Ws => $"ws://{_base}/api/pirate-ship/match";

    /// <summary>The option index for a point name in the client's current decision.</summary>
    static int OptionFor(Client c, string label)
    {
        var options = c.State!.Value.GetProperty("decision").GetProperty("options").EnumerateArray().Select(o => o.GetString()).ToList();
        return options.IndexOf(label);
    }

    [Fact]
    public async Task Manifest_names_the_game_and_its_modes()
    {
        using var http = new HttpClient();
        var m = await http.GetFromJsonAsync<JsonElement>($"http://{_base}/api/manifest");
        Assert.Equal("pirate-ship", m.GetProperty("id").GetString());
        Assert.Contains("match", m.GetProperty("features").EnumerateArray().Select(f => f.GetString()));
    }

    [Fact]
    public async Task A_match_is_played_to_the_end_and_reported_once()
    {
        var id = NewMatchId();
        await using var host = await Client.Join(Ws, id, Token("ann", id, "host"));
        await using var guest = await Client.Join(Ws, id, Token("bob", id, "guest"));
        await Until(() => host.State?.GetProperty("started").GetBoolean() == true, "both seated");

        // The host (seat 0) makes three in a row along rank 1.
        string[] moves = ["a1", "a2", "b1", "b2", "c1"];
        for (var i = 0; i < moves.Length; i++)
        {
            var mover = i % 2 == 0 ? host : guest;
            await Until(() => mover.State?.GetProperty("decision") is { ValueKind: JsonValueKind.Object } d && d.GetProperty("player").GetInt32() == i % 2, $"move {i}");
            await mover.Send(new { type = "choose", option = OptionFor(mover, moves[i]) });
            await Until(() => host.State?.GetProperty("view").GetProperty("turn").GetInt32() == i + 1, $"turn {i + 1}");
        }
        await Until(() => _events.Any(e => e.GetProperty("type").GetString() == "match.finished"), "match.finished");

        await guest.Send(new { type = "choose", option = 0 });   // too late: the match is over
        await Until(() => guest.Errors.Count > 0, "an error");
        await Task.Delay(200);
        var finished = _events.Where(e => e.GetProperty("type").GetString() == "match.finished").ToList();
        Assert.Single(finished);
        Assert.Equal("ann", finished[0].GetProperty("data").GetProperty("winner").GetString());
        Assert.Single(_events, e => e.GetProperty("type").GetString() == "match.started");
        Assert.Equal(0, _badSignatures);
    }

    [Fact]
    public async Task Spectators_watch_and_strangers_are_refused()
    {
        var id = NewMatchId();
        await using var host = await Client.Join(Ws, id, Token("ann", id, "host"));
        await Until(() => host.State is not null, "the host's state");   // the host's join creates the match; a spectator can't join before it
        await using var guest = await Client.Join(Ws, id, Token("bob", id, "guest"));
        await using var watcher = await Client.Join(Ws, id, Token("cat", id, "spectator"));
        await using var stranger = await Client.Join(Ws, id, Token("dan", NewMatchId(), "host"));
        await Until(() => watcher.State is not null, "the spectator's state");
        Assert.Equal("spectator", watcher.State!.Value.GetProperty("seat").GetString());
        await watcher.Send(new { type = "choose", option = 0 });
        await Until(() => watcher.Errors.Count > 0 && stranger.Errors.Count > 0, "both refused");
        Assert.Contains("spectators can't move", watcher.Errors);
        Assert.Contains("you're not in this match", stranger.Errors);
    }
}
