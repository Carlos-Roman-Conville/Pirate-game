import eventData from '../../../data/pirate-ship/alignment/events.json'
import { isQuadrant } from './charts'
import type { Quadrant } from './square'

export interface EventDef {
  id: string
  source: 'dialogue' | 'quest' | 'action'
  category: Quadrant
  weight: 'minor' | 'major'
}

export interface EventOccurrence {
  defId: string
  witnesses: string[]
  playerActs: boolean
  day: number
}

function record(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function nonempty(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

export function validateEventDef(value: unknown): asserts value is EventDef {
  if (!record(value) || !nonempty(value.id)
    || (value.source !== 'dialogue' && value.source !== 'quest' && value.source !== 'action')
    || !isQuadrant(value.category) || (value.weight !== 'minor' && value.weight !== 'major')) {
    throw new Error('invalid event definition')
  }
}

export function validateEventOccurrence(value: unknown): asserts value is EventOccurrence {
  if (!record(value) || !nonempty(value.defId) || typeof value.playerActs !== 'boolean'
    || !Number.isSafeInteger(value.day) || (value.day as number) < 0
    || !Array.isArray(value.witnesses) || !value.witnesses.every(nonempty)
    || new Set(value.witnesses).size !== value.witnesses.length) {
    throw new Error('invalid event occurrence')
  }
}

export function loadEvents(raw: unknown = eventData): EventDef[] {
  if (!Array.isArray(raw)) throw new Error('invalid event definitions')
  const ids = new Set<string>()
  return raw.map((value) => {
    validateEventDef(value)
    if (ids.has(value.id)) throw new Error(`duplicate event definition: ${value.id}`)
    ids.add(value.id)
    return { id: value.id, source: value.source, category: value.category, weight: value.weight }
  })
}
