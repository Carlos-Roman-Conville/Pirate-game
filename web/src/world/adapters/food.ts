/**
 * Phase 5 adapter 2: the economy's goods become engine foods, and an inventory feeds people (Toolchain/realism
 * PHASES-4-5.md, rules 4 to 6). The map is the game's adapter rows (body/data/nutrition.json `foods`: `Good (GOODS.md
 * row)` and `Keeps (days at sea)`) against data/pirate-ship/economy/goods.json; a good with no food row is not food.
 * The ration is the game's `ration` table. Every eaten kilogram goes through the engine's `eat`; nothing here computes
 * a nutrient. Where the game has no system (an inventory, a rule for goods that cover several foods) the stand-ins are
 * F-FD-* in ../FIXTURES.md.
 */
import { eat, foodRow } from '@rex/realism'
import nutrition from '../../../../files/pirate-ship/body/data/nutrition.json'
import economy from '../../../../data/pirate-ship/economy/goods.json'
import data from '../../../../data/pirate-ship/world/food.json'
import { engineOf, type GameCharacter } from './characters.ts'

/** A food row of the game's table, with the economy good it stands for (null: none, or several fit and none is chosen). */
export interface FoodItem {
  /** The engine's food id (`nutrition.foods.<slug>`), what `eat` and `foodRow` take. */
  id: string
  slug: string
  /** The game's name for the row, as the table gives it. */
  name: string
  /** GOODS.md row numbers the name cites. */
  rows: number[]
  /** Days the food keeps at sea: the first number of the `Keeps` text; null where the text gives none (drunk as made). */
  keeps: number | null
  /** The economy good id; null when no good fits or more than one does (`candidates` says which). */
  good: string | null
  candidates: string[]
}

/** One line of the game's ration: what a man is issued a week, and what the table says it gives a day. */
export interface RationItem {
  item: string
  food: FoodItem
  /** Kilograms a week per person. */
  weeklyKg: number
  /** `weight` when the table's weekly text gives a weight; `implied` when it gives a volume (so the kg comes from the table's own kcal column). */
  weightFrom: 'weight' | 'implied'
  table: { kcalDay: number; proteinDay: number; vitCDay: number }
}

const words = (s: string): Set<string> => new Set(s.toLowerCase().replace(/'/g, '').match(/[a-z0-9]+/g) ?? [])
const covers = (big: Set<string>, small: Set<string>): boolean => [...small].every(w => big.has(w))

const goods = economy.goods as { id: string; name: string; row: number }[]
const overrides = data.goodOverrides as { food: string; good: string }[]

function foodItem(row: string[]): FoodItem {
  const [id, name, keepsText] = row as [string, string, string]
  const slug = id.replace('nutrition.foods.', '')
  const rows = [...name.matchAll(/\((\d+(?:, \d+)*)[):]/g)].flatMap(m => m[1]!.split(', ').map(Number))
  const head = words(name.split(/\s*[(:,]/)[0]!)
  const candidates = goods.filter(g => covers(words(g.name), head) && (rows.length === 0 || rows.includes(g.row))).map(g => g.id)
  const over = overrides.find(o => o.food === slug)
  const good = over ? over.good : candidates.length === 1 ? candidates[0]! : null
  const first = /\d+/.exec(keepsText)
  return { id, slug, name, rows, keeps: first ? Number(first[0]) : null, good, candidates: over ? [over.good] : candidates }
}

/** Every food row of the game's table, in its order. */
export const foodItems: FoodItem[] = (nutrition.foods.rows as string[][]).map(foodItem)

const byGood = new Map<string, FoodItem[]>()
for (const f of foodItems) if (f.good) byGood.set(f.good, [...(byGood.get(f.good) ?? []), f])

/** The food rows an economy good stands for; empty when it is not food. */
export function foodsOf(good: string): FoodItem[] { return byGood.get(good) ?? [] }

/** The economy goods that are food. */
export function foodGoods(): string[] { return [...byGood.keys()] }

/** Days a good keeps: the shortest of its food rows (one stock per good, F-FD-3); null when a row gives none. */
export function keepsOf(good: string): number | null {
  const rows = foodsOf(good)
  if (rows.length === 0 || rows.some(f => f.keeps === null)) return null
  return rows.reduce((least, f) => (f.keeps! < least ? f.keeps! : least), rows[0]!.keeps!)
}

// ------------------------------------------------------------------------------------------------------------ the ration

function itemFood(item: string, note: string): FoodItem {
  const want = words(item), title = (f: FoodItem) => words(f.name.split(/\s*\(/)[0]!)
  const hits = foodItems.filter(f => covers(title(f), want))
  if (hits.length === 1) return hits[0]!
  // several rows share the word (beer): the row with a further word that the table's note names
  const named = hits.filter(f => [...title(f)].some(w => !want.has(w) && words(note).has(w)))
  if (named.length === 1) return named[0]!
  throw new Error(`food: the ration item "${item}" names ${hits.length} food rows`)
}

function weeklyKg(perWeek: string, kcalDay: number, food: FoodItem): Pick<RationItem, 'weeklyKg' | 'weightFrom'> {
  const units = data.units as Record<string, { kg: number }>
  const m = /about ([\d.]+) (lb|oz)/.exec(perWeek) ?? /^([\d.]+) (lb|oz)\b/.exec(perWeek)
  if (m) return { weeklyKg: Number(m[1]) * units[m[2]!]!.kg, weightFrom: 'weight' }
  return { weeklyKg: (kcalDay * data.week.days) / foodRow(food.id).kcalPerKg, weightFrom: 'implied' }
}

/** The game's ration table as items: one per line, the total row left out. */
export const ration: RationItem[] = (nutrition.ration.rows as (string | number)[][])
  .filter(r => !String(r[0]).startsWith('Total'))
  .map(r => {
    const [item, perWeek, kcalDay, proteinDay, vitCDay, note] = r as [string, string, number, number, number, string]
    const food = itemFood(item, note)
    if (!food.good) throw new Error(`food: the ration item "${item}" (${food.slug}) has no economy good`)
    return { item, food, ...weeklyKg(perWeek, kcalDay, food), table: { kcalDay, proteinDay, vitCDay } }
  })

// ------------------------------------------------------------------------------------------------------------ the inventory

/** Food of one good that came in on one day. */
export interface Lot { kg: number; day: number }

/**
 * The inventory fixture (F-FD-1): kilograms of each food good, in lots by the day they came in. Goods are conserved:
 * what came in (the start and every `stock`) equals what was issued, plus what spoiled, plus what remains.
 */
export class Inventory {
  private readonly lots = new Map<string, Lot[]>()
  private readonly came: Record<string, number> = {}
  private readonly went: Record<string, number> = {}
  private readonly rotted: Record<string, number> = {}

  /** `start` is a map of good id to kilograms, all in on `day`. */
  constructor(start: Record<string, number> = {}, day = 1) {
    for (const [good, kg] of Object.entries(start)) this.stock(good, kg, day)
  }

  /** Put kilograms of a food good in. Throws for a good that is not food or has no Keeps days. */
  stock(good: string, kg: number, day: number): void {
    if (foodsOf(good).length === 0) throw new Error(`food: "${good}" has no food row, so it is not food`)
    if (keepsOf(good) === null) throw new Error(`food: "${good}" has no Keeps days (made as it is drunk), so it cannot be stocked`)
    this.lots.set(good, [...(this.lots.get(good) ?? []), { kg, day }])
    this.came[good] = (this.came[good] ?? 0) + kg
  }

  /** Kilograms on hand of a good. */
  kg(good: string): number { return (this.lots.get(good) ?? []).reduce((sum, l) => sum + l.kg, 0) }

  /** The map of good id to kilograms on hand. */
  totals(): Record<string, number> {
    const out: Record<string, number> = {}
    for (const good of this.lots.keys()) if (this.kg(good) > 0) out[good] = this.kg(good)
    return out
  }

  /** Lots at least `Keeps` days old on `day` spoil whole (F-FD-3). Returns kilograms spoiled by good. */
  spoil(day: number): Record<string, number> {
    const out: Record<string, number> = {}
    for (const [good, lots] of this.lots) {
      const keeps = keepsOf(good)!
      const [bad, fine] = [lots.filter(l => day - l.day >= keeps), lots.filter(l => day - l.day < keeps)]
      if (bad.length === 0) continue
      const kg = bad.reduce((sum, l) => sum + l.kg, 0)
      this.lots.set(good, fine)
      this.rotted[good] = (this.rotted[good] ?? 0) + kg
      out[good] = kg
    }
    return out
  }

  /** Take up to `kg` of a good, oldest lot first (F-FD-4); returns what was taken. */
  take(good: string, kg: number): number {
    let left = kg
    const lots = [...(this.lots.get(good) ?? [])].sort((a, b) => a.day - b.day)
    for (const lot of lots) {
      if (left <= 0) break
      const used = lot.kg < left ? lot.kg : left
      lot.kg -= used
      left -= used
    }
    this.lots.set(good, lots.filter(l => l.kg > 0))
    const taken = kg - left
    this.went[good] = (this.went[good] ?? 0) + taken
    return taken
  }

  /** In minus issued minus spoiled minus on hand, by good: zero where goods are conserved. */
  balance(): Record<string, number> {
    const out: Record<string, number> = {}
    for (const good of Object.keys(this.came)) out[good] = this.came[good]! - (this.went[good] ?? 0) - (this.rotted[good] ?? 0) - this.kg(good)
    return out
  }

  /** The books by good: in, issued, spoiled. */
  ledger(): { in: Record<string, number>; issued: Record<string, number>; spoiled: Record<string, number> } {
    return { in: { ...this.came }, issued: { ...this.went }, spoiled: { ...this.rotted } }
  }
}

// ------------------------------------------------------------------------------------------------------------ the issue

export interface RationReport {
  day: number
  /** Kilograms issued by good, to everyone. */
  issued: Record<string, number>
  /** Kilograms that spoiled on this day's check, by good. */
  spoiled: Record<string, number>
  /** What the inventory could not cover: person, ration item and kilograms missing. */
  short: { slug: string; item: string; kg: number }[]
  /** Kilograms each person was given, by person then food slug. */
  eaten: Record<string, Record<string, number>>
}

/**
 * Issue one day of the game's ration to each person from the inventory, and have each eat it. A day is a seventh of the
 * ration's week (F-FD-5). Spoiled lots go first, so no one is issued rot. Call it before `simulateDay(person, day)`: the
 * engine counts what is eaten into the day it closes.
 */
export function issueRation(inventory: Inventory, people: GameCharacter[], day: number): RationReport {
  const report: RationReport = { day, issued: {}, spoiled: inventory.spoil(day), short: [], eaten: {} }
  for (const person of people) {
    const { world, body, nextDay } = engineOf(person)
    if (day !== nextDay) throw new Error(`food: ${person.slug} is at day ${nextDay}, not ${day}`)
    const eaten: Record<string, number> = {}
    report.eaten[person.slug] = eaten
    for (const line of ration) {
      const want = line.weeklyKg / data.week.days
      const got = inventory.take(line.food.good!, want)
      if (got < want) report.short.push({ slug: person.slug, item: line.item, kg: want - got })
      if (got <= 0) continue
      eat(world, body, line.food.id, got)
      eaten[line.food.slug] = (eaten[line.food.slug] ?? 0) + got
      report.issued[line.food.good!] = (report.issued[line.food.good!] ?? 0) + got
    }
  }
  return report
}
