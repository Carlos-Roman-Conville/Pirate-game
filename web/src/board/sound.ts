// Sound effects, synthesized with the Web Audio API: no audio files, so nothing to license (ASSETS.md lists them as
// original). The audio context is made on first use, which is always after a click, so browsers allow it. Muting is
// kept in localStorage per game. Board kit (_template/board-kit), after Nine Men's Morris's sound.ts (tone and knock)
// and Senet's (the throw clatter); copied into the game when it was stamped and the game's own from then on.

/** The effects every board game has; add the game's own (a mill, the House of Water) to `play`'s switch. */
export type Effect = 'place' | 'move' | 'capture' | 'throw' | 'extra' | 'bearOff' | 'win' | 'lose' | 'draw'

const MUTED = 'pirate-ship.muted'
let ctx: AudioContext | null = null
let muted = (() => { try { return localStorage.getItem(MUTED) === '1' } catch { return false } })()

export const isMuted = () => muted
export function setMuted(value: boolean) {
  muted = value
  try { localStorage.setItem(MUTED, value ? '1' : '0') } catch { /* private mode */ }
}

function audio(): AudioContext | null {
  if (typeof AudioContext === 'undefined') return null
  ctx ??= new AudioContext()
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

/** One tone: a wave at a frequency (optionally gliding to another) with a quick attack and an exponential fade. */
export function tone(a: AudioContext, at: number, freq: number, dur: number, opts: { type?: OscillatorType; to?: number; gain?: number } = {}) {
  const osc = a.createOscillator()
  const g = a.createGain()
  osc.type = opts.type ?? 'sine'
  osc.frequency.setValueAtTime(freq, at)
  if (opts.to) osc.frequency.exponentialRampToValueAtTime(opts.to, at + dur)
  const peak = opts.gain ?? 0.2
  g.gain.setValueAtTime(0.0001, at)
  g.gain.exponentialRampToValueAtTime(peak, at + 0.008)
  g.gain.exponentialRampToValueAtTime(0.0001, at + dur)
  osc.connect(g).connect(a.destination)
  osc.start(at)
  osc.stop(at + dur + 0.02)
}

/** A short burst of band-passed noise: wood on wood (a piece set down, a pit sown). */
export function knock(a: AudioContext, at: number, freq: number, gain: number) {
  const len = Math.floor(a.sampleRate * 0.06)
  const buf = a.createBuffer(1, len, a.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 3
  const src = a.createBufferSource()
  src.buffer = buf
  const f = a.createBiquadFilter()
  f.type = 'bandpass'
  f.frequency.value = freq
  f.Q.value = 4
  const g = a.createGain()
  g.gain.value = gain
  src.connect(f).connect(g).connect(a.destination)
  src.start(at)
}

/** Dice or sticks thrown: a run of knocks a few milliseconds apart. */
export function clatter(a: AudioContext, at: number, pieces = 4) {
  for (let i = 0; i < pieces + 2; i++) knock(a, at + i * 0.03 + Math.random() * 0.012, 700 + Math.random() * 500, 0.6)
}

/** Plays an effect unless muted. Call it from the event playback, so sound follows what the board shows. */
export function play(effect: Effect) {
  if (muted) return
  const a = audio()
  if (!a) return
  const t = a.currentTime + 0.01
  switch (effect) {
    case 'place': knock(a, t, 900, 1.2); tone(a, t, 220, 0.12, { type: 'triangle', gain: 0.12 }); break
    case 'move': knock(a, t, 1300, 0.7); tone(a, t, 330, 0.09, { type: 'triangle', to: 300, gain: 0.08 }); break
    case 'capture': tone(a, t, 440, 0.25, { type: 'sawtooth', to: 110, gain: 0.07 }); knock(a, t, 500, 0.8); break
    case 'throw': clatter(a, t); break
    case 'extra': [880, 1174].forEach((f, i) => tone(a, t + i * 0.11, f, 0.25, { gain: 0.16 })); break
    case 'bearOff': tone(a, t, 330, 0.2, { to: 660, gain: 0.14 }); break
    case 'win': [523, 659, 784, 1047].forEach((f, i) => tone(a, t + i * 0.11, f, i === 3 ? 0.6 : 0.2, { type: 'triangle', gain: 0.15 })); break
    case 'lose': [392, 330, 262].forEach((f, i) => tone(a, t + i * 0.16, f, i === 2 ? 0.5 : 0.22, { gain: 0.14 })); break
    case 'draw': [440, 440].forEach((f, i) => tone(a, t + i * 0.18, f, 0.2, { gain: 0.12 })); break
  }
}
