// Stages 2–4 — aim, direction cone, power meter, and where the cast lands (pure logic).

import type { FisherStats, FishingConfig } from './machine'

export interface AimTarget {
  /** Intended landing distance along the cast line (tiles). */
  distanceTiles: number
  /** Perpendicular offset from the cast line at the aim point (tiles). */
  lateralTiles: number
}

export interface CastFacing {
  dx: number
  dy: number
}

export interface DirectionTuning {
  baseConeDegrees: number
  coneShrinkPerFishingSkill: number
  minConeHalfDegrees: number
  baseLineSpeed: number
  lineSlowPerFishingSkill: number
  lineSlowPerDexterity: number
  minLineSpeed: number
}

export interface PowerTuning {
  meterPeriodMs: number
  baseMaxThrowTiles: number
  strengthDistanceFactor: number
  distancePerPowerError: number
}

export interface CastLanding {
  x: number
  y: number
  distanceTiles: number
}

const DEG = Math.PI / 180

export function directionTuning(config: FishingConfig): DirectionTuning {
  const d = config.direction
  return {
    baseConeDegrees: Number(d.baseConeDegrees),
    coneShrinkPerFishingSkill: Number(d.coneShrinkPerFishingSkill),
    minConeHalfDegrees: Number(d.minConeHalfDegrees),
    baseLineSpeed: Number(d.baseLineSpeed),
    lineSlowPerFishingSkill: Number(d.lineSlowPerFishingSkill),
    lineSlowPerDexterity: Number(d.lineSlowPerDexterity),
    minLineSpeed: Number(d.minLineSpeed),
  }
}

export function powerTuning(config: FishingConfig): PowerTuning {
  const p = config.power
  return {
    meterPeriodMs: Number(p.meterPeriodMs),
    baseMaxThrowTiles: Number(p.baseMaxThrowTiles),
    strengthDistanceFactor: Number(p.strengthDistanceFactor),
    distancePerPowerError: Number(p.distancePerPowerError),
  }
}

/** Half-width of the direction cone in degrees (fishing skill narrows it). */
export function coneHalfAngleDegrees(stats: FisherStats, config: FishingConfig): number {
  const t = directionTuning(config)
  const half = t.baseConeDegrees / 2 - stats.skills.fishing * t.coneShrinkPerFishingSkill
  return Math.max(t.minConeHalfDegrees, half)
}

/** Oscillation speed of the moving line inside the cone (cycles per second). */
export function directionLineSpeed(stats: FisherStats, config: FishingConfig): number {
  const t = directionTuning(config)
  const speed =
    t.baseLineSpeed -
    stats.skills.fishing * t.lineSlowPerFishingSkill -
    stats.attributes.dexterity * t.lineSlowPerDexterity
  return Math.max(t.minLineSpeed, speed)
}

/** Moving line position in the cone, −1 (left edge) to 1 (right edge). */
export function directionLinePosition(elapsedMs: number, stats: FisherStats, config: FishingConfig): number {
  const speed = directionLineSpeed(stats, config)
  const phase = (elapsedMs / 1000) * speed * Math.PI * 2
  return Math.sin(phase)
}

/** Aim offset inside the cone from the line position at press (radians from forward). */
export function directionAngleOffsetRadians(
  linePosition: number,
  stats: FisherStats,
  config: FishingConfig,
): number {
  const clamped = Math.max(-1, Math.min(1, linePosition))
  const halfDeg = coneHalfAngleDegrees(stats, config)
  return clamped * halfDeg * DEG
}

/** Furthest cast distance at full meter power (strength sets the cap). */
export function maxThrowDistanceTiles(stats: FisherStats, config: FishingConfig): number {
  const t = powerTuning(config)
  return t.baseMaxThrowTiles + stats.attributes.strength * t.strengthDistanceFactor
}

/** Meter reading 0–1 for the oscillating power bar at a given time. */
export function powerMeterValue(elapsedMs: number, config: FishingConfig): number {
  const period = powerTuning(config).meterPeriodMs
  const phase = (elapsedMs / period) * Math.PI * 2
  return (Math.sin(phase) + 1) / 2
}

/** Target spot on the power meter for the distance chosen in aim (0–1). */
export function targetPowerForDistance(
  aimDistanceTiles: number,
  stats: FisherStats,
  config: FishingConfig,
): number {
  const max = maxThrowDistanceTiles(stats, config)
  if (max <= 0) return 1
  return Math.min(1, Math.max(0, aimDistanceTiles / max))
}

/** Landing distance along the cast line from power error (over / on / under the aim). */
export function landingDistanceTiles(
  aimDistanceTiles: number,
  targetPower: number,
  actualPower: number,
  config: FishingConfig,
): number {
  const t = powerTuning(config)
  const error = actualPower - targetPower
  return aimDistanceTiles + error * t.distancePerPowerError
}

function normalizeFacing(facing: CastFacing): { dx: number; dy: number } {
  const len = Math.hypot(facing.dx, facing.dy)
  if (len === 0) return { dx: 0, dy: 1 }
  return { dx: facing.dx / len, dy: facing.dy / len }
}

/** World landing point after aim, direction press, and power press. */
export function resolveCastLanding(
  origin: { x: number; y: number },
  facing: CastFacing,
  aim: AimTarget,
  linePositionAtPress: number,
  actualPower: number,
  stats: FisherStats,
  config: FishingConfig,
): CastLanding {
  const forward = normalizeFacing(facing)
  const perp = { dx: -forward.dy, dy: forward.dx }
  const angle = directionAngleOffsetRadians(linePositionAtPress, stats, config)
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  const castDx = forward.dx * cos - forward.dy * sin
  const castDy = forward.dx * sin + forward.dy * cos
  const targetPower = targetPowerForDistance(aim.distanceTiles, stats, config)
  const distance = landingDistanceTiles(aim.distanceTiles, targetPower, actualPower, config)
  const lateralScale = aim.distanceTiles > 0 ? distance / aim.distanceTiles : 1
  const x = origin.x + castDx * distance + perp.dx * aim.lateralTiles * lateralScale
  const y = origin.y + castDy * distance + perp.dy * aim.lateralTiles * lateralScale
  return { x, y, distanceTiles: distance }
}
