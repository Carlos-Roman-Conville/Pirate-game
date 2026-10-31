/**
 * The bindings between the two engines, exactly as Toolchain/economy/CONTRACTS.md (= Toolchain/settlement/CONTRACTS.md)
 * says, and nowhere else: Settlement's MaterialProvider and PriceProvider implemented from the economy runner (§4a),
 * the economy's LedgerProvider implemented from the settlement runner (§3: money has one home, Settlement's ledger),
 * the SettlementReader over settlement state (§4b), and the day order (§9). Neither engine imports the other.
 */
import { Runner as EconomyRunner, availableUnits, price, type LabourRow, type LabourSupply, type LedgerProvider, type LedgerRow, type Providers as EconomyProviders, type SettlementReader } from '@rex/economy'
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
  /** The economy inventory behind a ref without minting one (queries must be pure, CONTRACTS §17); null if unseen. */
  peek(ref: string): string | null {
    if (ref in this.economy.state.inventories) return ref
    return this.table.get(ref) ?? null
  }
  has(ref: string): boolean { return ref in this.economy.state.inventories || this.table.has(ref) }
  entries(): [string, string][] { return [...this.table.entries()] }
}

/** CONTRACTS §4a: Settlement's MaterialProvider from the economy; every call is a logged economy command. */
export function economyMaterials(economy: EconomyRunner, aliases: Aliases): MaterialProvider {
  return {
    // Queries read without minting (pure, CONTRACTS §17): an unseen ref is an empty inventory, which allows a recipe
    // with no inputs without limit and nothing else. Only produce and take mint an inventory for a new ref.
    available: (inventory, recipe) => {
      const id = aliases.peek(inventory)
      if (id) return availableUnits(economy.state, id, recipe)
      const def = economy.state.recipes[recipe]
      if (!def) throw new Error(`unknown recipe: ${recipe}`)
      return def.inputs.some((q) => q.units > 0) || def.inputsAny.some((g) => g.units > 0) ? 0 : Number.POSITIVE_INFINITY
    },
    produce: (inventory, recipe, units) => { economy.run({ type: 'produce', inventory: aliases.resolve(inventory), recipe, units }) },
    have: (inventory, material) => {
      const id = aliases.peek(inventory)
      return id ? economy.state.inventories[id].stock[material] ?? 0 : 0
    },
    take: (inventory, material, units) => economy.run({ type: 'take', inventory: aliases.resolve(inventory), good: material, units }).taken ?? 0,
    rates: (recipe) => {
      const def = economy.state.recipes[recipe]
      if (!def) throw new Error(`unknown recipe: ${recipe}`)
      // CONTRACTS §16: person-hours per unit, as stored.
      return { unitsPerFixtureDay: def.rates.unitsPerFixtureDay, labourHoursPerUnit: def.rates.labourHoursPerUnit! }
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

/**
 * CONTRACTS §16: the one labour interface, the same object for both engines. A host table of pools (persons each) and
 * Settlement's `hoursPerDay` (10 today, SET-12): a pool offers persons × hoursPerDay person-hours a day, less what it
 * has granted that day. A named person has no finite schedule here; `away` lists who is aboard, dead or gone.
 */
export interface PortLabour extends LabourSupply {
  pools: Record<string, { persons: number }>
  away: Set<string>
  factors: Record<string, number>
}

export function portLabour(pools: Record<string, { persons: number }>, hoursPerDay = 10): PortLabour {
  const grants: { day: number; pool: string; hours: number }[] = []
  const labour: PortLabour = {
    pools, away: new Set(), factors: {},
    supply: (): LabourRow[] => Object.keys(pools).sort().map((pool) => ({ category: pool, persons: pools[pool].persons, personHours: pools[pool].persons * hoursPerDay })),
    available: (person) => !labour.away.has(person),
    hours: (source, _role, day) => {
      if (!labour.available(source, day)) return 0
      if (!Object.hasOwn(pools, source)) return source.startsWith('pool.') ? 0 : Number.POSITIVE_INFINITY
      const granted = grants.filter((g) => g.day === day && g.pool === source).reduce((sum, g) => sum + g.hours, 0)
      return Math.max(0, pools[source].persons * hoursPerDay - granted)
    },
    draw: (pool, role, _requires, wantedHours, day) => {
      const hours = Object.hasOwn(pools, pool) ? Math.max(0, Math.min(wantedHours, labour.hours(pool, role, day))) : 0
      if (hours > 0) grants.push({ day, pool, hours })
      return hours
    },
    productivity: (holder) => labour.factors[holder] ?? 1,
  }
  return labour
}

/** Settlement's full provider set with the economy behind materials and prices; labour (`portLabour`) and utilities
 *  stay the host's. */
export function settlementProvidersOver(economy: EconomyRunner, aliases: Aliases, marketId: string, base: SettlementProviders = settlementStubs(), labour?: LabourSupply): SettlementProviders {
  return { ...base, ...(labour ? { labour } : {}), materials: economyMaterials(economy, aliases), prices: economyPrices(economy, marketId) }
}

/** The economy's provider set with Settlement behind the ledger; population and transport stay the host's, labour
 *  is the shared `portLabour` when given. */
export function economyProvidersOver(settlement: SettlementRunner, base: EconomyProviders, labour?: LabourSupply): EconomyProviders {
  return { ...base, ...(labour ? { labour } : {}), ledger: settlementLedger(settlement) }
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
