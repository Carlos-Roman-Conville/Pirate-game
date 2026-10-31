import { describe, expect, it } from 'vitest'
import { advanceDays, bodyOutputs, createMedicine, crisesOf, diseaseCourse, expose, trackCrisis, treat } from '@rex/realism'
import medicine from '../../../../files/pirate-ship/body/data/medicine.json'
import goods from '../../../../data/pirate-ship/economy/goods.json'
import fixture from '../../../../data/pirate-ship/world/medicine.json'
import placesData from '../../../../data/pirate-ship/world/places.json'
import source from './medicine.ts?raw'
import * as adapter from './medicine.ts'
import {
  crisesHeld, dipFactor, dipsOf, engineVectorDose, exposeAt, healDay, inflict, medicineOf, multiplierOf, placeDiseases, skillNeeded,
  suppliedFactors, treatmentIds, treatPatient, woundProcesses, woundRowFor, woundsOf, type CrisisEvent,
} from './medicine.ts'
import { capabilityToday } from './stats.ts'
import { engineOf, fixturePlace, releaseDayTrace, simulateDay, type GameCharacter } from './characters.ts'
import { WorkInventory } from './work.ts'

const person = (slug: string): GameCharacter => ({ slug, plan: [] })
const cell = (table: { columns: string[]; rows: string[][] }, id: string, column: string): string =>
  table.rows.find(r => r[0] === id)![table.columns.indexOf(column)]!
const woundCell = (id: string): string => cell(medicine.wounds, id, medicine.wounds.columns[1]!)
const GUNSHOT = 'medicine.wounds.gunshot-musket-ball-splinter'
const dayOf = (month: string, day = 1): number => {
  const i = placesData.calendar.months.indexOf(month)
  return placesData.calendar.monthDays.slice(0, i).reduce((a, b) => a + b, 0) + day
}
const AUG = dayOf('Aug', 15), JAN = dayOf('Jan', 15)

describe('a hit becomes an engine wound and dips what its row says', () => {
  it('turns a musket ball to the thigh into the gunshot row, dipping the leg as the column states', () => {
    const c = person('ball'), h = inflict(c, { location: 'thigh', side: 'left', kind: 'shot', open: true })
    expect(woundRowFor('thigh', 'shot')).toBe(GUNSHOT)
    expect(h.wound.kind).toBe(GUNSHOT)
    expect(h.location).toBe('leg')
    expect(h.wound.open).toBe(true)
    const stated = Number(/\bx(\d+(?:\.\d+)?)/.exec(woundCell(GUNSHOT))![1])
    expect(h.dips).toHaveLength(1)
    expect(h.dips[0]).toMatchObject({ location: 'leg', side: 'left', attributes: ['Strength', 'Dexterity', 'Reflexes'], factor: stated })
    // the engine counts it by kind once the day's outputs are published
    healDay(c)
    const { world, body } = engineOf(c)
    expect(bodyOutputs(world.registry.component(body))[GUNSHOT]).toBe(1)
    expect(woundsOf(c)).toEqual([h])
  })

  it('applies the dip through stats.ts: the left leg only, one wound pathway, no stacking', () => {
    const c = person('limp')
    inflict(c, { location: 'leg', side: 'left', kind: 'shot', depth: 0.5 })
    const stated = Number(/\bx(\d+(?:\.\d+)?)/.exec(woundCell(GUNSHOT))![1])
    const left = { limb: { location: 'leg', side: 'left' as const }, attribute: 'Strength' }
    const strength = capabilityToday('Strength_today(limb)', 60, {}, { supplied: suppliedFactors(woundsOf(c), left) })
    expect(strength.value).toBeCloseTo(60 * stated, 10)
    expect(strength.factors['woundDip(limb)']).toBe(stated)
    expect(strength.missing).not.toContain('woundDip(limb)')
    const right = capabilityToday('Strength_today(limb)', 60, {}, { supplied: suppliedFactors(woundsOf(c), { ...left, limb: { location: 'leg', side: 'right' } }) })
    expect(right.factors['woundDip(limb)']).toBe(1)
    const arm = capabilityToday('Strength_today(limb)', 60, {}, { supplied: suppliedFactors(woundsOf(c), { ...left, limb: { location: 'arm', side: 'left' } }) })
    expect(arm.factors['woundDip(limb)']).toBe(1)
    // a second wound to the same leg does not multiply: the worst counts
    inflict(c, { location: 'leg', side: 'left', kind: 'cut', depth: 0 })
    expect(dipFactor(woundsOf(c), left.limb, 'Strength')).toBe(stated)
    // without the caller's factor the formula is as before
    expect(capabilityToday('Strength_today(limb)', 60, {}).missing).toContain('woundDip(limb)')
  })

  it('reads the depth range of a cut from its column', () => {
    const [mild, worst] = /\bx(\d+(?:\.\d+)?) to x(\d+(?:\.\d+)?)/.exec(woundCell('medicine.wounds.cut-incised'))!.slice(1).map(Number) as [number, number]
    const shallow = inflict(person('a'), { location: 'forearm', side: 'right', kind: 'cut', depth: 0 })
    const deep = inflict(person('b'), { location: 'forearm', side: 'right', kind: 'cut', depth: 1 })
    expect(shallow.dips[0]!.factor).toBeCloseTo(mild, 10)
    expect(deep.dips[0]!.factor).toBeCloseTo(worst, 10)
    expect(deep.dips[0]!.attributes.sort()).toEqual(['Dexterity', 'Strength'])
  })

  it('reads every wound row, and keeps fracture, torso and head clauses where they belong', () => {
    for (const r of medicine.wounds.rows) expect(dipsOf(r[0]!).length, r[0]).toBeGreaterThan(0)
    const fracture = inflict(person('f'), { location: 'leg', side: 'right', kind: 'blunt', variant: 'fracture', infected: false })
    expect(fracture.dips.map(d => d.factor).sort()).toEqual([0, 0.5].sort())
    expect(suppliedFactors(woundsOf(person('nobody'))).legsFactor).toBe(1)
    const bruise = inflict(person('b'), { location: 'leg', side: 'right', kind: 'blunt', variant: 'bruise' })
    expect(bruise.dips).toEqual([])
    const stab = inflict(person('s'), { location: 'chest', kind: 'thrust' })
    expect(stab.location).toBe('torso')
    expect(stab.dips).toHaveLength(1)
    expect(stab.dips[0]).toMatchObject({ factor: null, drains: true, attributes: ['Endurance pool', 'Constitution'] })
    const blow = inflict(person('h'), { location: 'skull', kind: 'blunt' })
    expect(blow.wound.kind).toBe('medicine.wounds.head-blow-concussion')
    expect(blow.dips[0]!.attributes).toEqual(['Eyesight', 'Perception', 'Hearing', 'Intuition', 'Spatial Reasoning'])
    expect(blow.dips[0]!.factor).toBe(Number(/\bx(\d+(?:\.\d+)?)/.exec(woundCell('medicine.wounds.head-blow-concussion'))![1]))
    const c = person('c')
    inflict(c, { location: 'head', kind: 'blunt' })
    const eye = suppliedFactors(woundsOf(c), { attribute: 'Eyesight' })
    expect(eye.headWoundDip).toBeLessThan(1)
    expect(suppliedFactors(woundsOf(c), { attribute: 'Strength' }).headWoundDip).toBe(1)
  })

  it('asks for a side on a limb and refuses an unknown place or kind', () => {
    expect(() => inflict(person('x'), { location: 'arm', kind: 'cut' })).toThrow(/side/)
    expect(() => inflict(person('x'), { location: 'elbow-pit-of-doom', kind: 'cut' })).toThrow(/hit location/)
    expect(() => inflict(person('x'), { location: 'arm', side: 'left', kind: 'lightning' })).toThrow(/damage kind/)
  })

  it('stops dipping once the engine heals the wound', () => {
    const c = person('mends'), h = inflict(c, { location: 'arm', side: 'right', kind: 'cut', depth: 1, infected: false })
    const arm = { location: 'arm', side: 'right' as const }
    expect(dipFactor(woundsOf(c), arm, 'Dexterity')).toBeLessThan(1)
    for (let d = 0; d < 120 && !h.wound.healed; d++) healDay(c)
    expect(h.wound.healed).toBe(true)
    expect(dipFactor(woundsOf(c), arm, 'Dexterity')).toBe(1)
  })
})

describe('sickness by place and season', () => {
  it('reads an exposure cell as the table states it', () => {
    expect(multiplierOf('x4', true)).toBe(4)
    expect(multiplierOf('x0.3 (at sea), x1 at anchor', true)).toBe(0.3)
    expect(multiplierOf('x0.3 (at sea), x1 at anchor', true, true)).toBe(1)
    expect(multiplierOf('x2 wet season', true)).toBe(2)
    expect(multiplierOf('x2 wet season', false)).toBeNull()
    expect(multiplierOf('0', true)).toBe(0)
    expect(multiplierOf('the casks', true)).toBeNull()
    expect(multiplierOf('-', true)).toBeNull()
  })

  it('infects at the engine\'s rate in the wet season, and the engine draws the onset', () => {
    const N = 4000
    let infected = 0
    let dose = 0
    for (let i = 0; i < N; i++) {
      const c = person(`wet-${i}`)
      const state = medicineOf(c, { seed: i + 1 })
      const r = exposeAt(c, { place: 'swamp-anchorage', day: AUG, disease: 'yellow_fever' })
      dose = r.dose
      expect(r.vector).toBe('Mosquito exposure')
      expect(r.multiplier).toBe(4)
      expect(r.engineVectorExposure).toBeNull()
      // the same seed and dose straight into the engine give the same answer
      const direct = expose(createMedicine('body', { seed: i + 1 }), 'yellow_fever', dose)
      expect(r.result!.infected).toBe(direct.infected)
      if (r.result!.infected) {
        infected++
        const sick = r.result!.sick!, inc = diseaseCourse('yellow_fever').incubation!
        expect(sick).toEqual(direct.sick)
        expect(sick.incubationDays).toBeGreaterThanOrEqual(inc.lo)
        expect(sick.incubationDays).toBeLessThanOrEqual(inc.hi)
        if (infected <= 20) {
          advanceDays(state, sick.incubationDays - 1)
          expect(state.sick[0]!.stage).toBe(sick.incubationDays === 1 ? 'ill' : 'incubating')
          advanceDays(state, 1)
          expect(state.sick[0]!.stage).toBe('ill')
        }
      }
    }
    expect(dose).toBe(fixture.baseDose * 4)
    const p = dose, sigma = (p * (1 - p) / N) ** 0.5
    expect(Math.abs(infected / N - p)).toBeLessThan(4 * sigma)
  })

  it('scales the dose by the place and gives nothing in the dry season', () => {
    const wet = (place: string) => exposeAt(person(`p-${place}`), { place, day: AUG, disease: 'yellow_fever' })
    expect(wet('swamp-anchorage').dose).toBe(wet('tavern').dose * 4)
    const dry = exposeAt(person('dry'), { place: 'swamp-anchorage', day: JAN, disease: 'yellow_fever' })
    expect(dry.season).toBe('dry')
    expect(dry.dose).toBe(0)
    expect(dry.result).toMatchObject({ infected: false, reason: 'no dose' })
  })

  it('says so when the tables cannot place an exposure, and takes a scripted dose', () => {
    const scurvy = exposeAt(person('s'), { place: 'hold', day: AUG, disease: 'scurvy' })
    expect(scurvy.unsupported).toMatch(/no place vector/)
    expect(scurvy.result).toBeNull()
    const casks = exposeAt(person('w'), { place: 'open-deck', day: AUG, disease: 'dysentery' })
    expect(casks.unsupported).toMatch(/no multiplier/)
    expect(casks.result).toBeNull()
    const boarded = exposeAt(person('b'), { place: 'hold', day: AUG, disease: 'smallpox', dose: 1 })
    expect(boarded.result!.infected).toBe(true)
    expect(() => exposeAt(person('x'), { place: 'hold', day: AUG, disease: 'plague' })).toThrow(/no disease/)
    expect(() => exposeAt(person('x'), { place: 'atlantis', day: AUG, disease: 'scurvy' })).toThrow(/no place/)
    for (const d of placeDiseases()) expect(medicine.diseases.rows.some(r => r[0] === d), d).toBe(true)
  })
})

describe('crises', () => {
  it('opens a crisis when a death risk falls due, and never a death', () => {
    let found: GameCharacter | null = null
    for (let i = 1; i <= 400 && !found; i++) {
      const c = person(`crisis-${i}`)
      medicineOf(c, { seed: i, riskAt: 1 })
      const r = exposeAt(c, { place: 'hold', day: AUG, disease: 'yellow_fever', dose: 1 })
      if (r.result?.sick?.fatalOnDay != null) found = c
    }
    expect(found).not.toBeNull()
    const c = found!, events: CrisisEvent[] = []
    for (let d = 0; d < 200 && events.length === 0; d++) events.push(...healDay(c).crises)
    expect(events).toHaveLength(1)
    const e = events[0]!
    expect(e).toMatchObject({ kind: 'crisis', slug: c.slug, cause: 'disease:yellow_fever' })
    expect(e.risk).toBe(diseaseCourse('yellow_fever').risk!.hi)
    expect(e.source).toMatch(/death risk/)
    expect(e.record.resolved).toBeUndefined()
    // the case is still on the sick list: the fate systems decide, and the engine has killed no one
    const state = medicineOf(c)
    expect(state.sick).toHaveLength(1)
    expect(state.sick[0]!.crisis).toBe(true)
    expect(healDay(c).outputs['medicine.crises']).toBe(1)
    expect(healDay(c).crises).toEqual([])
    expect(Object.keys(adapter).filter(k => /^(resolve|kill|die)|death/i.test(k))).toEqual([])
  })

  // The library has no thrust bleed rate (F-MD-3), so the rate and clotting are the host's, as in the engine's own bleeding test.
  const bleeder = (slug: string, bound = false): GameCharacter => {
    const c: GameCharacter = { slug, plan: [{ fromH: 0, toH: 24, duty: 'Walking the deck' }] }
    const h = inflict(c, { location: 'chest', kind: 'thrust', depth: 1, open: true, infected: false, rateMlMin: 200, clotting: 0 })
    if (bound) treat(medicineOf(c), 'tourniquet-and-ligature', { wound: h.wound.n })
    return c
  }
  const IV = 'circulation.bleeding.iv'

  it('a bleeding wound opens a crisis record before any death, once, across days', () => {
    const c = bleeder('bleeding')
    expect(woundProcesses(c)).toHaveLength(2)
    const day1 = simulateDay(c, 1, { ...fixturePlace, processes: woundProcesses(c) })
    expect(day1.failedChecks).toEqual([])
    const { world, body } = engineOf(c)
    expect(crisesOf(world, body).map(r => r.cause)).toEqual([IV])
    expect(world.registry.component(body).props).not.toHaveProperty('dead') // the engine kills no one, and the adapter never declares it
    const events = healDay(c).crises
    expect(events).toHaveLength(1)
    expect(events[0]).toMatchObject({ kind: 'crisis', slug: 'bleeding', cause: IV, day: null, risk: null })
    expect(events[0]!.source).toContain(IV)
    releaseDayTrace(c)
    const day2 = simulateDay(c, 2, { ...fixturePlace, processes: woundProcesses(c) })
    expect(day2.failedChecks).toEqual([]) // the blood ledger is carried across the renewed trace
    // the same condition in the renewed trace is not a second crisis (this body drinks nothing, so water crises are its own)
    expect(healDay(c).crises.filter(e => e.cause === IV)).toEqual([])
    expect(crisesHeld(c).filter(r => r.cause === IV)).toHaveLength(1)
  })

  it('a crisis reopened after it resolved is a new episode and a new record; one still open is not handed out twice', () => {
    const c = bleeder('reopened')
    simulateDay(c, 1, { ...fixturePlace, processes: [] })
    const { world, body } = engineOf(c)
    const detail = { source: 'test episode' }
    trackCrisis(world, body, IV, true, detail)
    expect(healDay(c).crises.filter(e => e.cause === IV)).toHaveLength(1)
    // still open on a later look: the same episode
    trackCrisis(world, body, IV, true, detail)
    expect(healDay(c).crises.filter(e => e.cause === IV)).toEqual([])
    // the condition ends, and days later starts again
    world.t += 86400
    trackCrisis(world, body, IV, false, detail)
    expect(healDay(c).crises.filter(e => e.cause === IV)).toEqual([])
    world.t += 3 * 86400
    trackCrisis(world, body, IV, true, detail)
    const again = healDay(c).crises.filter(e => e.cause === IV)
    expect(again).toHaveLength(1)
    const held = crisesHeld(c).filter(r => r.cause === IV)
    expect(held).toHaveLength(2)
    expect(held[0]!.resolvedAt).toBeDefined()
    expect(held[1]!.resolvedAt).toBeUndefined()
    expect(held[1]!.startedAt).toBeGreaterThanOrEqual(held[0]!.resolvedAt!)
    expect(again[0]!.record).toBe(held[1])
  })

  it('a wound bound at once loses no blood and opens no crisis; a body with no rate runs no extra process', () => {
    const c = bleeder('bound', true)
    simulateDay(c, 1, { ...fixturePlace, processes: woundProcesses(c) })
    const { world, body } = engineOf(c)
    expect(world.registry.component(body).props.blood_lost_ml).toBe(0)
    expect(healDay(c).crises).toEqual([])
    const plain = person('plain')
    inflict(plain, { location: 'thigh', side: 'left', kind: 'shot' })
    expect(woundProcesses(plain)).toEqual([])
  })

  it('reads the vector dose from an engine exposure row that states one, and keeps F-MD-4 where it is null', () => {
    expect(engineVectorDose({ vector: 0.2 })).toBe(0.2)
    expect(engineVectorDose({})).toBeNull()
    expect(engineVectorDose({ vector: null })).toBeNull()
    expect(() => engineVectorDose({ vector: 4 })).toThrow(/not a chance/)
    // the library's exposure rows carry no vector value yet (2562, FLAGS.md): the fixture dose stands and the report says so
    const natural = exposeAt(person('natural'), { place: 'swamp-anchorage', day: AUG, disease: 'yellow_fever' })
    expect(natural).toMatchObject({ doseSource: 'F-MD-4', dose: fixture.baseDose * 4, engineVectorExposure: null })
    expect(exposeAt(person('scripted'), { place: 'hold', day: AUG, disease: 'smallpox', dose: 1 }).doseSource).toBe('scripted')
  })
})

describe('the surgeon', () => {
  const stocked = (...goods: string[]): WorkInventory => {
    const s = new WorkInventory()
    for (const g of goods) s.stock(g, 5, 1)
    return s
  }
  const sickWith = (disease: string, slug: string): GameCharacter => {
    const c = person(slug)
    expect(exposeAt(c, { place: 'hold', day: AUG, disease, dose: 1 }).result!.infected).toBe(true)
    return c
  }

  it('asks the skill the row states, and the knowledge it names', () => {
    for (const id of treatmentIds()) {
      const stated = /^(\d+)/.exec(cell(medicine.treatments, `medicine.treatments.${id}`, 'Skill needed (STATS Surgery)'))
      expect(skillNeeded(id), id).toBe(stated ? Number(stated[1]) : 0)
    }
    const bark = 'peruvian-bark-cinchona', stock = stocked('peruvian-bark'), patient = sickWith('malaria_vivax', 'ague')
    const low = treatPatient(patient, { treatment: bark, target: { disease: 'malaria_vivax' }, surgeon: { skill: skillNeeded(bark) - 1, knows: [bark] }, stock, day: 2 })
    expect(low.refused).toMatch(/skill/)
    const ignorant = treatPatient(patient, { treatment: bark, target: { disease: 'malaria_vivax' }, surgeon: { skill: 90 }, stock, day: 2 })
    expect(ignorant.refused).toMatch(/know/)
    expect(stock.amount('peruvian-bark')).toBe(5)
    expect(low.result).toBeNull()
    expect(medicineOf(patient).sick[0]!.treated).toBe(false)
  })

  it('pays the supplies and lets the engine decide the effect', () => {
    const bark = 'peruvian-bark-cinchona', stock = stocked('peruvian-bark'), patient = sickWith('malaria_vivax', 'fever')
    const r = treatPatient(patient, { treatment: `medicine.treatments.${bark}`, target: { disease: 'malaria_vivax' }, surgeon: { skill: 30, knows: [bark] }, stock, day: 2 })
    expect(r.refused).toBeNull()
    expect(r.name).toBe(cell(medicine.treatments, `medicine.treatments.${bark}`, 'Treatment'))
    expect(r.paid).toEqual({ 'peruvian-bark': 1 })
    expect(stock.amount('peruvian-bark')).toBe(4)
    expect(stock.ledger().recipes).toMatchObject([{ recipe: `treatment:${bark}`, day: 2, consumed: { 'peruvian-bark': 1 }, produced: {} }])
    expect(r.result).toMatchObject({ efficacy: 'worked', effect: 'cure' })
    expect(medicineOf(patient).sick[0]!.treated).toBe(true)
  })

  it('spends the supplies on a treatment the library says did not work, and changes nothing', () => {
    const stock = stocked('mercury'), patient = sickWith('syphilis', 'pox')
    const r = treatPatient(patient, { treatment: 'mercury-unction-pills-salivation', target: { disease: 'syphilis' }, surgeon: { skill: 40 }, stock, day: 2 })
    expect(r.paid).toEqual({ mercury: 1 })
    expect(r.result).toMatchObject({ efficacy: 'none', effect: null })
    expect(medicineOf(patient).sick[0]!.treated).toBe(false)
  })

  it('keeps the instruments, pays the dressings, and names what the game has no good for', () => {
    const stock = stocked('the-surgeon-s-chest-stocked', 'coarse-linen', 'linen-thread'), patient = person('cut')
    const wound = inflict(patient, { location: 'arm', side: 'left', kind: 'cut' })
    const r = treatPatient(patient, { treatment: 'washing-wounds-dry-lint-bandage-stitching', target: { wound }, surgeon: { skill: 20 }, stock, day: 3 })
    expect(r.paid).toEqual({ 'coarse-linen': 1, 'linen-thread': 1 })
    expect(r.kept).toEqual(['the-surgeon-s-chest-stocked'])
    expect(stock.amount('the-surgeon-s-chest-stocked')).toBe(5)
    expect(r.result).toMatchObject({ efficacy: 'unquantified' })
    const splint = treatPatient(patient, { treatment: 'splints-and-reduction', target: { wound }, surgeon: { skill: 35 }, stock, day: 3 })
    expect(splint.unsupplied).toEqual(['wood'])
    expect(splint.paid).toEqual({ 'coarse-linen': 1 })
  })

  it('refuses for want of supplies without paying or touching the engine', () => {
    const stock = stocked('coarse-linen'), patient = person('bare'), wound = inflict(patient, { location: 'arm', side: 'left', kind: 'cut' })
    const r = treatPatient(patient, { treatment: 'washing-wounds-dry-lint-bandage-stitching', target: { wound }, surgeon: { skill: 99 }, stock, day: 3 })
    expect(r.refused).toMatch(/thread/)
    expect(r.paid).toEqual({})
    expect(r.result).toBeNull()
    expect(stock.amount('coarse-linen')).toBe(5)
    expect(stock.ledger().recipes).toEqual([])
  })

  it('needs no supplies for the captain\'s call', () => {
    const r = treatPatient(person('q'), { treatment: 'quarantine-and-airing-the-ship', target: { disease: 'typhus' }, surgeon: { skill: 0 }, stock: stocked(), day: 2 })
    expect(r.refused).toBeNull()
    expect(r.paid).toEqual({})
    expect(r.name).toMatch(/^Quarantine/)
  })

  it('has a supply list for every treatment, of goods the economy has', () => {
    const ids = new Set(goods.goods.map(g => g.id))
    expect(Object.keys(fixture.supplies).sort()).toEqual(treatmentIds().sort())
    for (const [id, slots] of Object.entries(fixture.supplies)) {
      for (const slot of slots as { text: string; any?: string[] }[]) for (const g of slot.any ?? []) expect(ids.has(g), `${id}: ${g}`).toBe(true)
    }
  })
})

describe('no formula or invented number lives in the adapter', () => {
  it('holds none', () => {
    expect(source).not.toMatch(/Math/)
    const code = source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '').replace(/'[^']*'|`[^`]*`/g, "''")
    const literals = new Set(code.match(/\b\d+(?:\.\d+)?\b/g) ?? [])
    expect([...literals].filter(n => !['0', '1'].includes(n))).toEqual([])
  })
})
