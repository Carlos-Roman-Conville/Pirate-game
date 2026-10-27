using System.Reflection;
using Microsoft.Extensions.FileProviders;

namespace Archive.Server.Modules;

/// <summary>Finds every <see cref="IGameModule"/> in the server assembly and wires it in.</summary>
public static class ModuleRegistry
{
    public static IReadOnlyList<IGameModule> Discover() =>
        Assembly.GetExecutingAssembly().GetTypes()
            .Where(t => t is { IsClass: true, IsAbstract: false } && typeof(IGameModule).IsAssignableFrom(t))
            .Select(t => (IGameModule)Activator.CreateInstance(t)!)
            .OrderBy(m => m.Id, StringComparer.Ordinal)
            .ToList();

    /// <summary>The repo root: the first folder up from the running server that has a data/ folder.</summary>
    public static string RepoRoot()
    {
        for (var d = new DirectoryInfo(AppContext.BaseDirectory); d is not null; d = d.Parent)
            if (Directory.Exists(Path.Combine(d.FullName, "data"))) return d.FullName;
        throw new DirectoryNotFoundException("no data/ folder above the server");
    }

    public static ModuleContext Context(IGameModule m, string root) => new(Path.Combine(root, "data", m.Id), root);

    /// <summary>Checks ids are unique and url-safe, so modules can't collide.</summary>
    public static void Validate(IReadOnlyList<IGameModule> modules)
    {
        foreach (var m in modules)
            if (!System.Text.RegularExpressions.Regex.IsMatch(m.Id, "^[a-z0-9-]+$"))
                throw new InvalidOperationException($"module id '{m.Id}' must be lowercase letters, digits and hyphens");
        var dup = modules.GroupBy(m => m.Id).FirstOrDefault(g => g.Count() > 1);
        if (dup is not null) throw new InvalidOperationException($"two modules use the id '{dup.Key}'");
    }

    /// <summary>Card art fetched locally (data/&lt;Id&gt;/images, gitignored), served at /img/&lt;Id&gt;/; the game's other
    /// fetched assets (data/&lt;Id&gt;/assets: card back, mat, tokens; gitignored but the manifest) at /img/&lt;Id&gt;/assets/.</summary>
    public static void ServeImages(WebApplication app, IReadOnlyList<IGameModule> modules, string root)
    {
        foreach (var m in modules)
        {
            var images = Path.Combine(root, "data", m.Id, "images");
            if (Directory.Exists(images))
                app.UseStaticFiles(new StaticFileOptions { FileProvider = new PhysicalFileProvider(images), RequestPath = "/img/" + m.Id });
            var assets = Path.Combine(root, "data", m.Id, "assets");
            if (Directory.Exists(assets))
                app.UseStaticFiles(new StaticFileOptions { FileProvider = new PhysicalFileProvider(assets), RequestPath = $"/img/{m.Id}/assets" });
        }
    }
}
