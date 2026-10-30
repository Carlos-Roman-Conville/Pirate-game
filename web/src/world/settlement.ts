/** Thirty nautical days in Port Royal. All stand-ins are F-SE-* in FIXTURES.md. */
import { bodyOutputs, KCAL_J, type Component } from '@rex/realism'
import fixture from '../../../data/pirate-ship/world/settlement.json'
import calendar from '../../../data/pirate-ship/world/places.json'
import foodData from '../../../data/pirate-ship/world/food.json'
import characterData from '../../../data/pirate-ship/world/characters.json'
import recipes from '../../../data/pirate-ship/economy/recipes.json'
import { drinkingProcess, engineOf, releaseDayTrace, type DutyBlock, type GameCharacter, type Place } from './adapters/characters.ts'
import { issueRation, ration, keepsOf } from './adapters/food.ts'
import { conditionsAt, roomFor } from './adapters/places.ts'
import { facilityAt, workDay, workDuty, WorkInventory, type Worker } from './adapters/work.ts'
import { crisesHeld, exposeAt, healDay, inflict, medicineOf, woundProcesses, woundsOf, type Hit, type CrisisEvent } from './adapters/medicine.ts'
import { facesOf } from './adapters/stats.ts'

type Amounts = Record<string, number>
const add = (a: Amounts, b: Amounts) => { for (const [id, n] of Object.entries(b)) a[id] = (a[id] ?? 0) + n }
const difference = (a: Amounts, b: Amounts): Amounts => Object.fromEntries(
  [...new Set([...Object.keys(a), ...Object.keys(b)])].map(id => [id, (a[id] ?? 0) - (b[id] ?? 0)]))
export const settlementFixture = fixture
export const startDayOfYear = calendar.calendar.monthDays.slice(0, calendar.calendar.months.indexOf(fixture.startMonth))
  .reduce((a, b) => a + b, fixture.startDay)

export function settlementPlan(occupation: string, short: boolean): DutyBlock[] {
  const sleepFrom = short ? fixture.shortSleepFromH : fixture.sleepFromH
  return [
    { fromH: fixture.workFromH, toH: fixture.workToH, duty: workDuty(occupation) },
    { fromH: fixture.workToH, toH: sleepFrom, duty: fixture.restDuty },
    { fromH: sleepFrom, toH: fixture.sleepToH, duty: fixture.sleepDuty },
    { fromH: fixture.sleepToH, toH: fixture.workFromH, duty: fixture.restDuty },
  ]
}

function extrema() {
  const ranges: Record<string, { min: number; max: number }> = {}
  return { ranges, observe(body: Component) {
    const outputs = bodyOutputs(body)
    for (const [id, value] of Object.entries({ mass_kg: body.mass, alertness: outputs.alertness, fatigue_met_hours: outputs.fatigue_met_hours })) {
      if (typeof value !== 'number' || !Number.isFinite(value)) throw new Error(`settlement: invalid ${id}`)
      const r = ranges[id] ??= { min: value, max: value }
      r.min = Math.min(r.min, value); r.max = Math.max(r.max, value)
    }
  } }
}

/** New bodies, medicine streams and inventory on every invocation. No fate resolution. */
export function runSettlement(seed = fixture.seed) {
  const facilities = fixture.facilities.map(f => facilityAt(f.id, f.recipe, f.equipment))
  const workers: Worker[] = fixture.facilities.flatMap((assignment, group) => {
    const recipe = recipes.recipes.find(r => r.id === assignment.recipe)!
    return Array.from({ length: fixture.staffPerFacility }, (_, member) => {
      const index = group * fixture.staffPerFacility + member
      const character: GameCharacter = { slug: `settler-${index + 1}`, plan: day => settlementPlan(assignment.occupation,
        index === fixture.shortSleep.person && day >= fixture.shortSleep.fromDay && day <= fixture.shortSleep.toDay) }
      medicineOf(character, { seed: fixture.medicineSeed + seed - fixture.seed + index })
      return { character, occupation: assignment.occupation, skills: { [recipe.skill]: fixture.skill }, knownRecipes: [recipe.id] }
    })
  })
  const people = workers.map(w => w.character)
  const stock = new WorkInventory()
  for (const line of ration) stock.stock(line.food.good!, line.weeklyKg / foodData.week.days * people.length * fixture.days, 1)
  for (const assignment of fixture.facilities) {
    const recipe = recipes.recipes.find(r => r.id === assignment.recipe)!
    for (const id of recipe.inputs) stock.stock(id, fixture.recipeInputUnits, 1)
  }
  stock.stock(fixture.spoilageProbe.good, fixture.spoilageProbe.kg, 1)
  const initialStock = stock.totals()
  const allCrises: CrisisEvent[] = []
  const days = []
  for (let day = 1; day <= fixture.days; day++) {
    const calendarDay = startDayOfYear + day - 1
    const weather = Array.from({ length: 24 / fixture.weatherSampleHours }, (_, i) => {
      const hour = i * fixture.weatherSampleHours
      return conditionsAt(fixture.climatePlace, calendarDay + Number(hour < characterData.clock.dayStartH), hour, seed)
    })
    const room = roomFor(fixture.room, { airC: weather[characterData.clock.dayStartH]!.air_c })!
    const place: Place = { airC: room.temperatureC, volumeM3: room.props.volume_m3!, ach: room.props.ach!,
      conditions: hour => {
        const conditions = weather[Math.floor(hour / fixture.weatherSampleHours)]!
        if (conditions.wbgt_c === null) throw new Error('settlement: unsupported WBGT')
        return { air_c: conditions.air_c, wbgt_c: conditions.wbgt_c }
      } }
    const before = stock.totals(), ledgerBefore = stock.ledger()
    // Initialise the place BEFORE food.ts asks for this person's engine.
    const bodiesBefore = people.map(person => {
      const { world, body } = engineOf(person, place)
      return { water: world.massOf('water', [body]), unplaced: Number(bodyOutputs(world.registry.component(body)).energy_unplaced_kcal ?? 0) }
    })
    const hazards: string[] = []
    if (day === fixture.wound.day) {
      const person = people[fixture.wound.person]!
      inflict(person, fixture.wound as Hit)
      hazards.push(`${person.slug}:thrust`)
    }
    if (day === fixture.fatalWound.day) {
      const person = people[fixture.fatalWound.person]!
      inflict(person, fixture.fatalWound as Hit)
      hazards.push(`${person.slug}:fatal-thrust`)
    }
    if (day === fixture.fever.day) {
      const person = people[fixture.fever.person]!
      const exposure = exposeAt(person, { place: fixture.climatePlace, day: calendarDay,
        disease: fixture.fever.disease, dose: fixture.fever.dose, weatherSeed: seed })
      hazards.push(`${person.slug}:fever-exposure:${exposure.result?.reason ?? exposure.unsupported}`)
      allCrises.push(...exposure.crises)
    }
    if (day >= fixture.shortSleep.fromDay && day <= fixture.shortSleep.toDay) hazards.push(`${people[fixture.shortSleep.person]!.slug}:short-sleep`)
    const meals = issueRation(stock.food, people, day)
    const outputByFacility: Record<string, Amounts> = {}
    const personReports = workers.map((worker, index) => {
      const character = worker.character, observed = extrema()
      const facility = facilities[Math.floor(index / fixture.staffPerFacility)]!
      const dry = facility.id === fixture.water.dry.facility && day >= fixture.water.dry.fromDay
      const work = workDay(worker, facility, stock, day,
        { ...place, processes: [...(dry ? [] : [drinkingProcess(fixture.water.drinkEveryMin)]), ...woundProcesses(character)], observe: observed.observe })
      add(outputByFacility[facility.id] ??= {}, work.produced)
      const healing = healDay(character)
      allCrises.push(...healing.crises)
      const { world, body } = engineOf(character)
      const outputs = { ...work.body.outputs, ...healing.outputs }
      const flow = (quantity: string) => ({ in: world.trace.into(body, quantity), out: world.trace.outOf(body, quantity) })
      const chemical = flow('energy:chemical'), stored = flow('energy:stored'), water = flow('mass:water')
      const waterEnd = world.massOf('water', [body]), beforeBody = bodiesBefore[index]!
      const unplaced = Number(outputs.energy_unplaced_kcal) - beforeBody.unplaced
      const energy = { inKcal: chemical.in / KCAL_J, outKcal: chemical.out / KCAL_J,
        storedKcal: (stored.in - stored.out) / KCAL_J, unplacedKcal: unplaced }
      const plan = typeof character.plan === 'function' ? character.plan(day) : character.plan
      const sleep = plan.filter(p => p.duty === fixture.sleepDuty).reduce((h, p) => h + (p.toH - p.fromH + 24) % 24, 0)
      const medicine = medicineOf(character)
      const report = { slug: character.slug, facility: facility.id, occupation: worker.occupation,
        sleepH: sleep, kcalIssued: energy.inKcal, outputs, massKg: world.registry.component(body).mass,
        ranges: observed.ranges, energy, water: { startKg: beforeBody.water, endKg: waterEnd, inKg: water.in, outKg: water.out },
        failedChecks: work.body.failedChecks, checks: world.trace.checks.length,
        sick: structuredClone(medicine.sick), wounded: structuredClone(woundsOf(character)),
        crises: structuredClone(crisesHeld(character)), faces: facesOf(outputs),
        bloodLostMl: Number(world.registry.component(body).props.blood_lost_ml ?? 0), bloodLostKg: world.trace.outOf(body, 'mass:blood'),
        waterDeficitKg: Number(world.registry.component(body).props.waterDeficitKg ?? 0),
        workCapacity: outputs.work_capacity_hydration, workStopped: work.stopped, dead: world.registry.component(body).props.dead === 1,
        warnings: waterEnd === 0 ? ['Body water exhausted; the engine opens a crisis at the hydration rows, the host resolves it.'] : [] }
      releaseDayTrace(character)
      return report
    })
    const ledger = stock.ledger()
    const produced: Amounts = {}
    for (const output of Object.values(outputByFacility)) add(produced, output)
    days.push({ day, date: `${fixture.startMonth} ${fixture.startDay + day - 1}`, calendarDay,
      weather: weather[characterData.clock.dayStartH], before, stock: stock.totals(), produced,
      consumed: difference(ledger.issued, ledgerBefore.issued), spoiled: difference(ledger.spoiled, ledgerBefore.spoiled),
      outputByFacility, people: personReports, hazards, shortages: meals.short,
      crises: structuredClone(allCrises) })
  }
  return { seed, initialStock, days, crises: structuredClone(allCrises),
    limitations: ['No library wound blood-loss rate (the fatal wound\'s is a host fixture, F-MD-8); the engine opens a crisis and never a death; no physiological survival claim.',
      'Production uses F-WK placeholders; fever does not yet supply a physiological fever factor.',
      'No circulation or limb-muscle process in characters.ts; aerobic_today remains unavailable.',
      `Unrestocked ration lots spoil by food.ts Keeps days (${ration.map(r => `${r.food.good}:${keepsOf(r.food.good!)}`).join(', ')}).`] }
}

/** One JSON ledger line per nautical day, with full precision for machine checking. */
export function printSettlement(result: ReturnType<typeof runSettlement>, write = console.log): void {
  for (const day of result.days) write(JSON.stringify({ day: day.day, date: day.date, weather: day.weather,
    stock: day.stock, produced: day.produced, consumed: day.consumed, spoiled: day.spoiled,
    outputByFacility: day.outputByFacility,
    people: day.people.map(p => ({ slug: p.slug, kcalIssued: p.kcalIssued, sleepH: p.sleepH, alertness: p.outputs.alertness,
      fatigue: p.outputs.fatigue_met_hours, massKg: p.massKg, energy: p.energy, water: p.water,
      sick: p.sick, wounded: p.wounded, workCapacity: p.workCapacity, workStopped: p.workStopped, warnings: p.warnings })),
    hazards: day.hazards, shortages: day.shortages, crises: day.crises, limitations: result.limitations }))
}
