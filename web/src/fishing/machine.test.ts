import { describe, expect, it } from 'vitest'
import {
  dispatch,
  FISHING_STAGE_ORDER,
  hookWindowMs,
  loadFishingConfig,
  playerStatsFromConfig,
  startFishing,
  type FishingRun,
} from './machine'

const config = loadFishingConfig()

function reachPullIn(run: FishingRun): FishingRun {
  let r = run
  for (const stage of ['readWater', 'aim', 'direction', 'power', 'lure'] as const) {
    expect(r.stage).toBe(stage)
    r = dispatch(r, { type: 'stub', success: true })
  }
  expect(r.stage).toBe('bite')
  expect(r.bitePhase).toBe('waiting')
  r = dispatch(r, { type: 'bite', event: 'advance' })
  r = dispatch(r, { type: 'bite', event: 'advance' })
  r = dispatch(r, { type: 'bite', event: 'advance' })
  expect(r.bitePhase).toBe('hookWindow')
  r = dispatch(r, { type: 'bite', event: 'hook' })
  expect(r.stage).toBe('pullIn')
  return r
}

function passThrough(run: FishingRun): FishingRun {
  return dispatch(reachPullIn(run), { type: 'stub', success: true })
}

describe('fishing config', () => {
  it('loads placeholder player stats and test fish from data', () => {
    const stats = playerStatsFromConfig(config)
    expect(stats.attributes.eyesight).toBe(10)
    expect(stats.skills.fishing).toBe(25)
    expect(config.fish.length).toBeGreaterThanOrEqual(2)
    expect(config.fish.every((f) => f.notes.toLowerCase().includes('placeholder'))).toBe(true)
  })

  it('derives hook window from reflexes using config numbers only', () => {
    const stats = playerStatsFromConfig(config)
    const base = hookWindowMs(stats, config)
    const sharper = hookWindowMs(
      { ...stats, attributes: { ...stats.attributes, reflexes: stats.attributes.reflexes + 5 } },
      config,
    )
    expect(sharper).toBeGreaterThan(base)
    expect(base).toBe(
      Number(config.bite.reactionWindowBaseMs) +
        stats.attributes.reflexes * Number(config.bite.reactionWindowPerReflex),
    )
  })
})

describe('stage order', () => {
  it('matches FISHING.md from read the water through result', () => {
    expect(FISHING_STAGE_ORDER).toEqual([
      'readWater',
      'aim',
      'direction',
      'power',
      'lure',
      'bite',
      'pullIn',
      'result',
    ])
  })

  it('advances one stage at a time on stub success', () => {
    let run = startFishing(config)
    const seen: string[] = [run.stage]
    for (let i = 0; i < 5; i++) {
      run = dispatch(run, { type: 'stub', success: true })
      seen.push(run.stage)
    }
    expect(seen).toEqual(['readWater', 'aim', 'direction', 'power', 'lure', 'bite'])
  })
})

describe('outcomes', () => {
  it('ends caught after every stage succeeds', () => {
    const run = passThrough(startFishing(config))
    expect(run.stage).toBe('result')
    expect(run.result).toBe('caught')
    expect(run.gotAwayReason).toBeNull()
  })

  it('ends got away when a stub stage fails', () => {
    let run = startFishing(config)
    run = dispatch(run, { type: 'stub', success: true })
    run = dispatch(run, { type: 'stub', success: false })
    expect(run.stage).toBe('result')
    expect(run.result).toBe('gotAway')
    expect(run.bitePhase).toBeNull()
  })

  it('got away reason struckNibble when the hook is set on a nibble', () => {
    let run = startFishing(config)
    run = dispatch(run, { type: 'stub', success: true })
    run = dispatch(run, { type: 'stub', success: true })
    run = dispatch(run, { type: 'stub', success: true })
    run = dispatch(run, { type: 'stub', success: true })
    run = dispatch(run, { type: 'stub', success: true })
    run = dispatch(run, { type: 'bite', event: 'advance' })
    expect(run.bitePhase).toBe('nibbling')
    run = dispatch(run, { type: 'bite', event: 'hook' })
    expect(run.result).toBe('gotAway')
    expect(run.gotAwayReason).toBe('struckNibble')
  })

  it('got away reason missedBite when the hook window expires', () => {
    let run = startFishing(config)
    run = { ...run, stage: 'bite', bitePhase: 'hookWindow' }
    run = dispatch(run, { type: 'bite', event: 'expired' })
    expect(run.result).toBe('gotAway')
    expect(run.gotAwayReason).toBe('missedBite')
  })

  it('got away reason lineSnapped when pull-in snaps the line', () => {
    let run = reachPullIn(startFishing(config))
    run = dispatch(run, { type: 'stub', success: false, gotAwayReason: 'lineSnapped' })
    expect(run.result).toBe('gotAway')
    expect(run.gotAwayReason).toBe('lineSnapped')
  })

  it('ends got away when pull-in fails', () => {
    let run = reachPullIn(startFishing(config))
    run = dispatch(run, { type: 'stub', success: false })
    expect(run.stage).toBe('result')
    expect(run.result).toBe('gotAway')
  })

  it('ignores actions after the run has ended', () => {
    let run = startFishing(config)
    run = dispatch(run, { type: 'stub', success: false })
    const after = dispatch(run, { type: 'stub', success: true })
    expect(after).toEqual(run)
  })
})
