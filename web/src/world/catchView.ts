// Lure, bite and pull-in on the dock: input, timing, and meters (pure TS; DockScene paints).

import {
  createBiteSchedule,
  dispatchTimedHookPress,
  type BiteSchedule,
  type FishingRng,
} from '../fishing/bite'
import type { CastLanding } from '../fishing/cast'
import {
  expectedBeatTimesMs,
  fishDrawnByLure,
  lineMotionOffset,
  lureRhythmIds,
  lureTuning,
  rhythmById,
} from '../fishing/lure'
import { stubAdvanceRun } from '../fishing/loop'
import { dispatch, type FisherStats, type FishingConfig, type FishingRun } from '../fishing/machine'
import {
  applyPullStep,
  initialPullInLineState,
  lineSnapsAtTension,
  lineTensionAtPull,
  PULL_IN_HUD_TERM,
  pullInTuning,
  pullIntensityAtHold,
  type PullInLineState,
} from '../fishing/pullIn'

export interface CatchViewBobber {
  x: number
  y: number
}

export type LureViewPhase = 'pick' | 'play'

export interface CatchViewState {
  bobber: CatchViewBobber
  lurePhase: LureViewPhase
  rhythmIndex: number
  lureRoundStartMs: number | null
  lureTapsMs: number[]
  pullLine: PullInLineState
  lastPullTension: number | null
  /** Time Space went down during pull-in; null when not holding. */
  pullHoldStartMs: number | null
}

export interface CatchRhythmPickInput {
  cycleLeft: boolean
  cycleRight: boolean
}

const WAVE_PERIOD_MS = 1400
const NIBBLE_DIP_PX = 4

export function pullIntensityFromConfig(config: FishingConfig): number {
  return Number(config.pullIn.defaultPullIntensity)
}

export function createCatchView(landing: CastLanding, tileSize: number, config: FishingConfig): CatchViewState {
  return {
    bobber: { x: landing.x * tileSize, y: landing.y * tileSize },
    lurePhase: 'pick',
    rhythmIndex: 0,
    lureRoundStartMs: null,
    lureTapsMs: [],
    pullLine: initialPullInLineState(config),
    lastPullTension: null,
    pullHoldStartMs: null,
  }
}

export function catchViewSelectedRhythmId(state: CatchViewState, config: FishingConfig): string {
  const ids = lureRhythmIds(config)
  return ids[state.rhythmIndex % ids.length]!
}

export function catchViewLurePickInput(
  state: CatchViewState,
  input: CatchRhythmPickInput,
  config: FishingConfig,
): CatchViewState {
  if (state.lurePhase !== 'pick') return state
  const count = lureRhythmIds(config).length
  let idx = state.rhythmIndex
  if (input.cycleLeft) idx = (idx - 1 + count) % count
  if (input.cycleRight) idx = (idx + 1) % count
  return { ...state, rhythmIndex: idx }
}

/** Space during lure: confirm rhythm, record a beat, or finish the round. */
export function catchViewOnSpaceLure(
  state: CatchViewState,
  nowMs: number,
  run: FishingRun,
  config: FishingConfig,
): { state: CatchViewState; run: FishingRun } {
  if (run.stage !== 'lure') return { state, run }
  const fish = config.fish.find((f) => f.id === run.fishId)!
  const rhythmId = catchViewSelectedRhythmId(state, config)

  if (state.lurePhase === 'pick') {
    return {
      state: {
        ...state,
        lurePhase: 'play',
        lureRoundStartMs: nowMs,
        lureTapsMs: [],
      },
      run,
    }
  }

  const start = state.lureRoundStartMs!
  const tapOffset = nowMs - start
  const taps = [...state.lureTapsMs, tapOffset]
  const beats = expectedBeatTimesMs(rhythmId, config)
  if (taps.length < beats.length) {
    return { state: { ...state, lureTapsMs: taps }, run }
  }

  const drawn = fishDrawnByLure(fish, rhythmId, taps, config)
  return {
    state: { ...state, lureTapsMs: taps },
    run: dispatch(run, { type: 'lure', drawn }),
  }
}

export function catchViewOnSpaceBite(
  run: FishingRun,
  schedule: BiteSchedule,
  pressMs: number,
  config: FishingConfig,
): FishingRun {
  if (run.stage !== 'bite') return run
  return dispatchTimedHookPress(run, schedule, pressMs, config)
}

/** Space goes down during pull-in: start building intensity. */
export function catchViewPullHoldStart(state: CatchViewState, nowMs: number, run: FishingRun): CatchViewState {
  if (run.stage !== 'pullIn' || state.pullHoldStartMs !== null) return state
  return { ...state, pullHoldStartMs: nowMs }
}

/** Intensity the current hold has reached (0 when not holding). */
export function catchViewHoldIntensity(state: CatchViewState, nowMs: number, config: FishingConfig): number {
  if (state.pullHoldStartMs === null) return 0
  return pullIntensityAtHold(nowMs - state.pullHoldStartMs, config)
}

/** One pull at the given intensity: caught when progress reaches the landing point, got away on a snap. */
export function catchViewOnSpacePull(
  state: CatchViewState,
  run: FishingRun,
  stats: FisherStats,
  config: FishingConfig,
  intensity: number = pullIntensityFromConfig(config),
): { state: CatchViewState; run: FishingRun } {
  if (run.stage !== 'pullIn') return { state, run }
  const step = applyPullStep(state.pullLine, intensity, stats, config)
  const nextState: CatchViewState = {
    ...state,
    pullLine: step.state,
    lastPullTension: step.tension,
    pullHoldStartMs: null,
  }
  if (step.snapped) return { state: nextState, run: stubAdvanceRun(run, false) }
  if (step.landed) return { state: nextState, run: stubAdvanceRun(run, true) }
  return { state: nextState, run }
}

/** Space released during pull-in: pull with the intensity the hold reached. */
export function catchViewOnPullRelease(
  state: CatchViewState,
  nowMs: number,
  run: FishingRun,
  stats: FisherStats,
  config: FishingConfig,
): { state: CatchViewState; run: FishingRun } {
  if (run.stage !== 'pullIn' || state.pullHoldStartMs === null) return { state, run }
  return catchViewOnSpacePull(state, run, stats, config, catchViewHoldIntensity(state, nowMs, config))
}

export function catchViewResetPullLine(state: CatchViewState, config: FishingConfig): CatchViewState {
  return { ...state, pullLine: initialPullInLineState(config), lastPullTension: null, pullHoldStartMs: null }
}

export function catchViewCreateBiteSchedule(
  anchorMs: number,
  stats: FisherStats,
  config: FishingConfig,
  rng: FishingRng,
  lureDrawn: boolean,
): BiteSchedule {
  return createBiteSchedule(anchorMs, stats, config, rng, lureDrawn)
}

export function catchViewLineBreakTension(config: FishingConfig): number {
  return pullInTuning(config).lineBreakTension
}

export function catchViewTensionWouldSnap(intensity: number, stats: FisherStats, config: FishingConfig): boolean {
  const tension = lineTensionAtPull(intensity, stats, config, 0)
  return lineSnapsAtTension(tension, config)
}

export interface CatchBobberDraw {
  x: number
  y: number
  submerged: boolean
  nibbleDip: boolean
}

/** Bobber pose for script-drawn art (waves, nibbles, submerge). */
export function catchViewBobberDraw(
  state: CatchViewState,
  nowMs: number,
  run: FishingRun,
  schedule: BiteSchedule | null,
  stats: FisherStats,
  config: FishingConfig,
): CatchBobberDraw {
  const lureElapsed = state.lureRoundStartMs !== null ? nowMs - state.lureRoundStartMs : nowMs
  const motion =
    run.stage === 'lure'
      ? lineMotionOffset(lureElapsed, catchViewSelectedRhythmId(state, config), stats, config) * 3
      : Math.sin((nowMs / WAVE_PERIOD_MS) * Math.PI * 2) * 2

  let y = state.bobber.y + motion
  let submerged = false
  let nibbleDip = false

  if (run.stage === 'bite' && schedule) {
    const at = nowMs
    if (at >= schedule.submergedBeginMs && at <= schedule.hookWindowEndMs + 120) {
      submerged = true
      y = state.bobber.y + 10
    } else if (at >= schedule.nibbleBeginMs && at < schedule.submergedBeginMs) {
      if (Math.abs(at - schedule.nibbleTwitchMs) < 90) nibbleDip = true
      y = state.bobber.y + (nibbleDip ? NIBBLE_DIP_PX : motion * 0.5)
    } else {
      y = state.bobber.y + motion
    }
  }

  return { x: state.bobber.x, y, submerged, nibbleDip }
}

export interface CatchRhythmMeterDraw {
  rhythmId: string
  periodMs: number
  beats: number[]
  taps: number[]
  picking: boolean
}

export function catchViewRhythmMeter(state: CatchViewState, config: FishingConfig): CatchRhythmMeterDraw {
  const rhythmId = catchViewSelectedRhythmId(state, config)
  const periodMs = rhythmById(rhythmId, config).periodMs
  const beats = expectedBeatTimesMs(rhythmId, config)
  return {
    rhythmId,
    periodMs,
    beats,
    taps: state.lureTapsMs,
    picking: state.lurePhase === 'pick',
  }
}

export interface CatchTensionMeterDraw {
  /** Live tension while holding, else the last pull's tension. */
  tension: number
  breakAt: number
  weakenAt: number
  integrity: number
  maxIntegrity: number
  /** 0..1 of the way to the landing point. */
  progress: number
  holding: boolean
  /** True while the held (or last) pull is past the weaken threshold. */
  weakening: boolean
  lineTensionLabel: (typeof PULL_IN_HUD_TERM)['lineTension']
  lineIntegrityLabel: (typeof PULL_IN_HUD_TERM)['lineIntegrity']
  landingPointLabel: (typeof PULL_IN_HUD_TERM)['landingPoint']
}

export function catchViewTensionMeter(
  state: CatchViewState,
  config: FishingConfig,
  nowMs = 0,
  stats?: FisherStats,
): CatchTensionMeterDraw {
  const t = pullInTuning(config)
  const holding = state.pullHoldStartMs !== null
  const tension =
    holding && stats
      ? lineTensionAtPull(catchViewHoldIntensity(state, nowMs, config), stats, config, state.pullLine.fightTicks)
      : (state.lastPullTension ?? 0)
  return {
    tension,
    breakAt: t.lineBreakTension,
    weakenAt: t.weakenTensionThreshold,
    integrity: state.pullLine.integrity,
    maxIntegrity: t.lineStrengthMax,
    progress: Math.min(1, state.pullLine.progress / t.progressToLand),
    holding,
    weakening: tension > t.weakenTensionThreshold,
    lineTensionLabel: PULL_IN_HUD_TERM.lineTension,
    lineIntegrityLabel: PULL_IN_HUD_TERM.lineIntegrity,
    landingPointLabel: PULL_IN_HUD_TERM.landingPoint,
  }
}

export function catchViewShowsBobber(run: FishingRun): boolean {
  return run.stage === 'lure' || run.stage === 'bite' || run.stage === 'pullIn'
}

export function lureBeatsPerRound(config: FishingConfig): number {
  return lureTuning(config).beatsPerRound
}

export function catchViewRhythmHitWindowMs(config: FishingConfig): number {
  return lureTuning(config).rhythmHitWindowMs
}
