import { isQuadrant } from './charts'
import type { AlignmentConfig } from './engine'
import type { AlignmentState } from './state'
import type { Position } from './square'

function counted(state: AlignmentState, config: AlignmentConfig) {
  if (config.thresholds.undevelopedCounts !== 'skip') throw new Error('unresolved undevelopedCounts')
  return Object.entries(state.slots).filter(([, slot]) => slot.developed && slot.pos !== null)
}

export function townPosition(state: AlignmentState, config: AlignmentConfig): Position {
  if (config.thresholds.townAggregate !== 'mean') throw new Error('unresolved townAggregate')
  const slots = counted(state, config)
  if (!slots.length) return { x: 0, y: 0 }
  return slots.reduce((mean, [, slot]) => ({
    x: mean.x + slot.pos!.x / slots.length,
    y: mean.y + slot.pos!.y / slots.length,
  }), { x: 0, y: 0 })
}

export function isPerfect(state: AlignmentState, config: AlignmentConfig): boolean {
  let slots = counted(state, config)
  switch (config.thresholds.perfectCounts) {
    case 'all-developed': break
    case 'winners-only': {
      const sectors = new Set(slots.map(([, slot]) => slot.sector))
      slots = [...sectors].flatMap((sector) => {
        const pair = slots.filter(([, slot]) => slot.sector === sector)
        const latest = Math.max(...pair.map(([id]) => state.slotTransformedAt[id] ?? -1))
        const winners = pair.filter(([id]) => (state.slotTransformedAt[id] ?? -1) === latest)
        if (winners.length > 1) throw new Error('unresolved winners-only simultaneous transformations')
        return winners
      })
      break
    }
    default: throw new Error('unresolved perfectCounts')
  }
  const region = slots[0]?.[1].region
  return isQuadrant(region) && slots.every(([, slot]) => slot.region === region)
}
