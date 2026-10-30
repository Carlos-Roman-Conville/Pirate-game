// Golden capture of the thirty-day run (I2, via ./fixture.ts): adopting the kernel must not silently change a result.
// The first run writes golden/thirty-days.json; later runs compare byte for byte and name the first differing path.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { thirtyDays } from './fixture'

const FILE = resolve(dirname(fileURLToPath(import.meta.url)), 'golden', 'thirty-days.json')

/** Object keys sorted at every depth, so the text does not depend on insertion order. */
function sorted(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sorted)
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((k) => [k, sorted((value as Record<string, unknown>)[k])]))
  }
  return value
}

function firstDifference(a: unknown, b: unknown, path: string): string | null {
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) {
    return Object.is(a, b) ? null : `${path}: golden ${JSON.stringify(a)}, now ${JSON.stringify(b)}`
  }
  const keys = [...new Set([...Object.keys(a), ...Object.keys(b)])].sort()
  for (const k of keys) {
    const found = firstDifference((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k], `${path}.${k}`)
    if (found) return found
  }
  return null
}

describe('golden: the thirty-day run', () => {
  it('matches the recorded output byte for byte', () => {
    const run = thirtyDays()
    const text = JSON.stringify(sorted({
      economy: run.e.state,
      settlement: run.s.state,
      ledger: run.s.state.ledger,
      log: run.e.log,
      events: run.e.events,
      rows: run.rows,
    }), null, 2) + '\n'
    if (!existsSync(FILE)) {
      mkdirSync(dirname(FILE), { recursive: true })
      writeFileSync(FILE, text)
      console.log('golden written')
      return
    }
    const golden = readFileSync(FILE, 'utf8')
    if (golden !== text) {
      const where = firstDifference(JSON.parse(golden), JSON.parse(text), '$') ?? 'text differs, parsed values equal'
      expect.fail(`golden moved at ${where}`)
    }
    expect(golden).toBe(text)
  })
})
