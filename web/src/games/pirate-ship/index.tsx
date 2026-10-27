import { useCallback, useEffect, useRef, useState } from 'react'
import { api, type GameEvent, type GameProps } from '../types'
import { PointBoard, type BoardGeometry } from '../../board/PointBoard'
import { usePlayback } from '../../board/playback'
import { sleep, stepMs } from '../../board/motion'
import { isMuted, play, setMuted } from '../../board/sound'
import { MatchLink, matchFromUrl, type MatchParams } from '../../board/online'
import { Rules } from './Rules'
import './pirate-ship.css'

// Pirate Ship: the screen. The server runs the rules (engine/Games/PirateShip) and sends the view, the events since the last
// response, and the decision it is asking; this draws the board, plays the events back in order (animation and
// sound, reduced motion respected), and offers exactly the decision's options. Modes: against the computer at three
// levels, two players on one screen, and an online match through the lobby (?match=). Board kit placeholder
// (_template/board-kit): keep the shape, replace the drawing. Tick each piece in progress/ui/pirate-ship.json when done.
// Class names are prefixed pirate-ship-.

const SAVED = 'pirate-ship.game'
const NAMES = ['First', 'Second']

interface View { turn: number; toMove: number; cells: number[]; board: BoardGeometry }
interface Decision { player: number; kind: string; prompt: string; options: string[]; points: number[] }
interface Result { winner?: number | null; reason: string }
interface Response {
  id: string; mode: string; computerSide?: number; you?: number | null; seat?: string; names?: (string | null)[]
  started?: boolean; reset?: boolean; view: View; events: GameEvent[]; decision: Decision | null; result: Result | null; canUndo?: boolean
}

export default function PirateShip({ onExit }: GameProps) {
  const [match] = useState(matchFromUrl)
  const [rules, setRules] = useState(false)
  if (rules) return <Rules onBack={() => setRules(false)} />
  return match ? <Online params={match} onExit={onExit} onRules={() => setRules(true)} /> : <Solo onExit={onExit} onRules={() => setRules(true)} />
}

/** Against the computer or two on one screen: HTTP, one game id kept in localStorage so a reload resumes. */
function Solo({ onExit, onRules }: GameProps & { onRules: () => void }) {
  const [game, setGame] = useState<Response | null>(null)
  const [level, setLevel] = useState('Medium')
  const [side, setSide] = useState(0)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const saved = (() => { try { return localStorage.getItem(SAVED) } catch { return null } })()

  const run = (p: Promise<Response>) => {
    setBusy(true); setError('')
    p.then(r => { setGame(r); try { localStorage.setItem(SAVED, r.id) } catch { /* private mode */ } })
      .catch(e => setError(String(e.message ?? e))).finally(() => setBusy(false))
  }
  const start = (mode: string) => run(api<Response>('POST', 'api/pirate-ship/games', { mode, level, humanSide: side }))

  if (!game) {
    return (
      <div className="splash pirate-ship-menu">
        <h1>Pirate Ship</h1>
        <p className="dim">working title · Rex's original</p>
        <label>Computer <select value={level} onChange={e => setLevel(e.target.value)}>
          {['Easy', 'Medium', 'Hard'].map(l => <option key={l}>{l}</option>)}
        </select></label>
        <label>You play <select value={side} onChange={e => setSide(Number(e.target.value))}>
          {NAMES.map((n, i) => <option key={i} value={i}>{n}</option>)}
        </select></label>
        <button disabled={busy} onClick={() => start('computer')}>Play the computer</button>
        <button disabled={busy} onClick={() => start('hotseat')}>Two players, one screen</button>
        {saved && <button disabled={busy} onClick={() => run(api<Response>('GET', `api/pirate-ship/games/${saved}`))}>Continue</button>}
        <button onClick={onRules}>Rules</button>
        <button onClick={onExit}>Back</button>
        {error && <p className="error">{error}</p>}
      </div>
    )
  }
  return (
    <Table response={game} onMenu={() => setGame(null)} onRules={onRules}
      choose={i => run(api<Response>('POST', `api/pirate-ship/games/${game.id}/choose`, { option: i }))}
      undo={() => run(api<Response>('POST', `api/pirate-ship/games/${game.id}/undo`))} error={error} />
  )
}

/** An online match through the lobby: one socket for the whole visit. */
function Online({ params, onExit, onRules }: { params: MatchParams; onExit: () => void; onRules: () => void }) {
  const [state, setState] = useState<Response | null>(null)
  const [error, setError] = useState('')
  const [connected, setConnected] = useState(false)
  const link = useRef<MatchLink<Response> | null>(null)
  useEffect(() => {
    const l = new MatchLink<Response>('api/pirate-ship/match', params, { onState: s => { setError(''); setState(s) }, onError: setError, onConnection: setConnected })
    link.current = l
    return () => l.close()
  }, [params])

  if (!state) {
    return (
      <div className="splash pirate-ship-menu">
        <h1>Pirate Ship</h1>
        <p className="dim">{error || (connected ? 'Joining the match…' : 'Connecting…')}</p>
        <button onClick={onExit}>Back</button>
      </div>
    )
  }
  return <Table response={state} onMenu={onExit} onRules={onRules} choose={i => link.current?.choose(i)} error={error} />
}

/** The board, the decision, the log. Events play back in order before the decision shows. */
function Table({ response, choose, undo, onMenu, onRules, error }: {
  response: Response; choose: (option: number) => void; undo?: () => void; onMenu: () => void; onRules: () => void; error: string
}) {
  const [shown, setShown] = useState<Response>(() => ({ ...response, decision: null, view: { ...response.view, cells: response.view.cells.map(() => -1) } }))
  const [cells, setCells] = useState<number[]>(() => response.view.cells.map(() => -1))
  const [last, setLast] = useState<number[]>([])
  const [log, setLog] = useState<string[]>([])
  const [muted, setMutedState] = useState(isMuted)
  const you = response.you ?? (response.computerSide === 0 ? 1 : response.computerSide === 1 ? 0 : null)

  const step = useCallback(async (e: GameEvent, skipping: () => boolean) => {
    setLog(l => [...l.slice(-40), describe(e)])
    if (e.type === 'PsPlaced') {
      const point = e.data.point as number
      setCells(c => c.map((v, i) => (i === point ? (e.data.player as number) : v)))
      setLast([point])
      if (!skipping()) { play('place'); await sleep(stepMs(260)) }
    } else if (e.type === 'PsGameEnded') {
      const w = e.data.winner as number | null | undefined
      if (!skipping()) play(w == null ? 'draw' : you == null || w === you ? 'win' : 'lose')
      if (e.data.line) setLast(e.data.line as number[])
    }
  }, [you])
  const playback = usePlayback<GameEvent, Response>(step, r => { setShown(r); setCells(r.view.cells) })

  // A new response: a reset (reload, reconnect) starts from an empty log; otherwise its events follow the last ones.
  const seen = useRef<Response | null>(null)
  useEffect(() => {
    if (seen.current === response) return
    const first = seen.current === null
    seen.current = response
    if (first || response.reset) { setLog([]); setCells(response.view.cells.map(() => -1)) }
    playback.push(response.events, response, first && response.events.length > 3)   // resuming: show the position at once
  }, [response, playback])

  const d = shown.decision
  const offer = d && !playback.busy && (shown.mode !== 'online' || d.player === shown.you) ? d : null
  const status = shown.result
    ? shown.result.winner == null ? `Draw: ${shown.result.reason}.` : `${seatName(shown, shown.result.winner)} wins: ${shown.result.reason}.`
    : shown.mode === 'online' && !shown.started ? 'Waiting for the other player…'
      : d ? `${seatName(shown, d.player)} to play. ${offer ? d.prompt : ''}` : 'Thinking…'

  return (
    <div className="pirate-ship-table">
      <header className="pirate-ship-bar">
        <b>Pirate Ship</b>
        <span className="dim">turn {shown.view.turn}</span>
        <span className="pirate-ship-spacer" />
        <button onClick={() => { setMuted(!muted); setMutedState(!muted) }} aria-pressed={muted}>{muted ? 'Sound off' : 'Sound on'}</button>
        <button onClick={onRules}>Rules</button>
        {undo && <button disabled={!shown.canUndo || playback.busy} onClick={undo}>Undo</button>}
        <button onClick={onMenu}>Menu</button>
      </header>
      <p className="pirate-ship-status" aria-live="polite">{status}</p>
      <main className="pirate-ship-board">
        <PointBoard board={shown.view.board} cells={cells} targets={offer?.points ?? []} last={last}
          onPoint={p => { if (offer) choose(offer.points.indexOf(p)) }} seatClass={s => `pirate-ship-piece-${s}`} />
      </main>
      {playback.busy && <button className="pirate-ship-skip" onClick={playback.skipAll}>Skip</button>}
      {error && <p className="error">{error}</p>}
      <aside className="pirate-ship-log" aria-label="Moves">{log.map((l, i) => <div key={i}>{l}</div>)}</aside>
    </div>
  )
}

function seatName(r: Response, seat: number): string {
  if (r.mode === 'online') return r.names?.[seat] ?? NAMES[seat]
  if (r.computerSide === seat) return 'The computer'
  if (r.computerSide === 0 || r.computerSide === 1) return 'You'
  return NAMES[seat]
}

function describe(e: GameEvent): string {
  switch (e.type) {
    case 'PsGameStarted': return 'New game.'
    case 'PsPlaced': return `${NAMES[e.data.player as number]}: ${e.data.name as string}`
    case 'PsGameEnded': return `Game over: ${e.data.reason as string}.`
    default: return e.type
  }
}
