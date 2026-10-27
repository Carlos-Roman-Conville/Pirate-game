// Thin drawing helpers for cast stages 2–4 (geometry only; callers paint).

import type { FisherStats, FishingConfig } from './machine'
import {
  coneHalfAngleDegrees,
  directionAngleOffsetRadians,
  directionLinePosition,
  powerMeterValue,
  targetPowerForDistance,
  type AimTarget,
  type CastFacing,
} from './cast'

export const CAST_HUD_CLASS = {
  aim: 'pirate-ship-fishing-aim',
  direction: 'pirate-ship-fishing-direction',
  power: 'pirate-ship-fishing-power',
} as const

export interface Point2 {
  x: number
  y: number
}

export interface DirectionConeDraw {
  className: typeof CAST_HUD_CLASS.direction
  apex: Point2
  left: Point2
  right: Point2
  lineEnd: Point2
  halfAngleDegrees: number
}

export interface PowerMeterDraw {
  className: typeof CAST_HUD_CLASS.power
  fill: number
  target: number
}

function normalizeFacing(facing: CastFacing): { dx: number; dy: number } {
  const len = Math.hypot(facing.dx, facing.dy)
  if (len === 0) return { dx: 0, dy: 1 }
  return { dx: facing.dx / len, dy: facing.dy / len }
}

export interface AimMarkerDraw {
  className: typeof CAST_HUD_CLASS.aim
  apex: Point2
  marker: Point2
}

/** Aim reticle along the fisher's facing before direction is chosen. */
export function aimMarkerLayout(
  originTiles: Point2,
  facing: CastFacing,
  aim: AimTarget,
  tileSize: number,
): AimMarkerDraw {
  const forward = normalizeFacing(facing)
  const perp = { dx: -forward.dy, dy: forward.dx }
  const apex = { x: originTiles.x * tileSize, y: originTiles.y * tileSize }
  const markerTiles = {
    x: originTiles.x + forward.dx * aim.distanceTiles + perp.dx * aim.lateralTiles,
    y: originTiles.y + forward.dy * aim.distanceTiles + perp.dy * aim.lateralTiles,
  }
  return {
    className: CAST_HUD_CLASS.aim,
    apex,
    marker: { x: markerTiles.x * tileSize, y: markerTiles.y * tileSize },
  }
}

function pointOnRay(apex: Point2, angleRad: number, length: number): Point2 {
  return {
    x: apex.x + Math.sin(angleRad) * length,
    y: apex.y - Math.cos(angleRad) * length,
  }
}

/** Cone edges and the moving line for the direction stage. */
export function directionConeLayout(
  apex: Point2,
  facing: CastFacing,
  coneLengthPx: number,
  elapsedMs: number,
  stats: FisherStats,
  config: FishingConfig,
): DirectionConeDraw {
  const forward = normalizeFacing(facing)
  const forwardAngle = Math.atan2(forward.dx, -forward.dy)
  const halfDeg = coneHalfAngleDegrees(stats, config)
  const halfRad = halfDeg * (Math.PI / 180)
  const linePos = directionLinePosition(elapsedMs, stats, config)
  const lineAngle = forwardAngle + directionAngleOffsetRadians(linePos, stats, config)
  return {
    className: CAST_HUD_CLASS.direction,
    apex,
    left: pointOnRay(apex, forwardAngle - halfRad, coneLengthPx),
    right: pointOnRay(apex, forwardAngle + halfRad, coneLengthPx),
    lineEnd: pointOnRay(apex, lineAngle, coneLengthPx),
    halfAngleDegrees: halfDeg,
  }
}

/** Power meter fill and target marker for the aim distance. */
export function powerMeterLayout(
  elapsedMs: number,
  aim: AimTarget,
  stats: FisherStats,
  config: FishingConfig,
): PowerMeterDraw {
  return {
    className: CAST_HUD_CLASS.power,
    fill: powerMeterValue(elapsedMs, config),
    target: targetPowerForDistance(aim.distanceTiles, stats, config),
  }
}
