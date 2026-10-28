import { describe, expect, it } from 'vitest'
import { initialState, loadStarts, loadAlignmentConfig, loadGates, reduce, unlock } from './index'

const config = loadAlignmentConfig()
const fresh = () => initialState(loadStarts(), config.thresholds, config.gates)
const recruit = (state: ReturnType<typeof fresh>, slug: string) => reduce(state, { type: 'recruit', slug }, config).state
const earn = (state: ReturnType<typeof fresh>, slug: string) => reduce(state, { type: 'unlock', slug }, config).state

describe('§7 joining gates', () => {
  it.each(['isfj-f', 'intp-m', 'estp-f', 'esfp-f'])('story-gated %s refuses recruitment before unlock', (slug) => {
    const state = fresh()
    expect(state.characters[slug].unlocked).toBe(false)
    expect(() => recruit(state, slug)).toThrow('not unlocked')
    expect(state.log).toEqual([])
  })
  it.each(['intp-m', 'estp-f', 'esfp-f'])('%s can join after unlock', (slug) => {
    expect(recruit(earn(fresh(), slug), slug).characters[slug].location).toBe('aboard')
  })
  it('unlocked ISFJ refuses while ESTP is in town', () => {
    expect(() => recruit(earn(fresh(), 'isfj-f'), 'isfj-f')).toThrow('needs aboard: estp-f')
  })
  it('unlocked ISFJ joins with ESTP aboard, without event party membership', () => {
    let state = recruit(earn(fresh(), 'estp-f'), 'estp-f')
    state = recruit(earn(state, 'isfj-f'), 'isfj-f')
    expect(state.characters['isfj-f'].location).toBe('aboard')
    expect(state.characters['estp-f'].inParty).toBe(false)
  })
  it('ungated characters need no unlock', () => {
    expect(fresh().characters['entp-m'].unlocked).toBe(true)
    expect(recruit(fresh(), 'entp-m').characters['entp-m'].location).toBe('aboard')
  })
  it('unlock twice or an ungated character is a no-op apart from the command log', () => {
    const state = earn(fresh(), 'intp-m')
    expect(unlock(state, 'intp-m')).toBe(state)
    expect(unlock(state, 'entp-m')).toBe(state)
    expect(earn(state, 'intp-m')).toEqual({ ...state, log: [...state.log, { type: 'unlock', slug: 'intp-m' }] })
  })
  it('rejects invalid gate data and unknown slugs including aboard requirements', () => {
    for (const raw of [null, {}, { notes: '', gates: [] },
      { notes: '', gates: { missing: { story: true } } },
      { notes: '', gates: { 'isfj-f': { aboard: ['missing'] } } },
      { notes: '', gates: { 'isfj-f': { story: 'yes' } } },
      { notes: '', gates: { 'isfj-f': { aboard: 'estp-f' } } }]) {
      expect(() => loadGates(raw)).toThrow('invalid')
    }
  })
  it('uses configured gates in initial state and preserves unlocks through JSON replay', () => {
    expect(initialState(loadStarts(), config.thresholds, {}).characters['intp-m'].unlocked).toBe(true)
    const state = earn(fresh(), 'intp-m')
    expect(JSON.parse(JSON.stringify(state))).toEqual(state)
    expect(state.log.reduce((s, command) => reduce(s, command, config).state, fresh())).toEqual(state)
  })
})
