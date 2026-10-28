// Fishing run state machine: pure TS, no drawing. Stage bodies are stubs until later units.

import fishingData from '../../../data/pirate-ship/fishing.json'

export type FishingStage =
  | 'readWater'
  | 'aim'
  | 'direction'
  | 'power'
  | 'lure'
  | 'bite'
  | 'pullIn'
  | 'result'

/** Bite substates per FISHING.md (stage 6). */
export type BitePhase = 'waiting' | 'nibbling' | 'submerged' | 'hookWindow'

export type FishingResult = 'caught' | 'gotAway'

export type GotAwayReason = 'lineSnapped' | 'struckEarly' | 'struckNibble' | 'missedBite' | 'other'

export interface FisherAttributes {
  strength: number
  dexterity: number
  reflexes: number
  eyesight: number
  endurance: number
}

export interface FisherSkills {
  fishing: number
}

export interface FisherPersonality {
  patience: number
  calm: number
}

export interface FisherStats {
  attributes: FisherAttributes
  skills: FisherSkills
  personality: FisherPersonality
}

export interface PlaceholderFish {
  id: string
  notes: string
  distanceBand: [number, number]
  preferredRhythm: string
}

export interface FishingConfig {
  notes: string
  player: FisherStats & { notes: string }
  fish: PlaceholderFish[]
  readWater: Record<string, number | string>
  aim: Record<string, number | string>
  castFly: Record<string, number | string>
  direction: Record<string, number | string>
  power: Record<string, number | string>
  lure: Record<string, number | string>
  bite: Record<string, number | string>
  pullIn: Record<string, number | string>
  result: Record<string, number | string>
}

export const FISHING_STAGE_ORDER: readonly FishingStage[] = [
  'readWater',
  'aim',
  'direction',
  'power',
  'lure',
  'bite',
  'pullIn',
  'result',
]

const PLAY_STAGES: readonly FishingStage[] = FISHING_STAGE_ORDER.slice(0, -1)

export interface FishingRun {
  stage: FishingStage
  stats: FisherStats
  fishId: string
  bitePhase: BitePhase | null
  /** Set by the lure stage: the right rhythm played well draws the fish, so the bite comes sooner. */
  lureDrawn: boolean
  result: FishingResult | null
  gotAwayReason: GotAwayReason | null
}

export type FishingAction =
  | { type: 'stub'; success: boolean; gotAwayReason?: GotAwayReason }
  | { type: 'lure'; drawn: boolean }
  | { type: 'bite'; event: 'advance' | 'hook' | 'expired' }

export function loadFishingConfig(raw: FishingConfig = fishingData as unknown as FishingConfig): FishingConfig {
  return raw
}

export function playerStatsFromConfig(config: FishingConfig): FisherStats {
  const { attributes, skills, personality } = config.player
  return { attributes, skills, personality }
}

function fishById(config: FishingConfig, fishId: string): PlaceholderFish {
  const fish = config.fish.find((f) => f.id === fishId)
  if (!fish) throw new Error(`unknown fish id: ${fishId}`)
  return fish
}

function nextStage(stage: FishingStage): FishingStage {
  const i = PLAY_STAGES.indexOf(stage)
  if (i < 0 || i >= PLAY_STAGES.length - 1) return 'result'
  return PLAY_STAGES[i + 1]
}

function endRun(run: FishingRun, result: FishingResult, gotAwayReason?: GotAwayReason): FishingRun {
  return {
    ...run,
    stage: 'result',
    bitePhase: null,
    result,
    gotAwayReason: result === 'gotAway' ? (gotAwayReason ?? 'other') : null,
  }
}

const BITE_PHASE_ORDER: readonly BitePhase[] = ['waiting', 'nibbling', 'submerged', 'hookWindow']

function advanceBitePhase(phase: BitePhase): BitePhase {
  const i = BITE_PHASE_ORDER.indexOf(phase)
  return i < BITE_PHASE_ORDER.length - 1 ? BITE_PHASE_ORDER[i + 1] : phase
}

/** Start a run at reading the water with the placeholder player (or supplied stats). */
export function startFishing(
  config: FishingConfig = loadFishingConfig(),
  options?: { stats?: FisherStats; fishId?: string },
): FishingRun {
  const stats = options?.stats ?? playerStatsFromConfig(config)
  const fishId = options?.fishId ?? config.fish[0]?.id
  if (!fishId) throw new Error('fishing config has no fish')
  fishById(config, fishId)
  return {
    stage: 'readWater',
    stats,
    fishId,
    bitePhase: null,
    lureDrawn: false,
    result: null,
    gotAwayReason: null,
  }
}

function completePlayStage(run: FishingRun, success: boolean): FishingRun {
  if (run.stage === 'result') return run
  if (!success) return endRun(run, 'gotAway', 'other')
  const stage = run.stage
  if (stage === 'bite') return run
  const next = nextStage(stage)
  if (next === 'bite') {
    return { ...run, stage: 'bite', bitePhase: 'waiting' }
  }
  if (next === 'result') {
    return endRun(run, 'caught')
  }
  return { ...run, stage: next, bitePhase: null }
}

function dispatchBite(run: FishingRun, event: 'advance' | 'hook' | 'expired'): FishingRun {
  if (run.stage !== 'bite' || run.bitePhase === null) return run
  const phase = run.bitePhase

  if (event === 'expired') return endRun(run, 'gotAway', 'missedBite')

  if (event === 'hook') {
    if (phase === 'waiting') return endRun(run, 'gotAway', 'struckEarly')
    if (phase === 'nibbling') return endRun(run, 'gotAway', 'struckNibble')
    if (phase === 'hookWindow') {
      return { ...run, stage: 'pullIn', bitePhase: null }
    }
    return run
  }

  const nextPhase = advanceBitePhase(phase)
  return { ...run, bitePhase: nextPhase }
}

/** Apply one player or stub action; returns a new run value. */
export function dispatch(run: FishingRun, action: FishingAction): FishingRun {
  if (run.stage === 'result') return run

  if (action.type === 'stub') {
    if (run.stage === 'bite') return run
    if (run.stage === 'pullIn') {
      return action.success
        ? endRun(run, 'caught')
        : endRun(run, 'gotAway', action.gotAwayReason ?? 'other')
    }
    return completePlayStage(run, action.success)
  }

  if (action.type === 'lure') {
    if (run.stage !== 'lure') return run
    return { ...run, stage: 'bite', bitePhase: 'waiting', lureDrawn: action.drawn }
  }

  if (action.type === 'bite') return dispatchBite(run, action.event)
  return run
}

/** Hook-window length in ms from reflexes and config (used in later units). */
export function hookWindowMs(stats: FisherStats, config: FishingConfig): number {
  const bite = config.bite
  const base = Number(bite.reactionWindowBaseMs)
  const perReflex = Number(bite.reactionWindowPerReflex)
  return base + stats.attributes.reflexes * perReflex
}
