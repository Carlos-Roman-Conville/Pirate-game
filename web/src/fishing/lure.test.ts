import { describe, expect, it } from 'vitest'
import { createBiteSchedule } from './bite'
import { dispatch, loadFishingConfig, playerStatsFromConfig, startFishing } from './machine'
import {
  expectedBeatTimesMs,
  fishDrawnByLure,
  isRhythmMatchForFish,
  lineMotionAmplitude,
  lineMotionOffset,
  rhythmById,
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
  it('counts a tap one period after the start as the first beat, a tap at once not', () => {
    const rhythm = minnow.preferredRhythm
    const period = rhythmById(rhythm, config).periodMs
    const beats = expectedBeatTimesMs(rhythm, config)
    expect(beats[0]).toBe(period)
    const onTime = [...beats]
    expect(rhythmPlaySucceeded(onTime, rhythm, config)).toBe(true)
    const atOnce = [0, ...beats.slice(1)]
    expect(rhythmPlaySucceeded(atOnce, rhythm, config)).toBe(false)
  })


  it('fails when taps miss the beat window', () => {
    const rhythm = minnow.preferredRhythm
    const beats = expectedBeatTimesMs(rhythm, config)
    const late = beats.map((t) => t + Number(config.lure.rhythmHitWindowMs) + 50)
    expect(rhythmPlaySucceeded(late, rhythm, config)).toBe(false)
  })
})

describe('lure hands its result to the bite', () => {
  it('bites sooner after the right rhythm than after a wrong one', () => {
    const right = minnow.preferredRhythm
    const wrong = bass.preferredRhythm
    const drawn = fishDrawnByLure(minnow, right, expectedBeatTimesMs(right, config), config)
    const missed = fishDrawnByLure(minnow, wrong, expectedBeatTimesMs(wrong, config), config)
    let run = startFishing(config)
    for (let i = 0; i < 4; i++) run = dispatch(run, { type: 'stub', success: true })
    expect(run.stage).toBe('lure')
    const drawnRun = dispatch(run, { type: 'lure', drawn: drawn })
    const missedRun = dispatch(run, { type: 'lure', drawn: missed })
    expect(drawnRun.stage).toBe('bite')
    expect(missedRun.stage).toBe('bite')
    const rng = { next: () => 0.5 }
    const sooner = createBiteSchedule(0, stats, config, rng, drawnRun.lureDrawn)
    const normal = createBiteSchedule(0, stats, config, rng, missedRun.lureDrawn)
    expect(sooner.nibbleBeginMs).toBeLessThan(normal.nibbleBeginMs)
    expect(sooner.submergedBeginMs).toBeLessThan(normal.submergedBeginMs)
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
