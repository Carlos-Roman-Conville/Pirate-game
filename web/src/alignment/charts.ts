import chartData from '../../../data/pirate-ship/alignment/charts.json'
import type { Quadrant } from './square'

export const QUADRANTS: readonly Quadrant[] = ['og', 'cg', 'oe', 'ce']
export type ChartCell = Quadrant | 'lean' | 'stay'
export type Chart = Record<Quadrant, ChartCell> & { mark?: string }
export type Response = { kind: 'move' | 'lean'; to: Quadrant } | { kind: 'stay' }

export function isQuadrant(value: unknown): value is Quadrant {
  return QUADRANTS.some((q) => q === value)
}

export function loadCharts(raw: unknown = chartData): Record<string, Chart> {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('invalid charts')
  return Object.fromEntries(Object.entries(raw).map(([slug, chart]) => {
    if (!slug || !chart || typeof chart !== 'object' || Array.isArray(chart)) throw new Error(`invalid chart: ${slug}`)
    for (const key of Object.keys(chart)) {
      if (!isQuadrant(key) && key !== 'mark') throw new Error(`invalid chart key: ${slug}.${key}`)
    }
    for (const q of QUADRANTS) {
      const cell = chart[q]
      if (!isQuadrant(cell) && cell !== 'lean' && cell !== 'stay') throw new Error(`invalid chart cell: ${slug}.${q}`)
    }
    if (chart.mark !== undefined && typeof chart.mark !== 'string') throw new Error(`invalid chart mark: ${slug}`)
    return [slug, { ...chart } as Chart]
  }))
}

export function respond(chart: Chart, category: Quadrant): Response {
  const cell = chart[category]
  if (cell === 'stay') return { kind: 'stay' }
  if (cell === 'lean') return { kind: 'lean', to: category }
  if (!isQuadrant(cell)) throw new Error(`invalid chart response: ${category}`)
  return { kind: 'move', to: cell }
}

export function reachable(chart: Chart, quadrant: Quadrant): boolean {
  return QUADRANTS.some((category) => {
    const response = respond(chart, category)
    return response.kind !== 'stay' && response.to === quadrant
  })
}
