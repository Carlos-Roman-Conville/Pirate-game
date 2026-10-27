import { sitePath } from '../games/types'

// Online matches through the lobby (contract v3). The lobby opens the game at ?token=<match token>&match=pirate-ship; this
// keeps one WebSocket to the server's match (api/pirate-ship/match, through sitePath so it works under /g/pirate-ship/), sends the
// player's answers, and hands every state the server pushes to the screen. The server holds the game, the dice and
// any hidden hands; the browser only says which offered option it picks. If the socket drops it reconnects and joins
// again (the server finds the seat by the user and sends the whole game back, reset: true).
// Board kit (_template/board-kit), after Ur's and Senet's online.ts; the game's own once stamped.

export interface MatchParams {
  match: string
  token: string | null
}

/** The match in the page URL, or null outside a match. */
export function matchFromUrl(): MatchParams | null {
  const q = new URLSearchParams(location.search)
  const match = q.get('match')
  if (!match || !/^[0-9a-f]{32}$/.test(match)) return null
  return { match, token: q.get('token') }
}

export interface MatchLinkHandlers<S> {
  onState: (state: S) => void
  onError: (message: string) => void
  onConnection: (connected: boolean) => void
}

export class MatchLink<S> {
  private ws: WebSocket | null = null
  private closed = false
  private retry = 0
  private timer: number | undefined
  private readonly path: string
  private readonly params: MatchParams
  private readonly handlers: MatchLinkHandlers<S>

  /** `path` is the game's socket, e.g. 'api/pirate-ship/match'. */
  constructor(path: string, params: MatchParams, handlers: MatchLinkHandlers<S>) {
    this.path = path
    this.params = params
    this.handlers = handlers
    this.connect()
  }

  private connect() {
    const url = new URL(sitePath(this.path), location.href)
    url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:'
    url.search = ''
    const ws = new WebSocket(url)
    this.ws = ws
    ws.onopen = () => {
      this.retry = 0
      this.handlers.onConnection(true)
      ws.send(JSON.stringify({ type: 'join', match: this.params.match, token: this.params.token }))
    }
    ws.onmessage = e => {
      let msg: { type?: string; message?: string }
      try { msg = JSON.parse(String(e.data)) } catch { return }
      if (msg.type === 'state') this.handlers.onState(msg as S)
      else if (msg.type === 'error') this.handlers.onError(msg.message ?? 'error')
    }
    ws.onclose = () => {
      this.handlers.onConnection(false)
      if (this.closed) return
      const wait = Math.min(10000, 500 * 2 ** this.retry++)
      this.timer = window.setTimeout(() => this.connect(), wait)
    }
  }

  choose(option: number) {
    if (this.ws?.readyState === WebSocket.OPEN) this.ws.send(JSON.stringify({ type: 'choose', option }))
    else this.handlers.onError('Reconnecting… try again in a moment.')
  }

  close() {
    this.closed = true
    window.clearTimeout(this.timer)
    this.ws?.close()
  }
}
