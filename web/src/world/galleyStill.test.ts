import { describe, expect, it } from 'vitest'
import { expectedBoilC, runGalleyStill } from './galleyStill.ts'

describe('the galley still runs on the shared realism engine', () => {
  const deck = runGalleyStill({ altitudeM: 0, airC: 28, skill: 70, minutes: 90, seed: 4 })
  const hills = runGalleyStill({ altitudeM: 2256, airC: 18, skill: 70, minutes: 90, seed: 4 })

  it('boils at the real boiling point for the place', () => {
    expect(deck.boilingPointC).toBeCloseTo(100, 0)
    expect(hills.boilingPointC).toBeCloseTo(92.5, 0)
    expect(expectedBoilC(2256)).toBeCloseTo(hills.boilingPointC, 5)
  })
  it('makes distillate, burns charcoal, and keeps every gram accounted for', () => {
    expect(deck.distillateL).toBeGreaterThan(0.5)
    expect(deck.charcoalKg).toBeGreaterThan(0)
    expect(deck.conserved).toBe(true)
    expect(hills.conserved).toBe(true)
  })
  it('gives the game a journal and a tender who sweats', () => {
    expect(deck.journal.length).toBeGreaterThanOrEqual(2)
    expect(deck.journal[0]).toMatch(/boils/)
    expect(deck.tenderWaterDeficitPct).toBeGreaterThan(0)
  })
  it('a neglected glass misreads, which the journal can catch against the expected boil', () => {
    const r = runGalleyStill({ altitudeM: 0, airC: 28, skill: 70, minutes: 60, thermometerDays: 90, seed: 2 })
    expect(Math.abs(r.glassReadsC - expectedBoilC(0))).toBeGreaterThan(2)
    expect(r.glassTrueC).toBeCloseTo(100, 0)
  })
})
