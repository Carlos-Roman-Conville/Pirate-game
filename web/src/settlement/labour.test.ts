// VALIDATION.md s2 / V5 in the host: the labour cap. I3: no pool grants more person-hours than it supplied.
import { describe, expect, it } from 'vitest'
import { stubProviders, totalMoney } from '@rex/settlement'
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
