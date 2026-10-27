// What every game module's screen receives. A module is web/src/games/pirate-ship/index.tsx with a default export of
// this shape; App finds it by folder (import.meta.glob), so adding a game touches no shared file.

import type { ComponentType } from 'react'

export interface GameProps {
  /** Back to the archive's menu */
  onExit: () => void
}

export type GameScreen = ComponentType<GameProps>

/** A game as the server lists it (GET /api/games). */
export interface GameInfo { id: string; name: string; summary: string }

/** An engine event as the server sends it: the record's name and its fields. */
export interface GameEvent { type: string; data: Record<string, unknown> }

let appBase: string | undefined

/** Where index.html was loaded from (fixed at first use), not the current hash route: '' at the site root. */
function appMountPath(): string {
  if (appBase !== undefined) return appBase
  for (const s of document.getElementsByTagName('script')) {
    if (s.type !== 'module' || !s.src) continue
    const path = new URL(s.src, location.href).pathname
    const cut = path.lastIndexOf('/assets/')
    if (cut >= 0) {
      appBase = cut === 0 ? '' : path.slice(0, cut)
      return appBase
    }
  }
  appBase = ''
  return appBase
}

/**
 * Turns `api/...` or `img/...` (with or without a leading slash) into a URL under this app's mount, e.g.
 * `/g/pirate-ship/api/...` when the lobby serves the game under /g/pirate-ship/ (lobby BRIEF section 5). Every fetch and every
 * image src goes through this; never write a root path like `/img/...` straight into the page.
 */
export function sitePath(path: string): string {
  const p = path.replace(/^\//, '')
  const base = appMountPath()
  return base ? `${base}/${p}` : `/${p}`
}

/** Calls a module's API (/api/pirate-ship/...), throwing the server's message on an error status. */
export async function api<T>(method: string, url: string, body?: unknown): Promise<T> {
  const res = await fetch(sitePath(url), {
    method,
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  if (!res.ok) throw new Error((await res.text()).replace(/^"|"$/g, '') || `HTTP ${res.status}`)
  return res.json()
}
