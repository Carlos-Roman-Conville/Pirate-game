import { describe, expect, it } from 'vitest'
import { metOf, overnight, sleepDebtRow, splitSleepQuality } from '@rex/realism'
import physiology from '../../../../files/pirate-ship/body/data/physiology.json'
import data from '../../../../data/pirate-ship/world/characters.json'
import source from './characters.ts?raw'
import { activityOf, mappedDuties, scheduleOf, simulateDay, type DutyBlock, type GameCharacter } from './characters.ts'

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

  it('holds no formula: no Math anywhere in the adapter', () => {
    expect(source).not.toMatch(/Math/)
  })
})
