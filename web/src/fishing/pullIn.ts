// Stage 7 — line tension; pull too hard weakens or snaps the line (pure logic).

import type { FisherStats, FishingConfig } from './machine'

export interface PullInTuning {
  lineBreakTension: number
  weakenTensionThreshold: number
  lineStrengthMax: number
  integrityLossPerPullOverWeaken: number
  basePullTensionPerIntensity: number
  strengthPullBonus: number
  calmTensionReduction: number
  patienceTensionReduction: number
  dexterityTensionReduction: number
  enduranceFightBonus: number
}

interface PullInConfigSection {
  lineBreakTension: number
  weakenTensionThreshold: number
  lineStrengthMax: number
  integrityLossPerPullOverWeaken: number
  basePullTensionPerIntensity: number
  strengthPullBonus: number
  calmTensionReduction: number
  patienceTensionReduction: number
  dexterityTensionReduction: number
  enduranceFightBonus: number
}

function pullInSection(config: FishingConfig): PullInConfigSection {
  return config.pullIn as unknown as PullInConfigSection
}

export function pullInTuning(config: FishingConfig): PullInTuning {
  const p = pullInSection(config)
  return {
    lineBreakTension: Number(p.lineBreakTension),
    weakenTensionThreshold: Number(p.weakenTensionThreshold),
    lineStrengthMax: Number(p.lineStrengthMax),
    integrityLossPerPullOverWeaken: Number(p.integrityLossPerPullOverWeaken),
    basePullTensionPerIntensity: Number(p.basePullTensionPerIntensity),
    strengthPullBonus: Number(p.strengthPullBonus),
    calmTensionReduction: Number(p.calmTensionReduction),
    patienceTensionReduction: Number(p.patienceTensionReduction),
    dexterityTensionReduction: Number(p.dexterityTensionReduction),
    enduranceFightBonus: Number(p.enduranceFightBonus),
  }
}

export interface PullInLineState {
  /** Remaining line strength before a cumulative break (weakening). */
  integrity: number
  /** Fight length in pull ticks (endurance helps on long fights). */
  fightTicks: number
}

export function initialPullInLineState(config: FishingConfig): PullInLineState {
  const t = pullInTuning(config)
  return { integrity: t.lineStrengthMax, fightTicks: 0 }
}

/**
 * Line tension from pull intensity (0 = slack, 1 = full yank).
 * Strength adds pull; calm, patience and dexterity ease tension; endurance helps over a long fight.
 */
export function lineTensionAtPull(
  pullIntensity: number,
  stats: FisherStats,
  config: FishingConfig,
  fightTicks = 0,
): number {
  const t = pullInTuning(config)
  const clamped = Math.max(0, pullIntensity)
  const pullScale =
    t.basePullTensionPerIntensity + stats.attributes.strength * t.strengthPullBonus
  const statEase =
    stats.personality.calm * t.calmTensionReduction +
    stats.personality.patience * t.patienceTensionReduction +
    stats.attributes.dexterity * t.dexterityTensionReduction
  const enduranceEase = fightTicks * stats.attributes.endurance * t.enduranceFightBonus
  const raw = clamped * pullScale - statEase - enduranceEase
  return Math.max(0, raw)
}

/** Snap when tension is strictly past the configured break threshold. */
export function lineSnapsAtTension(tension: number, config: FishingConfig): boolean {
  return tension > pullInTuning(config).lineBreakTension
}

export interface PullInStepResult {
  state: PullInLineState
  tension: number
  snapped: boolean
  weakened: boolean
}

/** One pull input: may weaken the line or snap it if tension exceeds the break threshold. */
export function applyPullStep(
  state: PullInLineState,
  pullIntensity: number,
  stats: FisherStats,
  config: FishingConfig,
): PullInStepResult {
  const t = pullInTuning(config)
  const tension = lineTensionAtPull(pullIntensity, stats, config, state.fightTicks)
  if (lineSnapsAtTension(tension, config)) {
    return {
      state: { ...state, integrity: 0, fightTicks: state.fightTicks + 1 },
      tension,
      snapped: true,
      weakened: false,
    }
  }
  let integrity = state.integrity
  let weakened = false
  if (tension > t.weakenTensionThreshold) {
    integrity = Math.max(0, integrity - t.integrityLossPerPullOverWeaken)
    weakened = true
  }
  const snapped = integrity <= 0
  return {
    state: { integrity, fightTicks: state.fightTicks + 1 },
    tension,
    snapped,
    weakened,
  }
}
