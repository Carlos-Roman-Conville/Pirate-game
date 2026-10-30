/**
 * The pirate adapter's loader for @rex/economy (Toolchain/economy, CONTRACTS.md with Settlement): replays
 * data/pirate-ship/economy/goods.json and recipes.json into engine commands and opens the starting port's market.
 *
 * Recipe quantities (inputs per unit, yield, by-product units, the two rates) are NOT in the data yet
 * (data/pirate-ship/economy/README.md "Not here yet"), so the host passes them in and only the recipes it quantifies
 * are loaded; the rest are listed as `unquantified`. Nothing is invented here: a recipe without a number stays out.
 */
import goodsData from '../../../data/pirate-ship/economy/goods.json'
import recipesData from '../../../data/pirate-ship/economy/recipes.json'
import { Runner, defaultConfig, stubProviders, type EconomyConfig, type Good, type MarketMode, type Providers, type Rates, type Recipe } from '@rex/economy'

interface DataGood { id: string; type: string | null; typeMark?: string; offMap: boolean; madeBy: string | null; region: string; origin: string }
interface DataRecipe {
  id: string; skill: string; band: string; minLevel: number; output: string | null; service: boolean; offMap: boolean
  inputs: string[]; inputsAny: string[] | string[][]; equipment: string[]; byproductOf: string | null; knowledge: string; region: string
}

/** The host's numbers for one recipe (fixtures in tests until the balance lane sets them). */
export interface RecipeQuantity {
  yield: number
  inputs: Record<string, number>        // units per output unit, one per good the data lists under `inputs`
  inputsAny?: number[]                  // units per output unit, one per `inputsAny` group
  byproducts?: Record<string, number>   // units of each by-product good per output unit
  rates: Rates
}
export type RecipeQuantities = Record<string, RecipeQuantity>

export interface LoadedEconomy {
  runner: Runner
  marketId: string
  /** Recipe ids in the data that were not quantified and so not loaded. */
  unquantified: string[]
  counts: { goods: number; recipes: number }
}

function groups(raw: string[] | string[][]): string[][] {
  if (!raw.length) return []
  return Array.isArray(raw[0]) ? (raw as string[][]) : [raw as string[]]
}

export function loadEconomy(quantities: RecipeQuantities, options: { providers?: Providers; config?: EconomyConfig; marketId?: string; mode?: MarketMode } = {}): LoadedEconomy {
  const marketId = options.marketId ?? 'stl.port'
  const runner = new Runner(undefined, options.config ?? defaultConfig(), options.providers ?? stubProviders())
  const goods = (goodsData as { goods: DataGood[] }).goods
  for (const entry of goods) {
    const good: Good = { id: entry.id, type: entry.type, weight: null, spoilagePerDay: null, legal: null }
    runner.run({ type: 'defineGood', good })
  }
  const recipes = (recipesData as { recipes: DataRecipe[] }).recipes
  const byId = new Map(recipes.map((entry) => [entry.id, entry]))
  const unquantified: string[] = []
  let loaded = 0
  for (const entry of recipes) {
    if (entry.byproductOf) continue                    // attached to its parent below, if the parent quantifies it
    const q = quantities[entry.id]
    if (!q) { unquantified.push(entry.id); continue }
    const inputs = entry.inputs.map((good) => {
      if (!(good in q.inputs)) throw new Error(`recipe ${entry.id}: no quantity for input ${good}`)
      return { good, units: q.inputs[good] }
    })
    const anyGroups = groups(entry.inputsAny)
    if (anyGroups.length !== (q.inputsAny ?? []).length) throw new Error(`recipe ${entry.id}: ${anyGroups.length} inputsAny groups, ${(q.inputsAny ?? []).length} quantities`)
    const inputsAny = anyGroups.map((options, i) => ({ options, units: q.inputsAny![i] }))
    const byproducts = Object.entries(q.byproducts ?? {}).map(([good, units]) => {
      // the data writes byproductOf as "<skill>:<parent output name>"; the parent is found by skill and the child by output
      const child = recipes.find((other) => other.output === good && other.byproductOf !== null && other.byproductOf.startsWith(`${entry.skill}:`))
      if (!child) throw new Error(`recipe ${entry.id}: ${good} is not a by-product of a ${entry.skill} recipe in the data`)
      return { good, units }
    })
    const recipe: Recipe = {
      id: entry.id, output: entry.output, yield: entry.output === null ? 0 : q.yield, inputs, inputsAny, byproducts,
      equipment: entry.equipment, skill: entry.skill, band: entry.band, minLevel: entry.minLevel, knowledge: entry.knowledge, rates: q.rates,
    }
    runner.run({ type: 'defineRecipe', recipe })
    loaded += 1
  }
  for (const id of Object.keys(quantities)) if (!byId.has(id)) throw new Error(`quantities name a recipe not in the data: ${id}`)
  runner.run({ type: 'openMarket', id: marketId, mode: options.mode ?? 'settlement' })
  runner.events.length = 0   // seeding is not news
  runner.log.length = 0      // and replays from the loaded state, not from the catalogue
  return { runner, marketId, unquantified, counts: { goods: goods.length, recipes: loaded } }
}
