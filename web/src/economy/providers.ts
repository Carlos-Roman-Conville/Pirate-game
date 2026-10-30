/**
 * The bindings between the two engines, exactly as Toolchain/economy/CONTRACTS.md (= Toolchain/settlement/CONTRACTS.md)
 * says, and nowhere else: Settlement's MaterialProvider and PriceProvider implemented from the economy runner (§4a),
 * the economy's LedgerProvider implemented from the settlement runner (§3: money has one home, Settlement's ledger),
 * the SettlementReader over settlement state (§4b), and the day order (§9). Neither engine imports the other.
 */
import { Runner as EconomyRunner, availableUnits, price, type LedgerProvider, type LedgerRow, type Providers as EconomyProviders, type SettlementReader } from '@rex/economy'
import { Runner as SettlementRunner, balanceOf, hasFixture, ledger, stubProviders as settlementStubs, type MaterialProvider, type PriceProvider, type Providers as SettlementProviders } from '@rex/settlement'

/**
 * Settlement's loader hands each business a placeholder inventory ref (`inv.port.<place>`, load.ts) until it asks
 * the economy for one (CONTRACTS §2). Until then the alias table maps each ref to an economy inventory minted on
 * first use, so neither loader changes. A ref that is already an economy inventory id passes through.
 */
export class Aliases {
  private readonly table = new Map<string, string>()
  private readonly economy: EconomyRunner
  private readonly marketId: string
  constructor(economy: EconomyRunner, marketId: string) { this.economy = economy; this.marketId = marketId }
  /** The economy inventory behind a settlement ref, opened for `holder` on first use. */
  resolve(ref: string, holder = ref): string {
    if (ref in this.economy.state.inventories) return ref
    let id = this.table.get(ref)
    if (!id) {
      id = this.economy.run({ type: 'openInventory', holder, market: this.marketId }).minted!
      this.table.set(ref, id)
    }
    return id
  }
  has(ref: string): boolean { return ref in this.economy.state.inventories || this.table.has(ref) }
  entries(): [string, string][] { return [...this.table.entries()] }
}

/** CONTRACTS §4a: Settlement's MaterialProvider from the economy; every call is a logged economy command. */
export function economyMaterials(economy: EconomyRunner, aliases: Aliases): MaterialProvider {
  return {
    available: (inventory, recipe) => availableUnits(economy.state, aliases.resolve(inventory), recipe),
    produce: (inventory, recipe, units) => { economy.run({ type: 'produce', inventory: aliases.resolve(inventory), recipe, units }) },
    have: (inventory, material) => economy.state.inventories[aliases.resolve(inventory)].stock[material] ?? 0,
    take: (inventory, material, units) => economy.run({ type: 'take', inventory: aliases.resolve(inventory), good: material, units }).taken ?? 0,
    rates: (recipe) => {
      const def = economy.state.recipes[recipe]
      if (!def) throw new Error(`unknown recipe: ${recipe}`)
      // CONTRACTS §16, during the switch to person-hours: both fields, each derived from the other when only one is
      // stored (the economy keeps rates as given). Settlement reads labourPerUnit until its unit 2617.
      const perDay = economy.config.legacyHoursPerWorkerDay
      const hours = def.rates.labourHoursPerUnit ?? def.rates.labourPerUnit! * perDay
      const rates = { unitsPerFixtureDay: def.rates.unitsPerFixtureDay, labourPerUnit: def.rates.labourPerUnit ?? hours / perDay, labourHoursPerUnit: hours }
      return rates
    },
  }
}

/** CONTRACTS §4a: goods only. A title, building or parcel is refused: who values property is open (§12 item 3). */
export function economyPrices(economy: EconomyRunner, marketId: string): PriceProvider {
  return {
    valueOf: (subject) => {
      if (!(subject in economy.state.goods)) throw new Error(`valueOf(${subject}): property valuation is open for Rex (CONTRACTS §12 item 3)`)
      const p = price(economy.state, economy.config, marketId, subject)
      if (p === null) throw new Error(`no price for ${subject} in ${marketId}: basePrice is open`)
      return p
    },
  }
}

/** CONTRACTS §3: the economy's LedgerProvider over Settlement's accounts, one implementation (§13e). */
export function settlementLedger(settlement: SettlementRunner): LedgerProvider {
  return {
    balance: (holder) => balanceOf(settlement.state, holder),
    transfer: (from, to, amount, kind, subject, note = '') => settlement.run<string>({ type: 'pay', from, to, amount, kind, subject, note }),
    rows: (holder, fromDay, toDay): LedgerRow[] => ledger(settlement.state, { holder, fromDay, toDay }),
  }
}

/** CONTRACTS §4b: the read-only view of the settlement, one market per SettlementState. */
export function settlementReader(settlement: SettlementRunner, options: { activeOnly?: boolean } = {}): SettlementReader {
  const mine = (market: string) => market === settlement.state.settlement.id
  return {
    businesses: (market) => mine(market)
      ? Object.values(settlement.state.businesses).map((biz) => ({ id: biz.id, inventory: biz.inventory, account: biz.account, status: biz.status, open: biz.open }))
      : [],
    posts: (market) => mine(market)
      ? Object.values(settlement.state.posts).map((post) => ({ id: post.id, biz: post.biz, role: post.role, wage: post.wage, hours: post.hours, filledBy: post.filledBy }))
      : [],
    production: (biz, day) => {
      const record = settlement.state.production[biz]
      return record && record.day === day ? record.lines.map((line) => ({ recipe: line.recipe, q: line.q })) : null
    },
    hasFixture: (market, fixture) => mine(market) && hasFixture(settlement.state, null, fixture, { activeOnly: options.activeOnly ?? false }),
  }
}

/** Settlement's full provider set with the economy behind materials and prices; labour and utilities stay the host's
 *  (stubs here until a population model and realism supply them). */
export function settlementProvidersOver(economy: EconomyRunner, aliases: Aliases, marketId: string, base: SettlementProviders = settlementStubs()): SettlementProviders {
  return { ...base, materials: economyMaterials(economy, aliases), prices: economyPrices(economy, marketId) }
}

/** The economy's provider set with Settlement behind the ledger; population, labour supply and transport stay the host's. */
export function economyProvidersOver(settlement: SettlementRunner, base: EconomyProviders): EconomyProviders {
  return { ...base, ledger: settlementLedger(settlement) }
}

/**
 * CONTRACTS §9: one day. The host calls settlement.tick while settlement.day === N (it increments at the end), then
 * economy.tick(N); the reader is read in between by whoever needs it. Returns N. Throws if the two days disagree.
 */
export function runDay(settlement: SettlementRunner, economy: EconomyRunner): number {
  const day = settlement.state.settlement.day
  if (economy.state.day !== day) throw new Error(`day mismatch: settlement ${day}, economy ${economy.state.day}`)
  settlement.tick()
  economy.run({ type: 'tick' })
  return day
}
