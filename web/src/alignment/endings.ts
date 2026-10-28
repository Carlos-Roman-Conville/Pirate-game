import names from './endings.json'
import type { AlignmentConfig } from './engine'
import type { AlignmentState } from './state'
import { classify, type Region } from './square'
import { isPerfect, townPosition } from './town'

export interface Ending { id: Region; perfect: boolean; name: string | null }

export function ending(state: AlignmentState, config: AlignmentConfig): Ending {
  const id = classify(townPosition(state, config), {
    ...config.thresholds.thresholds, tieBreak: config.thresholds.tieBreak,
  }, state.town.region)
  return { id, perfect: isPerfect(state, config), name: names[id] }
}
