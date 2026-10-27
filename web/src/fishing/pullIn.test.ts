import { describe, expect, it } from 'vitest'
import {
  applyPullStep,
  initialPullInLineState,
  lineSnapsAtTension,
  lineTensionAtPull,
  pullInTuning,
} from './pullIn'
import { loadFishingConfig, playerStatsFromConfig, type FishingConfig } from './machine'

const config = loadFishingConfig()
const stats = playerStatsFromConfig(config)

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
