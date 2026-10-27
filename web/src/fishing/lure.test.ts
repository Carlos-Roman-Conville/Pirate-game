import { describe, expect, it } from 'vitest'
import { loadFishingConfig, playerStatsFromConfig } from './machine'
import {
  expectedBeatTimesMs,
  fishDrawnByLure,
  isRhythmMatchForFish,
  lineMotionAmplitude,
  lineMotionOffset,
  rhythmPlaySucceeded,
} from './lure'

const config = loadFishingConfig()
const stats = playerStatsFromConfig(config)
const minnow = config.fish.find((f) => f.id === 'placeholder-minnow')!
const bass = config.fish.find((f) => f.id === 'placeholder-bass')!

describe('fish drawn by rhythm', () => {
  it('draws the test fish when the played rhythm matches its preference', () => {
    const rhythm = minnow.preferredRhythm
    const taps = expectedBeatTimesMs(rhythm, config)
    expect(isRhythmMatchForFish(minnow, rhythm)).toBe(true)
    expect(fishDrawnByLure(minnow, rhythm, taps, config)).toBe(true)
  })

  it('does not draw the test fish when a wrong rhythm is chosen', () => {
    const wrong = bass.preferredRhythm
    expect(wrong).not.toBe(minnow.preferredRhythm)
    const taps = expectedBeatTimesMs(wrong, config)
    expect(fishDrawnByLure(minnow, wrong, taps, config)).toBe(false)
  })
})

describe('rhythm play', () => {
  it('fails when taps miss the beat window', () => {
    const rhythm = minnow.preferredRhythm
    const beats = expectedBeatTimesMs(rhythm, config)
    const late = beats.map((t) => t + Number(config.lure.rhythmHitWindowMs) + 50)
    expect(rhythmPlaySucceeded(late, rhythm, config)).toBe(false)
  })
})

describe('patience and line motion', () => {
  it('reduces motion amplitude as patience rises', () => {
    const impatient = { ...stats, personality: { ...stats.personality, patience: 10 } }
    const patient = { ...stats, personality: { ...stats.personality, patience: 90 } }
    expect(lineMotionAmplitude(patient, config)).toBeLessThan(lineMotionAmplitude(impatient, config))
    const rhythm = minnow.preferredRhythm
    const t = 300
    expect(Math.abs(lineMotionOffset(t, rhythm, patient, config))).toBeLessThanOrEqual(
      Math.abs(lineMotionOffset(t, rhythm, impatient, config)),
    )
  })
})
