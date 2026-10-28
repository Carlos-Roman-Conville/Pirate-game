import { loadCharts, respond, type Chart } from './charts'
import { loadEvents, validateEventDef, validateEventOccurrence, type EventDef, type EventOccurrence } from './events'
import { classify, quadrantAnchors, step, type Quadrant } from './square'
import { loadAlignmentThresholds, type AlignedPosition, type AlignmentState, type AlignmentThresholds, type Command } from './state'
import { develop, markReturned, sleep } from './institutions'
import { canRecruit, loadGates, unlock, type Gates } from './gates'
import { townPosition } from './town'

export interface AlignmentConfig {
  thresholds: AlignmentThresholds
  charts: Record<string, Chart>
  events: EventDef[]
  gates: Gates
}

export const UNRESOLVED: string[] = [
  'INTJ becomes neutral: no neutralizing verb or replacement chart is defined',
  'thresholds.neutral / thresholds.pure: provisional boundaries',
  'step.minor / step.major / anchor: placeholder movement sizes and targets',
  'step.metric / step.overshoot: placeholder fixed Euclidean distance, stop at anchor',
  'startCoords: placeholder starting coordinates',
  'leanFactor: placeholder lean distance multiplier',
  'witnesses: present-only; absent learning is unresolved',
  'pendingWhenAboard / undevelopedCounts: placeholder keep / skip; ownerDeparted is freeze (Rex)',
  'institutionLock: placeholder reread-each-sleep-while-owner-in-town',
  'Ghost timing and a distinct ghost state are undefined; undeveloped slots stay undeveloped',
  'Missing port slot IDs use internal sector:owner keys until content supplies IDs',
  'winners-only simultaneous transformations: no tie-breaking rule is defined',
  'Ending names other than Twisted Virtue are unassigned',
]

export function loadAlignmentConfig(): AlignmentConfig {
  return { thresholds: loadAlignmentThresholds(), charts: loadCharts(), events: loadEvents(), gates: loadGates() }
}

function character(state: AlignmentState, slug: string) {
  if (!Object.hasOwn(state.characters, slug)) throw new Error(`unknown character: ${slug}`)
  return state.characters[slug]
}

function move<T extends AlignedPosition>(who: T, to: Quadrant, distance: number, config: AlignmentThresholds): T {
  const pos = step(who.pos, quadrantAnchors(config.anchor)[to], distance, config)
  return { ...who, pos, region: classify(pos, { ...config.thresholds, tieBreak: config.tieBreak }, who.region) }
}

function event(state: AlignmentState, occurrence: EventOccurrence, config: AlignmentConfig): AlignmentState {
  validateEventOccurrence(occurrence)
  const matches = config.events.filter((entry) => entry.id === occurrence.defId)
  if (matches.length !== 1) throw new Error(`unknown or duplicate event definition: ${occurrence.defId}`)
  const def = matches[0]
  validateEventDef(def)
  if (config.thresholds.witnesses !== 'present-only') throw new Error('unresolved witnesses policy')
  const distance = config.thresholds.step[def.weight]
  const characters = { ...state.characters }
  // Presence is supplied by the caller, never inferred from party or location.
  for (const slug of occurrence.witnesses) {
    const who = character(state, slug)
    if (!Object.hasOwn(config.charts, slug)) throw new Error(`missing chart: ${slug}`)
    const response = respond(config.charts[slug], def.category)
    if (response.kind !== 'stay') {
      characters[slug] = move(who, response.to,
        distance * (response.kind === 'lean' ? config.thresholds.leanFactor : 1), config.thresholds)
    }
  }
  return {
    ...state, characters,
    player: occurrence.playerActs ? move(state.player, def.category, distance, config.thresholds) : state.player,
  }
}

function recruit(state: AlignmentState, slug: string, config: AlignmentConfig): AlignmentState {
  const who = character(state, slug)
  if (who.location === 'departed') throw new Error(`character departed: ${slug}`)
  if (who.location !== 'town') throw new Error(`character is not in town: ${slug}`)
  const refusal = canRecruit(state, slug, config.gates)
  if (refusal) throw new Error(refusal)
  const aboard = Object.values(state.characters).filter((entry) => entry.location === 'aboard').length
  if (aboard >= config.thresholds.crewSlots) throw new Error('crewSlots full')
  return { ...state, characters: { ...state.characters, [slug]: { ...who, location: 'aboard' } } }
}

function party(state: AlignmentState, slugs: string[]): AlignmentState {
  for (const slug of slugs) {
    if (character(state, slug).location !== 'aboard') throw new Error(`party character is not aboard: ${slug}`)
  }
  return { ...state, characters: Object.fromEntries(Object.entries(state.characters).map(([slug, who]) => [
    slug, { ...who, inParty: who.location === 'aboard' && slugs.includes(slug) },
  ])) }
}

function leave(state: AlignmentState, slug: string): AlignmentState {
  const who = character(state, slug)
  if (who.location !== 'aboard') throw new Error(`character is not aboard: ${slug}`)
  return { ...state, characters: { ...state.characters, [slug]: { ...who, location: 'town', inParty: false } } }
}

/** The sole command entry point. Failed commands throw without changing state or its replay log. */
export function reduce(state: AlignmentState, command: Command, config: AlignmentConfig): { state: AlignmentState; log: string[] } {
  let next: AlignmentState
  const log = [JSON.stringify(command)]
  switch (command.type) {
    case 'event': next = event(state, command.occurrence, config); break
    case 'recruit': next = recruit(state, command.slug, config); break
    case 'unlock': next = unlock(state, command.slug); break
    case 'party': next = party(state, command.slugs); break
    case 'leave': next = markReturned(leave(state, command.slug), command.slug); break
    case 'develop': next = develop(state, command.slot, config.thresholds); break
    case 'sleep': {
      const result = sleep(state, config.thresholds)
      next = result.state
      log.push(...result.transformations.map((entry) => JSON.stringify(entry)))
      const pos = townPosition(next, config)
      next = { ...next, town: { pos, region: classify(pos,
        { ...config.thresholds.thresholds, tieBreak: config.thresholds.tieBreak }, state.town.region) } }
      break
    }
    default: throw new Error('unknown alignment command')
  }
  return { state: { ...next, log: [...state.log, structuredClone(command)] }, log }
}
