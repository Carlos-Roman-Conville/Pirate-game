import { describe, expect, it } from 'vitest'
import { resolveHookPress } from '../fishing/bite'
import { expectedBeatTimesMs, fishDrawnByLure } from '../fishing/lure'
import {
  applyFishingRun,
  dismissResultPanel,
  dockAllowsWalking,
  initialDockLoop,
  tryStartFishingAtDock,
} from '../fishing/loop'
import { dispatch, loadFishingConfig, playerStatsFromConfig, startFishing } from '../fishing/machine'
import { initialPullInLineState, pullInTuning } from '../fishing/pullIn'
import type { CastLanding } from '../fishing/cast'
import {
  catchViewCreateBiteSchedule,
  catchViewLineBreakTension,
  catchViewOnSpaceBite,
  catchViewOnSpaceLure,
  catchViewOnSpacePull,
  catchViewSelectedRhythmId,
  catchViewTensionWouldSnap,
  createCatchView,
  pullIntensityFromConfig,
} from './catchView'

const config = loadFishingConfig()
const stats = playerStatsFromConfig(config)
const minnow = config.fish.find((f) => f.id === 'placeholder-minnow')!
const rng = { next: () => 0.25 }

const landing: CastLanding = { x: 12, y: 14, distanceTiles: 5 }

function catchAtLure(rhythmIndex = 0) {
  let state = createCatchView(landing, 16, config)
  state = { ...state, rhythmIndex }
  let run = startFishing(config, { fishId: minnow.id })
  for (let i = 0; i < 4; i++) run = dispatch(run, { type: 'stub', success: true })
  expect(run.stage).toBe('lure')
  return { state, run }
}

function perfectLureTaps(rhythmId: string) {
  return expectedBeatTimesMs(rhythmId, config)
}

describe('catchView lure rhythm taps', () => {
  it('feeds tap times into lure.ts and advances when the rhythm matches', () => {
    const { state, run } = catchAtLure(0)
    const rhythm = catchViewSelectedRhythmId(state, config)
    expect(rhythm).toBe(minnow.preferredRhythm)
    const start = 10_000
    let s = state
    let r = run
    const afterPick = catchViewOnSpaceLure(s, start, r, config)
    s = afterPick.state
    r = afterPick.run
    expect(s.lurePhase).toBe('play')
    const taps = perfectLureTaps(rhythm)
    for (let i = 0; i < taps.length; i++) {
      const beat = catchViewOnSpaceLure(s, start + taps[i], r, config)
      s = beat.state
      r = beat.run
    }
    expect(fishDrawnByLure(minnow, rhythm, taps, config)).toBe(true)
    expect(r.stage).toBe('bite')
    expect(r.lureDrawn).toBe(true)
  })
})

describe('catchView bite hook press', () => {
  function runAtBite() {
    let r = startFishing(config)
    for (let i = 0; i < 5; i++) r = dispatch(r, { type: 'stub', success: true })
    expect(r.stage).toBe('bite')
    return r
  }

  it('false-strikes on a nibble press', () => {
    const schedule = catchViewCreateBiteSchedule(0, stats, config, rng, false)
    expect(resolveHookPress(schedule, schedule.nibbleTwitchMs)).toBe('falseStrike')
    const run = runAtBite()
    const after = catchViewOnSpaceBite(run, schedule, schedule.nibbleTwitchMs, config)
    expect(after.stage).toBe('result')
    expect(after.result).toBe('gotAway')
  })

  it('hooks when the press lands after submerge', () => {
    const schedule = catchViewCreateBiteSchedule(0, stats, config, rng, false)
    const press = schedule.submergedBeginMs + 5
    const run = runAtBite()
    const after = catchViewOnSpaceBite(run, schedule, press, config)
    expect(after.stage).toBe('pullIn')
  })
})

describe('catchView pull tension', () => {
  it('breaks the line only past the data threshold', () => {
    const threshold = catchViewLineBreakTension(config)
    expect(catchViewTensionWouldSnap(1, stats, config)).toBe(true)
    const gentle = pullIntensityFromConfig(config)
    expect(catchViewTensionWouldSnap(gentle, stats, config)).toBe(false)
    expect(threshold).toBe(pullInTuning(config).lineBreakTension)

    let state = createCatchView(landing, 16, config)
    state = { ...state, pullLine: initialPullInLineState(config) }
    let run = startFishing(config)
    for (let i = 0; i < 5; i++) run = dispatch(run, { type: 'stub', success: true })
    run = dispatch(run, { type: 'bite', event: 'advance' })
    run = dispatch(run, { type: 'bite', event: 'advance' })
    run = dispatch(run, { type: 'bite', event: 'advance' })
    run = dispatch(run, { type: 'bite', event: 'hook' })
    expect(run.stage).toBe('pullIn')

    const hardConfig = {
      ...config,
      pullIn: { ...config.pullIn, defaultPullIntensity: 1 },
    }
    const snap = catchViewOnSpacePull(state, run, stats, hardConfig)
    expect(snap.run.stage).toBe('result')
    expect(snap.run.result).toBe('gotAway')
  })
})

describe('catchView results return to walking', () => {
  it('returns to walking after caught and after got away', () => {
    let loop = tryStartFishingAtDock(initialDockLoop(), true, config)
    const caught = dispatch(startFishing(config), { type: 'stub', success: true })
    const caughtRun = { ...caught, stage: 'result' as const, result: 'caught' as const }
    loop = applyFishingRun(loop, caughtRun)
    expect(loop.mode).toBe('showingResult')
    loop = dismissResultPanel(loop)
    expect(dockAllowsWalking(loop)).toBe(true)

    loop = tryStartFishingAtDock(loop, true, config)
    const away = { ...startFishing(config), stage: 'result' as const, result: 'gotAway' as const }
    loop = applyFishingRun(loop, away)
    loop = dismissResultPanel(loop)
    expect(loop.mode).toBe('walking')
  })
})
