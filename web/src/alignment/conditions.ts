import conditionData from '../../../data/pirate-ship/alignment/conditions.json'
import { initialSlots } from './institutions'
import type { AlignmentState } from './state'

export interface DevelopCondition { supply: string[] }
export type Conditions = Record<string, DevelopCondition>

function record(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

export function loadConditions(raw: unknown = conditionData): Conditions {
  if (!record(raw) || typeof raw.notes !== 'string' || !record(raw.conditions)) throw new Error('invalid conditions data')
  const slots = initialSlots()
  return Object.fromEntries(Object.entries(raw.conditions).map(([id, condition]) => {
    if (!Object.hasOwn(slots, id) || !record(condition)
      || Object.keys(condition).some((key) => key !== 'supply')
      || !Array.isArray(condition.supply) || !condition.supply.length
      || condition.supply.some((item) => typeof item !== 'string' || !item.trim())) {
      throw new Error(`invalid condition: ${id}`)
    }
    return [id, { supply: [...condition.supply] as string[] }]
  }))
}

export function canDevelop(state: AlignmentState, slot: string, conditions: Conditions): string | null {
  if (!Object.hasOwn(state.slots, slot)) throw new Error(`unknown institution slot: ${slot}`)
  for (const what of (Object.hasOwn(conditions, slot) ? conditions[slot].supply : [])) {
    if (!state.supplied[slot]?.includes(what)) return `needs supply: ${what}`
  }
  return null
}

export function supply(state: AlignmentState, slot: string, what: string, conditions: Conditions = loadConditions()): AlignmentState {
  if (!Object.hasOwn(state.slots, slot)) throw new Error(`unknown institution slot: ${slot}`)
  if (!Object.hasOwn(conditions, slot) || !conditions[slot].supply.includes(what)
    || state.supplied[slot]?.includes(what)) return state
  return { ...state, supplied: { ...state.supplied, [slot]: [...(state.supplied[slot] ?? []), what] } }
}
