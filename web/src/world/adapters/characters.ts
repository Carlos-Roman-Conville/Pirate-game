/**
 * Phase 5 adapter 1: a game character becomes an engine body (Toolchain/realism PHASES-4-5.md, rules 4 to 6).
 * The game supplies circumstances (who, which duties by the hour, where) and receives results by id; every formula,
 * table and constant belongs to @rex/realism. Numbers here come from data/pirate-ship/world/characters.json; where the
 * game has no system yet (mass, age, sex, the room) that file holds a named fixture, listed in ../FIXTURES.md.
 */
import {
  World, Scheduler, defaultRegistry, bodyOutputs, physiologyProcess, nutritionProcess, neurologyProcess, roomAirProcess,
  airContents, stockPools, pooledNutrients, splitSleepQuality, airDensity, ingest, P_SEA_LEVEL, C_TO_K, carryRecords,
  initialiseCirculation, breathingProcess, aerobicToday,
  type Component, type BodyOutputs, type ScheduleEntry, type Process, type Transfer,
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
  /** Engine processes the caller adds ahead of the body's own, in order (`drinkingProcess`; medicine.ts `woundProcesses`: bleeding and circulation). */
  processes?: Process[]
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

/** The id every character's engine body has. */
const BODY = 'body'
const states = new WeakMap<GameCharacter, EngineBody>()
const DAY_S = 86400

export const fixturePhysique: Physique = { ...data.body, male: data.body.male === 1 }
export const fixturePlace: Place = { ...data.place }

/**
 * F-CH-9: drinking water. The game has no water supply, so a caller that wants a body to drink adds this to `Place.processes`:
 * every `everyMin` minutes the body takes the water it is short, through the engine's `ingest` (traced). Nothing else drinks.
 */
export function drinkingProcess(everyMin = 60): Process {
  return { name: 'drink-to-deficit', every: everyMin * 60 / data.clock.stepS, step(w) {
    const kg = w.registry.component(BODY).props.waterDeficitKg ?? 0
    if (kg > 0) ingest(w, BODY, { waterKg: kg }, 'drink')
  } }
}

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
    ...(b.duty === data.sleepDuty ? { sleepQuality: watched ? splitSleepQuality() : data.start.unbrokenSleepQuality } : {}),
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
  const body = component('body', 'body', phys.massKg, data.start.bodyTempC)
  body.props = { height_cm: phys.heightCm, age_y: phys.ageY, male: phys.male ? 1 : 0, fat_kg: phys.fatKg }
  body.contents = [{ substance: 'water', phase: 'liquid', mass: phys.waterKg }]
  const room = component('room', 'room', airDensity(P_SEA_LEVEL, place.airC + C_TO_K) * place.volumeM3, place.airC)
  room.props = { volume_m3: place.volumeM3, pressurePa: P_SEA_LEVEL, ach: place.ach }
  room.contents = airContents(place.volumeM3, P_SEA_LEVEL, place.airC)
  world.registry.addComponent(body)
  world.registry.addComponent(room)
  initialiseCirculation(world, body.id)
  stockPools(world, 'body')
  world.conserve('water', ['body', 'room'], data.start.conserveTolKg)
  for (const id of pooledNutrients()) world.conserve(`nutrient:${id}`, ['body'], data.start.conserveTolKg)
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
  for (const process of place.processes ?? []) sch.add(process) // before the body's step, so its mass ledger sees what they did
  sch.add(physiologyProcess('body', 'room', { ...opts, schedule }))
  sch.add(breathingProcess('body', 'room', { every: opts.every }))
  sch.add(nutritionProcess('body', opts))
  sch.add(neurologyProcess('body', opts))
  if (place.observe) sch.add({ name: 'observe', every: 1, step() { place.observe!(body) } })
  sch.run(world, DAY_S, data.clock.stepS)

  s.nextDay = day + 1
  const notes = world.trace.notes.slice(s.noteCursor)
  s.noteCursor = world.trace.notes.length
  const failedChecks = world.trace.failed().slice(s.checkCursor)
  s.checkCursor += failedChecks.length
  return { slug: character.slug, day, outputs: { ...bodyOutputs(body), aerobic_today: aerobicToday(world, body.id) }, notes, failedChecks }
}

/** Start a new audit window after the caller has saved the day's ledger. Component state,
 * clock, environment and graph persist; only trace storage and conservation baselines renew.
 * The blood ledger is the one history a process reads back (circulation checks the volume against the transfers out of it),
 * so those transfers are carried into the new trace (F-SE-10).
 */
const BLOOD_LEDGER = new Set(['volume:blood', 'mass:haemoglobin', 'mass:blood'])
export function releaseDayTrace(character: GameCharacter): void {
  const s = states.get(character)
  if (!s) throw new Error('characters: no day to archive')
  const previous = s.world, next = new World(previous.registry)
  const carried = new Map<string, Transfer>() // one summed record per flow: circulation sums the trace on every run
  for (const x of previous.trace.transfers) {
    if (!BLOOD_LEDGER.has(x.quantity)) continue
    const key = `${x.quantity}|${x.from}|${x.to}`, held = carried.get(key)
    if (held) held.amount += x.amount
    else carried.set(key, { ...x, process: 'carried', note: 'blood ledger of the days before' })
  }
  next.trace.transfers.push(...carried.values())
  carryRecords(next, previous) // audit records stay verbatim: the trace is where they are held
  next.t = previous.t; next.env = previous.env; next.graph = previous.graph
  for (const c of previous.conserved) {
    if (c.substance) next.conserve(c.substance, [...c.components], c.tolerance)
  }
  s.world = next; s.noteCursor = 0; s.checkCursor = 0
}
