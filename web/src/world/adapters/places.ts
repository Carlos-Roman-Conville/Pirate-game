/**
 * Phase 5 adapter 3: the game's places become engine rooms and weather (Toolchain/realism PHASES-4-5.md, rules 4 to 6).
 * A room is a row of the game's atmosphere table (body/data/atmosphere.json `regions`: volume, air changes; `scenarios`:
 * the period's gases) built as the engine's air box. The weather is the game's environment table (body/data/environment.json
 * `climate`, `weather_states`, `sun`, `exposure`): the month's row sets the day's curve, the state is drawn from the rows'
 * stay chances and seasonal weights, and the engine's `placeOutputs` turns them into WBGT and the rest. Nothing here holds a
 * formula or a climate number; the stand-ins are F-PL-* in ../FIXTURES.md.
 */
import {
  airContents, airDensity, C_TO_K, diurnalC, exposureIds, P_SEA_LEVEL, placeOutputs, rng, sunHours,
  type Component, type PlaceOutputs,
} from '@rex/realism'
import atmosphere from '../../../../files/pirate-ship/body/data/atmosphere.json'
import environment from '../../../../files/pirate-ship/body/data/environment.json'
import data from '../../../../data/pirate-ship/world/places.json'

type Cell = string | number
interface Table { columns: string[]; rows: Cell[][] }

const KNOT_MS = 1852 / 3600

const cellOf = (t: Table, row: Cell[], column: string): Cell => {
  const i = t.columns.indexOf(column)
  if (i < 0) throw new Error(`places: no column "${column}"`)
  return row[i]!
}
const num = (c: Cell): number => Number(c)
const first = (text: string): number | null => { const m = /\d+(?:\.\d+)?/.exec(text); return m ? Number(m[0]) : null }

const regions = atmosphere.regions as Table
const scenarios = atmosphere.scenarios as Table
const climate = environment.climate as Table
const states = environment.weather_states as Table
const sun = environment.sun as Table

/** A place of the game: where a character is, which air it has (the atmosphere row) and which exposure (the terrain row). */
export interface Place {
  id: string
  label: string
  /** The engine's exposure row id, `environment.exposure.<terrain>`. */
  terrain: string
  /** The `regions` Place cell this place takes; null: the table has no row for it, so it has no box of its own. */
  region: string | null
  ach: string | null
}

/** Every place, in the data file's order. */
export const places: Place[] = data.places.map(p => ({ ...p, terrain: `environment.exposure.${p.terrain}` }))

const place = (id: string): Place => {
  const p = places.find(x => x.id === id)
  if (!p) throw new Error(`places: no place "${id}"`)
  return p
}
const slug = (p: Place): string => p.terrain.replace('environment.exposure.', '')

/** True when the engine and the game both have the place's exposure row. */
export function terrainKnown(id: string): boolean {
  const p = place(id)
  return exposureIds().includes(slug(p)) && (environment.exposure.rows as Cell[][]).some(r => r[0] === p.terrain)
}

// ------------------------------------------------------------------------------------------------------------ rooms

/** One of a row's air-change states: "2 open, 0.2 battened" is two. */
interface Ach { value: number; label: string }

function achStates(text: string): Ach[] {
  return text.split(/,\s*/).flatMap(part => {
    const m = /^(\d+(?:\.\d+)?)\s*(.*)$/.exec(part.trim())
    return m ? [{ value: Number(m[1]), label: m[2]! }] : []
  })
}

function pickAch(text: string, want: string | null): number | null {
  const all = achStates(text)
  if (all.length === 0) return null
  const hit = want === null ? (all.find(a => a.label === '') ?? all[0]) : all.find(a => a.label.includes(want))
  if (!hit) throw new Error(`places: no air-change state "${want}" in "${text}"`)
  return hit.value
}

/** The row's volume in cubic metres: "a sloop 60; a brig 250; a ship 800" by vessel, "20 to 60" by its middle, "300 per deck" as 300. */
function volumeOf(text: string, vessel: string): number | null {
  const byVessel = [...text.matchAll(/a (\w+) (\d+(?:\.\d+)?)/g)]
  if (byVessel.length > 0) {
    const hit = byVessel.find(m => m[1] === vessel)
    if (!hit) throw new Error(`places: no "${vessel}" in "${text}"`)
    return Number(hit[2])
  }
  const range = /^(\d+(?:\.\d+)?) to (\d+(?:\.\d+)?)/.exec(text)
  if (range) return (Number(range[1]) + Number(range[2])) / 2
  return first(text)
}

const regionRow = (name: string): Cell[] => {
  const row = regions.rows.find(r => r[0] === name)
  if (!row) throw new Error(`places: no atmosphere region "${name}"`)
  return row
}

/** The mean of the climate table's air column: the room's air when the caller gives none. */
const annualMeanC = (): number => climate.rows.reduce((s, r) => s + num(cellOf(climate, r, 'Air mean (C)')), 0) / climate.rows.length

export interface RoomOptions {
  /** Which ship's volume the row gives (sloop, brig, ship); the data file's `vessel` by default (F-PL-1). */
  vessel?: string
  /** A word of the air-change state's label (battened, open, shut); the place's own by default. */
  state?: string
  airC?: number
}

function box(id: string, volumeM3: number, ach: number, airC: number): Component {
  const room: Component = {
    id, kind: 'room', material: 'air_mass', mass: airDensity(P_SEA_LEVEL, airC + C_TO_K) * volumeM3, temperatureC: airC,
    contents: airContents(volumeM3, P_SEA_LEVEL, airC), ports: [], condition: { capability: 1, control: 1, accuracy: 1 },
    props: { volume_m3: volumeM3, pressurePa: P_SEA_LEVEL, ach },
  }
  return room
}

/** The engine's air box for a place: the region row's volume and air changes. Null where the row has no number (open air, a place with no row). */
export function roomFor(id: string, o: RoomOptions = {}): Component | null {
  const p = place(id)
  if (p.region === null) return null
  const row = regionRow(p.region)
  const volume = volumeOf(String(cellOf(regions, row, 'Volume (m3, placeholder)')), o.vessel ?? data.vessel)
  const ach = pickAch(String(cellOf(regions, row, 'ACH (placeholder)')), o.state ?? p.ach)
  if (volume === null || ach === null) return null
  return box(p.id, volume, ach, o.airC ?? annualMeanC())
}

/** The scenarios the data file maps to a place and whose text carries their air changes. */
export function scenarioNames(): string[] { return data.scenarios.map(s => s.scenario) }

/** A scenario of the period as a box: the place's volume with the air changes the scenario row states ("the hold box at 0.2 ACH"). */
export function roomForScenario(name: string, o: Omit<RoomOptions, 'state'> = {}): Component {
  const link = data.scenarios.find(s => s.scenario === name)
  if (!link) throw new Error(`places: no scenario "${name}" is mapped to a place`)
  const row = scenarios.rows.find(r => r[0] === name)
  if (!row) throw new Error(`places: no atmosphere scenario "${name}"`)
  const text = String(cellOf(scenarios, row, 'Place and model'))
  const m = /(\d+(?:\.\d+)?) ACH|ACH (\d+(?:\.\d+)?)/.exec(text)
  if (!m) throw new Error(`places: the scenario "${name}" states no air changes`)
  const p = place(link.place)
  const volume = volumeOf(String(cellOf(regions, regionRow(p.region!), 'Volume (m3, placeholder)')), o.vessel ?? data.vessel)
  if (volume === null) throw new Error(`places: "${p.id}" has no volume`)
  return box(`${p.id}:${name}`, volume, Number(m[1] ?? m[2]), o.airC ?? annualMeanC())
}

// ------------------------------------------------------------------------------------------------------------ weather

const monthOf = (day: number): number => {
  const days = data.calendar.monthDays, year = days.reduce((a, b) => a + b, 0)
  let d = ((Math.floor(day) - 1) % year + year) % year
  for (let m = 0; m < days.length; m++) { if (d < days[m]!) return m; d -= days[m]! }
  return days.length - 1
}

const climateRow = (m: number): Cell[] => {
  const name = data.calendar.months[m]!
  const row = climate.rows.find(r => r[0] === name)
  if (!row) throw new Error(`places: no climate row ${name}`)
  return row
}

/** Month names a sun row covers: "Dec to Jan", "Mar and Sep", "Jun to Jul". */
function sunMonths(label: string): number[] {
  const names = data.calendar.months, found = names.map((n, i) => (label.includes(n) ? i : -1)).filter(i => i >= 0)
  return found
}

/** A sun column at a month: the rows name some months; the others are linear between the nearest named months, round the year. */
function sunAt(column: string, month: number): number {
  const known = sun.rows.flatMap(r => sunMonths(String(r[0])).map(m => ({ m, v: num(cellOf(sun, r, column)) }))).sort((a, b) => a.m - b.m)
  const exact = known.find(k => k.m === month)
  if (exact) return exact.v
  const span = data.calendar.months.length
  const before = [...known].reverse().find(k => k.m < month) ?? { ...known[known.length - 1]!, m: known[known.length - 1]!.m - span }
  const after = known.find(k => k.m > month) ?? { ...known[0]!, m: known[0]!.m + span }
  return before.v + (after.v - before.v) * (month - before.m) / (after.m - before.m)
}

/** A weather state's wind in knots: the middle of "12 to 18", the figure of "over 64". */
function stateKnots(text: string): number {
  const range = /(\d+(?:\.\d+)?) to (\d+(?:\.\d+)?)/.exec(text)
  if (range) return (Number(range[1]) + Number(range[2])) / 2
  const n = first(text)
  if (n === null) throw new Error(`places: no wind in "${text}"`)
  return n
}

/** A season weight cell: the leading number of "0.03 (x0.25 before 1715)"; the bracket's factor applies to years before the date. */
function weightOf(cell: Cell, year: number | undefined): number {
  const text = String(cell), w = first(text) ?? 0
  const f = /x(\d+(?:\.\d+)?) before (\d+)/.exec(text)
  return f && year !== undefined && year < Number(f[2]) ? w * Number(f[1]) : w
}

const wet = (month: number): boolean => String(cellOf(climate, climateRow(month), 'Season')).startsWith('wet')

function draw(weights: number[], u: number): number {
  const total = weights.reduce((a, b) => a + b, 0)
  let at = u * total
  for (let i = 0; i < weights.length; i++) { at -= weights[i]!; if (at < 0) return i }
  return weights.length - 1
}

/**
 * The weather state of a day of the year, from a seed: a Markov chain over the `weather_states` rows from day 1. Each day the
 * state stays with its row's stay chance; otherwise it becomes another state in proportion to the season's weights (dry or wet
 * by the month's Season cell). `year` applies the hurricane row's period factor to years before its date.
 */
export function weatherState(dayOfYear: number, seed: number, year?: number): string {
  const rand = rng(seed)
  const weights = (month: number, skip: number): number[] => states.rows.map((r, i) =>
    i === skip ? 0 : weightOf(cellOf(states, r, wet(month) ? 'Wet-season weight' : 'Dry-season weight'), year))
  let at = draw(weights(0, -1), rand())
  for (let d = 2; d <= dayOfYear; d++) {
    const stay = num(cellOf(states, states.rows[at]!, 'Stay chance'))
    if (rand() < stay) { rand(); continue }
    at = draw(weights(monthOf(d), at), rand())
  }
  return String(states.rows[at]![0])
}

export type PlaceConditions = PlaceOutputs & { month: string; weather: string }

/**
 * The engine's outputs for a place on a day of the year at an hour (0 to 24): `wbgt_c`, `air_c`, `wet`, `sun_exposure`,
 * `vector_exposure` and the rest of `placeOutputs`, with the month and the day's weather state. The same seed gives the same
 * weather for a day, whatever the hour.
 */
export function conditionsAt(id: string, dayOfYear: number, hour: number, seed: number, year?: number): PlaceConditions {
  const p = place(id), month = monthOf(dayOfYear), row = climateRow(month)
  const state = weatherState(dayOfYear, seed, year)
  const stateRow = states.rows.find(r => r[0] === state)!
  const daylightH = sunAt('Daylight (h)', month)
  const { rise } = sunHours(daylightH)
  const minAt = data.diurnal.minAt === 'sunrise' ? rise : Number(data.diurnal.minAt)
  const airC = diurnalC(hour, num(cellOf(climate, row, 'Air day max (C)')), num(cellOf(climate, row, 'Night min (C)')), data.diurnal.maxAtHour, minAt)
  const out = placeOutputs(slug(p), {
    airC, rhPct: num(cellOf(climate, row, 'Humidity (%)')), windMS: stateKnots(String(cellOf(states, stateRow, 'Wind (knots)'))) * KNOT_MS,
    sun: hour >= rise && hour < sunHours(daylightH).set, rain: !String(cellOf(states, stateRow, 'Rain')).startsWith('none'),
    daylightH, sunburnMin: sunAt('Sunburn time, untanned (min)', month), hour, waterC: num(cellOf(climate, row, 'SST (C)')),
  })
  return { ...out, month: data.calendar.months[month]!, weather: state }
}
