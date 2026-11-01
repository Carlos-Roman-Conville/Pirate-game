import { describe, expect, it } from 'vitest'
import { aerobicToday, bodyBanisterDay, bodyTrainingFactor, metOf, overnight, sleepDebtRow, splitSleepQuality } from '@rex/realism'
import statsData from '../../../../data/pirate-ship/world/stats.json'
import { capabilityToday } from './stats.ts'
import physiology from '../../../../files/pirate-ship/body/data/physiology.json'
import data from '../../../../data/pirate-ship/world/characters.json'
import source from './characters.ts?raw'
import { activityOf, engineOf, fixturePlace, mappedDuties, releaseDayTrace, scheduleOf, simulateDay, type DutyBlock, type GameCharacter } from './characters.ts'

// Four hours on, eight off, twice a day: watches 08 to 12 and 20 to 24; the off-watch hours sleep 12 to 16 and 00 to 04.
const watchBill: DutyBlock[] = [
  { fromH: 0, toH: 4, duty: 'Sleep' }, { fromH: 4, toH: 8, duty: 'Swabbing the deck' },
  { fromH: 8, toH: 12, duty: 'Standing watch' }, { fromH: 12, toH: 16, duty: 'Sleep' },
  { fromH: 16, toH: 20, duty: 'Fishing' }, { fromH: 20, toH: 24, duty: 'Standing watch' },
]
const nightsAbed: DutyBlock[] = [
  { fromH: 22, toH: 6, duty: 'Sleep' }, { fromH: 6, toH: 12, duty: 'Pumping the bilge' },
  { fromH: 12, toH: 22, duty: 'Walking the deck' },
]
const deckhand = (slug: string, plan: DutyBlock[]): GameCharacter => ({ slug, plan })

describe('a game character becomes an engine body', () => {
  it('Banister to adapter (2755): reads daily oxygen delivery and per-kg capability from the engine', () => {
    const hand = deckhand('training', nightsAbed)
    const { world, body } = engineOf(hand)
    expect(aerobicToday(world, body)).toBeNull() // breathing has not supplied blood gases yet
    const factors: number[] = [], aerobic: number[] = []
    for (let day = 1; day <= 30; day++) {
      // Exercise the engine's daily training API; the adapter owns no training formula.
      bodyBanisterDay(world, body, metOf(activityOf('Pumping the bilge')), 0)
      const report = simulateDay(hand, day)
      const expected = aerobicToday(world, body)
      expect(expected).not.toBeNull()
      expect(report.outputs.aerobic_today).toBe(expected)
      factors.push(bodyTrainingFactor(world, body))
      aerobic.push(expected!)
      const massKg = world.registry.component(body).mass
      const ceiling = capabilityToday('Endurance pool ceiling', 12, report.outputs, { massKg })
      expect(ceiling.factors.aerobicIndex).toBeCloseTo(expected! / massKg / statsData.factors.aerobicIndex.divideBy, 12)
      expect(ceiling.missing).toEqual([])
    }
    expect(factors.at(-1)!).toBeGreaterThan(factors[0]!)
    expect(aerobic.at(-1)!).toBeGreaterThan(aerobic[0]!)
  }, 60_000)

  it('maps every duty name to a met row of the game\'s adapter table', () => {
    const rows = new Map(physiology.met.rows.map(r => [r[0], r[1]]))
    expect(mappedDuties().length).toBeGreaterThan(10)
    for (const duty of mappedDuties()) {
      expect(rows.has(activityOf(duty)), duty).toBe(true)
      expect(() => metOf(activityOf(duty)), duty).not.toThrow()
    }
  })

  it('refuses a duty no met row names', () => {
    expect(() => activityOf('Tending the sick')).toThrow(/no met row/)
  })

  it('weighs a night broken by watches at the engine\'s split quality, an unbroken night at one', () => {
    const quality = (plan: DutyBlock[]) => scheduleOf(plan).filter(e => e.sleepQuality !== undefined).map(e => e.sleepQuality)
    expect(quality(watchBill)).toEqual([splitSleepQuality(), splitSleepQuality()])
    expect(quality(nightsAbed)).toEqual([1])
  })

  it('a 70 kg deckhand on four-on, eight-off for seven days has the sleep debt the engine\'s table gives', () => {
    expect(data.body.massKg).toBe(70)
    const hand = deckhand('deckhand', watchBill)
    let debt = 0, fatigue = 0, report = simulateDay(hand, 1)
    for (let day = 1; day <= 7; day++) {
      if (day > 1) report = simulateDay(hand, day)
      ;({ debtH: debt, fatigueMetH: fatigue } = overnight(debt, fatigue, 8 * splitSleepQuality()))
      expect(report.outputs.sleep_debt, `day ${day}`).toBeCloseTo(debt, 6)
    }
    expect(debt).toBeGreaterThan(0)
    expect(report.outputs.sleep_debt_row).toBe(sleepDebtRow(debt).row.id)
    expect(report.failedChecks).toEqual([])
  })

  it('a deckhand who sleeps eight unbroken hours owes nothing', () => {
    const hand = deckhand('sleeper', nightsAbed)
    let report = simulateDay(hand, 1)
    for (let day = 2; day <= 7; day++) report = simulateDay(hand, day)
    expect(report.outputs.sleep_debt).toBeCloseTo(0, 6)
    expect(report.failedChecks).toEqual([])
  })

  it('runs days in order', () => {
    const hand = deckhand('ordered', nightsAbed)
    expect(() => simulateDay(hand, 2)).toThrow(/day 1/)
    simulateDay(hand, 1)
    expect(() => simulateDay(hand, 1)).toThrow(/day 2/)
  })

  it('passes supplied climate to physiology and observes every completed minute', () => {
    const hand = deckhand('climate', nightsAbed)
    let observations = 0
    const hours: number[] = []
    const report = simulateDay(hand, 1, { ...fixturePlace,
      conditions: hour => { hours.push(hour); return { air_c: fixturePlace.airC, wbgt_c: fixturePlace.airC } },
      observe: () => { observations++ },
    })
    expect(observations).toBe(86400 / data.clock.stepS)
    expect(hours[0]).toBe(data.clock.dayStartH)
    expect(report.outputs.wbgt_c).toBe(fixturePlace.airC)
    expect(report.failedChecks).toEqual([])
    simulateDay(hand, 2)
    expect(engineOf(hand).world.registry.component('room').props.wbgt_c).toBeUndefined()
  })

  it('rotating daily audits preserves the body, clock and all subsequent outputs', () => {
    const retained = deckhand('retained', nightsAbed), archived = deckhand('archived', nightsAbed)
    for (let day = 1; day <= 3; day++) {
      const full = simulateDay(retained, day), bounded = simulateDay(archived, day)
      expect(bounded.outputs).toEqual(full.outputs)
      expect(bounded.failedChecks).toEqual(full.failedChecks)
      const before = engineOf(archived)
      releaseDayTrace(archived)
      const after = engineOf(archived)
      expect(after.world.t).toBe(before.world.t)
      expect(after.nextDay).toBe(day + 1)
      expect(after.world.registry).toBe(before.world.registry)
      expect(after.world.trace.transfers).toEqual([])
      expect(after.world.trace.checks).toEqual([])
    }
  })

  it('holds no formula: no Math anywhere in the adapter', () => {
    expect(source).not.toMatch(/Math/)
  })
})
