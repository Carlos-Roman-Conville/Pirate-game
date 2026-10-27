import { describe, expect, it } from 'vitest'
import { dispatch, loadFishingConfig, startFishing, type FishingRun } from './machine'
import {
  applyFishingRun,
  dismissResultPanel,
  dockAllowsWalking,
  initialDockLoop,
  resultPanelMessage,
  resultTuning,
  tryStartFishingAtDock,
} from './loop'

const config = loadFishingConfig()

function reachPullIn(run: FishingRun): FishingRun {
  let r = run
  for (const stage of ['readWater', 'aim', 'direction', 'power', 'lure'] as const) {
    expect(r.stage).toBe(stage)
    r = dispatch(r, { type: 'stub', success: true })
  }
  expect(r.stage).toBe('bite')
  r = dispatch(r, { type: 'bite', event: 'advance' })
  r = dispatch(r, { type: 'bite', event: 'advance' })
  r = dispatch(r, { type: 'bite', event: 'advance' })
  r = dispatch(r, { type: 'bite', event: 'hook' })
  expect(r.stage).toBe('pullIn')
  return r
}

function completeCaughtRun(): FishingRun {
  return dispatch(reachPullIn(startFishing(config)), { type: 'stub', success: true })
}

function completeGotAwayRun(): FishingRun {
  let run = startFishing(config)
  run = dispatch(run, { type: 'stub', success: true })
  run = dispatch(run, { type: 'stub', success: false })
  return run
}

describe('dock loop', () => {
  it('starts on the dock walking', () => {
    const loop = initialDockLoop()
    expect(loop.mode).toBe('walking')
    expect(dockAllowsWalking(loop)).toBe(true)
    expect(loop.run).toBeNull()
  })

  it('walk, fish, caught result, back to walking', () => {
    let loop = initialDockLoop()
    loop = tryStartFishingAtDock(loop, true, config)
    expect(loop.mode).toBe('fishing')
    expect(dockAllowsWalking(loop)).toBe(false)

    const finished = completeCaughtRun()
    expect(finished.result).toBe('caught')
    loop = applyFishingRun(loop, finished)
    expect(loop.mode).toBe('showingResult')
    expect(resultPanelMessage('caught', config)).toContain(resultTuning(config).caughtLabel)

    loop = dismissResultPanel(loop)
    expect(loop.mode).toBe('walking')
    expect(loop.run).toBeNull()
    expect(dockAllowsWalking(loop)).toBe(true)
  })

  it('walk, fish, got away result, back to walking', () => {
    let loop = tryStartFishingAtDock(initialDockLoop(), true, config)
    const finished = completeGotAwayRun()
    expect(finished.result).toBe('gotAway')
    loop = applyFishingRun(loop, finished)
    expect(loop.mode).toBe('showingResult')
    expect(resultPanelMessage('gotAway', config)).toContain(resultTuning(config).gotAwayLabel)
    loop = dismissResultPanel(loop)
    expect(loop.mode).toBe('walking')
  })

  it('does not start fishing away from the dock edge', () => {
    const loop = tryStartFishingAtDock(initialDockLoop(), false, config)
    expect(loop.mode).toBe('walking')
    expect(loop.run).toBeNull()
  })

  it('does not dismiss the result panel while still fishing', () => {
    let loop = tryStartFishingAtDock(initialDockLoop(), true, config)
    const mid = dispatch(loop.run!, { type: 'stub', success: true })
    loop = applyFishingRun(loop, mid)
    expect(loop.mode).toBe('fishing')
    expect(dismissResultPanel(loop)).toEqual(loop)
  })
})

describe('resultPanelMessage', () => {
  const t = resultTuning(config)
  const prompt = t.continuePrompt

  it('shows caught headline and continue with no got-away detail', () => {
    const msg = resultPanelMessage('caught', config)
    expect(msg).toBe(`${t.caughtLabel}\n${prompt}`)
    expect(msg).not.toContain(t.gotAwayLabel)
  })

  it('shows got-away headline and glossary detail for lineSnapped', () => {
    const msg = resultPanelMessage('gotAway', config, 'lineSnapped')
    expect(msg).toBe(`${t.gotAwayLabel}\nThe line snapped\n${prompt}`)
  })

  it('shows got-away headline and glossary detail for struckNibble', () => {
    const msg = resultPanelMessage('gotAway', config, 'struckNibble')
    expect(msg).toBe(`${t.gotAwayLabel}\nYou struck on a nibble\n${prompt}`)
  })

  it('shows got-away headline and glossary detail for missedBite', () => {
    const msg = resultPanelMessage('gotAway', config, 'missedBite')
    expect(msg).toBe(`${t.gotAwayLabel}\nToo slow on the bite\n${prompt}`)
  })

  it('shows got-away headline without detail for other', () => {
    const msg = resultPanelMessage('gotAway', config, 'other')
    expect(msg).toBe(`${t.gotAwayLabel}\n${prompt}`)
  })

  it('omits got-away detail when reason is omitted on a got-away result', () => {
    const msg = resultPanelMessage('gotAway', config)
    expect(msg).toBe(`${t.gotAwayLabel}\n${prompt}`)
  })
})
