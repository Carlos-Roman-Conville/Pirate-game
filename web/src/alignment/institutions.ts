import institutionData from '../../../data/pirate-ship/alignment/institutions.json'
import type { AlignmentState, AlignmentThresholds } from './state'
import type { Position, Region } from './square'

export interface InstitutionSlot {
  sector: string
  owner: string
  developed: boolean
  pos: Position | null
  region: Region | null
  pending: boolean
}

export interface Transformation { slot: string; from: Region | null; to: Region }

export function initialSlots(): Record<string, InstitutionSlot> {
  return Object.fromEntries(institutionData.flatMap((sector) => sector.slots.map((slot) => [
    // An internal key, not an invented port location, until content assigns a port ID.
    slot.slot ?? `${sector.id}:${slot.owner}`,
    { sector: sector.id, owner: slot.owner, developed: false, pos: null, region: null, pending: false },
  ])))
}

export function develop(state: AlignmentState, id: string, config: AlignmentThresholds): AlignmentState {
  if (config.ghostRule !== 'every-pair-both-improve') throw new Error('unresolved ghostRule')
  if (!Object.hasOwn(state.slots, id)) throw new Error(`unknown institution slot: ${id}`)
  const slot = state.slots[id]
  const owner = state.characters[slot.owner]
  const recruited = owner && (owner.location === 'aboard' ||
    state.log.some((command) => command.type === 'recruit' && command.slug === slot.owner))
  if (!recruited) throw new Error(`institution owner never recruited: ${slot.owner}`)
  if (slot.developed) return state
  return { ...state, slots: { ...state.slots, [id]: { ...slot, developed: true, pending: true } } }
}

export function markReturned(state: AlignmentState, owner: string): AlignmentState {
  return { ...state, slots: Object.fromEntries(Object.entries(state.slots).map(([id, slot]) => [
    id, slot.owner === owner && slot.developed ? { ...slot, pending: true } : slot,
  ])) }
}

export function sleep(state: AlignmentState, config: AlignmentThresholds): {
  state: AlignmentState; transformations: Transformation[]
} {
  if (!['reread-each-sleep', 'reread-each-sleep-while-owner-in-town'].includes(config.institutionLock)) {
    throw new Error('unresolved institutionLock')
  }
  if (config.pendingWhenAboard !== 'keep') throw new Error('unresolved pendingWhenAboard')
  if (config.ownerDeparted !== 'freeze') throw new Error('unresolved ownerDeparted')
  const day = state.day + 1
  const slots = { ...state.slots }
  const slotTransformedAt = { ...state.slotTransformedAt }
  const transformations: Transformation[] = []
  for (const [id, slot] of Object.entries(slots)) {
    if (!slot.developed) continue
    const owner = state.characters[slot.owner]
    if (!owner) throw new Error(`unknown institution owner: ${slot.owner}`)
    // Freeze departed owners entirely; aboard owners retain pending eligibility.
    if (owner.location !== 'town') continue
    // The configured placeholder re-reads every developed institution in town,
    // including after an earlier sleep cleared its pending flag.
    if (slot.region !== owner.region || slot.pos?.x !== owner.pos.x || slot.pos?.y !== owner.pos.y) {
      transformations.push({ slot: id, from: slot.region, to: owner.region })
      slotTransformedAt[id] = day
    }
    slots[id] = { ...slot, pos: { ...owner.pos }, region: owner.region, pending: false }
  }
  return { state: { ...state, day, slots, slotTransformedAt }, transformations }
}
