import { describe, expect, it } from 'vitest'
import { loadFishingConfig, playerStatsFromConfig, type FisherStats } from './machine'
import {
  isFishSilhouetteVisible,
  silhouetteDistanceTiles,
  visibleFishSilhouettes,
  visibleRangeTiles,
} from './readWater'

const config = loadFishingConfig()
const baseStats = playerStatsFromConfig(config)

function statsWith(partial: {
  eyesight?: number
  fishing?: number
}): FisherStats {
  return {
    ...baseStats,
    attributes: {
      ...baseStats.attributes,
      eyesight: partial.eyesight ?? baseStats.attributes.eyesight,
    },
    skills: {
      ...baseStats.skills,
      fishing: partial.fishing ?? baseStats.skills.fishing,
    },
  }
}

describe('visible range from stats', () => {
  it('uses only numbers from fishing.json readWater', () => {
    const rw = config.readWater
    expect(visibleRangeTiles(baseStats, config)).toBe(
      Number(rw.baseRangeTiles) +
        baseStats.attributes.eyesight * Number(rw.rangePerEyesight) +
        baseStats.skills.fishing * Number(rw.rangePerFishingSkill),
    )
  })

  it('shows fish farther away when eyesight is higher', () => {
    const low = statsWith({ eyesight: 1, fishing: 0 })
    const high = statsWith({ eyesight: 20, fishing: 0 })
    expect(visibleRangeTiles(high, config)).toBeGreaterThan(visibleRangeTiles(low, config))
    const far = 12
    expect(isFishSilhouetteVisible(far, low, config)).toBe(false)
    expect(isFishSilhouetteVisible(far, high, config)).toBe(true)
  })

  it('shows fish farther away when fishing skill is higher', () => {
    const low = statsWith({ eyesight: 1, fishing: 0 })
    const high = statsWith({ eyesight: 1, fishing: 80 })
    expect(visibleRangeTiles(high, config)).toBeGreaterThan(visibleRangeTiles(low, config))
    const far = 11
    expect(isFishSilhouetteVisible(far, low, config)).toBe(false)
    expect(isFishSilhouetteVisible(far, high, config)).toBe(true)
  })
})

describe('fish silhouettes', () => {
  it('hides a fish beyond visible range', () => {
    const stats = statsWith({ eyesight: 1, fishing: 0 })
    const range = visibleRangeTiles(stats, config)
    const beyond = range + 2
    expect(isFishSilhouetteVisible(beyond, stats, config)).toBe(false)
    expect(visibleFishSilhouettes(stats, config).every((f) => silhouetteDistanceTiles(f) <= range)).toBe(true)
  })

  it('includes placeholder fish within range for the default captain', () => {
    const visible = visibleFishSilhouettes(baseStats, config)
    const minnow = config.fish.find((f) => f.id === 'placeholder-minnow')
    expect(minnow).toBeDefined()
    expect(visible.some((f) => f.id === 'placeholder-minnow')).toBe(true)
  })
})
