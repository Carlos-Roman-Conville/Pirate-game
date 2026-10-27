import { useEffect, useRef, type KeyboardEvent } from 'react'
import './board.css'

// A board of points joined by lines, drawn as SVG from the geometry the server sends (the engine's PointGraph):
// pieces on points, the decision's options highlighted and clickable (nothing else is; the screen never works out
// what's legal), the last change marked. Works for grids of cells too: draw cells as points with no edges and set
// `cells` per square. Board kit (_template/board-kit), after Nine Men's Morris's and Fox and Geese's Board.tsx; the
// game's own once stamped: restyle it, add the game's own marks (mills, the throne).

export interface BoardPoint { x: number; y: number; name: string }
export interface BoardGeometry { width: number; height: number; points: BoardPoint[]; edges: number[][] }

/** What changed between two boards (cells: -1 empty, else the seat whose piece stands there). */
export interface Change { placed: number[]; removed: number[]; moved: { from: number; to: number }[] }

/** Works out pieces placed, moved and removed from two boards: any two positions give an animation and a sound. */
export function diffCells(before: number[], after: number[]): Change {
  const gone: number[] = [], came: number[] = []
  after.forEach((c, i) => {
    if (c === before[i]) return
    if (before[i] >= 0) gone.push(i)
    if (c >= 0) came.push(i)
  })
  const moved: { from: number; to: number }[] = []
  const placed: number[] = [], removed = [...gone]
  for (const to of came) {
    const k = removed.findIndex(from => before[from] === after[to] && after[from] !== before[from])
    if (k >= 0 && moved.length < 1) moved.push({ from: removed.splice(k, 1)[0], to })
    else placed.push(to)
  }
  return { placed, removed, moved }
}

const STEP = 60
const PAD = 40

export function PointBoard({ board, cells, targets, selected, last, onPoint, seatClass }: {
  board: BoardGeometry
  cells: number[]
  /** Points the current decision offers, in any order. */
  targets: number[]
  selected?: number | null
  /** Points to mark as the last change (from diffCells or the last event). */
  last?: number[]
  onPoint: (point: number) => void
  /** The CSS class for a seat's pieces (the game's own colours), e.g. s => `pirate-ship-piece-${s}`. */
  seatClass: (seat: number) => string
}) {
  const w = (board.width - 1) * STEP + PAD * 2
  const h = (board.height - 1) * STEP + PAD * 2
  // Y counts up from the bottom in the engine; SVG counts down.
  const at = (i: number) => ({ cx: PAD + board.points[i].x * STEP, cy: PAD + (board.height - 1 - board.points[i].y) * STEP })
  const r = STEP * 0.3
  const offered = new Set(targets)
  const lastSet = new Set(last ?? [])

  // A piece that just arrived pops in (CSS; off with reduced motion). The ref keeps StrictMode's second render quiet.
  const prev = useRef(cells)
  const change = diffCells(prev.current, cells)
  const arrived = new Set([...change.placed, ...change.moved.map(m => m.to)])
  useEffect(() => { prev.current = cells }, [cells])

  const key = (i: number) => (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPoint(i) }
  }

  return (
    <svg className="board-svg" viewBox={`0 0 ${w} ${h}`} role="group" aria-label="Board">
      {board.edges.map(([a, b], i) => <line key={i} className="board-edge" x1={at(a).cx} y1={at(a).cy} x2={at(b).cx} y2={at(b).cy} />)}
      {board.points.map((p, i) => {
        const c = cells[i]
        const can = offered.has(i)
        return (
          <g key={i} className={`board-point${can ? ' board-target' : ''}${selected === i ? ' board-selected' : ''}`}
            role={can ? 'button' : undefined} tabIndex={can ? 0 : undefined} aria-label={`${p.name}${c >= 0 ? `, seat ${c + 1}` : ''}`}
            onClick={can ? () => onPoint(i) : undefined} onKeyDown={can ? key(i) : undefined}>
            <circle className="board-spot" {...at(i)} r={r * 0.35} />
            {lastSet.has(i) && <circle className="board-last" {...at(i)} r={r * 1.25} />}
            {c >= 0 && <circle className={`board-piece ${seatClass(c)}${arrived.has(i) ? ' board-arrived' : ''}`} {...at(i)} r={r} />}
            {can && <circle className="board-hit" {...at(i)} r={r * 1.1} />}
          </g>
        )
      })}
    </svg>
  )
}
