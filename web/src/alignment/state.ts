import thresholdData from '../../../data/pirate-ship/alignment/thresholds.json'
import startData from '../../../data/pirate-ship/alignment/starts.json'
import { isQuadrant } from './charts'
import { clamp, classify, quadrantAnchors, type Position, type Quadrant, type Region } from './square'
import type { EventOccurrence } from './events'

export type AlignmentThresholds = typeof thresholdData
export type Starts = Record<string, Quadrant | 'neutral'>
export interface AlignedPosition { pos: Position; region: Region }
export interface CharacterState extends AlignedPosition {
  location: 'town' | 'aboard' | 'departed'
  inParty: boolean
}
export type Command =
  | { type: 'event'; occurrence: EventOccurrence }
  | { type: 'recruit'; slug: string }
  | { type: 'party'; slugs: string[] }
  | { type: 'leave'; slug: string }
  | { type: 'develop'; slot: string }
  | { type: 'sleep' }

export interface AlignmentState {
  version: 1
  day: number
  player: AlignedPosition
  characters: Record<string, CharacterState>
  slots: Record<string, never>
  log: Command[]
}

export function loadAlignmentThresholds(): AlignmentThresholds {
  return structuredClone(thresholdData)
}

export function loadStarts(raw: unknown = startData): Starts {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('invalid starts')
  return Object.fromEntries(Object.entries(raw).map(([slug, category]) => {
    if (!slug || (!isQuadrant(category) && category !== 'neutral')) throw new Error(`invalid start: ${slug}`)
    return [slug, category]
  }))
}

export function initialState(starts: Starts, thresholds: AlignmentThresholds): AlignmentState {
  const reading = { ...thresholds.thresholds, tieBreak: thresholds.tieBreak }
  const coords = { ...quadrantAnchors(thresholds.startCoords), neutral: thresholds.startCoords.neutral }
  const place = (category: Quadrant | 'neutral'): AlignedPosition => {
    const pos = clamp(coords[category], thresholds.bound)
    return { pos, region: classify(pos, reading) }
  }
  return {
    version: 1,
    // Zero-based elapsed days; only sleep (unit 2477) advances this counter.
    day: 0,
    player: place('neutral'),
    characters: Object.fromEntries(Object.entries(starts).map(([slug, category]) => [
      slug, { ...place(category), location: 'town', inParty: false },
    ])),
    slots: {},
    log: [],
  }
}
