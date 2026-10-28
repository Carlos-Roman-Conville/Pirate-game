import {
  canRecruit, loadAlignmentConfig, reachable, respond,
  type AlignmentConfig, type Command, type Quadrant,
} from '../index'
import { checkLimit, Cursor, eventCommand } from './scenario'

export interface GreedyOptions {
  maxSteps?: number
  maxEventsPerOwner?: number
  /** Sector indices in traversal order; omitted indices are appended. */
  order?: number[]
  /** Index into each sector's reachable owners, in the original sector order. */
  choices?: number[]
  party?: 'solo' | 'compatible'
}

/** Steering policy only: movement, eligibility and development remain engine rules. */
export function greedyToward(quadrant: Quadrant, config = loadAlignmentConfig(), options: GreedyOptions = {}) {
  const cursor = new Cursor(config, options.maxSteps ?? 256)
  const maxEvents = options.maxEventsPerOwner ?? 64
  checkLimit(maxEvents, 'maxEventsPerOwner')
  const slots = Object.entries(cursor.state.slots)
  const sectors = [...new Set(slots.map(([, slot]) => slot.sector))]
  const order = [...new Set([...(options.order ?? []), ...sectors.map((_, i) => i)])]
  const selected = order.flatMap((index) => {
    const candidates = slots.filter(([, slot]) => slot.sector === sectors[index]
      && config.charts[slot.owner] && reachable(config.charts[slot.owner], quadrant))
    if (!candidates.length) {
      cursor.issues.push(`no chart route for sector ${sectors[index] ?? index} to ${quadrant}`)
      return []
    }
    return [candidates[(options.choices?.[index] ?? 0) % candidates.length]]
  })
  const capacity = Math.max(0, Math.floor(config.thresholds.crewSlots))
  if (!Number.isFinite(capacity) || capacity === 0) {
    cursor.issues.push('no usable crew slots')
    return cursor
  }
  const helps = (slug: string, category: Quadrant) => {
    const response = respond(config.charts[slug], category)
    return response.kind !== 'stay' && response.to === quadrant
  }
  for (let offset = 0; offset < selected.length && !cursor.full; offset += capacity) {
    const batch = selected.slice(offset, offset + capacity)
    const board = (slug: string): boolean => {
      if (cursor.full) return false
      if (cursor.state.characters[slug].location === 'aboard') return true
      if (config.gates[slug]?.story && !cursor.state.characters[slug].unlocked) {
        if (!cursor.apply({ type: 'unlock', slug })) return false
      }
      for (const key of config.gates[slug]?.aboard ?? []) {
        if (!board(key)) return false
      }
      const aboard = Object.entries(cursor.state.characters).filter(([, who]) => who.location === 'aboard')
      if (aboard.length >= capacity) {
        const completed = batch.find(([id, member]) => cursor.state.slots[id].developed
          && cursor.state.characters[member.owner].location === 'aboard'
          && !(config.gates[slug]?.aboard ?? []).includes(member.owner))
        if (completed) cursor.apply({ type: 'leave', slug: completed[1].owner })
      }
      return cursor.apply({ type: 'recruit', slug })
    }
    // Fill as much of the batch as possible; prerequisite recruits may consume a slot.
    for (const [, slot] of batch) {
      const needed = [slot.owner, ...(config.gates[slot.owner]?.aboard ?? [])]
        .filter((slug) => cursor.state.characters[slug].location !== 'aboard').length
      const aboard = Object.values(cursor.state.characters).filter((who) => who.location === 'aboard').length
      if (aboard + needed <= capacity) board(slot.owner)
    }
    for (const [id, slot] of batch) {
      const slug = slot.owner
      if (!board(slug)) continue
      // Prefer the largest effective step; respond() owns the chart interpretation.
      const events = config.events.filter((event) => helps(slug, event.category)).sort((a, b) => {
        const strength = (event: typeof a) => config.thresholds.step[event.weight]
          * (respond(config.charts[slug], event.category).kind === 'lean' ? config.thresholds.leanFactor : 1)
        return strength(b) - strength(a)
      })
      const event = events[0]
      if (event && cursor.state.characters[slug].region !== quadrant) {
        const party = options.party === 'compatible'
          ? batch.map(([, member]) => member.owner).filter((owner) =>
            cursor.state.characters[owner].location === 'aboard' && helps(owner, event.category))
          : [slug]
        cursor.apply({ type: 'party', slugs: party })
        for (let i = 0; i < maxEvents && !cursor.full
          && cursor.state.characters[slug].region !== quadrant; i++) {
          if (!cursor.apply(eventCommand(event.id))) break
        }
      }
      const arrived = cursor.state.characters[slug].region === quadrant
      if (!arrived) cursor.issues.push(`steering limit or missing event: ${slug} -> ${quadrant}`)
      cursor.apply({ type: 'leave', slug })
      if (arrived) cursor.apply({ type: 'develop', slot: id })
    }
    for (const [slug, who] of Object.entries(cursor.state.characters)) {
      if (who.location === 'aboard') cursor.apply({ type: 'leave', slug })
    }
    cursor.apply({ type: 'sleep' })
  }
  return cursor
}

/** Mulberry32: simulator chance only; never used by the opportunity search. */
export function random(seed: number, config: AlignmentConfig = loadAlignmentConfig(), maxSteps = 256) {
  const cursor = new Cursor(config, maxSteps)
  let value = seed >>> 0
  const draw = () => {
    value = (value + 0x6d2b79f5) >>> 0
    let bits = Math.imul(value ^ (value >>> 15), 1 | value)
    bits ^= bits + Math.imul(bits ^ (bits >>> 7), 61 | bits)
    return ((bits ^ (bits >>> 14)) >>> 0) / 4294967296
  }
  while (!cursor.full) {
    const characters = Object.entries(cursor.state.characters)
    const aboard = characters.filter(([, who]) => who.location === 'aboard').map(([slug]) => slug)
    const commands: Command[] = [{ type: 'sleep' }]
    commands.push(...characters.filter(([slug, who]) => config.gates[slug]?.story && !who.unlocked)
      .map(([slug]): Command => ({ type: 'unlock', slug })))
    if (aboard.length < config.thresholds.crewSlots) {
      commands.push(...characters.filter(([slug, who]) => who.location === 'town' && canRecruit(cursor.state, slug, config.gates) === null)
        .map(([slug]): Command => ({ type: 'recruit', slug })))
    }
    commands.push(...aboard.map((slug): Command => ({ type: 'leave', slug })))
    commands.push({ type: 'party', slugs: aboard.filter(() => draw() < 0.5) })
    commands.push(...config.events.map((event) => eventCommand(event.id)))
    commands.push(...Object.entries(cursor.state.slots)
      .filter(([, slot]) => !slot.developed && cursor.route.some((command) =>
        command.type === 'recruit' && command.slug === slot.owner))
      .map(([slot]): Command => ({ type: 'develop', slot })))
    cursor.apply(commands[Math.floor(draw() * commands.length)])
  }
  return cursor
}
