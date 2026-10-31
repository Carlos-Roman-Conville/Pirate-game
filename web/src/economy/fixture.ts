/**
 * The shared fixture of the economy adapter's tests (Toolchain/economy/TESTS.md I1, I1b, I2) and of the golden
 * capture: the port with both engines, the butcher shop's two lines, and the thirty-day run. Every number here is a
 * fixture: recipe quantities, market numbers, wages and stock are not game data yet (GOODS.md "Open for Rex",
 * Settlement Q10). Tests import it; nothing in the game does.
 */
import { defaultConfig as economyDefaults, marketStock, stubProviders as economyStubs, totalUnits, type EconomyConfig } from '@rex/economy'
import { balanceOf, stubProviders as settlementStubs, totalMoney } from '@rex/settlement'
import { loadPort } from '../settlement'
import { economyProvidersOver, loadEconomy, portLabour, runDay, settlementProvidersOver, settlementReader, type RecipeQuantities } from './index'

/** Fixture quantities for the two recipes the butcher shop runs (the data has none yet). */
export const QUANTITIES: RecipeQuantities = {
  'butchering-fresh-meat': { yield: 1, inputs: {}, inputsAny: [1], byproducts: { 'raw-hides': 0.2, tallow: 0.1 }, rates: { unitsPerFixtureDay: 10, labourHoursPerUnit: 2.5 } },
  'preserving-salt-fish': { yield: 1, inputs: { 'fresh-fish': 1, salt: 0.5 }, rates: { unitsPerFixtureDay: 8, labourHoursPerUnit: 2.5 } },
}

export function world(config: EconomyConfig = economyDefaults()) {
  const econStubs = economyStubs()
  const economy = loadEconomy(QUANTITIES, { providers: econStubs, config })
  const loaded = structuredClone(economy.runner.state)
  const base = settlementStubs()
  const labour = portLabour({ 'pool.housing': { persons: 5 } })
  const port = loadPort(settlementProvidersOver(economy.runner, economy.marketId, base, labour), undefined, undefined, {
    inventoryOf: (_place, biz) => economy.runner.run({ type: 'openInventory', holder: biz, market: economy.marketId }).minted!,
  })
  economy.runner.providers = economyProvidersOver(port.runner, econStubs, labour)
  const reader = settlementReader(port.runner)
  // the butcher shop: two lines, one butcher, a purse; its inputs land in the inventory Settlement holds on it
  const shop = port.bindings['port.bakery']
  const biz = shop.businesses[0]
  const r = port.runner
  r.run({ type: 'setLines', biz, lines: [{ recipe: 'butchering-fresh-meat', equipment: [] }, { recipe: 'preserving-salt-fish', equipment: [] }] })
  const post = r.run<string>({ type: 'addPost', biz, role: 'butcher', wage: 2 })
  r.run({ type: 'hire', post, holder: 'esfp-f' })
  r.run({ type: 'credit', holder: biz, amount: 100 })
  const inv = r.state.businesses[biz].inventory
  for (const [good, units] of [['cattle-and-hogs', 50], ['fresh-fish', 50], ['salt', 50]] as const) economy.runner.run({ type: 'addStock', inventory: inv, good, units })
  return { economy, loaded, port, reader, biz, inv, econStubs }
}

/** I2's price curve: a fixture curve, not Rex's. */
export const THIRTY_DAY_CONFIG: EconomyConfig = { ...economyDefaults(), priceRule: { kind: 'shortage-linear', low: 0.7, high: 3 } }

export type World = ReturnType<typeof world>

/** What one day of the run looked like, after both ticks. */
export interface DayRow {
  day: number
  sold: Record<string, number>                       // units the shop sold to the market before the day began
  production: { recipe: string; q: number }[]        // Settlement's record for the day
  producedLast: Record<string, number>               // the economy's record of the same
  price: Record<string, number | null>               // the market's price after the economy's tick
  marketStock: Record<string, number>
  shopStock: Record<string, number>
  balances: Record<string, number>                   // the shop and the market, from Settlement's ledger
  totalMoney: number
  status: string                                     // the shop's business status
}

const GOODS = ['fresh-meat', 'salt-fish'] as const

/**
 * I2's thirty autonomous days. The host's policy (a fixture): the shop sells yesterday's finished goods to the
 * market before the day begins; then Settlement ticks, then the economy (`runDay`). `onDay` runs after each day,
 * where I2 makes its per-day checks.
 */
export function thirtyDays(onDay?: (n: number, day: number, w: World & { moneyAtStart: number }) => void, days = 30, config: EconomyConfig = THIRTY_DAY_CONFIG) {
  const w = world(config)
  const e = w.economy.runner
  const s = w.port.runner
  e.run({ type: 'setMarketGood', market: 'stl.port', good: 'fresh-meat', consumptionPerDay: 3, targetReserve: 20, basePrice: 2 })
  e.run({ type: 'setMarketGood', market: 'stl.port', good: 'salt-fish', consumptionPerDay: 2, targetReserve: 10, basePrice: 3 })
  s.run({ type: 'credit', holder: 'stl.port', amount: 1000 })                                 // the market's purse
  const moneyAtStart = totalMoney(s.state)
  const meatAtStart = totalUnits(e.state, 'cattle-and-hogs') + totalUnits(e.state, 'fresh-meat')
  let soldDays = 0
  const rows: DayRow[] = []
  for (let n = 0; n < days; n++) {
    const sold: Record<string, number> = {}
    for (const good of GOODS) {
      const units = e.state.inventories[w.inv].stock[good] ?? 0
      if (units > 0) { e.run({ type: 'sell', inventory: w.inv, good, units }); soldDays++; sold[good] = units }
    }
    const day = runDay(s, e)
    onDay?.(n, day, { ...w, moneyAtStart })
    const goods = e.state.markets['stl.port'].goods
    rows.push({
      day, sold,
      production: (w.reader.production(w.biz, day) ?? []).map((line) => ({ recipe: line.recipe, q: line.q })),
      producedLast: Object.fromEntries(GOODS.map((good) => [good, goods[good]?.producedLast ?? 0])),
      price: Object.fromEntries(GOODS.map((good) => [good, goods[good]?.price ?? null])),
      marketStock: Object.fromEntries(GOODS.map((good) => [good, marketStock(e.state, 'stl.port', good)])),
      shopStock: { ...e.state.inventories[w.inv].stock },
      balances: { [w.biz]: balanceOf(s.state, w.biz), 'stl.port': balanceOf(s.state, 'stl.port') },
      totalMoney: totalMoney(s.state),
      status: s.state.businesses[w.biz].status,
    })
  }
  return { ...w, e, s, moneyAtStart, meatAtStart, soldDays, rows }
}
