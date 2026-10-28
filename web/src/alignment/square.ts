// The alignment square: pure TS, no drawing. Rules are ALIGNMENT.md sections 1, 2 (step) and 8; every number is data.

import alignmentData from '../../../data/pirate-ship/alignment/thresholds.json'

export interface Position {
  x: number
  y: number
}

export type Quadrant = 'og' | 'cg' | 'oe' | 'ce'

export type Region =
  | 'neutral'
  | Quadrant
  | 'hybrid_good'
  | 'hybrid_evil'
  | 'hybrid_order'
  | 'hybrid_chaos'

export interface Thresholds {
  neutral: number
  pure: number
  tieBreak: string
}

export interface SquareConfig {
  bound: number
  anchor: Position
  step: { metric: string; overshoot: string }
}

export function loadThresholds(): Thresholds {
  return { ...alignmentData.thresholds, tieBreak: alignmentData.tieBreak }
}

export function loadSquareConfig(): SquareConfig {
  return {
    bound: alignmentData.bound,
    anchor: { ...alignmentData.anchor },
    step: { metric: alignmentData.step.metric, overshoot: alignmentData.step.overshoot },
  }
}

export function clamp(pos: Position, bound: number): Position {
  return {
    x: Math.max(-bound, Math.min(bound, pos.x)),
    y: Math.max(-bound, Math.min(bound, pos.y)),
  }
}

/** X: orderly (negative) to chaotic (positive). Y: evil (negative) to good (positive). */
export function quadrantAnchors(anchor: Position): Record<Quadrant, Position> {
  return {
    og: { x: -anchor.x, y: anchor.y },
    cg: { x: anchor.x, y: anchor.y },
    oe: { x: -anchor.x, y: -anchor.y },
    ce: { x: anchor.x, y: -anchor.y },
  }
}

/** A fixed distance toward the anchor, stopping at it. */
export function step(from: Position, toAnchor: Position, distance: number, config: SquareConfig): Position {
  if (config.step.metric !== 'euclidean-fixed') throw new Error(`unknown step.metric: ${config.step.metric}`)
  if (config.step.overshoot !== 'stop-at-anchor') throw new Error(`unknown step.overshoot: ${config.step.overshoot}`)
  const dx = toAnchor.x - from.x
  const dy = toAnchor.y - from.y
  const gap = Math.hypot(dx, dy)
  if (gap <= distance) return clamp({ ...toAnchor }, config.bound)
  const k = distance / gap
  return clamp({ x: from.x + dx * k, y: from.y + dy * k }, config.bound)
}

function quadrantOf(pos: Position): Quadrant {
  if (pos.x < 0) return pos.y < 0 ? 'oe' : 'og'
  return pos.y < 0 ? 'ce' : 'cg'
}

function sideBand(pos: Position): Region {
  return pos.x < 0 ? 'hybrid_order' : 'hybrid_chaos'
}

function heightBand(pos: Position): Region {
  return pos.y < 0 ? 'hybrid_evil' : 'hybrid_good'
}

/** Reads a position as one of nine regions. An exact |x| = |y| tie in the transitional ring keeps `previous`. */
export function classify(pos: Position, thresholds: Thresholds, previous?: Region): Region {
  const ax = Math.abs(pos.x)
  const ay = Math.abs(pos.y)
  if (ax < thresholds.neutral && ay < thresholds.neutral) return 'neutral'
  if (ax >= thresholds.pure && ay >= thresholds.pure) return quadrantOf(pos)
  if (ax >= thresholds.pure) return sideBand(pos)
  if (ay >= thresholds.pure) return heightBand(pos)
  if (ax > ay) return sideBand(pos)
  if (ay > ax) return heightBand(pos)
  if (thresholds.tieBreak !== 'keep-previous') throw new Error(`unknown tieBreak: ${thresholds.tieBreak}`)
  return previous ?? quadrantOf(pos)
}
