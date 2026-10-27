import { useCallback, useEffect, useRef, useState } from 'react'

// Event playback: the server sends what happened as an ordered list of events; the screen shows them one at a time,
// each with its own animation and sound, then shows the new decision. Responses that arrive while events are still
// playing queue behind them, so nothing is skipped and nothing plays out of order; "skip" finishes the queue at once.
// Board kit (_template/board-kit), after Ur's playback queue and Morris's applyEvent; the game's own once stamped.

/**
 * `step` applies and animates one event (await its sleeps; use stepMs from ./motion so reduced motion shortens it);
 * when `skipping()` is true it applies the event without sleeping or sound. `done` runs after the batch, with the batch's payload (usually: show the decision).
 */
export function usePlayback<E, P>(step: (event: E, skipping: () => boolean) => Promise<void>, done: (payload: P) => void) {
  const queue = useRef<{ events: E[]; payload: P; instant: boolean }[]>([])
  const running = useRef(false)
  const skip = useRef(false)
  const [busy, setBusy] = useState(false)
  const stepRef = useRef(step)
  const doneRef = useRef(done)
  useEffect(() => { stepRef.current = step; doneRef.current = done })

  const run = useCallback(async () => {
    if (running.current) return
    running.current = true
    setBusy(true)
    while (queue.current.length) {
      const batch = queue.current.shift()!
      // A skipped event still runs its step (the board and log must end right); the step leaves out its sleeps and sound.
      for (const e of batch.events) await stepRef.current(e, () => skip.current || batch.instant)
      doneRef.current(batch.payload)
    }
    skip.current = false
    running.current = false
    setBusy(false)
  }, [])

  /** Adds a batch: its events play in order, then `done(payload)`. `instant` applies them without animation (a resumed game). */
  const push = useCallback((events: E[], payload: P, instant = false) => {
    queue.current.push({ events, payload, instant })
    void run()
  }, [run])

  /** Finishes everything queued without animating it. */
  const skipAll = useCallback(() => { if (running.current) skip.current = true }, [])

  return { push, skipAll, busy }
}
