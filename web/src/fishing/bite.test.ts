import { describe, expect, it, vi } from 'vitest'

const playBiteSubmergeFx = vi.hoisted(() => vi.fn())

vi.mock('../world/biteFx', () => ({
  playBiteSubmergeFx: (...args: unknown[]) => playBiteSubmergeFx(...args),
}))

import {
  bitePhaseAt,
  biteSubmergeBeat,
  createBiteSchedule,
  dispatchTimedHookPress,
  resolveHookPress,
} from './bite'
import { dispatch, loadFishingConfig, playerStatsFromConfig, startFishing } from './machine'

const config = loadFishingConfig()
const stats = playerStatsFromConfig(config)
const rng = { next: () => 0.25 }

function scheduleAtZero() {
  return createBiteSchedule(0, stats, config, rng)
}

function runAtBite() {
  let r = startFishing(config)
  for (let i = 0; i < 5; i++) {
    r = dispatch(r, { type: 'stub', success: true })
  }
  expect(r.stage).toBe('bite')
  return r
}

describe('biteSubmergeBeat', () => {
  it('biteSubmergeBeat resolves after playBiteSubmergeFx has run', async () => {
    const order: string[] = []
    const fakeContainer = { name: 'splash' }
    playBiteSubmergeFx.mockImplementation(() => {
      order.push('fx')
      return fakeContainer
    })
    const scene = {} as import('phaser').Scene
    await biteSubmergeBeat(scene, 12, 34).then(() => {
      order.push('resolve')
    })
    expect(playBiteSubmergeFx).toHaveBeenCalledWith(scene, 12, 34)
    expect(order).toEqual(['fx', 'resolve'])
  })
})

describe('bite hook press', () => {
  it('misses when the player strikes on a nibble', () => {
    const schedule = scheduleAtZero()
    expect(bitePhaseAt(schedule, schedule.nibbleTwitchMs)).toBe('nibbling')
    expect(resolveHookPress(schedule, schedule.nibbleTwitchMs)).toBe('falseStrike')
    const run = runAtBite()
    const after = dispatchTimedHookPress(run, schedule, schedule.nibbleTwitchMs, config)
    expect(after.stage).toBe('result')
    expect(after.result).toBe('gotAway')
  })

  it('hooks on submerge instant when the player presses at submerge instant', () => {
    const schedule = scheduleAtZero()
    const press = schedule.submergedBeginMs
    expect(schedule.hookWindowBeginMs).toBe(press)
    expect(bitePhaseAt(schedule, press)).toBe('hookWindow')
    expect(resolveHookPress(schedule, press)).toBe('hooked')
    const run = runAtBite()
    const after = dispatchTimedHookPress(run, schedule, press, config)
    expect(after.stage).toBe('pullIn')
    expect(after.bitePhase).toBeNull()
  })

  it('hooks when the press lands inside the reflex reaction window', () => {
    const schedule = scheduleAtZero()
    const press = schedule.hookWindowBeginMs + 20
    expect(bitePhaseAt(schedule, press)).toBe('hookWindow')
    expect(resolveHookPress(schedule, press)).toBe('hooked')
    const run = runAtBite()
    const after = dispatchTimedHookPress(run, schedule, press, config)
    expect(after.stage).toBe('pullIn')
    expect(after.bitePhase).toBeNull()
  })

  it('loses the fish when the press is after the reaction window', () => {
    const schedule = scheduleAtZero()
    const late = schedule.hookWindowEndMs + 1
    expect(bitePhaseAt(schedule, late)).toBe('expired')
    expect(resolveHookPress(schedule, late)).toBe('tooLate')
    const run = runAtBite()
    const after = dispatchTimedHookPress(run, schedule, late, config)
    expect(after.stage).toBe('result')
    expect(after.result).toBe('gotAway')
  })
})
