import { describe, expect, it } from 'vitest'
import { loadAlignmentConfig, reduce, UNRESOLVED } from './engine'
import { loadEvents, validateEventDef, validateEventOccurrence, type EventDef } from './events'
import { initialState, loadStarts, type AlignmentState, type Command } from './state'
import { classify, quadrantAnchors, type Position } from './square'

const config = loadAlignmentConfig()
const fresh = () => initialState(loadStarts(), config.thresholds)
const occurrence = (overrides = {}) => ({
  defId: 'placeholder.action.minor.og', witnesses: ['entp-m'], playerActs: true, day: 0, ...overrides,
})
const fire = (state = fresh(), overrides = {}, cfg = config) => reduce(state, { type: 'event', occurrence: occurrence(overrides) }, cfg).state
const distance = (a: Position, b: Position) => Math.hypot(a.x - b.x, a.y - b.y)
function freeze(value: unknown) {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(freeze)
    Object.freeze(value)
  }
}

describe('alignment engine rules', () => {
  it('§4 starting category uses startCoords independently of chart and movement anchor', () => {
    const state = fresh()
    const coords = quadrantAnchors(config.thresholds.startCoords)
    for (const [slug, category] of Object.entries(loadStarts())) {
      expect(state.characters[slug].pos).toEqual(category === 'neutral' ? { x: 0, y: 0 } : coords[category])
      expect(state.characters[slug].region).toBe(category)
      expect(state.characters[slug].location).toBe('town')
      expect(state.characters[slug].inParty).toBe(false)
    }
    expect(state.player).toEqual({ pos: { x: 0, y: 0 }, region: 'neutral' })
    expect(Object.values(state.slots)).toHaveLength(16)
    expect(Object.values(state.slots).every((slot) => !slot.developed)).toBe(true)
  })
  it.each(config.events)('§2–3 $id moves the acting player by its weight toward its category anchor', (def) => {
    const before = fresh()
    const after = fire(before, { defId: def.id })
    const anchor = quadrantAnchors(config.thresholds.anchor)[def.category]
    expect(distance(after.player.pos, before.player.pos)).toBeCloseTo(config.thresholds.step[def.weight])
    expect(distance(after.player.pos, anchor)).toBeCloseTo(distance(before.player.pos, anchor) - config.thresholds.step[def.weight])
  })
  it('§3 playerActs false leaves the player unchanged', () => {
    expect(fire(fresh(), { playerActs: false }).player).toEqual(fresh().player)
  })
  it('§4 each witness moves toward its chart destination', () => {
    const before = fresh()
    const after = fire(before)
    const anchor = quadrantAnchors(config.thresholds.anchor).cg
    expect(distance(after.characters['entp-m'].pos, anchor)).toBeCloseTo(
      distance(before.characters['entp-m'].pos, anchor) - config.thresholds.step.minor)
  })
  it('§4 lean is leanFactor times a fixed step', () => {
    const before = fresh()
    const after = fire(before, { witnesses: ['istj-m'] })
    expect(distance(after.characters['istj-m'].pos, before.characters['istj-m'].pos)).toBeCloseTo(
      config.thresholds.step.minor * config.thresholds.leanFactor)
  })
  it('§4 stay leaves a witness unchanged', () => {
    const cfg = structuredClone(config)
    cfg.charts['entp-m'].og = 'stay'
    expect(fire(fresh(), {}, cfg).characters['entp-m']).toEqual(fresh().characters['entp-m'])
  })
  it('§4 non-witnesses never move, including aboard party members', () => {
    let before = reduce(fresh(), { type: 'recruit', slug: 'istj-m' }, config).state
    before = reduce(before, { type: 'party', slugs: ['istj-m'] }, config).state
    const after = fire(before)
    for (const slug of Object.keys(before.characters).filter((s) => s !== 'entp-m')) {
      expect(after.characters[slug]).toEqual(before.characters[slug])
    }
  })
  it('§4 presence comes only from the occurrence, including a witness in town', () => {
    const before = fresh()
    expect(fire(before).characters['entp-m'].pos).not.toEqual(before.characters['entp-m'].pos)
  })
  it('§2 movement accumulates: two minor events move farther than one', () => {
    const before = fresh()
    const once = fire(before)
    const twice = fire(once)
    expect(distance(twice.player.pos, before.player.pos)).toBeCloseTo(config.thresholds.step.minor * 2)
    expect(distance(twice.characters['entp-m'].pos, before.characters['entp-m'].pos)).toBeCloseTo(config.thresholds.step.minor * 2)
  })
  it('§4 repeated lean from the centre eventually arrives at the quadrant and anchor', () => {
    let state = initialState({ 'istj-m': 'neutral' }, config.thresholds)
    const anchor = quadrantAnchors(config.thresholds.anchor).og
    const count = Math.ceil(distance(state.characters['istj-m'].pos, anchor) /
      (config.thresholds.step.minor * config.thresholds.leanFactor)) + 1
    for (let i = 0; i < count; i++) state = fire(state, { witnesses: ['istj-m'] })
    expect(state.characters['istj-m'].region).toBe('og')
    expect(state.characters['istj-m'].pos).toEqual(anchor)
  })
  it('§1 a diagonal step keeps the previous band in the transitional ring', () => {
    const state = fresh()
    state.characters['istj-m'] = { ...state.characters['istj-m'], pos: { x: -18, y: 18 }, region: 'hybrid_order' }
    state.player = { pos: { x: -18, y: 18 }, region: 'hybrid_good' }
    const after = fire(state, { witnesses: ['istj-m'] })
    expect(after.characters['istj-m'].pos.x).toBe(-after.characters['istj-m'].pos.y)
    expect(after.characters['istj-m'].region).toBe('hybrid_order')
    expect(after.player.region).toBe('hybrid_good')
  })
  it('§1 region is re-read after each move', () => {
    const before = fresh()
    const after = fire(before)
    const thresholds = { ...config.thresholds.thresholds, tieBreak: config.thresholds.tieBreak }
    expect(after.player.region).toBe(classify(after.player.pos, thresholds, before.player.region))
    expect(after.characters['entp-m'].region).toBe(classify(after.characters['entp-m'].pos, thresholds, before.characters['entp-m'].region))
  })
  it('§1 positions clamp to the configured ±100 bound', () => {
    const cfg = structuredClone(config)
    cfg.thresholds.anchor = { x: 200, y: 200 }
    cfg.thresholds.step.major = 1000
    const after = fire(fresh(), { defId: 'placeholder.action.major.og' }, cfg)
    expect(after.player.pos).toEqual({ x: -config.thresholds.bound, y: config.thresholds.bound })
    expect(after.characters['entp-m'].pos).toEqual({ x: config.thresholds.bound, y: config.thresholds.bound })
  })
  it('§8 tunable steps, anchors, leanFactor, starts and thresholds come from config', () => {
    const cfg = structuredClone(config)
    cfg.thresholds.step.minor = 8
    cfg.thresholds.step.major = 16
    cfg.thresholds.anchor = { x: 60, y: 80 }
    cfg.thresholds.leanFactor = 0.25
    cfg.thresholds.startCoords = { x: 41, y: 42, neutral: { x: 0, y: 0 } }
    cfg.thresholds.thresholds = { neutral: 1, pure: 2 }
    const before = initialState({ 'istj-m': 'neutral', 'entp-m': 'ce' }, cfg.thresholds)
    expect(before.characters['entp-m'].pos).toEqual({ x: 41, y: -42 })
    const after = fire(before, { witnesses: ['istj-m'] }, cfg)
    expect(after.player.pos.x).toBeCloseTo(-4.8)
    expect(after.player.pos.y).toBeCloseTo(6.4)
    expect(after.player.region).toBe('og')
    expect(distance(before.characters['istj-m'].pos, after.characters['istj-m'].pos)).toBeCloseTo(2)
    expect(distance(before.player.pos, fire(before, { defId: 'placeholder.action.major.og' }, cfg).player.pos)).toBeCloseTo(16)
  })
  it('§4 persistence: leave and recruit again keep position and region', () => {
    let state = reduce(fresh(), { type: 'recruit', slug: 'entp-m' }, config).state
    state = reduce(state, { type: 'party', slugs: ['entp-m'] }, config).state
    state = fire(state)
    const aligned = state.characters['entp-m']
    state = reduce(state, { type: 'leave', slug: 'entp-m' }, config).state
    expect(state.characters['entp-m']).toEqual({ ...aligned, location: 'town', inParty: false })
    state = reduce(state, { type: 'recruit', slug: 'entp-m' }, config).state
    expect(state.characters['entp-m']).toEqual({ ...aligned, location: 'aboard', inParty: false })
  })
  it('§7 a fourth recruit with three aboard is refused', () => {
    let state = fresh()
    const slugs = Object.keys(state.characters)
    for (const slug of slugs.slice(0, config.thresholds.crewSlots)) {
      if (config.gates[slug]?.story) state = reduce(state, { type: 'unlock', slug }, config).state
      state = reduce(state, { type: 'recruit', slug }, config).state
    }
    const saved = JSON.stringify(state)
    expect(() => reduce(state, { type: 'recruit', slug: slugs[config.thresholds.crewSlots] }, config)).toThrow('crewSlots full')
    expect(JSON.stringify(state)).toBe(saved)
  })
  it('§8 crewSlots is read from config', () => {
    const cfg = structuredClone(config)
    cfg.thresholds.crewSlots = 0
    expect(() => reduce(fresh(), { type: 'recruit', slug: 'entp-m' }, cfg)).toThrow('crewSlots full')
  })
  it('§7 departed characters cannot be recruited', () => {
    const state = fresh()
    state.characters['entp-m'].location = 'departed'
    expect(() => reduce(state, { type: 'recruit', slug: 'entp-m' }, config)).toThrow('departed')
  })
  it('§7 party replaces membership and only accepts aboard characters', () => {
    let state = reduce(fresh(), { type: 'recruit', slug: 'entp-m' }, config).state
    state = reduce(state, { type: 'party', slugs: ['entp-m'] }, config).state
    expect(state.characters['entp-m'].inParty).toBe(true)
    expect(reduce(state, { type: 'party', slugs: [] }, config).state.characters['entp-m'].inParty).toBe(false)
    expect(() => reduce(state, { type: 'party', slugs: ['istj-m'] }, config)).toThrow('not aboard')
  })
  it('§4/§9 only reduce applies commands; inputs are immutable and state/log are JSON-safe and replayable', () => {
    const state = fresh()
    const cfg = loadAlignmentConfig()
    const commands: Command[] = [
      { type: 'recruit', slug: 'entp-m' }, { type: 'party', slugs: ['entp-m'] },
      { type: 'event', occurrence: occurrence() }, { type: 'leave', slug: 'entp-m' },
    ]
    freeze(state); freeze(cfg); freeze(commands)
    const final = commands.reduce((s, command) => reduce(s, command, cfg).state, state)
    expect(final).not.toBe(state)
    expect(state).toEqual(fresh())
    const saved = JSON.parse(JSON.stringify(final)) as AlignmentState
    expect(saved).toEqual(final)
    expect(saved.log.reduce((s, command) => reduce(s, command, cfg).state, fresh())).toEqual(final)
    expect(final.day).toBe(state.day)
    expect(reduce(state, commands[0], cfg).log).toHaveLength(1)
  })
  it('§9 records a command snapshot independent of caller mutations', () => {
    const command: Command = { type: 'event', occurrence: occurrence() }
    const state = reduce(fresh(), command, config).state
    command.occurrence.witnesses.push('istj-m')
    expect((state.log[0] as typeof command).occurrence.witnesses).toEqual(['entp-m'])
  })
  it('§9 sleep advances the day; the data default allows development after recruitment', () => {
    expect(reduce(fresh(), { type: 'sleep' }, config).state.day).toBe(1)
    const recruited = reduce(fresh(), { type: 'recruit', slug: 'istj-m' }, config).state
    expect(reduce(recruited, { type: 'develop', slot: 'port.church' }, config).state.slots['port.church'])
      .toMatchObject({ developed: true, pending: true, pos: null })
  })
  it('§8 exports named unresolved rules and placeholder keys', () => {
    const text = UNRESOLVED.join(' ')
    expect(text).not.toContain('ghostRule')
    for (const key of ['INTJ', 'step.minor', 'step.major', 'anchor', 'startCoords', 'leanFactor', 'institutionLock',
      'ownerDeparted', 'pendingWhenAboard', 'undevelopedCounts', 'step.metric', 'step.overshoot', 'witnesses']) expect(text).toContain(key)
  })
})

describe('event validation and invalid commands', () => {
  it('loads all three event sources and rejects duplicate IDs', () => {
    expect(new Set(loadEvents().map((def) => def.source))).toEqual(new Set(['dialogue', 'quest', 'action']))
    expect(() => loadEvents([config.events[0], config.events[0]])).toThrow('duplicate')
  })
  it.each([null, {}, { ...config.events[0], source: 'combat' }, { ...config.events[0], weight: 'huge' },
    { ...config.events[0], category: 'neutral' }, { ...config.events[0], id: '' }])('rejects invalid EventDef %#', (raw) => {
    expect(() => validateEventDef(raw)).toThrow('invalid event definition')
  })
  it.each([null, {}, occurrence({ day: NaN }), occurrence({ day: -1 }), occurrence({ day: 0.5 }),
    occurrence({ witnesses: ['entp-m', 'entp-m'] }), occurrence({ witnesses: [12] }),
    occurrence({ playerActs: 'yes' }), occurrence({ defId: '' })])('rejects invalid EventOccurrence %#', (raw) => {
    expect(() => validateEventOccurrence(raw)).toThrow('invalid event occurrence')
  })
  it('rejects unknown definitions, unknown witnesses, missing charts and unsupported witness policies', () => {
    expect(() => fire(fresh(), { defId: 'missing' })).toThrow('event definition')
    expect(() => fire(fresh(), { witnesses: ['missing'] })).toThrow('unknown character')
    expect(() => fire(fresh(), {}, { ...config, charts: {} })).toThrow('missing chart')
    expect(() => fire(fresh(), {}, { ...config, thresholds: { ...config.thresholds, witnesses: 'everyone' } })).toThrow('unresolved')
    const bad = { ...config.events[0], weight: 'huge' } as unknown as EventDef
    expect(() => fire(fresh(), { defId: bad.id }, { ...config, events: [bad] })).toThrow('invalid event definition')
  })
  it('rejects invalid crew transitions without changing the input', () => {
    const state = fresh()
    freeze(state)
    expect(() => reduce(state, { type: 'leave', slug: 'entp-m' }, config)).toThrow('not aboard')
    expect(() => reduce(state, { type: 'recruit', slug: 'missing' }, config)).toThrow('unknown character')
    const aboard = reduce(state, { type: 'recruit', slug: 'entp-m' }, config).state
    expect(() => reduce(aboard, { type: 'recruit', slug: 'entp-m' }, config)).toThrow('not in town')
  })
})
