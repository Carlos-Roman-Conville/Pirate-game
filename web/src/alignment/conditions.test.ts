import { describe, expect, it } from 'vitest'
import {
  canDevelop, initialState, loadAlignmentConfig, loadConditions, loadStarts, reduce, supply,
  type AlignmentState, type Command,
} from './index'

const config = loadAlignmentConfig()
const fresh = () => initialState(loadStarts(), config.thresholds, config.gates)
const apply = (state: AlignmentState, command: Command) => reduce(state, command, config).state
const recruited = (slot: string) => {
  const state = fresh()
  const slug = state.slots[slot].owner
  return apply(apply(state, { type: 'unlock', slug }), { type: 'recruit', slug })
}

describe('§5 develop conditions', () => {
  it.each(['port.farm', 'port.bakery'])('%s refuses development before bodies are supplied', (slot) => {
    const state = recruited(slot)
    const before = structuredClone(state)
    expect(canDevelop(state, slot, config.conditions)).toBe('needs supply: bodies')
    expect(() => apply(state, { type: 'develop', slot })).toThrow('needs supply: bodies')
    expect(state).toEqual(before)
  })
  it.each(['port.farm', 'port.bakery'])('%s develops after bodies are supplied once', (slot) => {
    let state = apply(recruited(slot), { type: 'supply', slot, what: 'bodies' })
    state = apply(state, { type: 'develop', slot })
    state = apply(state, { type: 'leave', slug: state.slots[slot].owner })
    state = apply(state, { type: 'sleep' })
    state = apply(state, { type: 'sleep' })
    expect(state.slots[slot].developed).toBe(true)
    expect(canDevelop(state, slot, config.conditions)).toBeNull()
    expect(JSON.parse(JSON.stringify(state))).toEqual(state)
    expect(state.log.reduce(apply, fresh())).toEqual(state)
  })
  it('a slot without a known condition develops without supply', () => {
    expect(apply(recruited('port.church'), { type: 'develop', slot: 'port.church' })
      .slots['port.church'].developed).toBe(true)
  })
  it('supplying twice is a no-op apart from the command log', () => {
    const command: Command = { type: 'supply', slot: 'port.farm', what: 'bodies' }
    const state = apply(fresh(), command)
    expect(supply(state, command.slot, command.what)).toBe(state)
    expect(apply(state, command)).toEqual({ ...state, log: [...state.log, command] })
  })
  it('unneeded items and slots without conditions are no-ops', () => {
    const state = fresh()
    expect(supply(state, 'port.farm', 'wood')).toBe(state)
    expect(supply(state, 'port.church', 'bodies')).toBe(state)
  })
  it('supplying an unknown slot is an error', () => {
    expect(() => apply(fresh(), { type: 'supply', slot: 'missing', what: 'bodies' }))
      .toThrow('unknown institution slot')
  })
  it('rejects invalid condition data', () => {
    for (const raw of [null, {}, { notes: '', conditions: [] },
      { notes: '', conditions: { missing: { supply: ['bodies'] } } },
      ...[null, {}, { supply: [] }, { supply: 'bodies' }, { supply: [''] },
        { supply: [' '] }, { supply: [1] }, { supply: ['bodies'], other: true }]
        .map((condition) => ({ notes: '', conditions: { 'port.farm': condition } }))]) {
      expect(() => loadConditions(raw)).toThrow('invalid')
    }
  })
  it('uses configured requirements instead of hard-coded food requirements', () => {
    const custom = { ...config, conditions: loadConditions({ notes: '', conditions: { 'port.church': { supply: ['wood', 'stone'] } } }) }
    let state = recruited('port.church')
    state = reduce(state, { type: 'supply', slot: 'port.church', what: 'wood' }, custom).state
    expect(canDevelop(state, 'port.church', custom.conditions)).toBe('needs supply: stone')
    state = reduce(state, { type: 'supply', slot: 'port.church', what: 'stone' }, custom).state
    expect(reduce(state, { type: 'develop', slot: 'port.church' }, custom).state.slots['port.church'].developed).toBe(true)
  })
})
