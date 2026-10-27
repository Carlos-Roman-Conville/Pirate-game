import Phaser from 'phaser'
import dock from '../../../data/pirate-ship/maps/dock.json'
import { facingOf, integerZoom, loadMap, moveBody, type Facing, type MapData } from './map'

// The dock world: three-quarter top-down, square tiles, script-drawn placeholder art (Rex's renders replace it).
// All rules about where you can stand live in map.ts; this file only draws and reads the keys.

const SPEED = 64            // pixels per second at zoom 1
const HALF = { hw: 4, hh: 3 }   // the feet box

const PALETTE: Record<string, number> = { water: 0x2f6f9f, planks: 0x9a7448, hull: 0x5b3a22, deck: 0xb08a58, post: 0x3b2a1a }

export class DockScene extends Phaser.Scene {
  private map = loadMap(dock as MapData)
  private keys!: Record<'up' | 'down' | 'left' | 'right' | 'w' | 'a' | 's' | 'd', Phaser.Input.Keyboard.Key>
  private player!: Phaser.GameObjects.Image
  private pos = { x: 0, y: 0 }
  private facing: Facing = 'down'
  private walked = 0

  constructor() { super('dock') }

  create() {
    const t = this.map.tileSize
    this.drawTextures(t)
    for (let y = 0; y < this.map.height; y++) {
      for (let x = 0; x < this.map.width; x++) {
        const kind = this.map.data.legend[this.map.data.rows[y][x]].name
        this.add.image(x * t, y * t, `tile-${kind}`).setOrigin(0, 0)
      }
    }
    this.pos = { x: (this.map.data.spawn.x + 0.5) * t, y: (this.map.data.spawn.y + 0.5) * t }
    this.player = this.add.image(this.pos.x, this.pos.y, 'player-down').setOrigin(0.5, 0.85).setDepth(10)

    const kb = this.input.keyboard!
    this.keys = {
      ...kb.createCursorKeys(),
      w: kb.addKey('W'), a: kb.addKey('A'), s: kb.addKey('S'), d: kb.addKey('D'),
    } as typeof this.keys

    const cam = this.cameras.main
    cam.setBounds(0, 0, this.map.width * t, this.map.height * t)
    cam.startFollow(this.player, true)
    cam.setRoundPixels(true)
    this.scale.on('resize', () => this.applyZoom())
    this.applyZoom()
  }

  update(_time: number, delta: number) {
    const k = this.keys
    const dx = (k.right.isDown || k.d.isDown ? 1 : 0) - (k.left.isDown || k.a.isDown ? 1 : 0)
    const dy = (k.down.isDown || k.s.isDown ? 1 : 0) - (k.up.isDown || k.w.isDown ? 1 : 0)
    const step = (SPEED * delta) / 1000
    const norm = dx !== 0 && dy !== 0 ? Math.SQRT1_2 : 1
    const next = moveBody(this.map, { ...this.pos, ...HALF }, dx * step * norm, dy * step * norm)
    const moved = next.x !== this.pos.x || next.y !== this.pos.y
    this.pos = next

    const f = facingOf(dx, dy)
    if (f) this.facing = f
    this.player.setTexture(`player-${this.facing}`)
    this.player.setFlipX(this.facing === 'side' && dx < 0)
    if (moved) this.walked += delta
    // A two-pixel bob while walking stands in for a walk cycle.
    const bob = moved ? Math.round(Math.sin(this.walked / 90)) : 0
    this.player.setPosition(Math.round(this.pos.x), Math.round(this.pos.y) + bob)
  }

  private applyZoom() {
    this.cameras.main.setZoom(integerZoom(this.scale.width, this.scale.height, this.map.tileSize))
  }

  private drawTextures(t: number) {
    const g = this.add.graphics()
    for (const [name, color] of Object.entries(PALETTE)) {
      g.clear().fillStyle(color).fillRect(0, 0, t, t)
      if (name === 'planks') g.lineStyle(1, 0x7a5a36).lineBetween(0, t / 2, t, t / 2).lineBetween(t / 2, 0, t / 2, t / 2)
      if (name === 'water') g.fillStyle(0x4b8fbf).fillRect(3, 4, 5, 1).fillRect(9, 11, 4, 1)
      g.generateTexture(`tile-${name}`, t, t)
    }
    // The placeholder pirate: red coat, a face that shows only when facing down or side.
    for (const face of ['down', 'up', 'side'] as const) {
      g.clear()
      g.fillStyle(0x222222).fillRect(4, 0, 8, 3)                  // hat
      g.fillStyle(face === 'up' ? 0x6b4a2a : 0xe0b48a).fillRect(4, 3, 8, 5)   // head
      g.fillStyle(0xaa2222).fillRect(3, 8, 10, 6)                 // coat
      g.fillStyle(0x333366).fillRect(4, 14, 3, 2).fillRect(9, 14, 3, 2)   // boots
      if (face === 'down') g.fillStyle(0x000000).fillRect(5, 5, 1, 1).fillRect(10, 5, 1, 1)
      if (face === 'side') g.fillStyle(0x000000).fillRect(10, 5, 1, 1)
      g.generateTexture(`player-${face}`, t, t)
    }
    g.destroy()
  }
}
