import { beforeAll, describe, expect, it } from 'vitest'
import { libraryTable, metOf, overnight, fatKcalPerKg, bleedingClass, normalBloodVolume, bleedFactor } from '@rex/realism'
import characterData from '../../../data/pirate-ship/world/characters.json'
import { activityOf, fixturePhysique } from './adapters/characters.ts'
import { runSettlement, printSettlement, settlementFixture as f, settlementPlan, startDayOfYear } from './settlement.ts'

let result: ReturnType<typeof runSettlement>
let elapsedMs: number
beforeAll(() => {
  const start = performance.now()
  result = runSettlement()
  elapsedMs = performance.now() - start
}, 300_000) // (2690) a time limit for a long simulation under load, not a tolerance

describe('Port Royal settlement, thirty days', () => {
  it('prints thirty dates from August 1, twelve people each, in under a minute', () => {
    expect(elapsedMs).toBeLessThan(60_000)
    expect(result.days).toHaveLength(30)
    const lines: string[] = []
    printSettlement(result, line => lines.push(line))
    expect(lines).toHaveLength(31)
    const peakMb = Number(/^peak resident memory (\d+) MB$/.exec(lines[30]!)?.[1])
    expect(peakMb).toBeGreaterThan(0)
    expect(peakMb).toBeLessThan(1536)
    expect(JSON.parse(lines[0]!)).toMatchObject({ day: 1, date: 'Aug 1' })
    expect(JSON.parse(lines[29]!)).toMatchObject({ day: 30, date: 'Aug 30' })
    for (const [index, day] of result.days.entries()) {
      expect(day.calendarDay).toBe(startDayOfYear + index)
      expect(day.weather.month).toBe('Aug')
      expect(day.people).toHaveLength(12)
      expect(new Set(day.people.map(p => p.slug)).size).toBe(12)
      expect(Object.keys(day.outputByFacility)).toHaveLength(f.facilities.length)
    }
  })

  it('closes every good every day, including food, production inputs and spoilage', () => {
    let previous = result.initialStock
    for (const day of result.days) {
      expect(day.before).toEqual(previous)
      const ids = new Set([...Object.keys(day.before), ...Object.keys(day.stock), ...Object.keys(day.produced),
        ...Object.keys(day.consumed), ...Object.keys(day.spoiled)])
      for (const id of ids) {
        expect((day.produced[id] ?? 0) - (day.consumed[id] ?? 0) - (day.spoiled[id] ?? 0), `${day.day}:${id}`)
          .toBeCloseTo((day.stock[id] ?? 0) - (day.before[id] ?? 0), 8)
        expect(day.stock[id] ?? 0).toBeGreaterThanOrEqual(-1e-10)
      }
      previous = day.stock
    }
    expect(result.days.some(d => Object.values(d.spoiled).some(n => n > 0))).toBe(true)
    for (const facility of f.facilities) expect(result.days.some(d =>
      Object.values(d.outputByFacility[facility.id]!).some(n => n > 0))).toBe(true)
  })

  it('closes each body energy and water independently, with engine checks active', () => {
    for (const day of result.days) for (const person of day.people) {
      const e = person.energy, w = person.water
      expect(e.inKcal).toBeGreaterThan(0)
      expect(e.outKcal).toBeGreaterThan(0)
      expect(e.inKcal - e.outKcal).toBeCloseTo(e.storedKcal + e.unplacedKcal, 6)
      expect(w.inKg).toBeGreaterThan(0)
      expect(w.inKg - w.outKg).toBeCloseTo(w.endKg - w.startKg, 8)
      expect(w.endKg).toBeGreaterThanOrEqual(0)
      expect(person.failedChecks, `${day.day}:${person.slug}`).toEqual([])
      expect(person.checks).toBeGreaterThan(0)
      if (day.day > 1) expect(w.startKg).toBe(result.days[day.day - 2]!.people.find(p => p.slug === person.slug)!.water.endKg)
    }
  })

  it('checks minute extrema and daily trajectories against library bounds and recovery', () => {
    const debt = libraryTable('physiology', 'sleep_debt').map(r => Number(r['Alertness multiplier']))
    const circadian = libraryTable('physiology', 'circadian').map(r => Number(r.Factor))
    const fatRule = libraryTable('nutrition', 'body_composition').find(r => r.id === 'nutrition.body_composition.fat-mass')!
    const fatFloor = Number(/floor ([\d.]+) kg/.exec(String(fatRule.Rule))![1])
    const state = new Map<string, { fatigue: number; debt: number; kcal: number; waterKg: number }>()
    for (const day of result.days) for (const person of day.people) {
      const previous = state.get(person.slug) ?? { fatigue: 0, debt: 0, kcal: 0, waterKg: 0 }
      const plan = settlementPlan(person.occupation, person.sleepH < f.sleepToH)
      const metHours = plan.reduce((n, b) => n + (b.toH - b.fromH + 24) % 24 * metOf(activityOf(b.duty)), 0)
      const next = overnight(previous.debt, previous.fatigue + metHours, person.sleepH)
      expect(person.outputs.fatigue_met_hours).toBeCloseTo(next.fatigueMetH, 6)
      expect(person.outputs.sleep_debt).toBeCloseTo(next.debtH, 6)
      expect(person.ranges.fatigue_met_hours!.min).toBeGreaterThanOrEqual(0)
      expect(person.ranges.fatigue_met_hours!.max).toBeLessThanOrEqual(previous.fatigue + metHours + 1e-7)
      expect(person.ranges.alertness!.min).toBeGreaterThanOrEqual(Math.min(...debt) * Math.min(...circadian))
      expect(person.ranges.alertness!.max).toBeLessThanOrEqual(Math.max(...debt) * Math.max(...circadian))
      expect(person.outputs.fat_kg).toBeGreaterThanOrEqual(fatFloor)
      // Body mass is the fat, plus the water the body is short (nutrition's ledger, since the sweat model of 2540), less the blood
      // shed at the library density (circulation's ledger); the pools stay full in this run, so glycogen adds nothing.
      const lost = person.bloodLostKg + person.waterDeficitKg
      expect(person.massKg).toBeCloseTo(fixturePhysique.massKg - fixturePhysique.fatKg + Number(person.outputs.fat_kg) - lost, 8)
      expect(person.ranges.mass_kg!.min).toBeGreaterThanOrEqual(fixturePhysique.massKg - fixturePhysique.fatKg + fatFloor - lost - 1e-8)
      // Library has no universal upper body-mass or MET-hour clamp. Bound gain by all food energy
      // plus the initial glycogen energy (read from its reserve row), not an invented healthy range.
      const energyRow = libraryTable('nutrition', 'nutrients').find(r => r.id === 'energy')!
      const glycogenKcal = Number(/glycogen about [\d,]+ g = ([\d,]+) kcal/.exec(String(energyRow['Body reserve (full)']))![1]!.replaceAll(',', ''))
      const kcal = previous.kcal + person.energy.inKcal
      // Water drunk and eaten enters body mass the moment it is taken in (one body-water ledger), so the day's peak can
      // carry all the water taken in up to that day, read from the run's own water ledger, not a constant (2686).
      const waterKg = previous.waterKg + person.water.inKg
      expect(person.ranges.mass_kg!.max).toBeLessThanOrEqual(fixturePhysique.massKg + (kcal + glycogenKcal) / fatKcalPerKg() + waterKg + 1e-8)
      state.set(person.slug, { fatigue: next.fatigueMetH, debt: next.debtH, kcal, waterKg })
    }
  })

  it('exercises all three hazards and leaves the seeded fatal-risk crisis unresolved', () => {
    expect(result.days[f.wound.day - 1]!.people[f.wound.person]!.wounded).toHaveLength(1)
    expect(result.days[f.fever.day - 1]!.hazards).toContain(`settler-${f.fever.person + 1}:fever-exposure:infected`)
    expect(result.crises.length).toBeGreaterThan(0) // no vacuous no-deaths assertion
    for (const day of result.days) for (const person of day.people) {
      for (const crisis of person.crises) {
        expect(crisis.resolved).toBeUndefined()
        expect(day.crises.some(c => c.slug === person.slug && c.cause === crisis.cause && c.record.startedAt === crisis.startedAt)).toBe(true)
      }
      for (const sick of person.sick.filter(s => s.crisis)) {
        expect(person.crises.some(c => c.cause === `disease:${sick.id}`)).toBe(true)
      }
    }
    const patient = result.days[29]!.people[f.fever.person]!
    expect(patient.sick.some(s => s.crisis)).toBe(true)
    expect(patient.crises.every(c => c.resolved === undefined)).toBe(true)
    const sleepy = result.days.filter(d => d.day >= f.shortSleep.fromDay && d.day <= f.shortSleep.toDay)
    expect(sleepy).toHaveLength(7)
    expect(sleepy.every(d => d.people[f.shortSleep.person]!.sleepH === f.sleepToH - f.shortSleepFromH)).toBe(true)
    expect(sleepy[6]!.people[f.shortSleep.person]!.outputs.alertness).toBeLessThan(1)
    expect(result.days[f.shortSleep.toDay]!.people[f.shortSleep.person]!.outputs.fatigue_met_hours).toBe(0)
  })

  it('a seeded fatal wound ends in a crisis record on its own day, before any death, and bleeds the body', () => {
    const IV = 'circulation.bleeding.iv', w = f.fatalWound, slug = `settler-${w.person + 1}`
    const before = result.days[w.day - 2]!.people[w.person]!, on = result.days[w.day - 1]!.people[w.person]!
    expect(before.crises.filter(c => c.cause === IV)).toEqual([])
    expect(before.bloodLostMl).toBe(0)
    expect(on.bloodLostMl).toBeGreaterThan(0)
    expect(on.crises.filter(c => c.cause === IV)).toHaveLength(1)
    expect(result.days[w.day - 1]!.hazards).toContain(`${slug}:fatal-thrust`)
    expect(result.days[w.day - 2]!.crises.some(c => c.slug === slug && c.cause === IV)).toBe(false)
    expect(result.days[w.day - 1]!.crises.filter(c => c.slug === slug && c.cause === IV)).toHaveLength(1)
    const record = on.crises.find(c => c.cause === IV)!
    expect(record).toMatchObject({ kind: 'crisis', body: 'body', risk: null, organ: IV })
    expect(record.source).toContain(IV)
    // F-MD-9 retired by 2570: circulation runs at the body's step, so the record opens within one step of the loss reaching the class
    const factor = bleedFactor() // the engine's `bleed` factor, by name
    const rateMlS = w.rateMlMin / 60 * (factor - w.clotting), baseline = normalBloodVolume(fixturePhysique.massKg, fixturePhysique.male)
    let reachS = 0
    while (bleedingClass(rateMlS * reachS, baseline).Class !== 'IV') reachS++
    // the step stamped t has bled through t + one step by the time circulation reads it
    const lateS = record.startedAt - (w.day - 1) * 86400 + characterData.clock.stepS - reachS
    expect(lateS).toBeGreaterThanOrEqual(0)
    expect(lateS).toBeLessThanOrEqual(characterData.clock.stepS)
    // the same condition the next day is not a second record, and the engine has declared nobody dead
    for (const day of result.days.slice(w.day)) expect(day.people[w.person]!.crises.filter(c => c.cause === IV)).toHaveLength(1)
    for (const day of result.days) for (const person of day.people) {
      expect(person.dead).toBe(false)
      expect(person.crises.every(c => c.resolved === undefined)).toBe(true)
    }
  })

  it('lists every crisis record the engine opened, and follows the hydration row that stops work', () => {
    const key = (slug: string, c: { cause: string; startedAt: number }) => `${slug}|${c.cause}|${c.startedAt}`
    for (const day of result.days) {
      const held = day.people.flatMap(p => p.crises.map(c => key(p.slug, c))).sort()
      expect(day.crises.map(c => key(c.slug, c.record)).sort(), `day ${day.day}`).toEqual(held)
    }
    expect(result.crises.map(c => key(c.slug, c.record)).sort()).toEqual(result.days[29]!.crises.map(c => key(c.slug, c.record)).sort())
    const causes = new Set(result.crises.map(c => c.cause))
    for (const cause of ['circulation.bleeding.iv', 'disease:yellow_fever', 'physiology.hydration.6-to-10', 'physiology.hydration.over-10']) {
      expect(causes.has(cause), cause).toBe(true)
    }
    // water: only the bakery's dry spell opens hydration records, a record is one episode (a band entered, then left) so a body
    // that dries again after drinking has another, and work stops on the engine's word
    const dry = f.water.dry, hydration = result.crises.filter(c => c.cause.startsWith('physiology.hydration'))
    const bakers = new Set(result.days[0]!.people.filter(p => p.facility === dry.facility).map(p => p.slug))
    expect(bakers.size).toBe(f.staffPerFacility)
    expect(hydration.every(c => bakers.has(c.slug))).toBe(true)
    // reads the engine's records (every settler's crisis records in the world trace), not the report the adapter built (round 49 fix 2)
    const engineCount = result.engineCrises.filter(c => c.cause.startsWith('physiology.hydration')).length
    expect(hydration).toHaveLength(engineCount)
    for (const slug of bakers) for (const band of ['physiology.hydration.6-to-10', 'physiology.hydration.over-10']) {
      const own = hydration.filter(c => c.slug === slug && c.cause === band).map(c => c.record).sort((a, b) => a.startedAt - b.startedAt)
      expect(own.length, `${slug} ${band}`).toBeGreaterThanOrEqual(1)
      for (let i = 1; i < own.length; i++) expect(own[i]!.startedAt, `${slug} ${band} #${i}`).toBeGreaterThanOrEqual(own[i - 1]!.resolvedAt!)
    }
    let stopped = 0
    for (const day of result.days) for (const person of day.people) {
      const is = day.crises.some(c => c.slug === person.slug && c.cause.startsWith('physiology.hydration'))
      expect(person.workStopped === 'hydration', `${day.day}:${person.slug}`).toBe(is)
      expect(person.workCapacity === 0, `${day.day}:${person.slug}`).toBe(is)
      if (is) stopped++
    }
    expect(stopped).toBeGreaterThan(0)
    // the bakery made bread-stuffs before its dry spell and nothing once its four were stopped
    const made = (day: number) => Object.values(result.days[day - 1]!.outputByFacility[dry.facility]!).reduce((a, b) => a + b, 0)
    expect(made(dry.fromDay - 1)).toBeGreaterThan(0)
    for (let day = 30; day > 21; day--) expect(made(day), `day ${day}`).toBe(0)
  })
})
