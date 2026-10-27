import { describe, expect, it } from 'vitest'
import {
  directionLinePosition,
  powerMeterValue,
  resolveCastLanding,
} from '../fishing/cast'
import { dispatch, loadFishingConfig, playerStatsFromConfig, startFishing } from '../fishing/machine'
import {
  castFlyDurationMs,
  castViewAimInput,
  castViewDrawLanding,
  castViewOnSpace,
  createCastView,
  type CastViewContext,
} from './castView'

const config = loadFishingConfig()
const stats = playerStatsFromConfig(config)

const ctx: CastViewContext = {
  originTiles: { x: 10, y: 8 },
  facing: { dx: 0, dy: 1 },
  tileSize: 16,
}

function runAt(stage: 'aim' | 'direction' | 'power') {
  let run = startFishing(config)
  while (run.stage !== stage) {
    run = dispatch(run, { type: 'stub', success: true })
  }
  return run
}

describe('castViewOnSpace advances the fishing machine', () => {
  it('confirms aim and moves to direction', () => {
    const now = 1000
    let state = createCastView(ctx, stats, config, now)
    let run = runAt('aim')
    const out = castViewOnSpace(state, now + 50, run, stats, config)
    expect(out.run.stage).toBe('direction')
    expect(out.state.linePositionAtPress).toBeNull()
  })

  it('confirms direction and moves to power', () => {
    const now = 2000
    let state = createCastView(ctx, stats, config, now)
    let run = runAt('direction')
    const out = castViewOnSpace(state, now + 120, run, stats, config)
    expect(out.run.stage).toBe('power')
    expect(out.state.linePositionAtPress).toBe(directionLinePosition(120, stats, config))
  })

  it('confirms power and moves to lure with a landing', () => {
    const now = 3000
    let state = createCastView(ctx, stats, config, now)
    let run = runAt('aim')
    const afterAim = castViewOnSpace(state, now, run, stats, config)
    state = afterAim.state
    run = afterAim.run
    const afterDir = castViewOnSpace(state, now + 40, run, stats, config)
    state = afterDir.state
    run = afterDir.run
    const out = castViewOnSpace(state, now + 400, run, stats, config)
    expect(out.run.stage).toBe('lure')
    expect(out.state.landing).not.toBeNull()
    expect(out.state.flyStartMs).toBe(now + 400)
  })

  it('does not advance when the run is not in a cast stage', () => {
    const state = createCastView(ctx, stats, config, 0)
    const run = startFishing(config)
    const out = castViewOnSpace(state, 500, run, stats, config)
    expect(out.run.stage).toBe('readWater')
  })
})

describe('castViewDrawLanding', () => {
  it('matches resolveCastLanding for the captured press values', () => {
    const now = 5000
    let state = createCastView(ctx, stats, config, now)
    state = castViewAimInput(state, { forward: true, back: false, left: false, right: false }, stats, config)
    let run = runAt('aim')
    const aimPress = now + 40
    const afterAim = castViewOnSpace(state, aimPress, run, stats, config)
    state = afterAim.state
    run = afterAim.run
    const dirElapsed = 80
    const dirPress = aimPress + dirElapsed
    const afterDir = castViewOnSpace(state, dirPress, run, stats, config)
    state = afterDir.state
    run = afterDir.run
    const linePos = state.linePositionAtPress!
    const powerElapsed = 333
    const powerPress = dirPress + powerElapsed
    const actualPower = powerMeterValue(powerElapsed, config)
    const { state: afterPower } = castViewOnSpace(state, powerPress, run, stats, config)
    const drawn = castViewDrawLanding(afterPower)
    const expected = resolveCastLanding(
      ctx.originTiles,
      ctx.facing,
      afterPower.aim,
      linePos,
      actualPower,
      stats,
      config,
    )
    expect(drawn).not.toBeNull()
    expect(drawn!.x).toBeCloseTo(expected.x, 8)
    expect(drawn!.y).toBeCloseTo(expected.y, 8)
    expect(drawn!.distanceTiles).toBeCloseTo(expected.distanceTiles, 8)
  })
})

describe('cast fly timing', () => {
  it('reads duration from fishing.json', () => {
    expect(castFlyDurationMs(config)).toBe(Number(config.castFly.durationMs))
  })
})
