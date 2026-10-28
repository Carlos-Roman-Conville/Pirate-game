import { describe, expect, it } from 'vitest'
import { clamp, classify, loadSquareConfig, loadThresholds, quadrantAnchors, step, type Region } from './square'

const thresholds = loadThresholds()
const config = loadSquareConfig()

describe('classify: the nine regions', () => {
  const cases: [string, number, number, Region][] = [
    ['neutral', 0, 0, 'neutral'],
    ['neutral edge', 14, -14, 'neutral'],
    ['og', -50, 50, 'og'],
    ['cg', 50, 50, 'cg'],
    ['oe', -50, -50, 'oe'],
    ['ce', 50, -50, 'ce'],
    ['hybrid_good', 0, 50, 'hybrid_good'],
    ['hybrid_evil', 5, -50, 'hybrid_evil'],
    ['hybrid_order', -50, 0, 'hybrid_order'],
    ['hybrid_chaos', 50, -5, 'hybrid_chaos'],
    ['pure edge', 30, 30, 'cg'],
  ]
  for (const [name, x, y, region] of cases) {
    it(name, () => expect(classify({ x, y }, thresholds)).toBe(region))
  }
})

describe('classify: the transitional ring', () => {
  it('a tie keeps the previous region', () => {
    expect(classify({ x: -20, y: 20 }, thresholds, 'hybrid_order')).toBe('hybrid_order')
    expect(classify({ x: -20, y: 20 }, thresholds, 'og')).toBe('og')
  })
  it('a tie with no previous reads the position alone', () => {
    expect(classify({ x: -20, y: 20 }, thresholds)).toBe('og')
  })
  it('the larger axis decides', () => {
    expect(classify({ x: -25, y: 18 }, thresholds)).toBe('hybrid_order')
    expect(classify({ x: 25, y: 18 }, thresholds)).toBe('hybrid_chaos')
    expect(classify({ x: 18, y: 25 }, thresholds)).toBe('hybrid_good')
    expect(classify({ x: 18, y: -25 }, thresholds)).toBe('hybrid_evil')
  })
})

describe('no threshold hard-coded', () => {
  it('different thresholds change the answer', () => {
    const wide = { ...thresholds, neutral: 40, pure: 60 }
    expect(classify({ x: 20, y: 20 }, thresholds, 'cg')).toBe('cg')
    expect(classify({ x: 20, y: 20 }, wide)).toBe('neutral')
    expect(classify({ x: 50, y: 50 }, wide)).toBe('cg')
    expect(classify({ x: 50, y: 40 }, wide)).toBe('hybrid_chaos')
    expect(classify({ x: 50, y: 40 }, thresholds)).toBe('cg')
  })
  it('the tie rule is read from data', () => {
    expect(() => classify({ x: 20, y: 20 }, { ...thresholds, tieBreak: 'other' })).toThrow()
  })
})

describe('clamp and step', () => {
  it('clamps at the bound', () => {
    expect(clamp({ x: 150, y: -300 }, config.bound)).toEqual({ x: 100, y: -100 })
    expect(clamp({ x: 5, y: -5 }, config.bound)).toEqual({ x: 5, y: -5 })
  })
  it('puts the anchors in the quadrants', () => {
    const a = quadrantAnchors(config.anchor)
    expect(a.og.x).toBeLessThan(0)
    expect(a.og.y).toBeGreaterThan(0)
    expect(a.ce.x).toBeGreaterThan(0)
    expect(a.ce.y).toBeLessThan(0)
    expect(a.oe).toEqual({ x: -config.anchor.x, y: -config.anchor.y })
  })
  it('moves a fixed Euclidean distance', () => {
    const p = step({ x: 0, y: 0 }, { x: 30, y: 40 }, 10, config)
    expect(p.x).toBeCloseTo(6)
    expect(p.y).toBeCloseTo(8)
  })
  it('stops at the anchor and never overshoots', () => {
    const anchor = { x: 30, y: 40 }
    expect(step({ x: 27, y: 36 }, anchor, 25, config)).toEqual(anchor)
    expect(step(anchor, anchor, 10, config)).toEqual(anchor)
    let p = { x: 0, y: 0 }
    for (let i = 0; i < 20; i++) p = step(p, anchor, 10, config)
    expect(p).toEqual(anchor)
  })
  it('reads metric and overshoot from data', () => {
    const odd = { ...config, step: { ...config.step, overshoot: 'pass-through' } }
    expect(() => step({ x: 0, y: 0 }, { x: 1, y: 1 }, 1, odd)).toThrow()
  })
})
