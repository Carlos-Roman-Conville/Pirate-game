import { describe, expect, it } from 'vitest'
import institutions from '../../../data/pirate-ship/alignment/institutions.json'
import endingNames from './endings.json'
import {
  ending, initialState, isPerfect, loadAlignmentConfig, loadStarts, quadrantAnchors,
  reduce, townPosition, type AlignmentState, type Command, type Quadrant, type RegionId,
} from './index'

const config = loadAlignmentConfig()
const fresh = () => initialState(loadStarts(), config.thresholds)
const run = (state: AlignmentState, command: Command) => reduce(state, command, config).state
const church = 'port.church'
const priest = 'istj-m'
const anchors = quadrantAnchors(config.thresholds.startCoords)

function developed(id = church, state = fresh()) {
  const slug = state.slots[id].owner
  for (const key of config.gates[slug]?.aboard ?? []) {
    if (state.characters[key].location !== 'aboard') {
      state = run(state, { type: 'unlock', slug: key })
      state = run(state, { type: 'recruit', slug: key })
    }
  }
  if (config.gates[slug]?.story) state = run(state, { type: 'unlock', slug })
  if (state.characters[slug].location !== 'aboard') state = run(state, { type: 'recruit', slug })
  return run(state, { type: 'develop', slot: id })
}

function returned(id = church, state = fresh()) {
  state = developed(id, state)
  return run(state, { type: 'leave', slug: state.slots[id].owner })
}

function town(quadrants: Quadrant[]) {
  let state = fresh()
  const ids = institutions.map((sector) => sector.slots[0].slot!)
  quadrants.forEach((quadrant, i) => {
    const id = ids[i]
    const owner = state.characters[state.slots[id].owner]
    owner.pos = { ...anchors[quadrant] }
    owner.region = quadrant
    state = returned(id, state)
  })
  return run(state, { type: 'sleep' })
}

function freeze(value: unknown) {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(freeze)
    Object.freeze(value)
  }
}

describe('§5 institutions', () => {
  it('per-slot state represents both data owners in every sector, including unassigned port IDs', () => {
    const slots = fresh().slots
    expect(Object.keys(slots)).toHaveLength(16)
    for (const sector of institutions) {
      for (const source of sector.slots) {
        expect(slots[source.slot ?? `${sector.id}:${source.owner}`]).toEqual({
          sector: sector.id, owner: source.owner, developed: false, pos: null, region: null, pending: false,
        })
      }
    }
  })

  it('recruiting alone never develops an institution', () => {
    const before = fresh()
    const after = run(before, { type: 'recruit', slug: priest })
    expect(after.slots).toEqual(before.slots)
  })

  it('develop refuses a never-recruited owner', () => {
    expect(() => run(fresh(), { type: 'develop', slot: church })).toThrow('never recruited')
  })

  it('develop accepts recruitment history after returning to town and after JSON save/load', () => {
    let state = run(fresh(), { type: 'recruit', slug: priest })
    state = run(state, { type: 'leave', slug: priest })
    state = JSON.parse(JSON.stringify(state)) as AlignmentState
    expect(run(state, { type: 'develop', slot: church }).slots[church]).toMatchObject({ developed: true, pending: true, pos: null })
  })

  it('develop rejects an unknown slot without changing state', () => {
    const state = fresh()
    freeze(state)
    expect(() => run(state, { type: 'develop', slot: 'missing' })).toThrow('unknown institution slot')
  })

  it.each(institutions)('every-pair-both-improve allows both $id slots to develop independently', (sector) => {
    let state = fresh()
    for (const source of sector.slots) state = returned(source.slot ?? `${sector.id}:${source.owner}`, state)
    expect(Object.values(state.slots).filter((slot) => slot.developed)).toHaveLength(2)
  })

  it('undeveloped slots stay undeveloped across returns and nights; no invented ghost state', () => {
    let state = run(fresh(), { type: 'recruit', slug: priest })
    state = run(state, { type: 'leave', slug: priest })
    expect(run(state, { type: 'sleep' }).slots).toEqual(fresh().slots)
  })

  it('leave only marks a developed institution eligible; character, slot and pending are separate', () => {
    let state = run(returned(), { type: 'sleep' })
    state = run(state, { type: 'recruit', slug: priest })
    state.characters[priest] = { ...state.characters[priest], pos: anchors.cg, region: 'cg' }
    const before = state.slots[church]
    state = run(state, { type: 'leave', slug: priest })
    expect(state.slots[church]).toEqual({ ...before, pending: true })
    expect(state.characters[priest].region).toBe('cg')
    expect(state.slots[church].region).toBe('og')
  })

  it('sleep advances the day, copies town owners, clears pending and logs slot/from/to', () => {
    const before = returned()
    const result = reduce(before, { type: 'sleep' }, config)
    expect(result.state.day).toBe(before.day + 1)
    expect(result.state.slots[church]).toMatchObject({ pos: anchors.og, region: 'og', pending: false })
    expect(result.state.slots[church].pos).not.toBe(result.state.characters[priest].pos)
    expect(result.log.slice(1).map((line) => JSON.parse(line))).toEqual([{ slot: church, from: null, to: 'og' }])
    let state = run(result.state, { type: 'recruit', slug: priest })
    state.characters[priest] = { ...state.characters[priest], pos: anchors.cg, region: 'cg' }
    state = run(state, { type: 'leave', slug: priest })
    expect(reduce(state, { type: 'sleep' }, config).log.slice(1).map((line) => JSON.parse(line)))
      .toEqual([{ slot: church, from: 'og', to: 'cg' }])
  })

  it('pendingWhenAboard keep preserves the old institution and pending flag after re-recruitment', () => {
    let state = run(returned(), { type: 'sleep' })
    state = run(state, { type: 'recruit', slug: priest })
    state = run(state, { type: 'leave', slug: priest })
    state = run(state, { type: 'recruit', slug: priest })
    state.characters[priest] = { ...state.characters[priest], pos: anchors.cg, region: 'cg' }
    const result = reduce(state, { type: 'sleep' }, config)
    expect(result.state.slots[church]).toEqual(state.slots[church])
    expect(result.state.slots[church].pending).toBe(true)
    expect(result.log).toHaveLength(1)
  })

  it('ownerDeparted freeze preserves an established institution and its pending flag', () => {
    let state = run(returned(), { type: 'sleep' })
    state = run(state, { type: 'recruit', slug: priest })
    state = run(state, { type: 'leave', slug: priest })
    state.characters[priest] = { ...state.characters[priest], location: 'departed', pos: anchors.ce, region: 'ce' }
    expect(run(state, { type: 'sleep' }).slots[church]).toEqual(state.slots[church])
  })

  it('institutionLock reread-each-sleep updates a town institution again after pending clears', () => {
    const state = run(returned(), { type: 'sleep' })
    state.characters[priest] = { ...state.characters[priest], pos: anchors.cg, region: 'cg' }
    expect(state.slots[church].pending).toBe(false)
    expect(run(state, { type: 'sleep' }).slots[church].region).toBe('cg')
  })

  it('repeated develop preserves an existing institution', () => {
    const state = run(returned(), { type: 'sleep' })
    expect(run(state, { type: 'develop', slot: church }).slots).toEqual(state.slots)
  })

  it.each(['ghostRule', 'institutionLock', 'pendingWhenAboard', 'ownerDeparted'] as const)(
    '§8 unsupported %s is rejected as unresolved without mutation', (key) => {
      const cfg = structuredClone(config)
      cfg.thresholds[key] = 'unknown'
      const state = returned()
      freeze(state)
      expect(() => reduce(state, key === 'ghostRule' ? { type: 'develop', slot: church } : { type: 'sleep' }, cfg))
        .toThrow(`unresolved ${key}`)
    })

  it('§9 development and sleep are immutable, JSON-safe and deterministic on replay', () => {
    const start = fresh()
    const commands: Command[] = [
      { type: 'recruit', slug: priest }, { type: 'develop', slot: church }, { type: 'sleep' },
      { type: 'leave', slug: priest }, { type: 'sleep' }, { type: 'sleep' },
    ]
    freeze(start)
    freeze(config)
    const state = commands.reduce(run, start)
    const saved = JSON.parse(JSON.stringify(state)) as AlignmentState
    expect(saved).toEqual(state)
    expect(saved.log.reduce(run, fresh())).toEqual(state)
  })
})

describe('§6 town and endings', () => {
  it('eight developed OG institutions, one per sector, produce a perfect OG town', () => {
    expect(ending(town(Array<Quadrant>(8).fill('og')), config)).toEqual({ id: 'og', perfect: true, name: null })
  })

  it.each(['og', 'oe', 'cg', 'ce'] as const)('perfect means consistency, including %s', (quadrant) => {
    expect(ending(town(Array<Quadrant>(8).fill(quadrant)), config)).toMatchObject({ id: quadrant, perfect: true })
  })

  it('eight developed institutions spread across four quadrants are not perfect', () => {
    expect(isPerfect(town(['og', 'oe', 'cg', 'ce', 'og', 'oe', 'cg', 'ce']), config)).toBe(false)
  })

  it('all-developed counts the rival too: an OG/OE pair prevents an otherwise OG perfect town', () => {
    let state = town(Array<Quadrant>(8).fill('og'))
    state = returned('church:entj-priest', state)
    state = run(state, { type: 'sleep' })
    expect(state.slots['church:entj-priest'].region).toBe('oe')
    expect(ending(state, config)).toMatchObject({ id: 'og', perfect: false })
  })

  it('four OG and four OE average into hybrid_order named Twisted Virtue from data', () => {
    expect(endingNames.hybrid_order).toBe('Twisted Virtue')
    const state = town(['og', 'og', 'og', 'og', 'oe', 'oe', 'oe', 'oe'])
    expect(townPosition(state, config)).toEqual({ x: -config.thresholds.startCoords.x, y: 0 })
    expect(ending(state, config)).toEqual({ id: 'hybrid_order', perfect: false, name: endingNames.hybrid_order })
  })

  it('four OG and four CG average into hybrid_good with name from endings.json', () => {
    const state = town(['og', 'og', 'og', 'og', 'cg', 'cg', 'cg', 'cg'])
    expect(townPosition(state, config)).toEqual({ x: 0, y: config.thresholds.startCoords.y })
    expect(ending(state, config)).toEqual({ id: 'hybrid_good', perfect: false, name: endingNames.hybrid_good })
  })

  it('four OE and four CE average into hybrid_evil with name from endings.json', () => {
    const state = town(['oe', 'oe', 'oe', 'oe', 'ce', 'ce', 'ce', 'ce'])
    expect(townPosition(state, config)).toEqual({ x: 0, y: -config.thresholds.startCoords.y })
    expect(ending(state, config)).toEqual({ id: 'hybrid_evil', perfect: false, name: endingNames.hybrid_evil })
  })

  it('four CG and four CE average into hybrid_chaos with name from endings.json', () => {
    const state = town(['cg', 'cg', 'cg', 'cg', 'ce', 'ce', 'ce', 'ce'])
    expect(townPosition(state, config)).toEqual({ x: config.thresholds.startCoords.x, y: 0 })
    expect(ending(state, config)).toEqual({ id: 'hybrid_chaos', perfect: false, name: endingNames.hybrid_chaos })
  })

  it('no developed institutions means (0,0), neutral and not perfect', () => {
    expect(townPosition(fresh(), config)).toEqual({ x: 0, y: 0 })
    expect(ending(fresh(), config)).toEqual({ id: 'neutral', perfect: false, name: null })
  })

  it('undevelopedCounts skip omits developed slots awaiting their first transformation', () => {
    let state = developed()
    expect(ending(state, config)).toMatchObject({ id: 'neutral', perfect: false })
    state = returned('port.apothecary', state)
    state = run(state, { type: 'sleep' })
    expect(state.slots[church].pos).toBeNull()
    expect(townPosition(state, config)).toEqual(anchors.oe)
    expect(isPerfect(state, config)).toBe(true)
  })

  it.each([
    ['hybrid_good', ['og', 'cg']], ['hybrid_evil', ['oe', 'ce']], ['hybrid_chaos', ['cg', 'ce']],
  ] as [RegionId, Quadrant[]][])('ending %s keeps its open name null and is not perfect', (id, quadrants) => {
    expect(ending(town(quadrants), config)).toEqual({ id, perfect: false, name: null })
  })

  it('town region persists through diagonal ties after an overnight update', () => {
    let state = town(['og'])
    state.characters[priest] = { ...state.characters[priest], pos: { x: -20, y: 20 }, region: 'og' }
    state = run(state, { type: 'sleep' })
    expect(state.town.region).toBe('og')
    expect(ending(state, config).id).toBe('og')
  })

  it('winners-only uses the latest actual transformation in each sector, not the last re-read', () => {
    let state = town(['og'])
    state = returned('church:entj-priest', state)
    state = run(state, { type: 'sleep' })
    const cfg = structuredClone(config)
    cfg.thresholds.perfectCounts = 'winners-only'
    expect(state.slotTransformedAt[church]).toBe(1)
    expect(state.slotTransformedAt['church:entj-priest']).toBe(2)
    expect(isPerfect(state, cfg)).toBe(true)
    expect(isPerfect(state, config)).toBe(false)
  })

  it('winners-only does not invent a tie breaker for simultaneous transformations', () => {
    let state = returned()
    state = returned('church:entj-priest', state)
    state = run(state, { type: 'sleep' })
    const cfg = structuredClone(config)
    cfg.thresholds.perfectCounts = 'winners-only'
    expect(() => isPerfect(state, cfg)).toThrow('unresolved winners-only simultaneous')
  })

  it.each(['townAggregate', 'perfectCounts', 'undevelopedCounts'] as const)(
    '§8 unsupported %s is rejected as unresolved', (key) => {
      const cfg = structuredClone(config)
      cfg.thresholds[key] = 'unknown'
      expect(() => ending(fresh(), cfg)).toThrow(`unresolved ${key}`)
    })
})
