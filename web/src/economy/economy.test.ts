// Toolchain/economy/TESTS.md I1 and I2: the economy engine behind the settlement engine's providers, in the pirate
// port, with the alignment engine untouched (the settlement tests hold that guard). Every number here is a fixture:
// recipe quantities, market numbers, wages and stock are not game data yet (GOODS.md "Open for Rex", Settlement Q10).
import { describe, expect, it } from 'vitest'
import { Runner as EconomyRunner, accounts, defaultConfig as economyDefaults, marketStock, producedLast, stubProviders as economyStubs, totalUnits, type EconomyConfig } from '@rex/economy'
import { balanceOf, stubProviders as settlementStubs, totalMoney } from '@rex/settlement'
import { loadPort } from '../settlement'
import { Aliases, economyProvidersOver, loadEconomy, runDay, settlementProvidersOver, settlementReader, type RecipeQuantities } from './index'

/** Fixture quantities for the two recipes the butcher shop runs (the data has none yet). */
const QUANTITIES: RecipeQuantities = {
  'butchering-fresh-meat': { yield: 1, inputs: {}, inputsAny: [1], byproducts: { 'raw-hides': 0.2, tallow: 0.1 }, rates: { unitsPerFixtureDay: 10, labourPerUnit: 0.25 } },
  'preserving-salt-fish': { yield: 1, inputs: { 'fresh-fish': 1, salt: 0.5 }, rates: { unitsPerFixtureDay: 8, labourPerUnit: 0.25 } },
}

function world(config: EconomyConfig = economyDefaults()) {
  const econStubs = economyStubs()
  const economy = loadEconomy(QUANTITIES, { providers: econStubs, config })
  const loaded = structuredClone(economy.runner.state)
  const aliases = new Aliases(economy.runner, economy.marketId)
  const base = settlementStubs()
  base.labour.pools['pool.housing'] = 5
  const port = loadPort(settlementProvidersOver(economy.runner, aliases, economy.marketId, base))
  economy.runner.providers = economyProvidersOver(port.runner, econStubs)
  const reader = settlementReader(port.runner)
  // the butcher shop: two lines, one butcher, a purse; its inputs land in the economy inventory behind its ref
  const shop = port.bindings['port.bakery']
  const biz = shop.businesses[0]
  const r = port.runner
  r.run({ type: 'setLines', biz, lines: [{ recipe: 'butchering-fresh-meat', equipment: [] }, { recipe: 'preserving-salt-fish', equipment: [] }] })
  const post = r.run<string>({ type: 'addPost', biz, role: 'butcher', wage: 2 })
  r.run({ type: 'hire', post, holder: 'esfp-f' })
  r.run({ type: 'credit', holder: biz, amount: 100 })
  const inv = aliases.resolve(r.state.businesses[biz].inventory, biz)
  for (const [good, units] of [['cattle-and-hogs', 50], ['fresh-fish', 50], ['salt', 50]] as const) economy.runner.run({ type: 'addStock', inventory: inv, good, units })
  return { economy, loaded, aliases, port, reader, biz, inv, econStubs }
}

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

describe('I2 thirty autonomous days of the port with both engines', () => {
  it('every day: days aligned, no negative stock, money conserved, prices finite, production agreed; the whole run replays', () => {
    const config: EconomyConfig = { ...economyDefaults(), priceRule: { kind: 'shortage-linear', low: 0.7, high: 3 } }   // a fixture curve, not Rex's
    const { economy, loaded, port, reader, biz, inv } = world(config)
    const e = economy.runner
    const s = port.runner
    e.run({ type: 'setMarketGood', market: 'stl.port', good: 'fresh-meat', consumptionPerDay: 3, targetReserve: 20, basePrice: 2 })
    e.run({ type: 'setMarketGood', market: 'stl.port', good: 'salt-fish', consumptionPerDay: 2, targetReserve: 10, basePrice: 3 })
    s.run({ type: 'credit', holder: 'stl.port', amount: 1000 })                                 // the market's purse
    const moneyAtStart = totalMoney(s.state)
    const meatAtStart = totalUnits(e.state, 'cattle-and-hogs') + totalUnits(e.state, 'fresh-meat')
    let soldDays = 0
    for (let n = 0; n < 30; n++) {
      // the host's policy (a fixture): the shop sells yesterday's finished goods to the market before the day begins
      for (const good of ['fresh-meat', 'salt-fish']) {
        const units = e.state.inventories[inv].stock[good] ?? 0
        if (units > 0) { e.run({ type: 'sell', inventory: inv, good, units }); soldDays++ }
      }
      const day = runDay(s, e)
      expect(day).toBe(n)
      expect(e.state.day).toBe(s.state.settlement.day)
      for (const entry of Object.values(e.state.inventories)) for (const units of Object.values(entry.stock)) expect(units).toBeGreaterThan(0)
      expect(totalMoney(s.state)).toBeCloseTo(moneyAtStart)
      for (const good of Object.values(e.state.markets['stl.port'].goods)) if (good.price !== null) expect(Number.isFinite(good.price)).toBe(true)
      const lines = reader.production(biz, day)!
      expect(producedLast(e.state, 'stl.port', 'fresh-meat')).toBe(lines[0].q)
      expect(producedLast(e.state, 'stl.port', 'salt-fish')).toBe(lines[1].q)
    }
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
