// Dock activity loop: walk the dock, fish through the run, short result panel, back to walking.

import glossary from '../../../data/pirate-ship/glossary.json'
import {
  dispatch,
  loadFishingConfig,
  startFishing,
  type FishingConfig,
  type FishingResult,
  type FishingRun,
  type GotAwayReason,
} from './machine'

export type DockMode = 'walking' | 'fishing' | 'showingResult'

export interface DockLoopState {
  mode: DockMode
  run: FishingRun | null
}

export const RESULT_PANEL_CLASS = 'pirate-ship-fishing-result'

export interface ResultTuning {
  caughtLabel: string
  gotAwayLabel: string
  continuePrompt: string
}

interface ResultConfigSection {
  caughtLabel: string
  gotAwayLabel: string
  continuePrompt: string
}

function resultSection(config: FishingConfig): ResultConfigSection {
  const r = config.result as unknown as ResultConfigSection
  return r
}

export function resultTuning(config: FishingConfig): ResultTuning {
  const r = resultSection(config)
  return {
    caughtLabel: String(r.caughtLabel),
    gotAwayLabel: String(r.gotAwayLabel),
    continuePrompt: String(r.continuePrompt),
  }
}

function glossaryEn(code: string): string {
  const entry = glossary.terms.find((term) => term.code === code)
  if (!entry) throw new Error(`missing glossary code: ${code}`)
  return entry.en
}

function gotAwayDetailLine(reason: GotAwayReason | null | undefined): string | null {
  if (!reason || reason === 'other') return null
  return glossaryEn(reason)
}

export function resultPanelMessage(
  result: FishingResult,
  config: FishingConfig,
  gotAwayReason?: GotAwayReason | null,
): string {
  const t = resultTuning(config)
  const headline = result === 'caught' ? t.caughtLabel : t.gotAwayLabel
  const detail = result === 'gotAway' ? gotAwayDetailLine(gotAwayReason) : null
  const lines = detail ? [headline, detail, t.continuePrompt] : [headline, t.continuePrompt]
  return lines.join('\n')
}

export function initialDockLoop(): DockLoopState {
  return { mode: 'walking', run: null }
}

/** True when the player may move on the dock map. */
export function dockAllowsWalking(loop: DockLoopState): boolean {
  return loop.mode === 'walking'
}

/** Start fishing at the dock edge; no-op if not walking or not at the edge. */
export function tryStartFishingAtDock(
  loop: DockLoopState,
  atDockEdge: boolean,
  config: FishingConfig = loadFishingConfig(),
): DockLoopState {
  if (loop.mode !== 'walking' || !atDockEdge) return loop
  return { mode: 'fishing', run: startFishing(config) }
}

/** Sync the active run; enters the result panel when the run ends. */
export function applyFishingRun(loop: DockLoopState, run: FishingRun): DockLoopState {
  if (loop.mode !== 'fishing') return loop
  if (run.stage === 'result') {
    return { mode: 'showingResult', run }
  }
  return { ...loop, run }
}

/** Leave the result panel and return to walking the dock. */
export function dismissResultPanel(loop: DockLoopState): DockLoopState {
  if (loop.mode !== 'showingResult') return loop
  return initialDockLoop()
}

/** Advance the run with a stub stage outcome (used when a stage has no full UI yet). */
export function stubAdvanceRun(run: FishingRun, success: boolean): FishingRun {
  return dispatch(run, { type: 'stub', success })
}
