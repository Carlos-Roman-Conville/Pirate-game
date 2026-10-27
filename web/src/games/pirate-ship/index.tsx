import { useEffect, useRef, useState } from 'react'
import Phaser from 'phaser'
import type { GameProps } from '../types'
import { DockScene } from '../../world/DockScene'
import { Rules } from './Rules'
import './pirate-ship.css'

// Pirate Ship: the screen. A Phaser world (src/world/): the dock, walked with the arrow keys or WASD. Map and
// collision are pure TS in world/map.ts. The old board placeholder is gone; the server/engine side is untouched.
// Class names are prefixed pirate-ship-.

export default function PirateShip({ onExit }: GameProps) {
  const [rules, setRules] = useState(false)
  const host = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (rules || !host.current) return
    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: host.current,
      backgroundColor: '#1d4f73',
      pixelArt: true,
      scale: { mode: Phaser.Scale.RESIZE, width: '100%', height: '100%' },
      scene: [DockScene],
    })
    return () => game.destroy(true)
  }, [rules])

  if (rules) return <Rules onBack={() => setRules(false)} />
  return (
    <div className="pirate-ship-table">
      <header className="pirate-ship-bar">
        <b>Pirate Ship</b>
        <span className="dim">Arrow keys or WASD to walk</span>
        <span className="pirate-ship-spacer" />
        <button onClick={() => setRules(true)}>Rules</button>
        <button onClick={onExit}>Menu</button>
      </header>
      <main className="pirate-ship-world" ref={host} />
    </div>
  )
}
