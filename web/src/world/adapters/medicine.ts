/**
 * Phase 5 adapter 6: harm and healing in the game's terms over the engine's biology (Toolchain/realism PHASES-4-5.md, rules 4
 * to 6). A hit (COMBAT.md 4a: a location and a damage kind) becomes the engine's wound of the row the game names
 * (files/pirate-ship/body/data/medicine.json `wounds`); what the wound dips in play is that row's `What it dips` column, read
 * here into factors and handed to stats.ts by name (its one wound pathway per formula: the worst dip counts, dips never
 * stack). Sickness is an exposure by place and season (`diseases` `How the sim catches it`, environment.json `exposure`),
 * handed to the engine by disease id and dose. The surgeon's action is a `treatments` row: the game checks the skill and pays
 * the supplies from the inventory, the engine's treatment decides the effect. Every record the engine opens (a due disease or
 * inoculation death, a bleed into the dying class, water exhaustion) comes back as a crisis event for the fate systems, read
 * by the engine's own `Crisis` type; nothing here resolves one (balance/BALANCE.md item 32: every death opens a crisis first).
 * The stand-ins are F-MD-* in ../FIXTURES.md.
 */
import {
  advanceDays, bleed, bodyOutputs, circulationProcess, createMedicine, crisesOf, exposure, exposureIds, expose, flushMedicineCrises, inflictWound,
  medicineOutputs, treat, worldHealingFactors,
  type Crisis, type ExposureResult, type MedicineOptions, type MedicineState, type Process, type TreatmentResult, type Wound,
  type WoundOptions,
} from '@rex/realism'
import medicine from '../../../../files/pirate-ship/body/data/medicine.json'
import environment from '../../../../files/pirate-ship/body/data/environment.json'
import data from '../../../../data/pirate-ship/world/medicine.json'
import { conditionsAt, isWetSeason, places } from './places.ts'
import { engineOf, type GameCharacter } from './characters.ts'
import type { WorkInventory } from './work.ts'

interface Table { columns: string[]; rows: string[][] }
interface Slot { text: string; any?: string[]; kept?: boolean }
type Amounts = Record<string, number>

const wounds = medicine.wounds as Table
const diseases = medicine.diseases as Table
const treatments = medicine.treatments as Table
const exposures = environment.exposure as Table
const supplies = data.supplies as unknown as Record<string, Slot[]>
const vectors = data.vectors as Record<string, string>
const kinds = data.kinds as Record<string, string>
const locationNames = data.locations as Record<string, string[]>
const locationAttributes = data.locationAttributes as Record<string, string[]>

/** characters.ts names its body this; the medicine state is made before the engine world is. */
const BODY = 'body'

const cellOf = (t: Table, row: string[], column: string): string => {
  const i = t.columns.indexOf(column)
  if (i < 0) throw new Error(`medicine: no column "${column}"`)
  return row[i]!
}
const shortId = (id: string): string => id.split('.').pop()!
const lowest = (xs: number[]): number => xs.reduce((a, b) => (b < a ? b : a), 1)

// ------------------------------------------------------------------------------------------------------------ the state

export type Side = 'left' | 'right'

/** An engine wound with where it is on the body and what the game's row says it dips. */
export interface GameWound {
  slug: string
  /** arm, leg, head or torso (COMBAT.md 4a). */
  location: string
  side: Side | null
  /** The damage kind the hit named. */
  damage: string
  /** 0 to 1: how deep, which also picks the engine's bleeding class. */
  depth: number
  /** The engine's own record; `healed` and `infected` change as days pass. */
  wound: Wound
  dips: AppliedDip[]
}

/**
 * A crisis the engine opened, for the fate systems. `record` is the engine's own object: resolving it is theirs
 * (`resolveCrisis` for the medicine ones, `declareDeath` once the host decides). `day` is the course day of a disease crisis.
 */
export interface CrisisEvent {
  kind: 'crisis'
  slug: string
  cause: string
  day: number | null
  risk: number | null
  source: string
  record: Crisis
}

interface Held {
  state: MedicineState
  wounds: GameWound[]
  /** Records already handed out as events; the world's trace holds them all (the engine's `flushMedicineCrises` puts the medicine ones there). */
  seen: Set<Crisis>
  /** Causes of the process crises (not the medicine state's) already handed out. */
  causes: Set<string>
}
const held = new WeakMap<GameCharacter, Held>()

function heldOf(c: GameCharacter, o: MedicineOptions = {}): Held {
  let h = held.get(c)
  if (!h) { h = { state: createMedicine(BODY, o), wounds: [], seen: new Set(), causes: new Set() }; held.set(c, h) }
  return h
}

/** The engine's medicine state of a character, made on first use (the options of the first call stand). */
export function medicineOf(c: GameCharacter, o: MedicineOptions = {}): MedicineState { return heldOf(c, o).state }

/** The wounds this character has been given, healed ones included. */
export function woundsOf(c: GameCharacter): GameWound[] { return [...heldOf(c).wounds] }

const eventOf = (c: GameCharacter, r: Crisis): CrisisEvent =>
  ({ kind: 'crisis', slug: c.slug, cause: r.cause, day: r.day ?? null, risk: r.risk, source: r.source, record: r })

/** The medicine state's crises go into the world's trace (the engine's flush), then the trace is read: records new since the last call. */
function newCrises(c: GameCharacter): CrisisEvent[] {
  const h = heldOf(c), { world, body } = engineOf(c)
  flushMedicineCrises(world, h.state)
  const fresh: Crisis[] = []
  for (const r of crisesOf(world, body)) {
    if (h.seen.has(r)) continue
    // a process crisis (bleeding, water) the engine opens again as the condition moves between its bands is the same condition, not a new crisis
    if (!h.state.crises.includes(r) && h.causes.has(r.cause)) { world.trace.crises.splice(world.trace.crises.indexOf(r), 1); continue }
    h.seen.add(r)
    if (!h.state.crises.includes(r)) h.causes.add(r.cause)
    fresh.push(r)
  }
  return fresh.map(r => eventOf(c, r))
}

/** Every crisis record the engine has opened for this character: the world's trace, read only. */
export function crisesHeld(c: GameCharacter): Crisis[] { const { world, body } = engineOf(c); return [...crisesOf(world, body)] }

// ------------------------------------------------------------------------------------------------------------ what a wound dips

type Scope = 'limb' | 'leg' | 'head' | 'torso' | 'hit'

/** One clause of a wounds row's `What it dips`, read: where it lands, which stats, and the factors the text gives. */
export interface Dip {
  scope: Scope
  variant: string | null
  /** The stats the clause names; null: it names none, so the hit location's own (COMBAT.md 4a). */
  attributes: string[] | null
  /** The factor at the mildest and at the deepest wound; null where the clause gives no size. */
  mild: number | null
  worst: number | null
  /** The clause says the Endurance pool drains (bleeding): the engine's circulation owns that. */
  drains: boolean
  text: string
}

export interface AppliedDip { location: string; side: Side | null; attributes: string[]; factor: number | null; drains: boolean; text: string }

const clauseNumbers = (text: string): number[] => {
  const xs = [...text.matchAll(/\bx(\d+(?:\.\d+)?)/g)].map(m => Number(m[1]))
  if (xs.length > 0) return xs
  const eq = /= (\d+(?:\.\d+)?)/.exec(text)
  if (eq) return [Number(eq[1])]
  return (data.zeroPhrases as string[]).some(p => text.includes(p)) ? [0] : []
}

const scopeOf = (text: string): Scope => {
  if (/^torso:/.test(text)) return 'torso'
  if (/^a leg:|for a leg\b/.test(text)) return 'leg'
  if (/face burn|\bhead/.test(text)) return 'head'
  if (/limb/.test(text)) return 'limb'
  return 'hit'
}

const cache = new Map<string, Dip[]>()

/** A wounds row read into dips: the clauses of its `What it dips` that name a factor, a stat or a drain. */
export function dipsOf(woundId: string): Dip[] {
  const hit = cache.get(woundId)
  if (hit) return hit
  const row = wounds.rows.find(r => r[0] === woundId)
  if (!row) throw new Error(`medicine: no wound row "${woundId}"`)
  const names = data.attributes as string[]
  const out: Dip[] = []
  let variant: string | null = null
  for (const raw of cellOf(wounds, row, wounds.columns[1]!).split(';')) {
    let text = raw.trim()
    for (const v of data.variants) if (text.startsWith(`${v}:`)) { variant = v; text = text.slice(v.length + 1).trim() }
    const plain = text.replace(/\([^)]*\)/g, '')
    const found = names.map(n => ({ n, at: plain.indexOf(n) })).filter(x => x.at >= 0).sort((a, b) => a.at - b.at).map(x => x.n)
    const xs = clauseNumbers(plain), drains = /drains/.test(plain)
    if (found.length === 0 && xs.length === 0 && !drains) continue
    out.push({
      scope: scopeOf(plain), variant, attributes: found.length > 0 ? found : null,
      mild: xs.length > 0 ? xs[0]! : null, worst: xs.length > 0 ? xs[xs.length - 1]! : null, drains, text: raw.trim(),
    })
  }
  cache.set(woundId, out)
  return out
}

const reaches = (scope: Scope, location: string): boolean =>
  scope === 'hit' || (scope === 'limb' && data.limbs.includes(location)) || scope === location

// ------------------------------------------------------------------------------------------------------------ hits

/** A hit as combat states it: where, what kind of damage, and how deep. */
export interface Hit {
  /** A hit location of COMBAT.md 4a or a body part that stands for one (thigh, forearm, face, chest). */
  location: string
  /** Required for an arm or a leg. */
  side?: Side
  /** cut, thrust, shot, blunt, burn, crush, or amputation (the surgeon's). */
  kind: string
  /** 0 (shallow) to 1 (deep); drawn from the character's own medicine stream when absent. */
  depth?: number
  /** The wound is open to the air (the engine reads its infection chance by it). */
  open?: boolean
  /** A label inside the row's `Heals in` text ("fracture", "concussion"). */
  variant?: string
  /** Force the infection outcome; otherwise the engine rolls the row's chance. */
  infected?: boolean
  /** The host's blood-loss rate in mL/min and clotting (both or neither; F-MD-3, F-MD-8): without them the wound bleeds nothing. */
  rateMlMin?: number
  clotting?: number
}

function locationOf(name: string): string {
  const key = Object.keys(locationNames).find(k => locationNames[k]!.includes(name.toLowerCase()))
  if (!key) throw new Error(`medicine: no hit location "${name}"`)
  return key
}

/** The wounds row a hit becomes. */
export function woundRowFor(location: string, kind: string): string {
  const loc = locationOf(location)
  if (kind === data.headBlow.kind && loc === data.headBlow.location) return data.headBlow.wound
  const id = kinds[kind]
  if (!id) throw new Error(`medicine: no wound row for the damage kind "${kind}"`)
  return id
}

/** A hit becomes the engine's wound of the row the game names; its dips are read from that row's column. */
export function inflict(c: GameCharacter, hit: Hit): GameWound {
  const h = heldOf(c), location = locationOf(hit.location), row = woundRowFor(hit.location, hit.kind)
  if (data.limbs.includes(location) && hit.side === undefined) throw new Error(`medicine: a hit to the ${location} needs a side`)
  const depth = hit.depth ?? h.state.rand()
  const o: WoundOptions = { severity: depth }
  if (hit.open !== undefined) o.open = hit.open
  if (hit.variant !== undefined) o.variant = hit.variant
  if (hit.infected !== undefined) o.infected = hit.infected
  if (hit.rateMlMin !== undefined) o.rateMlMin = hit.rateMlMin
  if (hit.clotting !== undefined) o.clotting = hit.clotting
  const wound = inflictWound(h.state, row, o)
  const dips = dipsOf(row).filter(d => reaches(d.scope, location) && (d.variant === null || d.variant === hit.variant)).map(d => ({
    location, side: data.limbs.includes(location) ? hit.side ?? null : null,
    attributes: d.attributes ?? locationAttributes[location]!,
    factor: d.mild === null ? null : d.mild + (d.worst! - d.mild) * depth, drains: d.drains, text: d.text,
  }))
  const made: GameWound = { slug: c.slug, location, side: hit.side ?? null, damage: hit.kind, depth, wound, dips }
  h.wounds.push(made)
  return made
}

/**
 * The worst factor any open wound puts on this stat at this place on the body; 1 when none does. stats.ts allows one wound
 * pathway in a formula, so wounds never multiply: the worst counts.
 */
export function dipFactor(all: GameWound[], where: { location: string; side?: Side | null }, attribute: string): number {
  return lowest(all.filter(w => !w.wound.healed).flatMap(w => w.dips).filter(d =>
    d.factor !== null && d.location === where.location && (where.side === undefined || d.side === null || d.side === where.side) &&
    d.attributes.includes(attribute)).map(d => d.factor!))
}

/**
 * The engine's processes for this character's bleeding, for `Place.processes` (characters.ts): every open wound that has a host
 * rate bleeds through the engine's `bleed` (traced and checked there), and the engine's circulation turns the loss into the
 * bleeding class and, at the class the library calls dying, into a crisis record. None while no wound has a rate, so a body
 * that bleeds nothing runs exactly as before. The engine's `medicineProcess` also keeps the healing clock, which `healDay` does.
 * Circulation runs at the body's own step (F-MD-9 retired by 2570): a crisis is recorded within one step of the loss
 * reaching the class.
 */
export function woundProcesses(c: GameCharacter): Process[] {
  const { state } = heldOf(c)
  if (!state.wounds.some(w => !w.healed && w.rateMlMin !== null)) return []
  return [
    { name: 'wound-bleeding', every: 1, step(world, dt) {
      for (const w of state.wounds) if (!w.healed && w.rateMlMin !== null) bleed(world, state.body, w.rateMlMin, dt, w.clotting, w.bound)
    } },
    circulationProcess(state.body, { every: 1 }),
  ]
}

/**
 * The wound factors stats.ts asks for by name (`Context.supplied`): the limb's own, the head's for the stat in question, the
 * torso's Constitution and the worse leg's Agility. Healed wounds count for nothing.
 */
export function suppliedFactors(all: GameWound[], where: { limb?: { location: string; side: Side }; attribute?: string } = {}): Record<string, number> {
  const out: Record<string, number> = {
    headWoundDip: dipFactor(all, { location: 'head' }, where.attribute ?? ''),
    torsoWoundDip: dipFactor(all, { location: 'torso' }, 'Constitution'),
    legsFactor: lowest((['left', 'right'] as Side[]).map(side => dipFactor(all, { location: 'leg', side }, 'Agility'))),
  }
  if (where.limb) out['woundDip(limb)'] = dipFactor(all, where.limb, where.attribute ?? '')
  return out
}

// ------------------------------------------------------------------------------------------------------------ sickness

export interface ExposureRequest {
  place: string
  /** Day of the year (1 to the calendar's length). */
  day: number
  disease: string
  /** At anchor rather than under way, where the exposure row gives both. */
  atAnchor?: boolean
  /** A scripted exposure (a sick man comes aboard): this dose, no place table. */
  dose?: number
  hygiene?: number
  quarantine?: boolean
  /** Seed for the day's weather when the place's conditions are read. */
  weatherSeed?: number
}

export interface SicknessReport {
  disease: string
  place: string
  season: 'wet' | 'dry'
  /** The `exposure` column the disease reads, or null for a scripted dose. */
  vector: string | null
  multiplier: number | null
  baseDose: number
  dose: number
  /** Where the dose came from: the engine's exposure row, the F-MD-4 fixture, or the caller's scripted dose. */
  doseSource: 'engine' | 'F-MD-4' | 'scripted'
  /** The engine's own `vector_exposure` for the place (null while the library has no table: FLAGS.md). */
  engineVectorExposure: number | null
  /** The engine's answer; null when the game could not place the exposure. */
  result: ExposureResult | null
  /** Why the exposure was not handed to the engine, else null. */
  unsupported: string | null
  crises: CrisisEvent[]
}

/** The multiplier an exposure cell states: "x4", the first clause of "x0.3 (at sea), x1 at anchor", "0"; null where it states none. */
export function multiplierOf(cell: string, wetSeason: boolean, atAnchor = false): number | null {
  const clauses = cell.split(/,\s*(?![^()]*\))/)
  const clause = (atAnchor ? clauses.find(x => x.includes('anchor')) : undefined) ?? clauses[0]!
  if (/wet season/.test(clause) && !wetSeason) return null
  const m = /\bx(\d+(?:\.\d+)?)/.exec(clause)
  if (m) return Number(m[1])
  return /^0\b/.test(clause) ? 0 : null
}

/** The dose a library exposure row states in its `vector` value (a sourced chance in [0, 1]); null where the row has none. */
export function engineVectorDose(row: Record<string, unknown>): number | null {
  const v = row.vector
  if (v === undefined || v === null) return null
  if (typeof v !== 'number' || !Number.isFinite(v) || v < 0 || v > 1) throw new Error(`medicine: the exposure row's vector value ${String(v)} is not a chance in [0, 1]`)
  return v
}

/** The engine's vector dose for a terrain, null while its exposure table has none (FLAGS.md: environment, vector exposure) or no such row. */
function engineDoseAt(terrain: string): number | null {
  return exposureIds().includes(terrain) ? engineVectorDose(exposure(terrain).row) : null
}

/**
 * Expose a character to a disease at a place on a day. The dose is the engine's `vector` value for the place's terrain where
 * its exposure row has one; where that is null (it is, while the library has no source: FLAGS.md) it is the fixture's base dose
 * times the place's exposure multiplier (F-MD-4), and the report says which. Nothing in a dry season for a disease the game
 * catches in the wet; the engine draws whether it takes, and the incubation, course and fate of the case from its own rows.
 */
export function exposeAt(c: GameCharacter, req: ExposureRequest): SicknessReport {
  const row = diseases.rows.find(r => r[0] === req.disease)
  if (!row) throw new Error(`medicine: no disease "${req.disease}"`)
  const place = places.find(p => p.id === req.place)
  if (!place) throw new Error(`medicine: no place "${req.place}"`)
  const wet = isWetSeason(req.day), h = heldOf(c)
  const report: SicknessReport = {
    disease: req.disease, place: req.place, season: wet ? 'wet' : 'dry', vector: null, multiplier: null, baseDose: data.baseDose,
    dose: 0, doseSource: req.dose === undefined ? 'F-MD-4' : 'scripted',
    engineVectorExposure: conditionsAt(req.place, req.day, data.conditionsHour, req.weatherSeed ?? 1).vector_exposure, result: null,
    unsupported: null, crises: [],
  }
  let dose = req.dose
  if (dose === undefined) {
    const vector = vectors[req.disease]
    if (!vector) { report.unsupported = `no place vector for ${req.disease}`; return report }
    const cell = exposures.rows.find(r => r[0] === place.terrain)
    if (!cell) throw new Error(`medicine: no exposure row "${place.terrain}"`)
    const sourced = engineDoseAt(place.terrain)
    const mult = multiplierOf(cellOf(exposures, cell, vector), wet, req.atAnchor)
    report.vector = vector
    report.multiplier = mult
    if (sourced === null && mult === null) { report.unsupported = `the exposure table gives no multiplier for ${vector} at ${req.place}`; return report }
    const gated = /wet[- ]season/i.test(cellOf(diseases, row, 'How the sim catches it')) && !wet
    if (sourced !== null) report.doseSource = 'engine'
    dose = gated ? 0 : sourced ?? data.baseDose * mult!
    if (dose > 1) dose = 1
  }
  report.dose = dose
  const o: { hygiene?: number; quarantine?: boolean } = {}
  if (req.hygiene !== undefined) o.hygiene = req.hygiene
  if (req.quarantine !== undefined) o.quarantine = req.quarantine
  report.result = expose(h.state, req.disease, dose, o)
  report.crises = newCrises(c)
  return report
}

/** Diseases the game catches by place (the others need a scripted dose). */
export function placeDiseases(): string[] { return Object.keys(vectors) }

// ------------------------------------------------------------------------------------------------------------ the days

export interface HealingDay { outputs: ReturnType<typeof medicineOutputs>; crises: CrisisEvent[] }

/**
 * One day for the sick and the wounded: wounds heal and diseases run on the engine's clocks, with the healing factors the body
 * already holds (vitamin C, energy balance, sleep debt: the engine reads them from the world). Run after the day's
 * `simulateDay` and before `releaseDayTrace`: the crisis records the day's processes opened in the world's trace (a bleed
 * into the dying class, water exhaustion) are taken here, with the medicine ones. The medicine outputs by library id are put
 * on the body beside the others.
 */
export function healDay(c: GameCharacter): HealingDay {
  const h = heldOf(c), { world, body } = engineOf(c)
  if (body !== h.state.body) throw new Error(`medicine: ${c.slug}'s body is "${body}", not "${h.state.body}"`)
  flushMedicineCrises(world, h.state) // binds the state's clock to the world's before it advances
  advanceDays(h.state, 1, worldHealingFactors(world, body))
  const outputs = medicineOutputs(h.state)
  Object.assign(bodyOutputs(world.registry.component(body)), outputs)
  return { outputs, crises: newCrises(c) }
}

// ------------------------------------------------------------------------------------------------------------ the surgeon

/** The healer: the skill level the `treatments` row asks for is checked against it, and the knowledge the row names (GOODS.md 3f). */
export interface Surgeon { skill: number; knows?: string[] }

export type Target = { disease: string } | { wound: GameWound }

export interface TreatmentOrder {
  treatment: string
  target: Target
  surgeon: Surgeon
  /** Where the supplies come from; the ones used are taken from it as a recorded conversion with no output. */
  stock: WorkInventory
  day: number
}

export interface TreatmentReport {
  treatment: string
  /** The period name, the table's own words. */
  name: string
  /** Why the surgeon did not act (skill, knowledge, supplies), else null. Nothing was paid or sent to the engine. */
  refused: string | null
  /** The goods taken from the stock, and the instruments that had to be there and were kept. */
  paid: Amounts
  kept: string[]
  /** Supplies the game has no good for (F-MD-6): named, never paid. */
  unsupplied: string[]
  /** The engine's answer; the effect is its to decide. */
  result: TreatmentResult | null
  crises: CrisisEvent[]
}

const treatmentRow = (id: string): string[] => {
  const row = treatments.rows.find(r => shortId(r[0]!) === shortId(id))
  if (!row) throw new Error(`medicine: no treatment "${id}"`)
  return row
}

/** The skill level the row asks for ("20", "30 (and the knowledge, GOODS 3f)"); 0 for "none". */
export function skillNeeded(treatment: string): number {
  const m = /^(\d+)/.exec(cellOf(treatments, treatmentRow(treatment), 'Skill needed (STATS Surgery)'))
  return m ? Number(m[1]) : 0
}

/** The period treatment ids the game can pay for. */
export function treatmentIds(): string[] { return treatments.rows.map(r => shortId(r[0]!)) }

/**
 * The surgeon treats a patient. The game checks skill and knowledge against the row and pays the supplies; the engine's
 * treatment decides what happens (a treatment the library says did not work changes nothing, and the supplies are spent).
 */
export function treatPatient(patient: GameCharacter, order: TreatmentOrder): TreatmentReport {
  const id = shortId(order.treatment), row = treatmentRow(id), h = heldOf(patient)
  const report: TreatmentReport = {
    treatment: id, name: cellOf(treatments, row, 'Treatment'), refused: null, paid: {}, kept: [], unsupplied: [], result: null, crises: [],
  }
  const skill = cellOf(treatments, row, 'Skill needed (STATS Surgery)')
  if (order.surgeon.skill < skillNeeded(id)) { report.refused = `skill ${order.surgeon.skill} is under the ${skillNeeded(id)} the row asks`; return report }
  if (/knowledge/.test(skill) && !(order.surgeon.knows ?? []).includes(id)) { report.refused = 'the surgeon does not know this treatment'; return report }
  const units = data.unitsPerUse
  for (const slot of supplies[id] ?? []) {
    if (!slot.any) { report.unsupplied.push(slot.text); continue }
    const good = slot.any.find(g => order.stock.amount(g) >= units)
    if (!good) { report.refused = `no ${slot.text} in the stock`; report.paid = {}; report.kept = []; return report }
    if (slot.kept) report.kept.push(good)
    else report.paid[good] = (report.paid[good] ?? 0) + units
  }
  if (Object.keys(report.paid).length > 0) order.stock.convert(`treatment:${id}`, order.day, report.paid, {})
  report.result = treat(h.state, id, 'disease' in order.target ? { disease: order.target.disease } : { wound: order.target.wound.wound.n })
  report.crises = newCrises(patient)
  return report
}
