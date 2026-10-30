/**
 * Phase 5 adapter 1: a game character becomes an engine body (Toolchain/realism PHASES-4-5.md, rules 4 to 6).
 * The game supplies circumstances (who, which duties by the hour, where) and receives results by id; every formula,
 * table and constant belongs to @rex/realism. Numbers here come from data/pirate-ship/world/characters.json; where the
 * game has no system yet (mass, age, sex, the room) that file holds a named fixture, listed in ../FIXTURES.md.
 */
import {
  World, Scheduler, defaultRegistry, bodyOutputs, physiologyProcess, nutritionProcess, neurologyProcess, roomAirProcess,
  airContents, stockPools, pooledNutrients, splitSleepQuality, airDensity, P_SEA_LEVEL, C_TO_K,
  type Component, type BodyOutputs, type ScheduleEntry,
} from '@rex/realism'
import data from '../../../../data/pirate-ship/world/characters.json'

/** One block of a day: clock hours, and the game's name for the duty or action (DUTIES.md). toH <= fromH wraps midnight. */
export interface DutyBlock { fromH: number; toH: number; duty: string }

/** What the game knows of a person for the engine: a slug (the alignment sim's) and a day plan. Physique falls back to the fixture. */
export interface GameCharacter {
  slug: string
  physique?: Partial<Physique>
  plan: DutyBlock[] | ((day: number) => DutyBlock[])
}

export interface Physique { male: boolean; ageY: number; heightCm: number; massKg: number; fatKg: number; waterKg: number }

/** Where the character spends the day: the room's air. Fixture-backed until places exist (task 2535). */
export interface Place {
  airC: number; volumeM3: number; ach: number
  /** Host weather from places.ts, sampled by clock hour; no climate formula here. */
  conditions?: (hour: number) => { air_c: number; wbgt_c: number }
  /** Optional observation after all body processes, used by settlement acceptance. */
  observe?: (body: Component) => void
}

export interface DayReport {
  slug: string
  day: number
  /** The engine's outputs by library id, copied at the end of the day. */
  outputs: BodyOutputs
  /** The engine's own trace notes for the day (deficiency stages and the like), untouched. */
  notes: { t: number; text: string }[]
  /** Conservation checks the engine failed during the day, untouched; empty when everything closed. */
  failedChecks: ReturnType<World['trace']['failed']>
}

interface EngineBody { world: World; body: Component; nextDay: number; noteCursor: number; checkCursor: number }

const states = new WeakMap<GameCharacter, EngineBody>()
const DAY_S = 86400

export const fixturePhysique: Physique = { ...data.body, male: data.body.male === 1 }
export const fixturePlace: Place = { ...data.place }

/** The engine activity id a duty or action name stands for; throws for a duty no met row names (FIXTURES.md lists them). */
export function activityOf(duty: string): string {
  const id = (data.dutyActivity as Record<string, string>)[duty]
  if (id === undefined) throw new Error(`characters: no met row for the duty "${duty}"`)
  return id
}

/** The duty names that have an engine activity. */
export function mappedDuties(): string[] { return Object.keys(data.dutyActivity) }

/** A day plan as the engine's schedule: sleep blocks carry the engine's weight for a night broken by watches. */
export function scheduleOf(blocks: DutyBlock[]): ScheduleEntry[] {
  const watched = blocks.some(b => data.watchDuties.includes(b.duty))
  return blocks.map(b => ({
    fromH: b.fromH, toH: b.toH, activity: activityOf(b.duty),
    ...(b.duty === data.sleepDuty ? { sleepQuality: watched ? splitSleepQuality() : 1 } : {}),
  }))
}

function component(id: string, kind: string, mass: number, temperatureC: number): Component {
  return {
    id, kind, mass, temperatureC, material: kind === 'body' ? 'flesh' : 'air_mass', contents: [], ports: [],
    condition: { capability: 1, control: 1, accuracy: 1 }, props: {},
  }
}

function start(c: GameCharacter, place: Place): EngineBody {
  const phys = { ...fixturePhysique, ...c.physique }
  const world = new World(defaultRegistry())
  const body = component('body', 'body', phys.massKg, 37)
  body.props = { height_cm: phys.heightCm, age_y: phys.ageY, male: phys.male ? 1 : 0, fat_kg: phys.fatKg }
  body.contents = [{ substance: 'water', phase: 'liquid', mass: phys.waterKg }]
  const room = component('room', 'room', airDensity(P_SEA_LEVEL, place.airC + C_TO_K) * place.volumeM3, place.airC)
  room.props = { volume_m3: place.volumeM3, pressurePa: P_SEA_LEVEL, ach: place.ach }
  room.contents = airContents(place.volumeM3, P_SEA_LEVEL, place.airC)
  world.registry.addComponent(body)
  world.registry.addComponent(room)
  stockPools(world, 'body')
  world.conserve('water', ['body', 'room'], 1e-9)
  for (const id of pooledNutrients()) world.conserve(`nutrient:${id}`, ['body'], 1e-9)
  return { world, body, nextDay: 1, noteCursor: 0, checkCursor: 0 }
}

function stateOf(character: GameCharacter, place: Place): EngineBody {
  let s = states.get(character)
  if (!s) { s = start(character, place); states.set(character, s) }
  return s
}

/** The engine side of a character, started on first use: the other adapters (food, wounds) act on this world and body. `nextDay` is the day simulateDay will run. */
export function engineOf(character: GameCharacter, place: Place = fixturePlace): { world: World; body: string; nextDay: number } {
  const s = stateOf(character, place)
  return { world: s.world, body: s.body.id, nextDay: s.nextDay }
}

/**
 * Run one day (the nautical day from the data's dayStartH) of this character in this place: physiology, nutrition and
 * neurology, in the engine's declared order. Days run in sequence from 1; the body carries over.
 */
export function simulateDay(character: GameCharacter, day: number, place: Place = fixturePlace): DayReport {
  const s = stateOf(character, place)
  if (day !== s.nextDay) throw new Error(`characters: ${character.slug} is at day ${s.nextDay}, not ${day}`)
  const { world, body } = s
  const room = world.registry.component('room')
  const blocks = typeof character.plan === 'function' ? character.plan(day) : character.plan
  const schedule = scheduleOf(blocks)
  const opts = { every: 1, clockH0: data.clock.dayStartH, dayStartH: data.clock.dayStartH }
  room.props.ach = place.ach
  world.env.outsideC = place.airC
  if (!place.conditions) delete room.props.wbgt_c

  const sch = new Scheduler()
  sch.add({ name: 'circumstances', every: 1, step(w) {
    const hour = (opts.clockH0 + w.t / 3600) % 24
    if (place.conditions) {
      const weather = place.conditions(hour)
      w.env.outsideC = weather.air_c
      room.props.wbgt_c = weather.wbgt_c
    }
    const now = schedule.find(e => (e.fromH < e.toH ? hour >= e.fromH && hour < e.toH : hour >= e.fromH || hour < e.toH))
    body.props.asleep = now?.sleepQuality !== undefined ? 1 : 0
  } })
  sch.add(roomAirProcess('room'))
  sch.add(physiologyProcess('body', 'room', { ...opts, schedule }))
  sch.add(nutritionProcess('body', opts))
  sch.add(neurologyProcess('body', opts))
  if (place.observe) sch.add({ name: 'observe', every: 1, step() { place.observe!(body) } })
  sch.run(world, DAY_S, data.clock.stepS)

  s.nextDay = day + 1
  const notes = world.trace.notes.slice(s.noteCursor)
  s.noteCursor = world.trace.notes.length
  const failedChecks = world.trace.failed().slice(s.checkCursor)
  s.checkCursor += failedChecks.length
  return { slug: character.slug, day, outputs: { ...bodyOutputs(body) }, notes, failedChecks }
}

/** Start a new audit window after the caller has saved the day's ledger. Component state,
 * clock, environment and graph persist; only trace storage and conservation baselines renew.
 * This character loop has no process whose state depends on historical transfers.
 */
export function releaseDayTrace(character: GameCharacter): void {
  const s = states.get(character)
  if (!s) throw new Error('characters: no day to archive')
  const previous = s.world, next = new World(previous.registry)
  next.t = previous.t; next.env = previous.env; next.graph = previous.graph
  for (const c of previous.conserved) {
    if (c.substance) next.conserve(c.substance, [...c.components], c.tolerance)
  }
  s.world = next; s.noteCursor = 0; s.checkCursor = 0
}
