// Stage 1 — reading the water: visible range from stats; no drawing.

import type { FisherStats, FishingConfig, PlaceholderFish } from './machine'

export interface ReadWaterTuning {
  baseRangeTiles: number
  rangePerEyesight: number
  rangePerFishingSkill: number
  viewTilesWide: number
  viewTilesHigh: number
}

export function readWaterTuning(config: FishingConfig): ReadWaterTuning {
  const rw = config.readWater
  return {
    baseRangeTiles: Number(rw.baseRangeTiles),
    rangePerEyesight: Number(rw.rangePerEyesight),
    rangePerFishingSkill: Number(rw.rangePerFishingSkill),
    viewTilesWide: Number(rw.viewTilesWide),
    viewTilesHigh: Number(rw.viewTilesHigh),
  }
}

/** How far out (tiles from the fisher) silhouettes can be seen. */
export function visibleRangeTiles(stats: FisherStats, config: FishingConfig): number {
  const t = readWaterTuning(config)
  return (
    t.baseRangeTiles +
    stats.attributes.eyesight * t.rangePerEyesight +
    stats.skills.fishing * t.rangePerFishingSkill
  )
}

/** Placeholder distance for a fish silhouette (midpoint of its band). */
export function silhouetteDistanceTiles(fish: PlaceholderFish): number {
  const [min, max] = fish.distanceBand
  return (min + max) / 2
}

export function isFishSilhouetteVisible(
  distanceTiles: number,
  stats: FisherStats,
  config: FishingConfig,
): boolean {
  return distanceTiles <= visibleRangeTiles(stats, config)
}

/** Fish ids whose silhouettes show during read-the-water. */
export function visibleFishSilhouettes(stats: FisherStats, config: FishingConfig): PlaceholderFish[] {
  return config.fish.filter((f) =>
    isFishSilhouetteVisible(silhouetteDistanceTiles(f), stats, config),
  )
}
