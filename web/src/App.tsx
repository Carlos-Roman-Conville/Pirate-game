import PirateShip from './games/pirate-ship'

// This repo is one game, so the shell opens it straight away; the game's own screen has its menu and rules page.
// Exiting goes back to the lobby when the game runs inside it (/g/pirate-ship/), else reloads the game's menu.
// Board-kit version of the template's App.tsx (_template/board-kit), after Royal Game of Ur's.

export default function App() {
  const exit = () => {
    const inLobby = location.pathname.includes('/g/')
    location.href = inLobby ? '/' : './'
  }
  return <PirateShip onExit={exit} />
}
