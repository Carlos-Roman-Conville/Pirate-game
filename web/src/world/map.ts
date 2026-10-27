// The dock map and collision: pure TS, no Phaser, so vitest can test it.

export interface TileKind { name: string; solid: boolean }
export interface MapData {
  name: string
  tileSize: number
  legend: Record<string, TileKind>
  spawn: { x: number; y: number }
  rows: string[]
}

export interface TileMap {
  data: MapData
  width: number
  height: number
  tileSize: number
}

/** Check a parsed map: equal-length rows, every character in the legend. */
export function loadMap(data: MapData): TileMap {
  const width = data.rows[0]?.length ?? 0
  if (width === 0) throw new Error(`map ${data.name}: no rows`)
  data.rows.forEach((row, y) => {
    if (row.length !== width) throw new Error(`map ${data.name}: row ${y} is ${row.length} wide, expected ${width}`)
    for (const ch of row) if (!data.legend[ch]) throw new Error(`map ${data.name}: row ${y} has unknown tile '${ch}'`)
  })
  return { data, width, height: data.rows.length, tileSize: data.tileSize }
}

/** The tile at a tile coordinate; null outside the map. */
export function tileAt(map: TileMap, tx: number, ty: number): TileKind | null {
  if (tx < 0 || ty < 0 || tx >= map.width || ty >= map.height) return null
  return map.data.legend[map.data.rows[ty][tx]]
}

/** Off the map counts as solid. */
export function isSolid(map: TileMap, tx: number, ty: number): boolean {
  return tileAt(map, tx, ty)?.solid ?? true
}

/** A box centred on (x, y) in pixels, half-width hw and half-height hh, overlaps no solid tile. */
export function boxFree(map: TileMap, x: number, y: number, hw: number, hh: number): boolean {
  const t = map.tileSize
  const x0 = Math.floor((x - hw) / t), x1 = Math.floor((x + hw - 1e-6) / t)
  const y0 = Math.floor((y - hh) / t), y1 = Math.floor((y + hh - 1e-6) / t)
  for (let ty = y0; ty <= y1; ty++) for (let tx = x0; tx <= x1; tx++) if (isSolid(map, tx, ty)) return false
  return true
}

export interface Body { x: number; y: number; hw: number; hh: number }

/** Move a body by (dx, dy), one axis at a time so it slides along walls. Returns the new position. */
export function moveBody(map: TileMap, b: Body, dx: number, dy: number): { x: number; y: number } {
  let { x, y } = b
  if (dx !== 0 && boxFree(map, x + dx, y, b.hw, b.hh)) x += dx
  if (dy !== 0 && boxFree(map, x, y + dy, b.hw, b.hh)) y += dy
  return { x, y }
}

export type Facing = 'down' | 'up' | 'side'

/** Facing from a movement vector; vertical wins a tie. Null when still (keep the old facing). */
export function facingOf(dx: number, dy: number): Facing | null {
  if (dx === 0 && dy === 0) return null
  return Math.abs(dy) >= Math.abs(dx) ? (dy < 0 ? 'up' : 'down') : 'side'
}

/** Whole-number zoom that fits at least tilesWide x tilesHigh tiles in the window; never below 1. */
export function integerZoom(width: number, height: number, tileSize: number, tilesWide = 20, tilesHigh = 12): number {
  return Math.max(1, Math.floor(Math.min(width / (tileSize * tilesWide), height / (tileSize * tilesHigh))))
}

/** On walkable dock with water next door (can cast from here). */
export function atDockEdge(map: TileMap, x: number, y: number): boolean {
  const t = map.tileSize
  const tx = Math.floor(x / t)
  const ty = Math.floor(y / t)
  const here = tileAt(map, tx, ty)
  if (!here || here.name === 'water') return false
  for (const [dx, dy] of [[0, 1], [0, -1], [1, 0], [-1, 0]] as const) {
    if (tileAt(map, tx + dx, ty + dy)?.name === 'water') return true
  }
  return false
}
