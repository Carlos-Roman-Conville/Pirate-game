using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace Archive.Server;

/// <summary>
/// A signed-in lobby player, from the X-Lobby-Token header or ?token= (lobby docs/CONTRACT-V2.md). Seat is set only on
/// a match token (CONTRACT-V3.md): "host", "guest" or "spectator".
/// </summary>
public record LobbyToken(string User, string Nickname, string[] Roles, string Game, string? Match, long Exp, string? Seat = null);

/// <summary>
/// Lobby contract v2, copied from games/lobby/docs/CONTRACT-V2.md through the board kit (_template/board-kit) and owned
/// here (nothing is a library): verifies the lobby token and posts signed events. Without LOBBY_SECRET everyone is a
/// guest and no events are sent. Testing online play by hand: start the server with LOBBY_SECRET (and
/// LOBBY_URL=http://127.0.0.1:9 when no lobby runs) and sign tokens with it (ISSUES I-078); never commit the secret.
/// </summary>
public static class Lobby
{
    public const string Game = "pirate-ship";
    static byte[]? Key = Environment.GetEnvironmentVariable("LOBBY_SECRET") is { Length: > 0 } s ? Encoding.UTF8.GetBytes(s) : null;
    public static readonly JsonSerializerOptions Json = new(JsonSerializerDefaults.Web);
    static HttpClient Http = NewClient(Environment.GetEnvironmentVariable("LOBBY_URL") is { Length: > 0 } u ? u : "http://127.0.0.1:5106");

    static HttpClient NewClient(string url) => new() { BaseAddress = new Uri(url), Timeout = TimeSpan.FromSeconds(10) };

    /// <summary>Tests: a secret and a lobby address in place of LOBBY_SECRET and LOBBY_URL.</summary>
    public static void Configure(string? secret, string url)
    {
        Key = secret is { Length: > 0 } ? Encoding.UTF8.GetBytes(secret) : null;
        Http = NewClient(url);
    }

    public static bool Enabled => Key is not null;

    /// <summary>Tests: sees each event body before it is sent; returning true keeps it from being sent.</summary>
    public static Func<byte[], bool>? Intercept { get; set; }

    /// <summary>The player, or null (a guest): no token, wrong signature, expired, or for another game.</summary>
    public static LobbyToken? Verify(string? token)
    {
        var parts = token?.Split('.');
        if (Key is null || parts is not { Length: 2 }) return null;
        try
        {
            var mac = HMACSHA256.HashData(Key, Encoding.ASCII.GetBytes(parts[0]));
            if (!CryptographicOperations.FixedTimeEquals(mac, FromBase64Url(parts[1]))) return null;
            var t = JsonSerializer.Deserialize<LobbyToken>(FromBase64Url(parts[0]), Json);
            return t is not null && t.Game == Game && DateTimeOffset.UtcNow.ToUnixTimeSeconds() < t.Exp ? t : null;
        }
        catch (Exception e) when (e is FormatException or JsonException) { return null; }
    }

    static byte[] FromBase64Url(string s) =>
        Convert.FromBase64String(s.Replace('-', '+').Replace('_', '/').PadRight(s.Length + (4 - s.Length % 4) % 4, '='));

    /// <summary>X-Lobby-Signature for an event's exact body bytes.</summary>
    public static string Sign(byte[] body) =>
        "sha256=" + Convert.ToHexString(HMACSHA256.HashData(Key!, body)).ToLowerInvariant();

    /// <summary>The event body, as the exact bytes that are signed and sent.</summary>
    public static byte[] Body(string id, string type, string? user, string? match, object? data) =>
        JsonSerializer.SerializeToUtf8Bytes(new { id, game = Game, type, user, match, at = DateTimeOffset.UtcNow, data }, Json);

    /// <summary>
    /// Posts an event in the background, retrying a few times with the same id (the lobby stores each id once).
    /// A failure is logged and dropped: a lost record never blocks play.
    /// </summary>
    public static void PostEvent(string id, string type, string? user, string? match, object? data)
    {
        if (Key is null) return;
        var body = Body(id, type, user, match, data);
        if (Intercept?.Invoke(body) == true) return;
        var http = Http;
        var signature = Sign(body);   // now, so a later Configure can't change what this event is signed with
        _ = Task.Run(async () =>
        {
            for (var attempt = 0; attempt < 4; attempt++)
            {
                try
                {
                    using var req = new HttpRequestMessage(HttpMethod.Post, "/api/events") { Content = new ByteArrayContent(body) };
                    req.Content.Headers.ContentType = new("application/json");
                    req.Headers.Add("X-Lobby-Signature", signature);
                    using var res = await http.SendAsync(req);
                    if ((int)res.StatusCode is 200 or 201) return;
                    if ((int)res.StatusCode is 400 or 401 or 413) { Console.Error.WriteLine($"lobby event {id}: {(int)res.StatusCode}"); return; }
                }
                catch (Exception e) when (e is HttpRequestException or TaskCanceledException or InvalidOperationException)
                {
                    Console.Error.WriteLine($"lobby event {id}: {e.Message}");
                }
                await Task.Delay(TimeSpan.FromSeconds(5 << attempt));
            }
        });
    }
}
