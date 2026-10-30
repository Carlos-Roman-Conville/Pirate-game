import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Dev: the server runs on :5308 (`dotnet run --project server`); Vite proxies the API and card images.
// Build: output goes to server/wwwroot so the server serves the client itself.
// Ports are this game's alone (games/CARD_PROJECTS.md); strictPort stops Vite rather than taking another game's port.
export default defineConfig({
  // Relative assets, so the lobby can serve the game under /g/pirate-ship/ (games/lobby/files/lobby/BRIEF.md section 5).
  base: './',
  plugins: [react()],
  server: {
    port: 5320,
    strictPort: true,
    fs: { allow: ['..', '../../../../Toolchain/realism', '../../../../Toolchain/settlement'] },   // the map data lives in ../data/pirate-ship/; the shared realism and settlement engines in Toolchain
    proxy: {
      '/api': { target: 'http://localhost:5308', ws: true },   // ws: the online match socket
      '/img': { target: 'http://localhost:5308' },
    },
  },
  build: {
    outDir: '../server/wwwroot',
    emptyOutDir: true,
  },
})
