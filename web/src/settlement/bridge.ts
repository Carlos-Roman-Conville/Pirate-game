/**
 * The bridge from settlement events to the story. It translates engine events into story hooks keyed on port.*
 * ids (TESTS.md A2: a sale may change a relationship) and never produces an alignment command: the alignment
 * engine's slot.owner, developed, pos and pending are written only by its own commands, issued by the game as
 * today (Rex, 2026-10-29: an owner or manager change never moves an institution's alignment).
 */
import type { SettlementEvent } from '@rex/settlement'
import { placeOf, type Bindings } from './load'

export type StoryHook =
  | { kind: 'titleChanged'; place: string; from: string; to: string }
  | { kind: 'operatorChanged'; place: string; from: string; to: string }
  | { kind: 'businessStatusChanged'; place: string; from: string; to: string }
  | { kind: 'projectCompleted'; place: string; project: string }
  | { kind: 'officeChanged'; place: string; holder: string | null }

/** Fold engine events into story hooks. Events on subjects bound to no place are dropped. */
export function fold(events: SettlementEvent[], bindings: Bindings): StoryHook[] {
  const hooks: StoryHook[] = []
  for (const event of events) {
    switch (event.type) {
      case 'titleChanged': {
        const place = placeOf(bindings, event.subject)
        if (place) hooks.push({ kind: 'titleChanged', place, from: event.from, to: event.to })
        break
      }
      case 'operatorChanged': {
        const place = placeOf(bindings, event.biz)
        if (place) hooks.push({ kind: 'operatorChanged', place, from: event.from, to: event.to })
        break
      }
      case 'businessStatusChanged': {
        const place = placeOf(bindings, event.biz)
        if (place) hooks.push({ kind: 'businessStatusChanged', place, from: event.from, to: event.to })
        break
      }
      case 'projectCompleted': {
        const place = placeOf(bindings, event.target)
        if (place) hooks.push({ kind: 'projectCompleted', place, project: event.project })
        break
      }
      case 'officeChanged': {
        const place = placeOf(bindings, event.office)
        if (place) hooks.push({ kind: 'officeChanged', place, holder: event.holder })
        break
      }
      default: break
    }
  }
  return hooks
}
