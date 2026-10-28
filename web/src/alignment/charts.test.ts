import { describe, expect, it } from 'vitest'
import { loadCharts, QUADRANTS, reachable, respond, type Chart } from './charts'

describe('§4 response charts', () => {
  it('respond follows the destination, independently of the event quadrant', () => {
    expect(respond(loadCharts()['entp-m'], 'og')).toEqual({ kind: 'move', to: 'cg' })
  })
  it('a dashed ring leans toward its own category', () => {
    const chart: Chart = { og: 'lean', cg: 'lean', oe: 'lean', ce: 'lean' }
    for (const q of QUADRANTS) expect(respond(chart, q)).toEqual({ kind: 'lean', to: q })
  })
  it('stay does not name a destination', () => {
    expect(respond({ og: 'stay', cg: 'stay', oe: 'stay', ce: 'stay' }, 'og')).toEqual({ kind: 'stay' })
  })
  it('reachable counts move destinations and the category of a lean, never a stay', () => {
    const chart: Chart = { og: 'ce', cg: 'lean', oe: 'stay', ce: 'ce' }
    expect(QUADRANTS.map((q) => reachable(chart, q))).toEqual([false, true, false, true])
  })
  it('loads all data charts and returns independent values', () => {
    const charts = loadCharts()
    expect(Object.keys(charts)).toHaveLength(16)
    for (const chart of Object.values(charts)) for (const q of QUADRANTS) expect(respond(chart, q)).toBeDefined()
    charts['entp-m'].og = 'stay'
    expect(loadCharts()['entp-m'].og).toBe('cg')
  })
  it.each([null, [], { bad: { og: 'jump', cg: 'cg', oe: 'oe', ce: 'ce' } }, { bad: { og: 'og' } },
    { bad: { og: 'og', cg: 'cg', oe: 'oe', ce: 'ce', invented: 'stay' } }])('rejects malformed charts %#', (raw) => {
    expect(() => loadCharts(raw)).toThrow(/invalid/)
  })
})
