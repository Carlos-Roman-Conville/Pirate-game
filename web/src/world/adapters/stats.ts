/**
 * Phase 5 adapter 4: the engine's outputs become the game's hidden stats and visible faces (Toolchain/realism
 * PHASES-4-5.md, rules 4 to 6). The capability formulas are the game's (files/pirate-ship/body/data/body.json
 * `capabilities`): an attribute times factors, each factor a named engine output by library id. The faces are the game's
 * strings (the stage faces of nutrition.json `depletion`, the symptoms of medicine.json, the sleep, water and heat rows of
 * physiology.json, circulation.json), chosen by the engine's row ids and stages. The psychology pushes are the rows of
 * psychology.json `pushes` that engine outputs can drive; each is a condition on outputs and a direction and size.
 * Nothing here is a biological number. A factor, face or push the engine has no output for is named in
 * data/pirate-ship/world/stats.json and ../FIXTURES.md (F-ST-*): a missing factor counts as 1 and the result lists it.
 */
import type { BodyOutputs } from '@rex/realism'
import body from '../../../../files/pirate-ship/body/data/body.json'
import physiology from '../../../../files/pirate-ship/body/data/physiology.json'
import nutrition from '../../../../files/pirate-ship/body/data/nutrition.json'
import medicine from '../../../../files/pirate-ship/body/data/medicine.json'
import circulation from '../../../../files/pirate-ship/body/data/circulation.json'
import data from '../../../../data/pirate-ship/world/stats.json'

interface FactorSpec {
  pathway: string
  outputs: string[]
  combine?: 'min'
  divideBy?: number
  perKg?: boolean
  token?: string
  why?: string
}
type FactorRef = string | { factor: string; only: string[] }
interface CapabilitySpec { row: string; attr: string; ceiling?: string; factors: FactorRef[] }
interface Table { columns: string[]; rows: string[][] }
interface FaceSource {
  kind: 'row' | 'deficiency' | 'disease' | 'count' | 'flag' | 'stage' | 'anyFlag'
  table: string
  column?: string
  rowOutput?: string
  outputs?: string[]
  id?: string
  channels: string[]
}
interface Condition { output: string; gt?: number; eq?: number; ne?: string }
interface PushSpec {
  row: number; state: string; meter: string; per: string; when: Condition[]
  delta?: number; deltaFrom?: string; forDays?: number
}

const factors = data.factors as Record<string, FactorSpec>
const capabilities = data.capabilities as unknown as CapabilitySpec[]
const faceSources = data.faceSources as unknown as FaceSource[]
const pushSpecs = data.pushes as unknown as PushSpec[]
const tables: Record<string, Table> = {
  'physiology.sleep_debt': physiology.sleep_debt, 'physiology.hydration': physiology.hydration, 'physiology.core_temp': physiology.core_temp,
  'nutrition.depletion': nutrition.depletion, 'medicine.diseases': medicine.diseases, 'medicine.wounds': medicine.wounds,
  'medicine.pain': medicine.pain, 'medicine.exposure': medicine.exposure, 'circulation.delivery_failures': circulation.delivery_failures,
}

/** What the caller knows that the outputs do not: the body's mass (the aerobic index is per kg) and, for a row that differs by attribute, which one. */
export interface Context { massKg?: number; attribute?: string }

export interface Capability {
  row: string
  /** The attribute the row multiplies, as the caller gave it. */
  attr: number
  /** attr times every factor the engine supplied; a missing factor counts as 1. */
  value: number
  /** Each factor by the table's name; null where the engine has no output for it. */
  factors: Record<string, number | null>
  /** The factors counted as 1 for want of an engine output (FIXTURES.md F-ST-2). */
  missing: string[]
  /** The mark body.json gives the row. */
  mark: string
}

export interface Face {
  /** The table the face is read from, and the row in it. */
  table: string
  id: string
  /** The deficiency stage (1 to 3) for a stage face. */
  stage?: number
  /** The table's string untouched, and the same without its parenthetical notes: what the UI shows. */
  text: string
  shown: string
  /** The body.json `visible_faces` channels it reaches. */
  channels: string[]
}

export interface Push { id: string; row: number; meter: string; delta: number; per: string }
/** Consecutive days each long push's condition has held, keyed by the push id. */
export type Streaks = Record<string, number>

const isNumber = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v)
const bodyRow = (name: string): (string | number)[] => {
  const hit = body.capabilities.rows.filter(r => String(r[0]).startsWith(name))
  if (hit.length !== 1) throw new Error(`stats: body.json capabilities has ${hit.length} rows starting "${name}"`)
  return hit[0]
}
const spec = (row: string): CapabilitySpec => {
  const s = capabilities.find(c => c.row === row)
  if (!s) throw new Error(`stats: no capability row "${row}"`)
  return s
}
const nameOf = (f: FactorRef): string => typeof f === 'string' ? f : f.factor
const factorSpec = (name: string): FactorSpec => {
  const f = factors[name]
  if (!f) throw new Error(`stats: no factor "${name}"`)
  return f
}

/** The capability rows the adapter computes, by body.json name. */
export function capabilityRows(): string[] { return capabilities.map(c => c.row) }

/** The factors of a row's formula, the ceiling's first; those with an `only` list apply when `attribute` is named in it. */
export function factorsOf(row: string, attribute?: string): string[] {
  const s = spec(row)
  const own = s.factors.filter(f => typeof f === 'string' || (attribute !== undefined && f.only.includes(attribute))).map(nameOf)
  return s.ceiling ? [...factorsOf(s.ceiling, attribute), ...own] : own
}

/** The attribute names a row's `only` lists mention. */
export function attributesOf(row: string): string[] {
  const s = spec(row)
  const own = s.factors.flatMap(f => typeof f === 'string' ? [] : f.only)
  return [...new Set(s.ceiling ? [...attributesOf(s.ceiling), ...own] : own)]
}

/** The impairment each factor of a formula carries. */
export function pathwaysOf(row: string, attribute?: string): string[] {
  return factorsOf(row, attribute).map(n => factorSpec(n).pathway)
}

/** Pathways that appear more than once: BODY.md section 3 allows none. */
export function pathwayClashes(pathways: string[]): string[] {
  return [...new Set(pathways.filter((p, i) => pathways.indexOf(p) !== i))]
}

/** The factors no engine output backs yet, with why. */
export function unsupportedFactors(): { factor: string; pathway: string; why: string }[] {
  return Object.entries(factors).filter(([, f]) => f.outputs.length === 0).map(([factor, f]) => ({ factor, pathway: f.pathway, why: f.why ?? '' }))
}

/** The formula token a factor stands for in body.json (its name unless the data says otherwise). */
export function tokenOf(name: string): string { return factorSpec(name).token ?? name }

/** The rows of the table the adapter does not compute, with why. */
export function notComputed(): { row: string; why: string }[] { return data.notComputed }

function factorValue(f: FactorSpec, outputs: BodyOutputs, ctx: Context): number | null {
  if (f.outputs.length === 0) return null
  let value: number | null = null
  for (const id of f.outputs) {
    const v = outputs[id]
    if (!isNumber(v)) return null
    value = value === null ? v : f.combine === 'min' ? (v < value ? v : value) : value * v
  }
  if (value === null) return null
  if (f.perKg) {
    if (!isNumber(ctx.massKg) || ctx.massKg <= 0) return null
    value = value / ctx.massKg
  }
  return f.divideBy ? value / f.divideBy : value
}

/** One capability row today: the attribute times the engine's factors (BODY.md section 3). */
export function capabilityToday(row: string, attr: number, outputs: BodyOutputs, ctx: Context = {}): Capability {
  const s = spec(row)
  const names = factorsOf(row, ctx.attribute)
  const seen: Record<string, number | null> = {}
  let value = attr
  for (const n of names) {
    const v = factorValue(factorSpec(n), outputs, ctx)
    seen[n] = v
    if (v !== null) value *= v
  }
  return { row, attr, value, factors: seen, missing: names.filter(n => seen[n] === null), mark: String(bodyRow(s.row)[3]) }
}

/** Every computed row for which the caller has the attribute, keyed by the data's attribute name (`Strength_attr(limb)`, `Endurance_attr`, ...). */
export function capabilitiesToday(attrs: Record<string, number>, outputs: BodyOutputs, ctx: Context = {}): Record<string, Capability> {
  const out: Record<string, Capability> = {}
  for (const c of capabilities) if (isNumber(attrs[c.attr])) out[c.row] = capabilityToday(c.row, attrs[c.attr], outputs, ctx)
  return out
}

// ---------------------------------------------------------------- faces

const stripNotes = (text: string): string => {
  let t = text
  while (/\([^()]*\)/.test(t)) t = t.replace(/\s*\([^()]*\)/g, '')
  return t.trim()
}
const blank = (text: string): boolean => text === '-' || text.startsWith('none')

function face(src: FaceSource, id: string, text: string, stage?: number): Face[] {
  if (blank(text)) return []
  return [{ table: src.table, id, ...(stage === undefined ? {} : { stage }), text, shown: stripNotes(text), channels: src.channels }]
}

/** The faces the body shows now: each a string from the game's own tables, chosen by the engine's row ids and stages. */
export function facesOf(outputs: BodyOutputs): Face[] {
  const faces: Face[] = []
  for (const src of faceSources) {
    const t = tables[src.table]
    const col = src.column === undefined ? -1 : t.columns.indexOf(src.column)
    const lookup = (id: string, c = col): string | undefined => {
      const r = t.rows.find(x => x[0] === id)
      return r ? String(r[c]) : undefined
    }
    if (src.kind === 'row') {
      const id = outputs[src.rowOutput!]
      const text = typeof id === 'string' ? lookup(id) : undefined
      if (text !== undefined) faces.push(...face(src, String(id), text))
    } else if (src.kind === 'deficiency') {
      for (const key of Object.keys(outputs)) {
        const m = /^deficiency_(.+)_row$/.exec(key)
        const id = outputs[key], stage = m ? outputs[`deficiency_${m[1]}`] : undefined
        if (!m || typeof id !== 'string' || !isNumber(stage) || stage < 1) continue
        const text = lookup(id, t.columns.indexOf(`Stage ${stage} face`))
        if (text !== undefined) faces.push(...face(src, id, text, stage))
      }
    } else if (src.kind === 'anyFlag') {
      if (src.outputs!.some(o => outputs[o] === 1)) faces.push(...face(src, src.id!, lookup(src.id!) ?? ''))
    } else {
      for (const r of t.rows) {
        const v = outputs[src.kind === 'disease' ? `medicine.diseases.${r[0]}` : r[0]]
        const on = !isNumber(v) ? false : src.kind === 'disease' ? v === 2 : src.kind === 'flag' ? v === 1 : src.kind === 'count' ? v > 0 : v >= 1
        if (on) faces.push(...face(src, r[0], String(r[col])))
      }
    }
  }
  return faces
}

/** Face sources and rows the engine has no output for (FIXTURES.md F-ST-4). */
export function facesNotExpressible(): { id: string; why: string }[] { return data.facesNotExpressible }

// ---------------------------------------------------------------- psychology pushes

const pushId = (row: number): string => `P${String(row).padStart(2, '0')}`

function holds(when: Condition[], outputs: BodyOutputs): boolean {
  return when.every(c => {
    const v = outputs[c.output]
    if (c.gt !== undefined) return isNumber(v) && v > c.gt
    if (c.eq !== undefined) return isNumber(v) && v === c.eq
    if (c.ne !== undefined) return v !== undefined && v !== null && v !== c.ne
    return false
  })
}

/** The engine output ids the expressible pushes read; the test checks each is one the engine writes. */
export function pushOutputs(): string[] {
  return [...new Set(pushSpecs.flatMap(p => [...p.when.map(c => c.output), ...(p.deltaFrom ? [p.deltaFrom] : [])]))]
}

/** The rows of psychology.json `pushes` no engine output can drive, with what each needs (FIXTURES.md F-ST-5). */
export function inexpressiblePushes(): { id: string; row: number; part?: string; needs: string }[] {
  return data.inexpressible.map(i => ({ id: pushId(i.row), ...i }))
}

/**
 * One day's pushes onto the game's meters, from the day's outputs. `streaks` counts the days a long push's condition has
 * held up to yesterday; the returned streaks include today. The caller applies the pushes to its own meters.
 */
export function dayPushes(outputs: BodyOutputs, streaks: Streaks = {}): { pushes: Push[]; streaks: Streaks } {
  const next: Streaks = {}
  const pushes: Push[] = []
  for (const p of pushSpecs) {
    const id = pushId(p.row), on = holds(p.when, outputs)
    if (p.forDays !== undefined) next[id] = on ? (streaks[id] ?? 0) + 1 : 0
    if (!on || (p.forDays !== undefined && next[id] < p.forDays)) continue
    const delta = p.delta ?? (p.deltaFrom === undefined ? undefined : outputs[p.deltaFrom])
    if (isNumber(delta)) pushes.push({ id, row: p.row, meter: p.meter, delta, per: p.per })
  }
  return { pushes, streaks: next }
}
