/// <reference types="node" />
import { stdout } from 'node:process'
import { describe, expect, it } from 'vitest'
import { loadAlignmentConfig, QUADRANTS, UNRESOLVED } from '../index'
import { run } from './scenario'
import { DEFAULT_LIMITS, reachablePerfect } from './search'
import { greedyToward, random } from './strategies'

describe('alignment simulator', () => {
  it('prints bounded default-config findings and replayable routes for all quadrants', () => {
    const report: string[] = ['UNRESOLVED:', ...UNRESOLVED,
      'Unreachable means no route found within limits; engine rejections follow each route.']
    for (const quadrant of QUADRANTS) {
      const result = reachablePerfect(quadrant)
      const verdict = `perfect ${quadrant}: ${result.reachable ? 'reachable' : 'unreachable'} (${result.steps} steps)`
      report.push(verdict)
      result.route.forEach((command, index) => report.push(`${index + 1}. ${JSON.stringify(command)}`))
      report.push(`coverage: ${result.coveredSectors}/${result.totalSectors}; issues: ${result.issues.join('; ')}`)
      expect(report).toContain(verdict)
      expect(result.routesTried).toBeLessThanOrEqual(DEFAULT_LIMITS.maxRoutes)
      expect(result.exploredSteps).toBeLessThanOrEqual(DEFAULT_LIMITS.maxRoutes * DEFAULT_LIMITS.maxSteps)
      expect(run(result.route).state).toEqual(result.state)
    }
    // Vitest's noninteractive reporter hides passing tests' console output.
    // This report is the command's artifact, so emit it directly to stdout.
    stdout.write(report.join('\n') + '\n')
  })

  it('replays a seeded random walk to the same state and ending', () => {
    const config = loadAlignmentConfig()
    const a = random(42, config)
    const b = random(42, config)
    expect(a.route).toEqual(b.route)
    expect(run(a.route, config)).toEqual(run(b.route, config))
    expect(run(a.route, config).state).toEqual(a.state)
    expect(random(43, config).route).not.toEqual(a.route)
  })

  it('uses engine logs and current party, playerActs and day for occurrences', () => {
    const result = run([
      { type: 'recruit', slug: 'entp-m' },
      { type: 'party', slugs: ['entp-m'] },
      { type: 'sleep' },
      { type: 'event', occurrence: { defId: 'placeholder.action.major.og', witnesses: [], playerActs: false, day: 99 } },
    ])
    expect(result.state.log[3]).toEqual({ type: 'event', occurrence: {
      defId: 'placeholder.action.major.og', witnesses: ['entp-m'], playerActs: true, day: 1,
    } })
    expect(result.log).toEqual(result.state.log.map((command) => JSON.stringify(command)))
  })

  it('exercises development and overnight routes with the explicitly supported ghost policy', () => {
    // This is a separate engine-supported configuration, never a default repair.
    const config = loadAlignmentConfig()
    config.thresholds.ghostRule = 'every-pair-both-improve'
    for (const quadrant of QUADRANTS) {
      const result = reachablePerfect(quadrant, config)
      if (result.reachable) {
        expect(run(result.route, config).ending).toEqual(result.ending)
        expect(result.coveredSectors).toBe(result.totalSectors)
      }
      const route = greedyToward(quadrant, config, { party: 'compatible' }).route
      const replay = run(route, config)
      expect(replay.log.length).toBeGreaterThan(route.length) // Includes engine transformations.
      expect(replay.state.log).toEqual(route)
    }
  })

  it('respects zero/tiny budgets, zero crew, absent events and motion that cannot reach a region', () => {
    expect(reachablePerfect('og', undefined, { maxRoutes: 0 }).steps).toBe(0)
    expect(reachablePerfect('og', undefined, { maxSteps: 0 }).exploredSteps).toBe(0)
    expect(reachablePerfect('og', undefined, { maxRoutes: 2, maxSteps: 1 }).exploredSteps).toBe(2)
    const config = loadAlignmentConfig()
    config.thresholds.crewSlots = 0
    expect(greedyToward('og', config).route).toEqual([])
    config.thresholds.crewSlots = 3
    config.events = []
    expect(reachablePerfect('ce', config, { maxRoutes: 2 }).reachable).toBe(false)
    config.events = loadAlignmentConfig().events
    config.thresholds.step.major = 0
    config.thresholds.step.minor = 0
    expect(greedyToward('cg', config, { maxSteps: 10 }).attempts).toBe(10)
    expect(() => reachablePerfect('og', config, { maxSteps: Infinity })).toThrow('invalid maxSteps')
  })
})
