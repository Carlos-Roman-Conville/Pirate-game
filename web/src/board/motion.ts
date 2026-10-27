import { useEffect, useState } from 'react'

// Reduced-motion helpers. With prefers-reduced-motion set, pieces don't fly or hop: each event becomes a short fade
// (REDUCED_MS) so the order of what happened still shows, and CSS turns its own transitions off (board.css). Board kit
// (_template/board-kit), after Ur's motionPref.ts and playbackAnim.ts; the game's own once stamped.

export const REDUCED_MS = 150

const query = () => (typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null)

export function prefersReducedMotion(): boolean {
  return query()?.matches ?? false
}

/** The setting, kept current if the player changes it while the page is open. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(prefersReducedMotion)
  useEffect(() => {
    const q = query()
    if (!q) return
    const on = () => setReduced(q.matches)
    q.addEventListener('change', on)
    return () => q.removeEventListener('change', on)
  }, [])
  return reduced
}

export function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms))
}

/** How long an animation step takes: its full time, or the short fade when motion is reduced. */
export function stepMs(ms: number): number {
  return prefersReducedMotion() ? Math.min(ms, REDUCED_MS) : ms
}
