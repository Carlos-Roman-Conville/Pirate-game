// Which fishing stages keep the read-the-water silhouettes on screen (pure; DockScene paints).

const SILHOUETTE_STAGES = new Set(['readWater', 'aim', 'direction', 'power'])

/** The fish seen while reading the water stay visible through aim, direction and power, so the player can aim at them. */
export function silhouettesShownAtStage(stage: string): boolean {
  return SILHOUETTE_STAGES.has(stage)
}

/** Clear them once the cast has left the cast stages and the line is no longer flying. */
export function silhouettesClearAt(stage: string, castFlying: boolean): boolean {
  return !silhouettesShownAtStage(stage) && !castFlying
}
