using Archive.Engine.Core;

namespace Archive.Server.Modules;

/// <summary>
/// One game in the archive. Implement it once per game, in server/Games/&lt;Id&gt;/&lt;Id&gt;Module.cs (a public class with a
/// parameterless constructor): the server finds it at startup, so adding a game touches no shared file.
/// Its routes are mounted under /api/&lt;Id&gt;/ and its data lives in data/&lt;Id&gt;/ (images in data/&lt;Id&gt;/images, gitignored,
/// served at /img/&lt;Id&gt;/).
/// </summary>
public interface IGameModule
{
    /// <summary>Lowercase, url-safe, matches the data/, files/ and web/src/games/ folder names (e.g. "guardians").</summary>
    string Id { get; }
    string Name { get; }
    /// <summary>Years and publisher, for the menu (e.g. "1995–1997 · FPG").</summary>
    string Summary { get; }

    /// <summary>Register the game's singletons (card database, sessions) before the app is built.</summary>
    void AddServices(IServiceCollection services, ModuleContext context) { }

    /// <summary>Map the game's endpoints on its group (already prefixed with /api/&lt;Id&gt;).</summary>
    void MapEndpoints(RouteGroupBuilder api);
}

/// <summary>Where a module finds its files: data/&lt;Id&gt;/ under the repo root.</summary>
public sealed record ModuleContext(string DataDir, string RepoRoot);

/// <summary>An engine event for the client: its record name and fields.</summary>
public sealed record GameEventDto(string Type, object Data)
{
    public static GameEventDto Of(IGameEvent e) => new(e.GetType().Name, e);
    public static List<GameEventDto> Of(IEnumerable<IGameEvent> events) => events.Select(Of).ToList();
}
