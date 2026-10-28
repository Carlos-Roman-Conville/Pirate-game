import gateData from '../../../data/pirate-ship/alignment/gates.json'
import startData from '../../../data/pirate-ship/alignment/starts.json'
import type { AlignmentState } from './state'

export interface JoiningGate { story?: boolean; aboard?: string[] }
export type Gates = Record<string, JoiningGate>

function record(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

export function loadGates(raw: unknown = gateData): Gates {
  if (!record(raw) || typeof raw.notes !== 'string' || !record(raw.gates)) throw new Error('invalid gates data')
  return Object.fromEntries(Object.entries(raw.gates).map(([slug, gate]) => {
    if (!Object.hasOwn(startData, slug) || !record(gate)
      || Object.keys(gate).some((key) => key !== 'story' && key !== 'aboard')
      || (gate.story !== undefined && typeof gate.story !== 'boolean')
      || (gate.aboard !== undefined && (!Array.isArray(gate.aboard)
        || gate.aboard.some((key) => typeof key !== 'string' || !Object.hasOwn(startData, key))))) {
      throw new Error(`invalid gate: ${slug}`)
    }
    return [slug, structuredClone(gate) as JoiningGate]
  }))
}

export function canRecruit(state: AlignmentState, slug: string, gates: Gates): string | null {
  if (!Object.hasOwn(state.characters, slug)) throw new Error(`unknown character: ${slug}`)
  const gate = Object.hasOwn(gates, slug) ? gates[slug] : undefined
  if (gate?.story && !state.characters[slug].unlocked) return 'not unlocked'
  for (const key of gate?.aboard ?? []) {
    if (state.characters[key]?.location !== 'aboard') return `needs aboard: ${key}`
  }
  return null
}

export function unlock(state: AlignmentState, slug: string): AlignmentState {
  if (!Object.hasOwn(state.characters, slug)) throw new Error(`unknown character: ${slug}`)
  const who = state.characters[slug]
  if (who.unlocked) return state
  return { ...state, characters: { ...state.characters, [slug]: { ...who, unlocked: true } } }
}
