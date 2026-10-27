// Stage 5 — pick a rhythm, play the rhythm game; patience dampens line motion (pure logic).

import type { FisherStats, FishingConfig, PlaceholderFish } from './machine'

export interface LureRhythm {
  id: string
  periodMs: number
}

export interface LureTuning {
  patienceMotionScale: number
  minMotionAmplitude: number
  rhythmHitWindowMs: number
  beatsPerRound: number
  rhythms: LureRhythm[]
}

interface LureConfigSection {
  patienceMotionScale: number
  minMotionAmplitude: number
  rhythmHitWindowMs: number
  beatsPerRound: number
  rhythms: LureRhythm[]
}

function lureSection(config: FishingConfig): LureConfigSection {
  const lure = config.lure as unknown as LureConfigSection
  return lure
}

export function lureTuning(config: FishingConfig): LureTuning {
  const lure = lureSection(config)
  return {
    patienceMotionScale: Number(lure.patienceMotionScale),
    minMotionAmplitude: Number(lure.minMotionAmplitude),
    rhythmHitWindowMs: Number(lure.rhythmHitWindowMs),
    beatsPerRound: Number(lure.beatsPerRound),
    rhythms: lure.rhythms.map((r) => ({ id: r.id, periodMs: Number(r.periodMs) })),
  }
}

export function lureRhythmIds(config: FishingConfig): string[] {
  return lureTuning(config).rhythms.map((r) => r.id)
}

export function rhythmById(rhythmId: string, config: FishingConfig): LureRhythm {
  const rhythm = lureTuning(config).rhythms.find((r) => r.id === rhythmId)
  if (!rhythm) throw new Error(`unknown lure rhythm: ${rhythmId}`)
  return rhythm
}

/** 0–1 scale; higher patience means less line wobble (more purposeful motion). */
export function lineMotionAmplitude(stats: FisherStats, config: FishingConfig): number {
  const t = lureTuning(config)
  const damped = 1 - stats.personality.patience * t.patienceMotionScale
  return Math.max(t.minMotionAmplitude, Math.min(1, damped))
}

/** Line offset along the lure axis for the chosen rhythm (−1 to 1). */
export function lineMotionOffset(
  elapsedMs: number,
  rhythmId: string,
  stats: FisherStats,
  config: FishingConfig,
): number {
  const period = rhythmById(rhythmId, config).periodMs
  const amp = lineMotionAmplitude(stats, config)
  const phase = (elapsedMs / period) * Math.PI * 2
  return amp * Math.sin(phase)
}

/** Beat times (ms from round start) the player should match for one lure round. */
export function expectedBeatTimesMs(rhythmId: string, config: FishingConfig): number[] {
  const { beatsPerRound } = lureTuning(config)
  const period = rhythmById(rhythmId, config).periodMs
  return Array.from({ length: beatsPerRound }, (_, i) => i * period)
}

/** Whether tap times land on each expected beat within the config window. */
export function rhythmPlaySucceeded(tapTimesMs: number[], rhythmId: string, config: FishingConfig): boolean {
  const beats = expectedBeatTimesMs(rhythmId, config)
  const window = lureTuning(config).rhythmHitWindowMs
  if (tapTimesMs.length !== beats.length) return false
  for (let i = 0; i < beats.length; i++) {
    if (Math.abs(tapTimesMs[i] - beats[i]) > window) return false
  }
  return true
}

/** Fish bite interest when the chosen rhythm matches what that species likes. */
export function isRhythmMatchForFish(fish: PlaceholderFish, rhythmId: string): boolean {
  return fish.preferredRhythm === rhythmId
}

/** A successful rhythm round with the fish's preferred rhythm draws it toward the hook. */
export function fishDrawnByLure(
  fish: PlaceholderFish,
  selectedRhythmId: string,
  tapTimesMs: number[],
  config: FishingConfig,
): boolean {
  if (!isRhythmMatchForFish(fish, selectedRhythmId)) return false
  return rhythmPlaySucceeded(tapTimesMs, selectedRhythmId, config)
}
