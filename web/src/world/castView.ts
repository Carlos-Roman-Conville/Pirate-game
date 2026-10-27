// Cast stages 2–4 on the dock: input, timing, and landing (pure TS; DockScene paints).

import {
  directionLinePosition,
  maxThrowDistanceTiles,
  powerMeterValue,
  resolveCastLanding,
  type AimTarget,
  type CastFacing,
  type CastLanding,
} from '../fishing/cast'
import {
  aimMarkerLayout,
  directionConeLayout,
  powerMeterLayout,
  type AimMarkerDraw,
  type DirectionConeDraw,
  type Point2,
  type PowerMeterDraw,
} from '../fishing/castDraw'
import { dispatch, type FisherStats, type FishingConfig, type FishingRun } from '../fishing/machine'

export interface AimTuning {
  defaultDistanceTiles: number
  minDistanceTiles: number
  lateralLimitTiles: number
  nudgeDistanceTiles: number
  nudgeLateralTiles: number
}

export interface CastViewContext {
  originTiles: Point2
  facing: CastFacing
  tileSize: number
}

export interface CastViewState {
  context: CastViewContext
  aim: AimTarget
  stageEnteredMs: number
  linePositionAtPress: number | null
  actualPower: number | null
  landing: CastLanding | null
  flyStartMs: number | null
}

export interface AimKeyInput {
  forward: boolean
  back: boolean
  left: boolean
  right: boolean
}

const CAST_STAGES = new Set(['aim', 'direction', 'power'])

export function aimTuning(config: FishingConfig): AimTuning {
  const a = config.aim
  return {
    defaultDistanceTiles: Number(a.defaultDistanceTiles),
    minDistanceTiles: Number(a.minDistanceTiles),
    lateralLimitTiles: Number(a.lateralLimitTiles),
    nudgeDistanceTiles: Number(a.nudgeDistanceTiles),
    nudgeLateralTiles: Number(a.nudgeLateralTiles),
  }
}

export function castFlyDurationMs(config: FishingConfig): number {
  return Number(config.castFly.durationMs)
}

export function createCastView(
  context: CastViewContext,
  stats: FisherStats,
  config: FishingConfig,
  stageEnteredMs: number,
): CastViewState {
  const t = aimTuning(config)
  const max = maxThrowDistanceTiles(stats, config)
  const distance = Math.min(t.defaultDistanceTiles, max)
  return {
    context,
    aim: { distanceTiles: distance, lateralTiles: 0 },
    stageEnteredMs,
    linePositionAtPress: null,
    actualPower: null,
    landing: null,
    flyStartMs: null,
  }
}

export function castStageElapsedMs(state: CastViewState, nowMs: number): number {
  return Math.max(0, nowMs - state.stageEnteredMs)
}

export function castViewShowsOverlay(run: FishingRun, state: CastViewState, nowMs: number, config: FishingConfig): boolean {
  if (CAST_STAGES.has(run.stage)) return true
  if (state.flyStartMs !== null && state.landing !== null) {
    const t = (nowMs - state.flyStartMs) / castFlyDurationMs(config)
    return t < 1
  }
  return false
}

function clampAim(aim: AimTarget, stats: FisherStats, config: FishingConfig): AimTarget {
  const t = aimTuning(config)
  const max = maxThrowDistanceTiles(stats, config)
  const distance = Math.min(max, Math.max(t.minDistanceTiles, aim.distanceTiles))
  const lateral = Math.max(-t.lateralLimitTiles, Math.min(t.lateralLimitTiles, aim.lateralTiles))
  return { distanceTiles: distance, lateralTiles: lateral }
}

/** Arrow / WASD nudge the aim target while the run is on the aim stage. */
export function castViewAimInput(
  state: CastViewState,
  input: AimKeyInput,
  stats: FisherStats,
  config: FishingConfig,
): CastViewState {
  const t = aimTuning(config)
  let { distanceTiles, lateralTiles } = state.aim
  if (input.forward) distanceTiles += t.nudgeDistanceTiles
  if (input.back) distanceTiles -= t.nudgeDistanceTiles
  if (input.left) lateralTiles -= t.nudgeLateralTiles
  if (input.right) lateralTiles += t.nudgeLateralTiles
  return { ...state, aim: clampAim({ distanceTiles, lateralTiles }, stats, config) }
}

function advanceRun(run: FishingRun): FishingRun {
  return dispatch(run, { type: 'stub', success: true })
}

/** Space confirms aim, direction, or power; returns an updated run when the machine should advance. */
export function castViewOnSpace(
  state: CastViewState,
  nowMs: number,
  run: FishingRun,
  stats: FisherStats,
  config: FishingConfig,
): { state: CastViewState; run: FishingRun } {
  if (run.stage === 'aim') {
    return {
      state: { ...state, stageEnteredMs: nowMs },
      run: advanceRun(run),
    }
  }
  if (run.stage === 'direction') {
    const elapsed = castStageElapsedMs(state, nowMs)
    const linePos = directionLinePosition(elapsed, stats, config)
    return {
      state: { ...state, linePositionAtPress: linePos, stageEnteredMs: nowMs },
      run: advanceRun(run),
    }
  }
  if (run.stage === 'power') {
    const elapsed = castStageElapsedMs(state, nowMs)
    const actualPower = powerMeterValue(elapsed, config)
    const linePos = state.linePositionAtPress ?? 0
    const landing = resolveCastLanding(
      state.context.originTiles,
      state.context.facing,
      state.aim,
      linePos,
      actualPower,
      stats,
      config,
    )
    return {
      state: {
        ...state,
        actualPower,
        landing,
        flyStartMs: nowMs,
        stageEnteredMs: nowMs,
      },
      run: advanceRun(run),
    }
  }
  return { state, run }
}

/** Landing point used for the fly line (matches cast.ts). */
export function castViewDrawLanding(state: CastViewState): CastLanding | null {
  return state.landing
}

export function castViewFlyProgress(state: CastViewState, nowMs: number, config: FishingConfig): number | null {
  if (state.flyStartMs === null || state.landing === null) return null
  const t = (nowMs - state.flyStartMs) / castFlyDurationMs(config)
  if (t >= 1) return null
  return Math.max(0, t)
}

export function castViewAimDraw(state: CastViewState): AimMarkerDraw {
  const { originTiles, facing, tileSize } = state.context
  return aimMarkerLayout(originTiles, facing, state.aim, tileSize)
}

export function castViewDirectionCone(
  state: CastViewState,
  nowMs: number,
  stats: FisherStats,
  config: FishingConfig,
): DirectionConeDraw {
  const { originTiles, facing, tileSize } = state.context
  const apex = { x: originTiles.x * tileSize, y: originTiles.y * tileSize }
  const coneLengthPx = state.aim.distanceTiles * tileSize * 1.15
  const elapsed = castStageElapsedMs(state, nowMs)
  return directionConeLayout(apex, facing, coneLengthPx, elapsed, stats, config)
}

export function castViewPowerMeter(
  state: CastViewState,
  nowMs: number,
  stats: FisherStats,
  config: FishingConfig,
): PowerMeterDraw {
  const elapsed = castStageElapsedMs(state, nowMs)
  return powerMeterLayout(elapsed, state.aim, stats, config)
}

export function castViewFlySegment(
  state: CastViewState,
  progress: number,
  tileSize: number,
): { from: Point2; to: Point2; bobber: Point2 } {
  const draw = castViewAimDraw(state)
  const landing = state.landing!
  const to = { x: landing.x * tileSize, y: landing.y * tileSize }
  const from = draw.apex
  const bobber = {
    x: from.x + (to.x - from.x) * progress,
    y: from.y + (to.y - from.y) * progress,
  }
  return { from, to, bobber }
}
