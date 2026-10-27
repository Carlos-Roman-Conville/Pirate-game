using System.Reflection;
using System.Text.Json.Serialization;
using Archive.Server.Modules;

namespace Archive.Server;

/// <summary>
/// Builds the server (Program.cs runs it; the tests start it on a free port). Games plug in as modules
/// (server/Games/&lt;Id&gt;/&lt;Id&gt;Module.cs, found at startup); this repo holds one, so the lobby manifest describes it.
/// Board-kit version of the template's Program.cs (_template/board-kit): adds WebSockets for online matches, the lobby
/// token middleware (contract v2) and the module's own features and picture in the manifest.
/// </summary>
public static class ServerApp
{
    public static WebApplication Build(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        builder.Services.ConfigureHttpJsonOptions(o => o.SerializerOptions.Converters.Add(new JsonStringEnumConverter()));

        var modules = ModuleRegistry.Discover();
        ModuleRegistry.Validate(modules);
        var root = ModuleRegistry.RepoRoot();
        foreach (var m in modules) m.AddServices(builder.Services, ModuleRegistry.Context(m, root));

        var app = builder.Build();
        app.UseWebSockets(new WebSocketOptions { KeepAliveInterval = TimeSpan.FromSeconds(20) });   // online matches

        // Lobby contract v2 (lobby/docs/CONTRACT-V2.md): the signed-in player for this request, if any (guest otherwise).
        app.Use(async (ctx, next) =>
        {
            var token = ctx.Request.Headers["X-Lobby-Token"].FirstOrDefault() ?? ctx.Request.Query["token"].FirstOrDefault();
            if (Lobby.Verify(token) is { } player) ctx.Items["player"] = player;
            await next();
        });

        // The games in the archive, for the menu.
        app.MapGet("/api/games", () => modules.Select(m => new { m.Id, m.Name, m.Summary }));

        // The lobby contract (games/lobby/files/lobby/BRIEF.md section 5): the manifest, at the root API; the About page
        // is data/pirate-ship/about.json, served as is when the game has one (check it with lobby/tools/check_about.py).
        var game = modules.Single();
        app.MapGet("/api/manifest", () =>
        {
            var raw = typeof(ServerApp).Assembly.GetCustomAttribute<AssemblyInformationalVersionAttribute>()?.InformationalVersion;
            var version = string.IsNullOrEmpty(raw) ? "0.0.0" : raw.Split('+')[0];
            var info = game as IBoardModule;
            return new
            {
                id = game.Id, name = game.Name, summary = game.Summary,
                image = info?.Image, status = "dev", version, features = info?.Features ?? new[] { "solo" },
            };
        });
        app.MapGet("/api/about", () =>
        {
            var path = Path.Combine(root, "data", game.Id, "about.json");
            return File.Exists(path) ? Results.Text(File.ReadAllText(path), "application/json") : Results.NotFound();
        });

        foreach (var m in modules) m.MapEndpoints(app.MapGroup("/api/" + m.Id));

        ModuleRegistry.ServeImages(app, modules, root);

        // The built client (npm run build in web/ writes server/wwwroot).
        if (Directory.Exists(app.Environment.WebRootPath))
        {
            app.UseDefaultFiles();
            app.UseStaticFiles();
        }

        return app;
    }
}

/// <summary>What a board game's module adds for the lobby manifest.</summary>
public interface IBoardModule
{
    /// <summary>The modes it offers: "solo" (vs the computer), "hotseat" (two on one screen), "match" (online, contract v3).</summary>
    string[] Features { get; }
    /// <summary>The menu picture, relative to the site (an original SVG in web/public, e.g. "board.svg"), or null.</summary>
    string? Image { get; }
}
