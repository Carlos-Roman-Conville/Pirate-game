// Stage 6 — bobber showdown timings (pure logic; clock and RNG injected).

import { hookWindowMs, type BitePhase, type FisherStats, type FishingConfig, type FishingRun, dispatch } from './machine'

export interface FishingClock {
  now(): number
}

/** Uniform 0 <= x < 1 */
export interface FishingRng {
  next(): number
}

export interface BiteTuning {
  waitingMs: number
  nibbleMs: number
  submergedMs: number
}

export interface BiteSchedule {
  /** When the bobber sequence started (ms). */
  anchorMs: number
  /** End of waiting / start of nibbling. */
  nibbleBeginMs: number
  /** End of nibbling / bite (submerge). */
  submergedBeginMs: number
  /** Hook-setting window opens. */
  hookWindowBeginMs: number
  /** Last instant a hook still counts (inclusive). */
  hookWindowEndMs: number
  /** One nibble twitch moment for UI feedback (within nibbling). */
  nibbleTwitchMs: number
}

export type HookPressOutcome = 'tooEarly' | 'falseStrike' | 'hooked' | 'tooLate'

export const BITE_FX_CLASS = {
  splash: 'pirate-ship-fishing-bite-splash',
  sound: 'pirate-ship-fishing-bite-sound',
  bobber: 'pirate-ship-fishing-bobber',
} as const

interface BiteConfigSection {
  waitingMs: number
  nibbleMs: number
  submergedMs: number
}

function biteSection(config: FishingConfig): BiteConfigSection {
  return config.bite as unknown as BiteConfigSection
}

export function biteTuning(config: FishingConfig): BiteTuning {
  const b = biteSection(config)
  return {
    waitingMs: Number(b.waitingMs),
    nibbleMs: Number(b.nibbleMs),
    submergedMs: Number(b.submergedMs),
  }
}

export function reactionWindowMs(stats: FisherStats, config: FishingConfig): number {
  return hookWindowMs(stats, config)
}

/** Build absolute timestamps for FISHING.md's bite beats. */
export function createBiteSchedule(
  anchorMs: number,
  stats: FisherStats,
  config: FishingConfig,
  rng: FishingRng,
): BiteSchedule {
  const t = biteTuning(config)
  const windowMs = reactionWindowMs(stats, config)
  const nibbleBeginMs = anchorMs + t.waitingMs
  const submergedBeginMs = nibbleBeginMs + t.nibbleMs
  const hookWindowBeginMs = submergedBeginMs + t.submergedMs
  const hookWindowEndMs = hookWindowBeginMs + windowMs
  const nibbleTwitchMs = nibbleBeginMs + rng.next() * t.nibbleMs
  return {
    anchorMs,
    nibbleBeginMs,
    submergedBeginMs,
    hookWindowBeginMs,
    hookWindowEndMs,
    nibbleTwitchMs,
  }
}

export function bitePhaseAt(schedule: BiteSchedule, atMs: number): BitePhase | 'expired' {
  if (atMs < schedule.nibbleBeginMs) return 'waiting'
  if (atMs < schedule.submergedBeginMs) return 'nibbling'
  if (atMs < schedule.hookWindowBeginMs) return 'submerged'
  if (atMs <= schedule.hookWindowEndMs) return 'hookWindow'
  return 'expired'
}

export function resolveHookPress(schedule: BiteSchedule, pressMs: number): HookPressOutcome {
  if (pressMs < schedule.nibbleBeginMs) return 'tooEarly'
  if (pressMs < schedule.submergedBeginMs) return 'falseStrike'
  if (pressMs < schedule.hookWindowBeginMs) return 'tooEarly'
  if (pressMs <= schedule.hookWindowEndMs) return 'hooked'
  return 'tooLate'
}

function endGotAway(run: FishingRun): FishingRun {
  return { ...run, stage: 'result', bitePhase: null, result: 'gotAway' }
}

function advanceRunToPhase(run: FishingRun, schedule: BiteSchedule, atMs: number): FishingRun {
  const target = bitePhaseAt(schedule, atMs)
  if (target === 'expired') return run
  let r = run
  while (r.bitePhase !== null && r.bitePhase !== target && r.stage === 'bite') {
    const next = dispatch(r, { type: 'bite', event: 'advance' })
    if (next === r) break
    r = next
  }
  return r
}

/** Apply a timed hook press to the run (stage must already be bite). */
export function dispatchTimedHookPress(
  run: FishingRun,
  schedule: BiteSchedule,
  pressMs: number,
  _config: FishingConfig,
): FishingRun {
  if (run.stage !== 'bite') return run
  const outcome = resolveHookPress(schedule, pressMs)
  if (outcome === 'tooLate') return endGotAway(run)
  if (outcome === 'hooked') {
    const atWindow = advanceRunToPhase(run, schedule, pressMs)
    return dispatch(atWindow, { type: 'bite', event: 'hook' })
  }
  const atPress = advanceRunToPhase(run, schedule, pressMs)
  return dispatch(atPress, { type: 'bite', event: 'hook' })
}

/** Advance bite phase from the clock when the schedule boundary is crossed (for UI ticks). */
export function syncBitePhaseToClock(
  run: FishingRun,
  schedule: BiteSchedule,
  clock: FishingClock,
): FishingRun {
  if (run.stage !== 'bite' || run.bitePhase === null) return run
  const target = bitePhaseAt(schedule, clock.now())
  if (target === 'expired') return endGotAway(run)
  let r = run
  while (r.bitePhase !== null && r.bitePhase !== target && r.stage === 'bite') {
    const next = dispatch(r, { type: 'bite', event: 'advance' })
    if (next === r) break
    r = next
  }
  return r
}
