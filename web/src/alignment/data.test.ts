import { describe, expect, it } from 'vitest'
import charts from '../../../data/pirate-ship/alignment/charts.json'
import starts from '../../../data/pirate-ship/alignment/starts.json'
import institutions from '../../../data/pirate-ship/alignment/institutions.json'
import events from '../../../data/pirate-ship/alignment/events.json'
import thresholdsData from '../../../data/pirate-ship/alignment/thresholds.json'
import { loadSquareConfig, quadrantAnchors, type Quadrant } from './square'

const CELL_KEYS = ['og', 'cg', 'oe', 'ce'] as const
const CELL_VALUES = ['og', 'cg', 'oe', 'ce', 'lean', 'stay'] as const
const START_VALUES = ['og', 'cg', 'oe', 'ce', 'neutral'] as const
const SOURCES = ['dialogue', 'quest', 'action'] as const
const WEIGHTS = ['minor', 'major'] as const
const CATEGORIES: Quadrant[] = ['og', 'cg', 'oe', 'ce']

describe('charts.json', () => {
  it('each chart has exactly the four cells with valid values', () => {
    for (const [slug, chart] of Object.entries(charts)) {
      const keys = Object.keys(chart).filter((k) => k !== 'mark')
      expect(keys.sort(), slug).toEqual([...CELL_KEYS].sort())
      for (const cell of CELL_KEYS) {
        const v = chart[cell as keyof typeof chart]
        expect(CELL_VALUES, `${slug}.${cell}`).toContain(v)
        expect(v, `${slug}.${cell} must not be null`).not.toBeNull()
      }
      expect(typeof chart.mark).toBe('string')
      expect(chart.mark.length).toBeGreaterThan(0)
    }
  })

  it('rejects an invented cell value (negative)', () => {
    expect(CELL_VALUES).not.toContain('jump')
  })
})

/** ALIGNMENT.md §4 starting positions table (Rex, 2026-10-28, "for now"). */
const SPEC_STARTS: Record<string, (typeof START_VALUES)[number]> = {
  'entp-m': 'ce',
  'intp-m': 'oe',
  'entj-priest': 'oe',
  'intj-f': 'oe',
  'enfj-m': 'neutral',
  'infj-m': 'og',
  enfp: 'cg',
  'infp-m': 'oe',
  'estj-f': 'oe',
  'istj-m': 'og',
  'esfj-m': 'cg',
  'isfj-f': 'og',
  'estp-f': 'neutral',
  'istp-f': 'neutral',
  'esfp-f': 'ce',
  isfp: 'ce',
}

describe('starts.json', () => {
  it('every charted slug has a start and vice versa', () => {
    const chartSlugs = Object.keys(charts).sort()
    const startSlugs = Object.keys(starts).sort()
    expect(startSlugs).toEqual(chartSlugs)
    for (const slug of chartSlugs) {
      expect(START_VALUES).toContain(starts[slug as keyof typeof starts])
    }
  })

  it('§4 each slug matches the starting positions table', () => {
    expect(Object.keys(SPEC_STARTS)).toHaveLength(16)
    for (const [slug, category] of Object.entries(SPEC_STARTS)) {
      expect(starts[slug as keyof typeof starts], slug).toBe(category)
    }
  })
})

describe('institutions.json', () => {
  it('eight sectors with two slots whose owners exist in charts', () => {
    expect(institutions).toHaveLength(8)
    const chartSlugs = new Set(Object.keys(charts))
    for (const sector of institutions) {
      expect(sector.slots).toHaveLength(2)
      for (const slot of sector.slots) {
        expect(chartSlugs.has(slot.owner)).toBe(true)
        expect(slot.forms).toEqual({ og: null, cg: null, oe: null, ce: null })
      }
    }
  })
})

describe('events.json', () => {
  it('placeholder EventDefs cover source × weight × category', () => {
    expect(events).toHaveLength(24)
    const seen = new Set<string>()
    for (const ev of events) {
      expect(SOURCES).toContain(ev.source)
      expect(WEIGHTS).toContain(ev.weight)
      expect(CATEGORIES).toContain(ev.category)
      expect(ev.placeholder).toBe(true)
      expect(Object.keys(ev).sort()).toEqual(['category', 'id', 'placeholder', 'source', 'weight'].sort())
      seen.add(`${ev.source}:${ev.weight}:${ev.category}`)
    }
    for (const source of SOURCES) {
      for (const weight of WEIGHTS) {
        for (const category of CATEGORIES) {
          expect(seen.has(`${source}:${weight}:${category}`)).toBe(true)
        }
      }
    }
  })

  it('rejects a non-placeholder event (negative)', () => {
    const bad = { id: 'x', source: 'dialogue', category: 'og', weight: 'minor', placeholder: false }
    expect(bad.placeholder).not.toBe(true)
  })
})

describe('anchor invariant (thresholds.pure)', () => {
  it('every anchor |x| and |y| are at least thresholds.pure', () => {
    const config = loadSquareConfig()
    const pure = thresholdsData.thresholds.pure
    const anchors = quadrantAnchors(config.anchor)
    for (const q of CATEGORIES) {
      const p = anchors[q]
      expect(Math.abs(p.x), q).toBeGreaterThanOrEqual(pure)
      expect(Math.abs(p.y), q).toBeGreaterThanOrEqual(pure)
    }
  })
})
