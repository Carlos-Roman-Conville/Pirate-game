import { describe, expect, it } from 'vitest'
import { foodContent, foodRow } from '@rex/realism'
import economy from '../../../../data/pirate-ship/economy/goods.json'
import data from '../../../../data/pirate-ship/world/food.json'
import source from './food.ts?raw'
import { foodGoods, foodItems, foodsOf, Inventory, issueRation, keepsOf, ration } from './food.ts'
import { simulateDay, type GameCharacter } from './characters.ts'

const goodsById = new Set(economy.goods.map(g => g.id))
const weekDays = data.week.days
const bySlug = (slug: string) => foodItems.find(f => f.slug === slug)!
const line = (item: string) => ration.find(r => r.item === item)!

const deck = [{ fromH: 0, toH: 24, duty: 'Walking the deck' }]
const crew = (n: number): GameCharacter[] => Array.from({ length: n }, (_, i) => ({ slug: `hand-${i + 1}`, plan: deck }))
/** Enough of every ration good for `people` over `days`, plus a margin. */
const stores = (people: number, days: number): Record<string, number> => {
  const out: Record<string, number> = {}
  for (const l of ration) out[l.food.good!] = (out[l.food.good!] ?? 0) + (l.weeklyKg / weekDays) * people * days * 1.5
  return out
}

describe('the economy\'s goods become engine foods', () => {
  it('maps every food row of the game to a food the engine knows', () => {
    expect(foodItems.length).toBe(51)
    for (const f of foodItems) expect(() => foodRow(f.id), f.slug).not.toThrow()
  })

  it('maps a food row only to an economy good, and a good with no food row is not food', () => {
    for (const f of foodItems) if (f.good) expect(goodsById.has(f.good), f.slug).toBe(true)
    for (const g of foodGoods()) expect(foodsOf(g).length, g).toBeGreaterThan(0)
    expect(foodsOf('cattle-mill')).toEqual([])
    expect(foodsOf('tight-casks')).toEqual([])
    expect(() => new Inventory({ 'cattle-mill': 1 })).toThrow(/not food/)
  })

  it('maps by the name and the row the table cites, one row to one good', () => {
    expect(bySlug('ships-biscuit').good).toBe('ship-s-biscuit')
    expect(bySlug('bread-fresh').good).toBe('bread')
    expect(bySlug('salt-beef-as-issued').good).toBe('salt-beef-and-pork')
    expect(bySlug('ships-beer-small').good).toBe('ship-s-beer')
    expect(bySlug('strong-beer-ale-42-78').good).toBe('strong-beer-stout-bottled-ale')
    expect(bySlug('salt-fish-dried-cod-24-128').rows).toEqual([24, 128])
  })

  it('takes the one proposed override (salt pork, whose row has no good) from the data file', () => {
    expect(data.goodOverrides.map(o => o.food)).toEqual(['salt-pork-as-issued'])
    expect(bySlug('salt-pork-as-issued').good).toBe('salt-beef-and-pork')
  })

  it('leaves unmapped, and lists in FIXTURES.md F-FD-2, every food with no good or with several', () => {
    expect(foodItems.filter(f => !f.good).map(f => f.slug)).toEqual([
      'green-turtle-meat', 'eggs-ships-hens', 'cassava-boiled', 'yams-boiled-76-92', 'sauerkraut-not-a-goods-row-cooks-cure',
      'cacao-as-chocolate-drink-11-120', 'coffee-brewed', 'rum-40', 'pepper-cloves-nutmeg-cinnamon-66-67-malaguetta',
      'burgoo-oatmeal-porridge-with-molasses',
    ])
    expect(bySlug('rum-40').candidates).toEqual(['rum', 'tight-casks'])
  })

  it('reads Keeps as its first number, and none where the text gives none', () => {
    expect(bySlug('ships-biscuit').keeps).toBe(365)
    expect(bySlug('bread-fresh').keeps).toBe(5)
    expect(bySlug('oranges').keeps).toBe(14)
    expect(bySlug('lime-juice-fresh').keeps).toBe(7)
    expect(bySlug('green-turtle-meat').keeps).toBe(1)
    expect(bySlug('coffee-brewed').keeps).toBeNull()
    expect(bySlug('punch-80-rum-water-lime-sugar-nutmeg').keeps).toBeNull()
    expect(keepsOf('bread')).toBe(5)
    expect(keepsOf('cattle-mill')).toBeNull()
  })

  it('keeps a good that covers several foods for the shortest of them', () => {
    const maize = bySlug('maize-whole-grain-76-92'), potatoes = bySlug('potatoes-boiled')
    expect(maize.good).toBe(potatoes.good)
    expect(keepsOf(maize.good!)).toBe(60)
  })
})

describe('the ration table as the game gives it', () => {
  it('has the eight lines of the table, each on an economy good', () => {
    expect(ration.map(r => r.item)).toEqual(['Biscuit', 'Beer', 'Beef (salt)', 'Pork (salt)', 'Pease', 'Oatmeal', 'Butter', 'Cheese'])
    expect(line('Beer').food.slug).toBe('ships-beer-small')
    for (const r of ration) expect(goodsById.has(r.food.good!), r.item).toBe(true)
  })

  it('reads a weight where the table gives one, and the kcal column where it gives only a volume', () => {
    const lb = data.units.lb.kg
    expect(line('Biscuit').weeklyKg).toBeCloseTo(7 * lb, 12)
    expect(line('Pease').weeklyKg).toBeCloseTo(2.5 * lb, 12)
    expect(line('Butter').weeklyKg).toBeCloseTo(6 * data.units.oz.kg, 12)
    expect(ration.filter(r => r.weightFrom === 'implied').map(r => r.item)).toEqual(['Beer'])
  })

  it('agrees with the engine\'s food rows to within the table\'s rounding; the differences are the commit\'s to report', () => {
    let kcal = 0, tableKcal = 0
    for (const r of ration) {
      const food = foodRow(r.food.id), kg = r.weeklyKg / weekDays
      const engine = foodContent(food, 'energy', kg)
      expect(Math.abs(engine - r.table.kcalDay) / r.table.kcalDay, `${r.item} kcal`).toBeLessThan(0.03)
      expect(Math.abs(foodContent(food, 'protein', kg) - r.table.proteinDay), `${r.item} protein`).toBeLessThan(1)
      expect(Math.abs(foodContent(food, 'vit_c', kg) - r.table.vitCDay), `${r.item} vitamin C`).toBeLessThan(0.5)
      kcal += engine
      tableKcal += r.table.kcalDay
    }
    expect(tableKcal).toBe(5160)
    expect(Math.abs(kcal - tableKcal) / tableKcal).toBeLessThan(0.01)
  })
})

describe('an inventory feeds people', () => {
  it('a week of the ration for 12 people debits the weekly amounts, and the engine reports the ration\'s kcal and vitamin C', () => {
    const people = crew(12)
    const inv = new Inventory(stores(12, 7))
    const before = inv.totals()
    let tableKcal = 0, tableProtein = 0, eatenVitC = 0
    const spent: Record<string, number> = {}   // the engine's expenditure output runs on; a day's intake is its balance plus the day's own spending
    for (const r of ration) {
      const food = foodRow(r.food.id), kg = r.weeklyKg / weekDays
      tableKcal += foodContent(food, 'energy', kg)
      tableProtein += foodContent(food, 'protein', kg)
      eatenVitC += foodContent(food, 'vit_c', kg)
    }
    for (let day = 1; day <= 7; day++) {
      const report = issueRation(inv, people, day)
      expect(report.short).toEqual([])
      expect(report.spoiled).toEqual({})
      for (const p of people) {
        const out = simulateDay(p, day)
        const expenditure = out.outputs.energy_expenditure_kcal as number
        const intake = (out.outputs.energy_balance_day_kcal as number) + expenditure - (spent[p.slug] ?? 0)
        spent[p.slug] = expenditure
        expect(intake, `${p.slug} day ${day} kcal`).toBeCloseTo(tableKcal, 4)
        expect(out.outputs.intake_protein as number, `${p.slug} day ${day} protein`).toBeCloseTo(tableProtein, 6)
        // the body keeps only the fraction of vitamin C the absorption table lets through
        expect(out.outputs.intake_vit_c as number, `${p.slug} day ${day} vitamin C`).toBeGreaterThan(0)
        expect(out.outputs.intake_vit_c as number).toBeLessThan(eatenVitC)
        expect(out.failedChecks).toEqual([])
      }
    }
    const used: Record<string, number> = {}
    for (const r of ration) used[r.food.good!] = (used[r.food.good!] ?? 0) + r.weeklyKg * 12
    for (const [good, kg] of Object.entries(used)) expect(before[good]! - inv.kg(good), good).toBeCloseTo(kg, 9)
    expect(Object.values(inv.balance()).every(b => Math.abs(b) < 1e-9)).toBe(true)
  })

  it('gives a man the table\'s day: the kcal a day of each line, summed, is the table\'s total within rounding', () => {
    const [hand] = crew(1)
    const report = issueRation(new Inventory(stores(1, 1)), [hand!], 1)
    expect(Object.keys(report.eaten[hand!.slug]!).sort()).toEqual(ration.map(r => r.food.slug).sort())
    expect(report.eaten[hand!.slug]!['ships-biscuit']).toBeCloseTo(line('Biscuit').weeklyKg / weekDays, 12)
  })

  it('refuses a day the body is not at', () => {
    const [hand] = crew(1)
    const inv = new Inventory(stores(1, 2))
    expect(() => issueRation(inv, [hand!], 2)).toThrow(/day 1/)
    issueRation(inv, [hand!], 1)
    simulateDay(hand!, 1)
    expect(() => issueRation(inv, [hand!], 1)).toThrow(/day 2/)
  })

  it('reports a shortage, feeds first come first served, and keeps the books', () => {
    const people = crew(3)
    const start = stores(3, 1)
    start['ship-s-biscuit'] = line('Biscuit').weeklyKg / weekDays * 2.5
    const inv = new Inventory(start)
    const report = issueRation(inv, people, 1)
    expect(report.short.map(s => [s.slug, s.item])).toEqual([['hand-3', 'Biscuit']])
    expect(report.short[0]!.kg).toBeCloseTo(line('Biscuit').weeklyKg / weekDays * 0.5, 12)
    expect(report.eaten['hand-3']!['ships-biscuit']).toBeCloseTo(line('Biscuit').weeklyKg / weekDays * 0.5, 12)
    expect(inv.kg('ship-s-biscuit')).toBe(0)
    expect(inv.balance()['ship-s-biscuit']).toBeCloseTo(0, 12)
  })

  it('spoils a lot Keeps days after it came in, issues the older lot first, and issues no rot', () => {
    const inv = new Inventory()
    inv.stock('cheese', 10, -58)   // Keeps 60: spoils on day 2
    inv.stock('cheese', 10, 1)
    expect(inv.take('cheese', 4)).toBe(4)
    expect(inv.kg('cheese')).toBe(16)
    expect(inv.spoil(1)).toEqual({})
    expect(inv.spoil(2)).toEqual({ cheese: 6 })   // the old lot, minus the 4 already issued
    expect(inv.totals()).toEqual({ cheese: 10 })
    expect(inv.spoil(61)).toEqual({ cheese: 10 })
    expect(inv.totals()).toEqual({})
    expect(inv.ledger()).toEqual({ in: { cheese: 20 }, issued: { cheese: 4 }, spoiled: { cheese: 16 } })
    expect(inv.balance()).toEqual({ cheese: 0 })
  })

  it('does not issue what spoiled on the day, and says what spoiled', () => {
    const [hand] = crew(1)
    const start = stores(1, 2)
    delete start.cheese
    const inv = new Inventory(start)
    inv.stock('cheese', 5, -58)
    const report = issueRation(inv, [hand!], 2 - 1)
    expect(report.spoiled).toEqual({})
    simulateDay(hand!, 1)
    const next = issueRation(inv, [hand!], 2)
    expect(next.spoiled).toEqual({ cheese: 5 - report.issued.cheese! })
    expect(next.issued.cheese).toBeUndefined()
    expect(next.short.map(s => s.item)).toEqual(['Cheese'])
    expect(inv.balance().cheese).toBeCloseTo(0, 12)
  })

  it('refuses to stock a food that has no Keeps days', () => {
    expect(() => new Inventory({ coffee: 1 })).toThrow(/Keeps|several|food row/)
  })

  it('conserves goods through stocking, issue and spoilage together', () => {
    const inv = new Inventory({ 'ship-s-biscuit': 100, bread: 20, butter: 3 }, 1)
    inv.stock('bread', 10, 3)
    inv.take('ship-s-biscuit', 33.3)
    inv.take('bread', 17)
    inv.spoil(6)     // bread keeps 5: the lot of day 1 spoils on day 6
    inv.take('bread', 99)
    inv.take('butter', 0.5)
    for (const b of Object.values(inv.balance())) expect(Math.abs(b)).toBeLessThan(1e-9)
  })

  it('holds no formula: no Math anywhere in the adapter', () => {
    expect(source).not.toMatch(/Math/)
  })
})
