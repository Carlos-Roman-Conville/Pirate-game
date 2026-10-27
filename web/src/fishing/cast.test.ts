import { describe, expect, it } from 'vitest'
import { loadFishingConfig, playerStatsFromConfig } from './machine'
import {
  directionLineSpeed,
  landingDistanceTiles,
  maxThrowDistanceTiles,
  powerTuning,
  resolveCastLanding,
  targetPowerForDistance,
} from './cast'

const config = loadFishingConfig()
const stats = playerStatsFromConfig(config)

describe('cast landing distance', () => {
  const aimDistance = 5

  it('lands on the aim distance when power matches the target spot', () => {
    const target = targetPowerForDistance(aimDistance, stats, config)
    expect(landingDistanceTiles(aimDistance, target, target, config)).toBe(aimDistance)
  })

  it('lands past the target when power is over', () => {
    const target = targetPowerForDistance(aimDistance, stats, config)
    expect(target).toBeLessThan(1)
    const over = target + 0.15
    expect(landingDistanceTiles(aimDistance, target, over, config)).toBeGreaterThan(aimDistance)
    const delta = Number(config.power.distancePerPowerError) * (over - target)
    expect(landingDistanceTiles(aimDistance, target, over, config)).toBe(aimDistance + delta)
  })

  it('lands short of the target when power is under', () => {
    const target = targetPowerForDistance(aimDistance, stats, config)
    const under = target - 0.15
    expect(landingDistanceTiles(aimDistance, target, under, config)).toBeLessThan(aimDistance)
    const delta = Number(config.power.distancePerPowerError) * (under - target)
    expect(landingDistanceTiles(aimDistance, target, under, config)).toBe(aimDistance + delta)
  })

  it('does not throw past max range when target power is capped at 1', () => {
    const max = maxThrowDistanceTiles(stats, config)
    const target = targetPowerForDistance(max + 5, stats, config)
    expect(target).toBe(1)
  })
})

describe('resolveCastLanding', () => {
  it('reports the same distance along the cast line as landingDistanceTiles', () => {
    const aim = { distanceTiles: 8, lateralTiles: 0 }
    const target = targetPowerForDistance(aim.distanceTiles, stats, config)
    const landing = resolveCastLanding(
      { x: 5, y: 5 },
      { dx: 0, dy: 1 },
      aim,
      0,
      target,
      stats,
      config,
    )
    expect(landing.distanceTiles).toBe(aim.distanceTiles)
    expect(landing.y).toBeCloseTo(5 + aim.distanceTiles, 5)
  })
})

describe('direction tuning from data', () => {
  it('slows the line when fishing skill and dexterity are higher', () => {
    const base = directionLineSpeed(stats, config)
    const skilled = directionLineSpeed(
      {
        ...stats,
        skills: { fishing: stats.skills.fishing + 30 },
        attributes: { ...stats.attributes, dexterity: stats.attributes.dexterity + 5 },
      },
      config,
    )
    expect(skilled).toBeLessThan(base)
    expect(base).toBeGreaterThanOrEqual(Number(config.direction.minLineSpeed))
  })

  it('derives max throw from strength using config only', () => {
    const t = powerTuning(config)
    expect(maxThrowDistanceTiles(stats, config)).toBe(
      t.baseMaxThrowTiles + stats.attributes.strength * t.strengthDistanceFactor,
    )
  })
})
