// Placeholder bite splash (Phaser shapes) and splash tone (Web Audio). No asset files.

import Phaser from 'phaser'

const BITE_SPLASH_CLASS = 'pirate-ship-fishing-bite-splash'
const BITE_SOUND_CLASS = 'pirate-ship-fishing-bite-sound'

let audioCtx: AudioContext | null = null

function audio(): AudioContext | null {
  if (typeof AudioContext === 'undefined') return null
  audioCtx ??= new AudioContext()
  if (audioCtx.state === 'suspended') void audioCtx.resume()
  return audioCtx
}

function biteSplashTone(at: number) {
  const a = audio()
  if (!a) return
  const osc = a.createOscillator()
  const g = a.createGain()
  osc.type = 'triangle'
  osc.frequency.setValueAtTime(520, at)
  osc.frequency.exponentialRampToValueAtTime(180, at + 0.12)
  g.gain.setValueAtTime(0.0001, at)
  g.gain.exponentialRampToValueAtTime(0.18, at + 0.01)
  g.gain.exponentialRampToValueAtTime(0.0001, at + 0.14)
  osc.connect(g).connect(a.destination)
  osc.start(at)
  osc.stop(at + 0.16)
}

/** Radial splash rings at the bobber when the fish bites (script art). */
export function playBiteSplash(scene: Phaser.Scene, x: number, y: number): Phaser.GameObjects.Container {
  const container = scene.add.container(x, y).setDepth(25)
  container.setName(BITE_SPLASH_CLASS)
  const core = scene.add.circle(0, 0, 3, 0xe8f8ff, 0.95)
  const spray = scene.add.graphics()
  spray.lineStyle(2, 0x7ec8e8, 0.9)
  for (let i = 0; i < 10; i++) {
    const a = (-Math.PI / 2) + ((i - 4.5) / 10) * Math.PI
    spray.lineBetween(0, 0, Math.cos(a) * 16, Math.sin(a) * 12)
  }
  container.add([spray, core])
  scene.tweens.add({
    targets: container,
    scaleX: 1.4,
    scaleY: 1.4,
    alpha: 0,
    duration: 380,
    ease: 'Quad.easeOut',
    onComplete: () => container.destroy(),
  })
  return container
}

/** Short bite cue; uses AudioContext only (no samples). */
export function playBiteSound(): void {
  const a = audio()
  if (!a) return
  const marker = document.createElement('span')
  marker.className = BITE_SOUND_CLASS
  marker.hidden = true
  document.body.append(marker)
  requestAnimationFrame(() => marker.remove())
  biteSplashTone(a.currentTime + 0.01)
}

export function playBiteSubmergeFx(scene: Phaser.Scene, x: number, y: number): Phaser.GameObjects.Container {
  const container = playBiteSplash(scene, x, y)
  playBiteSound()
  return container
}
