// Toolchain/economy/TESTS.md I1, I1b and I2: the economy engine behind the settlement engine's providers, in the
// pirate port, with the alignment engine untouched (the settlement tests hold that guard). The setup and the
// thirty-day run are in ./fixture.ts, shared with the golden capture.
import { describe, expect, it, vi } from 'vitest'
import { Runner as EconomyRunner, accounts, marketStock, producedLast, stubProviders as economyStubs, totalUnits } from '@rex/economy'
import { balanceOf, ledger, totalMoney } from '@rex/settlement'
import { THIRTY_DAY_CONFIG, thirtyDays, world } from './fixture'
import { runDay, type PortLabour } from './index'
import type { LedgerTransferGoods } from './providers'

type LedgerTransfer = (
  from: string, to: string, amount: number, kind: string, subject: string | null, note?: string, goods?: LedgerTransferGoods,
) => string

describe('I1 the port\'s butcher produces into an economy inventory through the material provider', () => {
  it('one settlement day: Q is Settlement\'s, the stock move is the economy\'s, and both agree', () => {
    const { economy, loaded, port, reader, biz, inv } = world()
    expect(economy.counts.goods).toBeGreaterThan(200)
    expect(economy.counts.recipes).toBe(2)
    expect(economy.unquantified.length).toBeGreaterThan(200)
    expect(economy.runner.state.inventories[inv]).toMatchObject({ holder: biz })
    expect(port.runner.state.businesses[biz].inventory).toBe(inv)
    const logged = economy.runner.log.length
    runDay(port.runner, economy.runner)
    // one butcher, ten hours, 2.5 person-hours a unit: four units of meat, then no labour left for the fish line
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
    expect(reader.businesses('stl.port').find((b) => b.id === biz)).toMatchObject({ inventory: inv, status: 'producing', open: true })
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

describe('I1b a project draws from its own inventory through its own economy inventory (CONTRACTS §15, DUP-44)', () => {
  it('materials come from the project\'s inventory ref, wages from its account, and the account is never an inventory', () => {
    const { economy, port } = world()
    const r = port.runner
    ;(r.providers.labour as PortLabour).pools['pool.builders'] = { persons: 1 }
    const store = economy.runner.run({ type: 'openInventory', holder: 'esfp-f', market: economy.marketId }).minted!
    economy.runner.run({ type: 'addStock', inventory: store, good: 'lumber', units: 10 })
    r.run({ type: 'credit', holder: 'esfp-f', amount: 10 })
    const proj = r.run<string>({ type: 'startProject', kind: 'renovate', target: port.bindings['port.bakery'].buildings[0], account: 'esfp-f',
      inventory: store, pool: 'pool.builders', wage: 1, labourHours: 10, materials: [{ material: 'lumber', units: 5 }], plan: { addFixtures: ['smokehouse'] } })
    runDay(r, economy.runner)
    expect(r.state.projects[proj].status).toBe('done')
    expect(economy.runner.state.inventories[store].stock.lumber).toBe(5)
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

describe('I1c the material queries are pure (CONTRACTS §17)', () => {
  it('available and have on an inventory change no state and log nothing; an unknown id throws as the economy does', () => {
    const { economy, port, inv } = world()
    const materials = port.runner.providers.materials
    const before = JSON.stringify(economy.runner.state)
    const logged = economy.runner.log.length
    expect(materials.available(inv, 'preserving-salt-fish')).toBe(50)
    expect(materials.have(inv, 'salt')).toBe(50)
    expect(materials.rates('preserving-salt-fish')).toEqual(materials.rates('preserving-salt-fish'))
    expect(() => materials.available('inv.port.unseen', 'preserving-salt-fish')).toThrow(/unknown inventory/)
    expect(() => materials.have('inv.port.unseen', 'salt')).toThrow(/unknown inventory/)
    expect(JSON.stringify(economy.runner.state)).toBe(before)
    expect(economy.runner.log.length).toBe(logged)
    expect(materials.take(inv, 'salt', 1)).toBe(1)
    expect(economy.runner.log.length).toBeGreaterThan(logged)
  })
})

function stubGoodsLedger(initial: Record<string, Record<string, number>> = { stall: { fish: 10 }, bag: { fish: 0 } }) {
  let stock = structuredClone(initial)
  const check = (account: string, good: string) => {
    if (!stock[account] || !(good in stock[account])) throw new Error('unknown inventory or good')
    return stock[account]
  }
  const apply = vi.fn((account: string, good: string, delta: number) => {
    const row = check(account, good)
    if (row[good] + delta < 0) throw new Error('insufficient stock')
    row[good] += delta
  })
  const ledger = {
    id: 'test.goods',
    unit(account: string, good: string) { check(account, good); return 'count' as const },
    apply,
    snapshot() { return structuredClone(stock) },
    restore(snapshot: typeof stock) { stock = structuredClone(snapshot) },
  }
  return { ledger, stock: () => structuredClone(stock) }
}

describe('settlementLedger goods', () => {
  it('with goods, one transfer moves money and stock and logs plain goods data only', () => {
    const { economy, port, biz } = world()
    const goods = stubGoodsLedger()
    const ledgerProv = economy.runner.providers.ledger
    const payerBefore = balanceOf(port.runner.state, biz)
    const payeeBefore = balanceOf(port.runner.state, 'esfp-f')
    const stockBefore = goods.stock()
    const logged = port.runner.log.length
    const transfer = ledgerProv.transfer as LedgerTransfer
    const txn = transfer(biz, 'esfp-f', 5, 'purchase', 'fish', 'market', {
      ledger: goods.ledger, from: 'stall', to: 'bag', good: 'fish', units: 3,
    })
    expect(txn).toMatch(/^txn\./)
    expect(balanceOf(port.runner.state, biz)).toBe(payerBefore - 5)
    expect(balanceOf(port.runner.state, 'esfp-f')).toBe(payeeBefore + 5)
    expect(goods.stock()).toEqual({ stall: { fish: 7 }, bag: { fish: 3 } })
    expect(goods.stock().stall.fish + goods.stock().bag.fish).toBe(stockBefore.stall.fish + stockBefore.bag.fish)
    const cmd = port.runner.log[port.runner.log.length - 1]
    expect(cmd.type).toBe('pay')
    expect(JSON.parse(JSON.stringify(cmd))).toEqual({
      type: 'pay', from: biz, to: 'esfp-f', amount: 5, kind: 'purchase', subject: 'fish', note: 'market',
      goods: { from: 'stall', to: 'bag', good: 'fish', units: 3 },
    })
    expect(port.runner.log.length).toBe(logged + 1)
  })

  it('with insufficient stock, transfer throws and settlement balances and stub stock stay unchanged', () => {
    const { economy, port, biz } = world()
    const goods = stubGoodsLedger()
    const ledgerProv = economy.runner.providers.ledger
    const balances = structuredClone(port.runner.state.accounts)
    const stock = goods.stock()
    const transfer = ledgerProv.transfer as LedgerTransfer
    expect(() => transfer(biz, 'esfp-f', 5, 'purchase', 'fish', 'market', {
      ledger: goods.ledger, from: 'stall', to: 'bag', good: 'fish', units: 11,
    })).toThrow('insufficient stock')
    expect(port.runner.state.accounts).toEqual(balances)
    expect(goods.stock()).toEqual(stock)
  })

  it('without goods, transfer matches a direct pay (txn shape and balances)', () => {
    const { economy: economy2, port: port2, biz: biz2 } = world()
    const txn = economy2.runner.providers.ledger.transfer(biz2, 'esfp-f', 5, 'dividend', null, 'test')
    expect(txn).toMatch(/^txn\./)
    const { port, biz } = world()
    const direct = port.runner.run<string>({ type: 'pay', from: biz, to: 'esfp-f', amount: 5, kind: 'dividend', subject: null, note: 'test' })
    expect(txn.length).toBe(direct.length)
    expect(balanceOf(port2.runner.state, biz2)).toBe(balanceOf(port.runner.state, biz))
    expect(balanceOf(port2.runner.state, 'esfp-f')).toBe(balanceOf(port.runner.state, 'esfp-f'))
    const cmd = port2.runner.log[port2.runner.log.length - 1]
    expect(JSON.parse(JSON.stringify(cmd))).toEqual({ type: 'pay', from: biz2, to: 'esfp-f', amount: 5, kind: 'dividend', subject: null, note: 'test' })
    expect('goods' in cmd).toBe(false)
  })
})

describe('settlementLedger currencies', () => {
  it('balance(holder, pieces) reads the pieces balance, and is 0 for one never moved', () => {
    const { economy, port, biz } = world()
    economy.runner.run({ type: 'defineCurrency', currency: { id: 'pieces' } })
    const ledgerProv = economy.runner.providers.ledger
    expect(ledgerProv.balance('nobody', 'pieces')).toBe(0)
    expect(ledgerProv.balance(biz, 'pieces')).toBe(0)
    port.runner.run({ type: 'credit', holder: biz, amount: 12, currency: 'pieces', process: 'test.fund' })
    expect(ledgerProv.balance(biz, 'pieces')).toBe(12)
  })

  it('exchange with one money leg, one pieces leg and one goods leg moves all three in one call, and returns two row ids sharing a batch', () => {
    const { economy, port, biz } = world()
    economy.runner.run({ type: 'defineCurrency', currency: { id: 'pieces' } })
    const goods = stubGoodsLedger()
    const ledgerProv = economy.runner.providers.ledger
    port.runner.run({ type: 'credit', holder: biz, amount: 20, currency: 'pieces', process: 'test.fund' })
    const moneyBeforeBiz = balanceOf(port.runner.state, biz)
    const moneyBeforePayee = balanceOf(port.runner.state, 'esfp-f')
    const piecesBefore = ledgerProv.balance(biz, 'pieces')
    const stockBefore = goods.stock()
    const logged = port.runner.log.length
    const ids = ledgerProv.exchange!(
      {
        money: [
          { from: biz, to: 'esfp-f', currency: 'money', amount: 5 },
          { from: biz, to: 'esfp-f', currency: 'pieces', amount: 3 },
        ],
        goods: [{ from: 'stall', to: 'bag', good: 'fish', units: 2 }],
      },
      'purchase', 'fish', 'market', goods.ledger,
    )
    expect(ids).toHaveLength(2)
    expect(new Set(ids).size).toBe(2)
    const rows = port.runner.state.ledger.filter((row) => ids.includes(row.id))
    expect(rows).toHaveLength(2)
    expect(rows.every((row) => row.batch === ids[0])).toBe(true)
    expect(balanceOf(port.runner.state, biz)).toBe(moneyBeforeBiz - 5)
    expect(balanceOf(port.runner.state, 'esfp-f')).toBe(moneyBeforePayee + 5)
    expect(ledgerProv.balance(biz, 'pieces')).toBe(piecesBefore - 3)
    expect(ledgerProv.balance('esfp-f', 'pieces')).toBe(3)
    expect(goods.stock()).toEqual({ stall: { fish: 8 }, bag: { fish: 2 } })
    expect(goods.stock().stall.fish + goods.stock().bag.fish).toBe(stockBefore.stall.fish + stockBefore.bag.fish)
    expect(port.runner.log.length).toBe(logged + 1)
    const cmd = port.runner.log[port.runner.log.length - 1]
    expect(cmd.type).toBe('pay')
    expect(JSON.parse(JSON.stringify(cmd))).toEqual({
      type: 'pay', kind: 'purchase', subject: 'fish', note: 'market',
      legs: {
        money: [
          { from: biz, to: 'esfp-f', currency: 'money', amount: 5 },
          { from: biz, to: 'esfp-f', currency: 'pieces', amount: 3 },
        ],
        goods: [{ from: 'stall', to: 'bag', good: 'fish', units: 2 }],
      },
    })
  })

  it('exchange with goods only (barter) returns [] and moves the goods; with stock short it throws, and both balances and the stub stock are unchanged', () => {
    const { economy, port, biz } = world()
    economy.runner.run({ type: 'defineCurrency', currency: { id: 'pieces' } })
    const goods = stubGoodsLedger()
    const ledgerProv = economy.runner.providers.ledger
    port.runner.run({ type: 'credit', holder: biz, amount: 10, currency: 'pieces', process: 'test.fund' })
    const ids = ledgerProv.exchange!(
      { money: [], goods: [{ from: 'stall', to: 'bag', good: 'fish', units: 1 }] },
      'barter', null, '', goods.ledger,
    )
    expect(ids).toEqual([])
    expect(goods.stock()).toEqual({ stall: { fish: 9 }, bag: { fish: 1 } })
    const accounts = structuredClone(port.runner.state.accounts)
    const ledgerSnap = structuredClone(port.runner.state.ledger)
    const stock = goods.stock()
    expect(() => ledgerProv.exchange!(
      { money: [], goods: [{ from: 'stall', to: 'bag', good: 'fish', units: 11 }] },
      'barter', null, '', goods.ledger,
    )).toThrow('insufficient stock')
    expect(port.runner.state.accounts).toEqual(accounts)
    expect(port.runner.state.ledger).toEqual(ledgerSnap)
    expect(goods.stock()).toEqual(stock)
    expect(ledgerProv.balance(biz, 'pieces')).toBe(10)
  })
})

describe('I4 the wage quote reaches Post.wage through setWage only (CONTRACTS §16)', () => {
  it('I4a the default rule issues no setWage and the ledger stays as it is', () => {
    const { s } = thirtyDays()
    expect(s.log.filter((command) => command.type === 'setWage')).toEqual([])
    expect(ledger(s.state, { kind: 'wage' }).every((row) => row.amount === 2)).toBe(true)
  })

  it('I4b a pressure rule with a pool too small for the posts: every wage change follows a setWage and the ledger pays Post.wage', () => {
    const config = { ...THIRTY_DAY_CONFIG, wageRule: { kind: 'ratio', elasticity: 0.5, floor: 0.5, ceiling: 2 } } as const
    const wageOf: Record<string, number>[] = []
    const run = thirtyDays((n, _day, w) => {
      const r = w.port.runner
      if (n === 0) {
        // two unfilled butcher posts and one person in the pool: demand outruns supply
        for (let i = 0; i < 2; i++) r.run({ type: 'addPost', biz: w.biz, role: 'butcher', wage: 2 })
        ;(r.providers.labour as PortLabour).pools['pool.housing'] = { persons: 1 }
      }
      wageOf.push(Object.fromEntries(Object.values(r.state.posts).map((post) => [post.id, post.wage])))
    }, 30, config)
    const { s } = run
    const sets = s.log.filter((command) => command.type === 'setWage')
    expect(sets.length).toBeGreaterThan(0)
    // a post's wage moves between two days only if a setWage for it was logged (the day's wages step reads Post.wage)
    let moved = 0
    for (const id of Object.keys(wageOf[wageOf.length - 1])) {
      let moves = 0
      for (let d = 1; d < wageOf.length; d++) if (id in wageOf[d - 1] && wageOf[d][id] !== wageOf[d - 1][id]) moves++
      expect(moves).toBeLessThanOrEqual(sets.filter((c) => c.type === 'setWage' && c.post === id).length)
      moved += moves
    }
    expect(moved).toBeGreaterThan(0)
    // each day's wage rows are the post's wage at that day's wages step
    const butcher = Object.values(s.state.posts).find((post) => post.filledBy === 'esfp-f')!.id
    const rows = ledger(s.state, { kind: 'wage', to: 'esfp-f' })
    expect(rows.length).toBeGreaterThan(0)
    for (const row of rows) expect(row.amount).toBeCloseTo(wageOf[row.day][butcher])
    expect(totalMoney(s.state)).toBeCloseTo(run.moneyAtStart)
  })
})
