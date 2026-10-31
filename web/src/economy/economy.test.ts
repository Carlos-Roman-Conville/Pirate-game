// Toolchain/economy/TESTS.md I1, I1b and I2: the economy engine behind the settlement engine's providers, in the
// pirate port, with the alignment engine untouched (the settlement tests hold that guard). The setup and the
// thirty-day run are in ./fixture.ts, shared with the golden capture.
import { describe, expect, it } from 'vitest'
import { Runner as EconomyRunner, accounts, marketStock, producedLast, stubProviders as economyStubs, totalUnits } from '@rex/economy'
import { balanceOf, ledger, totalMoney, type StubLabour } from '@rex/settlement'
import { thirtyDays, world } from './fixture'
import { runDay } from './index'

describe('I1 the port\'s butcher produces into an economy inventory through the material provider', () => {
  it('one settlement day: Q is Settlement\'s, the stock move is the economy\'s, and both agree', () => {
    const { economy, loaded, aliases, port, reader, biz, inv } = world()
    expect(economy.counts.goods).toBeGreaterThan(200)
    expect(economy.counts.recipes).toBe(2)
    expect(economy.unquantified.length).toBeGreaterThan(200)
    expect(aliases.entries()).toEqual([['inv.port.bakery', inv]])
    const logged = economy.runner.log.length
    runDay(port.runner, economy.runner)
    // one butcher, ten hours, 0.25 worker-days a unit: four units of meat, then no labour left for the fish line
    expect(port.runner.state.production[biz]!.lines).toMatchObject([{ recipe: 'butchering-fresh-meat', q: 4 }, { recipe: 'preserving-salt-fish', q: 0 }])
    expect(reader.production(biz, 0)).toEqual([{ recipe: 'butchering-fresh-meat', q: 4 }, { recipe: 'preserving-salt-fish', q: 0 }])
    expect(reader.production(biz, 1)).toBeNull()
    const stock = economy.runner.state.inventories[inv].stock
    expect(stock).toMatchObject({ 'cattle-and-hogs': 46, 'fresh-meat': 4, 'raw-hides': 0.8, tallow: 0.4, 'fresh-fish': 50, salt: 50 })
    expect(producedLast(economy.runner.state, 'stl.port', 'fresh-meat')).toBe(4)
    expect(port.runner.state.businesses[biz].status).toBe('producing')
    // every provider call Settlement made is an economy command, and the day replays
    expect(economy.runner.log.slice(logged).map((c) => c.type)).toEqual(['produce', 'tick'])
    const again = EconomyRunner.replay(economy.runner.log, economy.runner.config, economyStubs(), loaded)
    expect(JSON.stringify(again.state)).toBe(JSON.stringify(economy.runner.state))
    // the reader sees the settlement; another market sees nothing
    expect(reader.businesses('stl.port').find((b) => b.id === biz)).toMatchObject({ inventory: 'inv.port.bakery', status: 'producing', open: true })
    expect(reader.posts('stl.port').filter((p) => p.biz === biz)).toHaveLength(1)
    expect(reader.businesses('elsewhere')).toEqual([])
    expect(reader.hasFixture('stl.port', 'salting-house')).toBe(true)
    expect(reader.hasFixture('stl.port', 'powder-mill')).toBe(false)
  })
  it('the price provider answers for goods and refuses property (open for Rex); the ledger provider is Settlement\'s ledger', () => {
    const { economy, port, biz } = world()
    const prices = port.runner.providers.prices
    expect(() => prices.valueOf(port.bindings['port.bakery'].titles[1], 0)).toThrow(/open for Rex/)
    expect(() => prices.valueOf('fresh-meat', 0)).toThrow(/basePrice is open/)
    economy.runner.run({ type: 'setMarketGood', market: 'stl.port', good: 'fresh-meat', basePrice: 3 })
    expect(prices.valueOf('fresh-meat', 0)).toBe(3)
    const ledger = economy.runner.providers.ledger
    expect(ledger.balance(biz)).toBe(100)
    const txn = ledger.transfer(biz, 'esfp-f', 5, 'dividend', null, 'test')
    expect(txn).toMatch(/^txn\./)
    expect(balanceOf(port.runner.state, biz)).toBe(95)
    expect(ledger.rows(biz, 0, 0).map((row) => row.kind)).toEqual(['credit', 'dividend'])
  })
})

describe('I1b a project draws from its own inventory through the aliases (CONTRACTS §15, DUP-44)', () => {
  it('materials come from the project\'s inventory ref, wages from its account, and the account is never an inventory', () => {
    const { economy, aliases, port } = world()
    const r = port.runner
    ;(r.providers.labour as StubLabour).pools['pool.builders'] = 1
    const store = aliases.resolve('inv.project.store', 'esfp-f')
    economy.runner.run({ type: 'addStock', inventory: store, good: 'lumber', units: 10 })
    r.run({ type: 'credit', holder: 'esfp-f', amount: 10 })
    const proj = r.run<string>({ type: 'startProject', kind: 'renovate', target: port.bindings['port.bakery'].buildings[0], account: 'esfp-f',
      inventory: 'inv.project.store', pool: 'pool.builders', wage: 1, labourHours: 10, materials: [{ material: 'lumber', units: 5 }], plan: { addFixtures: ['smokehouse'] } })
    runDay(r, economy.runner)
    expect(r.state.projects[proj].status).toBe('done')
    expect(economy.runner.state.inventories[store].stock.lumber).toBe(5)
    expect(aliases.has('esfp-f')).toBe(false)
    // the project's wage is one row from its account (the cook also earns her butcher post's wage that day)
    expect(ledger(r.state, { kind: 'wage', subject: proj }).map((row) => [row.from, row.amount])).toEqual([['esfp-f', 1]])
  })
})

describe('I2 thirty autonomous days of the port with both engines', () => {
  it('every day: days aligned, no negative stock, money conserved, prices finite, production agreed; the whole run replays', () => {
    const run = thirtyDays((n, day, w) => {
      const e = w.economy.runner
      const s = w.port.runner
      expect(day).toBe(n)
      expect(e.state.day).toBe(s.state.settlement.day)
      for (const entry of Object.values(e.state.inventories)) for (const units of Object.values(entry.stock)) expect(units).toBeGreaterThan(0)
      expect(totalMoney(s.state)).toBeCloseTo(w.moneyAtStart)
      for (const good of Object.values(e.state.markets['stl.port'].goods)) if (good.price !== null) expect(Number.isFinite(good.price)).toBe(true)
      const lines = w.reader.production(w.biz, day)!
      expect(producedLast(e.state, 'stl.port', 'fresh-meat')).toBe(lines[0].q)
      expect(producedLast(e.state, 'stl.port', 'salt-fish')).toBe(lines[1].q)
    })
    const { e, s, biz, inv, loaded, meatAtStart, soldDays } = run
    expect(soldDays).toBeGreaterThan(10)
    // the inputs ran out part way: the shop is staffed but no longer producing, and said so through a status change
    expect(s.state.businesses[biz].status).toBe('staffed')
    expect(e.state.inventories[inv].stock['cattle-and-hogs']).toBeUndefined()
    // meat is conserved: what was cattle is now meat sold, eaten, or on the market shelf
    const eaten = e.events.filter((ev) => ev.type === 'consumed' && ev.good === 'fresh-meat').reduce((sum, ev) => sum + (ev as { units: number }).units, 0)
    expect(meatAtStart).toBeCloseTo(totalUnits(e.state, 'fresh-meat') + eaten)
    expect(marketStock(e.state, 'stl.port', 'fresh-meat')).toBeGreaterThanOrEqual(0)
    // the books: sales in, wages out, and the shop's balance is exactly what the ledger says
    const view = accounts(e.state, e.config, e.providers.ledger, biz, 0, 30)
    expect(view.revenue).toBeGreaterThan(0)
    expect(view.wages).toBe(2 * 30)
    expect(view.otherIn).toBe(100)
    expect(balanceOf(s.state, biz)).toBeCloseTo(view.profit)
    // the economy's whole run replays byte for byte from the loaded catalogue
    const again = EconomyRunner.replay(e.log, e.config, economyStubs(), loaded)
    expect(JSON.stringify(again.state)).toBe(JSON.stringify(e.state))
  })
})
