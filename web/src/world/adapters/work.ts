/**
 * Phase 5 adapter 5. GOODS.md 3c/3d/3f supplies skills, occupations and recipe gates;
 * FACILITIES.md section 2 supplies settlement equipment and the existing institution slots.
 * No source gives a numerical production rate, quantities or recipe time. F-WK-1/2 in
 * FIXTURES.md explicitly supply those game placeholders (world/work.json), NOT physiology.
 * BODY.md's proposed work capacity needs unavailable per-limb outputs and fatigueDay;
 * we do not substitute fatigue_met_hours into that formula. Bodies/MET stay in characters.ts.
 * Where the hydration row says work stops, the engine's `work_capacity_hydration` is 0 and so is the rate (the row's, not ours).
 */
import type { BodyOutputs } from '@rex/realism'
import recipes from '../../../../data/pirate-ship/economy/recipes.json'
import occupations from '../../../../data/pirate-ship/economy/occupations.json'
import skills from '../../../../data/pirate-ship/economy/skills.json'
import goods from '../../../../data/pirate-ship/economy/goods.json'
import fixture from '../../../../data/pirate-ship/world/work.json'
import { initialSlots, type InstitutionSlot } from '../../alignment/institutions.ts'
import { activityOf, simulateDay, type GameCharacter, type Place, type DayReport } from './characters.ts'
import { Inventory, foodsOf, keepsOf } from './food.ts'

type Amounts = Record<string, number>
const goodIds = new Set(goods.goods.map(g => g.id))
// byproductOf is a source-tree key (e.g. "butchering:Fresh meat"), not a goods id.
const recipeKey = (key: string) => key.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const foodGood = (id: string) => foodsOf(id).length > 0
const add = (rows: Amounts, id: string, n: number) => { rows[id] = (rows[id] ?? 0) + n }
function nonnegative(n: number, name: string): void {
  if (!Number.isFinite(n) || n < 0) throw new Error(`work: invalid ${name}`)
}

/** F-WK-3: food remains in the existing kg inventory; other goods use abstract units.
 * Pass .food to issueRation. Every recipe has an explicit consumed/produced ledger.
 * Balances close per good; unlike goods' unit counts are never summed as physical mass.
 */
export class WorkInventory {
  readonly food: Inventory
  private readonly stockUnits: Amounts = {}
  private readonly incoming: Amounts = {}
  private readonly outgoing: Amounts = {}
  private readonly runs: { recipe: string; day: number; consumed: Amounts; produced: Amounts }[] = []

  constructor(food = new Inventory()) { this.food = food }

  validate(good: string, amount: number): void {
    nonnegative(amount, 'quantity')
    if (!goodIds.has(good)) throw new Error(`work: unknown good ${good}`)
    if (foodGood(good) && keepsOf(good) === null) throw new Error(`work: ${good} has no Keeps days`)
  }

  stock(good: string, amount: number, day: number): void {
    this.validate(good, amount)
    if (!Number.isInteger(day)) throw new Error('work: invalid day')
    if (foodGood(good)) this.food.stock(good, amount, day)
    else { add(this.stockUnits, good, amount); add(this.incoming, good, amount) }
  }

  amount(good: string): number { return foodGood(good) ? this.food.kg(good) : this.stockUnits[good] ?? 0 }
  totals(): Amounts { return { ...this.stockUnits, ...this.food.totals() } }

  /** Atomic after preflight; insufficient input never creates output. */
  convert(recipe: string, day: number, consumed: Amounts, produced: Amounts): void {
    if (!Number.isInteger(day)) throw new Error('work: invalid day')
    for (const [id, n] of [...Object.entries(consumed), ...Object.entries(produced)]) this.validate(id, n)
    for (const [id, n] of Object.entries(consumed)) {
      if (this.amount(id) < n) throw new Error(`work: insufficient ${id}`)
    }
    for (const [id, n] of Object.entries(consumed)) {
      if (foodGood(id)) this.food.take(id, n)
      else { add(this.stockUnits, id, -n); add(this.outgoing, id, n) }
    }
    for (const [id, n] of Object.entries(produced)) this.stock(id, n, day)
    this.runs.push({ recipe, day, consumed: { ...consumed }, produced: { ...produced } })
  }

  ledger() {
    const food = this.food.ledger()
    return {
      in: { ...this.incoming, ...food.in }, issued: { ...this.outgoing, ...food.issued }, spoiled: food.spoiled,
      recipes: this.runs.map(r => ({ ...r, consumed: { ...r.consumed }, produced: { ...r.produced } })),
    }
  }

  balance(): Amounts {
    return { ...Object.fromEntries(Object.keys(this.incoming).map(id =>
      [id, this.incoming[id]! - (this.outgoing[id] ?? 0) - this.amount(id)])), ...this.food.balance() }
  }
}

export interface WorkFacility {
  id: string
  /** Existing slot snapshot, including its story owner; never mutated by work. */
  institution: InstitutionSlot
  /** Settlement-wide equipment booleans, not a new parcel/equipment system. */
  equipment: string[]
  recipe: string
}

/** F-WK-4: the caller explicitly assigns a recipe and settlement equipment to an existing slot. */
export function facilityAt(id: string, recipe: string, equipment: string[] = [], slots = initialSlots()): WorkFacility {
  const slot = slots[id]
  if (!slot) throw new Error(`work: unknown institution ${id}`)
  if (!recipes.recipes.some(r => r.id === recipe)) throw new Error(`work: unknown recipe ${recipe}`)
  for (const item of equipment) {
    if (!Object.hasOwn(recipes.facilities.list, item)) throw new Error(`work: unknown equipment ${item}`)
  }
  return { id, recipe, equipment: [...equipment], institution: { ...slot, pos: slot.pos && { ...slot.pos } } }
}

export interface Worker {
  character: GameCharacter
  occupation: string
  skills: Amounts
  /** Explicit knowledge: a high skill or an occupation does not grant recipes. */
  knownRecipes: string[]
}

export function workDuty(occupation: string): string {
  const duty = (fixture.occupationDuty as Record<string, string>)[occupation]
  if (!duty) throw new Error(`work: unsupported occupation activity ${occupation} (F-WK-5)`)
  activityOf(duty) // Validate via the characters adapter, which owns the MET mapping.
  return duty
}

/** The engine's `work_capacity_hydration`: 1 where the water deficit's row stops nothing, 0 where it says work stops
 * (incapacitated, death risk), null where the row gives no work figure (then it takes nothing from the rate). A body that
 * has no such output at all throws: there is no silent "hydrated" default.
 */
export function hydrationCapacity(outputs: BodyOutputs): number {
  const capacity = outputs.work_capacity_hydration
  if (capacity === undefined) throw new Error('work: missing work_capacity_hydration output')
  if (capacity === null) return 1
  if (typeof capacity !== 'number') throw new Error('work: invalid work_capacity_hydration output')
  nonnegative(capacity, 'hydration capacity')
  return Math.min(1, capacity)
}

/** F-WK-2: linear skill and fatigue factors, multiplied by capped engine alertness and the engine's hydration work capacity.
 * Missing outputs disable production; there is no silent "healthy" default.
 */
export function workRate(level: number, outputs: BodyOutputs): number {
  nonnegative(level, 'skill level')
  const fatigue = outputs.fatigue_met_hours, alertness = outputs.alertness
  if (typeof fatigue !== 'number' || typeof alertness !== 'number') throw new Error('work: missing fatigue/alertness outputs')
  nonnegative(fatigue, 'fatigue output'); nonnegative(alertness, 'alertness output')
  const r = fixture.rate
  return Math.max(r.floor, r.base + (level - r.skillReference) * r.skillPerLevel)
    * Math.max(r.floor, r.base - fatigue * r.fatiguePerMetHour) * Math.min(r.alertnessCeiling, alertness) * hydrationCapacity(outputs)
}

function prepare(worker: Worker, facility: WorkFacility, day: number) {
  const recipe = recipes.recipes.find(r => r.id === facility.recipe)
  if (!recipe) throw new Error('work: unknown recipe')
  const occupation = occupations.occupations.find(o => o.id === worker.occupation)
  if (!occupation?.skills.includes(recipe.skill) || !skills.skills.some(s => s.id === recipe.skill)) {
    throw new Error('work: recipe is outside the occupation skills')
  }
  const level = worker.skills[recipe.skill]
  if (level === undefined || !Number.isFinite(level) || level < recipe.minLevel) throw new Error('work: minimum skill not met')
  if (!worker.knownRecipes.includes(recipe.id)) throw new Error('work: recipe not learned')
  if (recipe.equipment.some(e => !facility.equipment.includes(e))) throw new Error('work: missing equipment')
  if (recipe.service || recipe.offMap || recipe.region !== 'caribbean' || recipe.gate || recipe.byproductOf ||
      recipes.recipes.some(r => r.byproductOf && recipeKey(r.byproductOf) === recipe.id) || recipe.inputs.length + recipe.inputsAny.length === 0) {
    throw new Error(`work: unsupported recipe ${recipe.id} (F-WK-6)`)
  }
  const duty = workDuty(worker.occupation)
  const plan = typeof worker.character.plan === 'function' ? worker.character.plan(day) : worker.character.plan
  // Reject overlaps so one body cannot earn duplicate working hours.
  const spans: [number, number][] = []
  let hours = 0
  for (const block of plan) {
    if (!Number.isFinite(block.fromH) || !Number.isFinite(block.toH) || block.fromH < 0 || block.fromH >= 24 || block.toH < 0 || block.toH > 24) {
      throw new Error('work: invalid duty hours')
    }
    const parts: [number, number][] = block.toH > block.fromH ? [[block.fromH, block.toH]] : [[block.fromH, 24], [0, block.toH]]
    for (const [from, to] of parts) {
      if (spans.some(([a, b]) => from < b && to > a)) throw new Error('work: overlapping duty hours')
      spans.push([from, to])
      if (block.duty === duty) hours += to - from
    }
  }
  return { recipe, level, duty, hours }
}

/** Runs one body's scheduled day, then converts goods using that day's engine outputs.
 * Feed with issueRation(inventory.food, ...) first. One assignment per character/day;
 * simulateDay enforces sequential days, preventing double production on a replay.
 */
export function workDay(worker: Worker, facility: WorkFacility, inventory: WorkInventory, day: number, place?: Place) {
  const { recipe, level, duty, hours } = prepare(worker, facility, day)
  const output = recipe.output
  if (!output) throw new Error('work: recipe has no goods output')
  const inputs = [...recipe.inputs]
  // F-WK-1: first available alternative in recipe order, no substitution within a batch.
  if (recipe.inputsAny.length) inputs.push(recipe.inputsAny.find(id => inventory.amount(id) > 0) ?? recipe.inputsAny[0]!)
  const required: Amounts = {}
  for (const id of inputs) add(required, id, fixture.batch.inputQuantity)
  for (const id of [...inputs, output]) inventory.validate(id, fixture.batch.inputQuantity)
  const body: DayReport = simulateDay(worker.character, day, place)
  const rate = workRate(level, body.outputs)
  const stopped = hydrationCapacity(body.outputs) === 0 ? 'hydration' : null
  const spoiled = inventory.food.spoil(day)
  const capacity = hours / fixture.batch.hours * rate
  const batches = Math.min(capacity, ...Object.entries(required).map(([id, n]) => inventory.amount(id) / n))
  const consumed = Object.fromEntries(Object.entries(required).map(([id, n]) => [id, n * batches]))
  const produced = { [output]: fixture.batch.outputQuantity * batches }
  if (batches > 0) inventory.convert(recipe.id, day, consumed, produced)
  return { day, slug: worker.character.slug, facility: facility.id, recipe: recipe.id, duty,
    activity: activityOf(duty), hours, rate, stopped, batches, consumed, produced, spoiled, body }
}
