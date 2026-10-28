import {
  ending, loadAlignmentConfig, reachable, townPosition,
  type AlignmentState, type Quadrant,
} from '../index'
import { checkLimit, Cursor } from './scenario'
import { greedyToward } from './strategies'

export interface SearchLimits {
  maxRoutes: number
  /** Maximum reducer attempts per route, including rejected commands. */
  maxSteps: number
  maxEventsPerOwner: number
}

export const DEFAULT_LIMITS: SearchLimits = { maxRoutes: 32, maxSteps: 256, maxEventsPerOwner: 64 }

/** Bounded evidence, not a proof of impossibility when reachable is false.
 * The objective covers every sector; ending() alone also permits a partial town.
 * "Closest" maximizes sectors developed in the target, then minimizes route length.
 */
export function reachablePerfect(quadrant: Quadrant, config = loadAlignmentConfig(), limits: Partial<SearchLimits> = {}) {
  const budget = { ...DEFAULT_LIMITS, ...limits }
  for (const [key, value] of Object.entries(budget)) checkLimit(value, key)
  let best = new Cursor(config, budget.maxSteps)
  const slots = Object.values(best.state.slots)
  const sectors = [...new Set(slots.map((slot) => slot.sector))]
  const alternatives = sectors.map((sector) => Math.max(1, slots.filter((slot) =>
    slot.sector === sector && config.charts[slot.owner] && reachable(config.charts[slot.owner], quadrant)).length))
  const coverage = (state: AlignmentState) => new Set(Object.values(state.slots)
    .filter((slot) => slot.developed && slot.pos !== null && slot.region === quadrant)
    .map((slot) => slot.sector)).size
  let bestCoverage = -1
  let exploredSteps = 0
  let routesTried = 0
  let found = false
  const issues = new Set<string>()
  for (let attempt = 0; attempt < budget.maxRoutes; attempt++) {
    // Mixed-radix owner choices, with both party policies and rotating/reversed orders.
    let choice = Math.floor(attempt / 2)
    const choices = alternatives.map((count) => {
      const index = choice % count
      choice = Math.floor(choice / count)
      return index
    })
    const order = sectors.map((_, index) => (index + Math.floor(attempt / 2)) % sectors.length)
    if (attempt % 2) order.reverse()
    const candidate = greedyToward(quadrant, config, {
      ...budget, choices, order, party: attempt % 2 ? 'compatible' : 'solo',
    })
    routesTried++
    exploredSteps += candidate.attempts
    candidate.issues.forEach((issue) => issues.add(issue))
    const covered = coverage(candidate.state)
    const result = ending(candidate.state, config)
    found = covered === sectors.length && result.perfect && result.id === quadrant
    if (found || covered > bestCoverage || (covered === bestCoverage && candidate.route.length < best.route.length)) {
      best = candidate
      bestCoverage = covered
    }
    if (found) break
  }
  return {
    reachable: found, route: best.route, steps: best.route.length,
    state: best.state, ending: ending(best.state, config), town: townPosition(best.state, config),
    coveredSectors: coverage(best.state), totalSectors: sectors.length,
    routesTried, exploredSteps, issues: [...issues],
  }
}
