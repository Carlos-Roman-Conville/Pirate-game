// The Pirate Ship server: runs the game's engine and AI; the browser only sends moves.
// Everything is built in ServerApp.cs, so the tests can start the real server in-process on a free port.
// Dev: `dotnet run --project server` (http://localhost:5308) and `npm run dev` in web/ (Vite proxies /api and /img).
Archive.Server.ServerApp.Build(args).Run();
