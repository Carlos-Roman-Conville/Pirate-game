import { describe, expect, it } from 'vitest'
import glossary from '../../../data/pirate-ship/glossary.json'
import {
  applyPullStep,
  initialPullInLineState,
  lineSnapsAtTension,
  lineTensionAtPull,
  PULL_IN_HUD_TERM,
  pullInTuning,
  pullIntensityAtHold,
} from './pullIn'
import { loadFishingConfig, playerStatsFromConfig, type FisherStats, type FishingConfig } from './machine'

const config = loadFishingConfig()
const stats = playerStatsFromConfig(config)

function glossaryEn(code: string): string {
  const entry = glossary.terms.find((t) => t.code === code)
  if (!entry) throw new Error(`missing glossary code: ${code}`)
  return entry.en
}

describe('pull-in HUD glossary terms', () => {
  it('matches data/pirate-ship/glossary.json for tension, integrity and landing point', () => {
    expect(PULL_IN_HUD_TERM.lineTension).toBe(glossaryEn('tension'))
    expect(PULL_IN_HUD_TERM.lineIntegrity).toBe(glossaryEn('integrity'))
    expect(PULL_IN_HUD_TERM.landingPoint).toBe(glossaryEn('progressToLand'))
  })

  it('does not invent alternate English names for the new pull-in bars', () => {
    expect(PULL_IN_HUD_TERM.lineIntegrity).not.toBe('line strength')
    expect(PULL_IN_HUD_TERM.landingPoint).not.toBe('reel progress')
  })
})

function configWithBreakTension(threshold: number): FishingConfig {
  return {
    ...config,
    pullIn: { ...config.pullIn, lineBreakTension: threshold },
  }
}

describe('pull-in line tension', () => {
  it('does not snap at or below the data break threshold', () => {
    const t = pullInTuning(config)
    expect(lineSnapsAtTension(t.lineBreakTension, config)).toBe(false)
    const atThreshold = lineTensionAtPull(0.72, stats, config)
    expect(atThreshold).toBeLessThanOrEqual(t.lineBreakTension)
    expect(lineSnapsAtTension(atThreshold, config)).toBe(false)
  })

  it('snaps only when tension is past the data break threshold', () => {
    const t = pullInTuning(config)
    const hardPull = lineTensionAtPull(1, stats, config)
    expect(hardPull).toBeGreaterThan(t.lineBreakTension)
    expect(lineSnapsAtTension(hardPull, config)).toBe(true)
    let state = initialPullInLineState(config)
    const step = applyPullStep(state, 1, stats, config)
    expect(step.snapped).toBe(true)
    expect(step.state.integrity).toBe(0)
  })

  it('changes snap outcome when the data break threshold changes', () => {
    const tension = lineTensionAtPull(1, stats, config)
    const lenient = configWithBreakTension(tension + 50)
    const strict = configWithBreakTension(tension - 1)
    expect(lineSnapsAtTension(tension, lenient)).toBe(false)
    expect(lineSnapsAtTension(tension, strict)).toBe(true)
    const gentle = applyPullStep(initialPullInLineState(lenient), 1, stats, lenient)
    const harsh = applyPullStep(initialPullInLineState(strict), 1, stats, strict)
    expect(gentle.snapped).toBe(false)
    expect(harsh.snapped).toBe(true)
  })

  it('does not snap on a gentle pull when a hard pull would', () => {
    const t = pullInTuning(config)
    const gentle = lineTensionAtPull(0.4, stats, config)
    const hard = lineTensionAtPull(1, stats, config)
    expect(gentle).toBeLessThanOrEqual(t.lineBreakTension)
    expect(hard).toBeGreaterThan(t.lineBreakTension)
    const step = applyPullStep(initialPullInLineState(config), 0.4, stats, config)
    expect(step.snapped).toBe(false)
    expect(step.state.integrity).toBeGreaterThan(0)
  })
})

function withStrength(strength: number): FisherStats {
  return { ...stats, attributes: { ...stats.attributes, strength } }
}

function pullsToLand(who: FisherStats, intensity: number): number {
  let state = initialPullInLineState(config)
  for (let n = 1; n <= 100; n++) {
    const step = applyPullStep(state, intensity, who, config)
    if (step.snapped) return Infinity
    if (step.landed) return n
    state = step.state
  }
  return Infinity
}

describe('pull-in several pulls', () => {
  it('grows intensity with hold time up to the data cap', () => {
    const t = pullInTuning(config)
    expect(pullIntensityAtHold(0, config)).toBe(0)
    expect(pullIntensityAtHold(t.holdMsToMaxIntensity / 2, config)).toBeCloseTo(t.maxPullIntensity / 2)
    expect(pullIntensityAtHold(t.holdMsToMaxIntensity * 5, config)).toBe(t.maxPullIntensity)
  })

  it('a hard pull weakens the line and a gentle one does not', () => {
    const t = pullInTuning(config)
    let hard = 0
    for (let i = 0.5; i <= 1; i += 0.01) {
      const tension = lineTensionAtPull(i, stats, config)
      if (tension > t.weakenTensionThreshold && tension <= t.lineBreakTension) {
        hard = i
        break
      }
    }
    expect(hard).toBeGreaterThan(0)
    const weak = applyPullStep(initialPullInLineState(config), hard, stats, config)
    expect(weak.weakened).toBe(true)
    expect(weak.snapped).toBe(false)
    expect(weak.state.integrity).toBeLessThan(t.lineStrengthMax)
    const gentle = applyPullStep(initialPullInLineState(config), 0.35, stats, config)
    expect(gentle.weakened).toBe(false)
    expect(gentle.state.integrity).toBe(t.lineStrengthMax)
  })

  it('repeated weakening pulls eventually break the line', () => {
    let state = initialPullInLineState(config)
    let snapped = false
    for (let i = 0; i < 40 && !snapped; i++) {
      const step = applyPullStep({ ...state, progress: 0 }, 0.9, stats, config)
      snapped = step.snapped
      state = step.state
    }
    expect(snapped).toBe(true)
  })

  it('gentle pulls add progress until the fish is landed', () => {
    const n = pullsToLand(stats, 0.35)
    expect(n).toBeGreaterThan(1)
    expect(n).toBeLessThan(Infinity)
  })

  it('higher Strength lands the fish in fewer pulls', () => {
    const weak = pullsToLand(withStrength(0), 0.35)
    const strong = pullsToLand(withStrength(20), 0.35)
    expect(strong).toBeLessThan(weak)
  })
})
