// VALIDATION.md s2 / V5 in the host: the labour cap. I3: no pool grants more person-hours than it supplied.
import { describe, expect, it } from 'vitest'
import { createPopulation, populationLabourSupply } from '@rex/realism'
import { stubProviders, totalMoney, type LabourSupply } from '@rex/settlement'
import { loadPort } from './index'

describe('I3 labour is capped by the hours supplied', () => {
  it('over thirty days of the port no pool is granted more hours than it supplied, and money is conserved', () => {
    const p = stubProviders({
      'salt-meat': { inputs: [{ good: 'meat', units: 1 }, { good: 'salt', units: 1 }], output: 'salt-meat', yield: 1, unitsPerFixtureDay: 10, labourHoursPerUnit: 2.5 },
    })
    p.labour.pools['pool.housing'] = 5
    p.labour.pools['pool.builders'] = 1
    const port = loadPort(p)
    const r = port.runner
    const shop = port.bindings['port.bakery']
    const biz = shop.businesses[0]
    r.run({ type: 'credit', holder: 'esfp-f', amount: 500 })
    r.run({ type: 'credit', holder: biz, amount: 500 })
    r.run({ type: 'setLines', biz, lines: [{ recipe: 'salt-meat', equipment: ['salting-house'] }] })
    p.materials.set('inv.port.bakery', 'meat', 1000); p.materials.set('inv.port.bakery', 'salt', 1000)
    for (const role of ['labourer', 'hauler']) r.run({ type: 'hire', post: r.run<string>({ type: 'addPost', biz, role, wage: 1 }), holder: 'pool.housing' })
    r.run({ type: 'startProject', kind: 'renovate', target: shop.buildings[0], account: 'esfp-f', pool: 'pool.builders', wage: 1, labourHours: 100,
      plan: { addFixtures: ['smokehouse'] } })
    const money = totalMoney(r.state)
    r.tick(30)
    expect(p.labour.grants.length).toBeGreaterThan(0)
    const supplied = (pool: string) => p.labour.pools[pool] * p.labour.hoursPerDay
    const byDay = new Map<string, number>()
    for (const row of p.labour.grants) byDay.set(`${row.day}|${row.pool}`, (byDay.get(`${row.day}|${row.pool}`) ?? 0) + row.hours)
    for (const [key, hours] of byDay) expect(hours, key).toBeLessThanOrEqual(supplied(key.split('|')[1]) + 1e-9)
    expect(totalMoney(r.state)).toBe(money)
  })
})

// Registry re-audit DUP-26/28/29: Settlement's tick against Reality's
// populationLabourSupply; assigned hours never exceed supplied hours per pool (CONTRACTS section 16, 18).
describe('I3b labour from the realism population provider is capped by the hours it supplies (2757)', () => {
  it('over thirty days of the port no pool is granted more hours than populationLabourSupply supplies, and money is conserved', () => {
    const recipe = {
      'salt-meat': { inputs: [{ good: 'meat', units: 1 }, { good: 'salt', units: 1 }], output: 'salt-meat', yield: 1, unitsPerFixtureDay: 10, labourHoursPerUnit: 2.5 },
    }
    const pop = createPopulation({ children: 0, adultsM: 1, adultsF: 2, elders: 0, transient: 0 })
    const real = populationLabourSupply(pop, {
      hoursPerDay: 10,
      pools: { 'pool.housing': ['adultsF'], 'pool.builders': ['adultsM'] },
    })
    const grants: { day: number; pool: string; hours: number }[] = []
    const wrapped: LabourSupply = {
      supply: real.supply,
      available: () => true,
      productivity: () => 1,
      hours(source, role, day) {
        if (source === 'pool.housing' || source === 'pool.builders') return real.hours(source, role, day)
        return source.startsWith('pool.') ? 0 : Number.POSITIVE_INFINITY
      },
      draw(pool, role, requires, wantedHours, day) {
        if (pool !== 'pool.housing' && pool !== 'pool.builders') return 0
        const result = real.draw(pool, role, requires, wantedHours, day)
        if (result > 0) grants.push({ day, pool, hours: result })
        return result
      },
    }
    const p = { ...stubProviders(recipe), labour: wrapped }
    const port = loadPort(p)
    const r = port.runner
    const shop = port.bindings['port.bakery']
    const biz = shop.businesses[0]
    r.run({ type: 'credit', holder: 'esfp-f', amount: 500 })
    r.run({ type: 'credit', holder: biz, amount: 500 })
    r.run({ type: 'setLines', biz, lines: [{ recipe: 'salt-meat', equipment: ['salting-house'] }] })
    p.materials.set('inv.port.bakery', 'meat', 1000)
    p.materials.set('inv.port.bakery', 'salt', 1000)
    for (const role of ['labourer', 'hauler']) r.run({ type: 'hire', post: r.run<string>({ type: 'addPost', biz, role, wage: 1 }), holder: 'pool.housing' })
    r.run({
      type: 'startProject', kind: 'renovate', target: shop.buildings[0], account: 'esfp-f', pool: 'pool.builders', wage: 1, labourHours: 100,
      plan: { addFixtures: ['smokehouse'] },
    })
    const poolCategories: Record<string, string[]> = { 'pool.housing': ['adultsF'], 'pool.builders': ['adultsM'] }
    const capacity = (pool: string, day: number) =>
      real.supply(day).reduce((sum, row) => sum + (poolCategories[pool]?.includes(row.category) ? row.personHours : 0), 0)
    const money = totalMoney(r.state)
    r.tick(30)
    expect(grants.length).toBeGreaterThan(0)
    expect(grants.some((g) => g.pool === 'pool.housing')).toBe(true)
    expect(grants.some((g) => g.pool === 'pool.builders')).toBe(true)
    const byDay = new Map<string, number>()
    for (const row of grants) byDay.set(`${row.day}|${row.pool}`, (byDay.get(`${row.day}|${row.pool}`) ?? 0) + row.hours)
    for (const [key, hours] of byDay) {
      const [dayStr, pool] = key.split('|')
      expect(hours, key).toBeLessThanOrEqual(capacity(pool, Number(dayStr)) + 1e-9)
    }
    for (const row of grants) {
      const grantedDay = byDay.get(`${row.day}|${row.pool}`) ?? 0
      const cap = capacity(row.pool, row.day)
      const remaining = wrapped.hours(row.pool, 'labourer', row.day)
      expect(remaining, `${row.pool} day ${row.day}`).toBeGreaterThanOrEqual(0)
      expect(remaining, `${row.pool} day ${row.day}`).toBeCloseTo(cap - grantedDay, 9)
    }
    expect(totalMoney(r.state)).toBe(money)
  })
})
