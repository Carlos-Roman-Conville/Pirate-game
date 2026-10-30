import { afterEach, describe, expect, it, vi } from 'vitest'
import * as characters from './characters.ts'
import { Inventory } from './food.ts'
import { facilityAt, WorkInventory, workDay, workDuty, workRate, type Worker } from './work.ts'
import fixture from '../../../../data/pirate-ship/world/work.json'
import recipes from '../../../../data/pirate-ship/economy/recipes.json'

const recipe = recipes.recipes.find(r => r.id === 'cooperage-slack-casks')!
function cooper(sleep = true): Worker {
  return { character: { slug: 'cooper', plan: [
    { fromH: 12, toH: 20, duty: 'Coopering' },
    { fromH: 20, toH: 4, duty: sleep ? 'Sleep' : 'Standing watch' },
    { fromH: 4, toH: 12, duty: 'Walking the deck' },
  ] }, occupation: 'cooper', skills: { cooperage: fixture.rate.skillReference }, knownRecipes: [recipe.id] }
}
const facility = () => facilityAt('port.shipyard', recipe.id)
function inventory(n = 10) {
  const stock = new WorkInventory()
  stock.stock(recipe.inputs[0]!, n, 1)
  return stock
}
function outputs(fatigue = 0, alertness = 1) {
  vi.spyOn(characters, 'simulateDay').mockReturnValue({ slug: 'cooper', day: 1,
    outputs: { fatigue_met_hours: fatigue, alertness }, notes: [], failedChecks: [] })
}
afterEach(() => vi.restoreAllMocks())

describe('work joins bodies, institutions, recipes and inventory', () => {
  it('makes exactly the fixture batch in its time, using the source recipe inputs/output', () => {
    outputs()
    const stock = inventory(), site = facility(), before = structuredClone(site)
    const report = workDay(cooper(), site, stock, 1)
    expect(report.hours).toBe(fixture.batch.hours)
    expect(report.batches).toBe(1)
    expect(report.activity).toBe(characters.activityOf('Coopering'))
    expect(report.consumed).toEqual({ [recipe.inputs[0]!]: fixture.batch.inputQuantity })
    expect(report.produced).toEqual({ [recipe.output!]: fixture.batch.outputQuantity })
    expect(site).toEqual(before)
    expect(stock.ledger().recipes).toHaveLength(1)
    expect(Object.values(stock.balance()).every(n => Math.abs(n) < 1e-10)).toBe(true)
  })

  it('uses the declared linear fatigue and skill rate, and engine alertness', () => {
    outputs(25, 0.8)
    const worker = cooper(), stock = inventory()
    worker.skills.cooperage = 75
    const report = workDay(worker, facility(), stock, 1)
    const r = fixture.rate
    expect(report.batches).toBeCloseTo((r.base + (75 - r.skillReference) * r.skillPerLevel)
      * (r.base - 25 * r.fatiguePerMetHour) * 0.8)
    expect(report.batches).toBeLessThan(workRate(75, { fatigue_met_hours: 0, alertness: 1 }))
    expect(workRate(75, { fatigue_met_hours: 1000, alertness: 1 })).toBe(0)
    expect(() => workRate(75, {})).toThrow(/missing/)
  })

  it('a real tired cooper produces less, with the bodies and goods both closing', () => {
    const rested = workDay(cooper(), facility(), inventory(), 1)
    const tiredStock = inventory()
    const tired = workDay(cooper(false), facility(), tiredStock, 1)
    expect(tired.batches).toBeLessThan(rested.batches)
    expect(tired.body.outputs.fatigue_met_hours).toBeGreaterThan(rested.body.outputs.fatigue_met_hours as number)
    expect(tired.body.failedChecks).toEqual([])
    expect(rested.body.failedChecks).toEqual([])
    expect(Object.values(tiredStock.balance()).every(n => Math.abs(n) < 1e-10)).toBe(true)
  })

  it('caps production at stock, never goes negative, and records fractional batches', () => {
    outputs()
    const stock = inventory(0.25)
    const report = workDay(cooper(), facility(), stock, 1)
    expect(report.batches).toBe(0.25)
    expect(stock.amount(recipe.inputs[0]!)).toBe(0)
    expect(stock.amount(recipe.output!)).toBe(0.25)
    expect(workDay(cooper(), facility(), inventory(0), 1).batches).toBe(0)
    expect(Object.values(stock.balance())).toEqual([0, 0])
  })

  it('shares food stock with the ration adapter and traces conversion, issue and spoilage', () => {
    const food = new Inventory({ bread: 2 }), stock = new WorkInventory(food)
    stock.stock('grain-for-meal-and-flour', 2, 1)
    stock.convert('fixture-bread', 1, { 'grain-for-meal-and-flour': 1 }, { bread: 1 })
    expect(food.kg('bread')).toBe(3)
    food.take('bread', 1)
    food.spoil(6)
    expect(stock.ledger().spoiled.bread).toBe(2)
    expect(Object.values(stock.balance()).every(n => n === 0)).toBe(true)
    const before = stock.totals()
    expect(() => stock.convert('bad', 1, { 'grain-for-meal-and-flour': 2 }, { bread: 1 })).toThrow(/insufficient/)
    expect(() => stock.convert('bad', 1, { 'grain-for-meal-and-flour': 1 }, { unknown: 1 })).toThrow(/unknown/)
    expect(() => stock.stock(recipe.output!, -1, 1)).toThrow(/invalid/)
    expect(stock.totals()).toEqual(before)
  })

  it('enforces learned knowledge, skill, equipment, and supported activities before advancing the body', () => {
    const worker = cooper(), stock = inventory()
    worker.knownRecipes = []
    expect(() => workDay(worker, facility(), stock, 1)).toThrow(/not learned/)
    worker.knownRecipes = [recipe.id]; worker.skills.cooperage = recipe.minLevel - 1
    expect(() => workDay(worker, facility(), stock, 1)).toThrow(/minimum skill/)
    worker.occupation = 'blacksmith'; worker.skills.smithing = 50; worker.knownRecipes = ['smithing-iron-hoops']
    expect(() => workDay(worker, facilityAt('port.shipyard', 'smithing-iron-hoops'), stock, 1)).toThrow(/equipment/)
    expect(() => facilityAt('new-town', recipe.id)).toThrow(/institution/)
    expect(() => workDuty('planter')).toThrow(/unsupported/)
    expect(stock.ledger().recipes).toEqual([])
  })

  it('will not double-book hours or run the same character day twice', () => {
    const worker = cooper(), stock = inventory()
    const plan = worker.character.plan as characters.DutyBlock[]
    plan.push({ fromH: 12, toH: 20, duty: 'Coopering' })
    expect(() => workDay(worker, facility(), stock, 1)).toThrow(/overlapping/)
    plan.pop()
    workDay(worker, facility(), stock, 1)
    const before = stock.totals()
    expect(() => workDay(worker, facility(), stock, 1)).toThrow(/day 2/)
    expect(stock.totals()).toEqual(before)
  })

  it('accounts for every input of a multi-input recipe and refuses unresolved byproduct parents', () => {
    outputs()
    const worker = cooper(), stock = new WorkInventory()
    worker.occupation = 'victualler-cook'
    worker.character.plan = [{ fromH: 12, toH: 20, duty: 'Cooking' }]
    const candy = recipes.recipes.find(r => r.id === 'cooking-preserves-and-sugar-candy')!
    worker.skills = { cooking: candy.minLevel, butchering: 100 }
    worker.knownRecipes = [candy.id, 'butchering-fresh-meat']
    for (const input of candy.inputs) stock.stock(input, 1, 1)
    const report = workDay(worker, facilityAt('port.bakery', candy.id), stock, 1)
    expect(Object.keys(report.consumed)).toEqual(candy.inputs)
    for (const input of candy.inputs) expect(stock.amount(input)).toBeCloseTo(1 - report.batches)
    expect(Object.values(stock.balance()).every(n => Math.abs(n) < 1e-10)).toBe(true)
    expect(() => workDay(worker, facilityAt('port.bakery', 'butchering-fresh-meat'), stock, 1)).toThrow(/unsupported recipe/)
  })
})
