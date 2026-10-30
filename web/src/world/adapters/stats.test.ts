import { describe, expect, it } from 'vitest'
import { createMedicine, expose, inflictWound, libraryTable, medicineOutputs, overnight, sleepDebtRow } from '@rex/realism'
import body from '../../../../files/pirate-ship/body/data/body.json'
import psychology from '../../../../files/pirate-ship/body/data/psychology.json'
import physiology from '../../../../files/pirate-ship/body/data/physiology.json'
import nutrition from '../../../../files/pirate-ship/body/data/nutrition.json'
import medicine from '../../../../files/pirate-ship/body/data/medicine.json'
import circulation from '../../../../files/pirate-ship/body/data/circulation.json'
import data from '../../../../data/pirate-ship/world/stats.json'
import characters from '../../../../data/pirate-ship/world/characters.json'
import fixtures from '../FIXTURES.md?raw'
import source from './stats.ts?raw'
import { engineOf, simulateDay, type DutyBlock, type GameCharacter } from './characters.ts'
import {
  attributesOf, capabilitiesToday, capabilityRows, capabilityToday, dayPushes, facesNotExpressible, facesOf, factorsOf,
  inexpressiblePushes, notComputed, pathwayClashes, pathwaysOf, pushOutputs, tokenOf, unsupportedFactors,
} from './stats.ts'

const awake: DutyBlock[] = [{ fromH: 0, toH: 24, duty: 'Standing watch' }]
const specs = data.capabilities as { row: string; attr: string; ceiling?: string; factors: (string | { factor: string; only: string[] })[]; unapplied?: Record<string, string> }[]
const formulaOf = (row: string) => String(body.capabilities.rows.find(r => String(r[0]).startsWith(row))![1])
const withoutParens = (text: string) => { let t = text; while (/\([^()]*\)/.test(t)) t = t.replace(/\([^()]*\)/g, ''); return t }
const baseName = (name: string) => withoutParens(name)

describe('the capability formulas', () => {
  it('has a row of body.json for each, and every factor it names is in the formula text', () => {
    expect(capabilityRows().length).toBe(specs.length)
    for (const s of specs) {
      const rows = body.capabilities.rows.filter(r => String(r[0]).startsWith(s.row))
      expect(rows.length, s.row).toBe(1)
      const text = formulaOf(s.row)
      if (s.ceiling) expect(text, s.row).toContain('ceiling')
      else expect(text, s.row).toContain(s.attr)
      for (const f of s.factors) {
        const name = typeof f === 'string' ? f : f.factor
        expect(text, `${s.row}: ${name}`).toContain(tokenOf(name))
      }
    }
  })

  it('names every factor the formula text names (none dropped)', () => {
    for (const s of specs) {
      const names = new Set([
        ...s.factors.map(f => baseName(typeof f === 'string' ? f : f.factor)),
        ...s.factors.map(f => tokenOf(typeof f === 'string' ? f : f.factor)),
        ...Object.keys(s.unapplied ?? {}),
      ])
      const tokens = withoutParens(formulaOf(s.row)).match(/[a-z]+[A-Za-z]*(?:Factor|Dip|Cap)\b/g) ?? []
      for (const t of tokens) expect(names.has(t), `${s.row}: ${t}`).toBe(true)
    }
  })

  it('takes the aerobic divisor from the formula, not from the code', () => {
    const m = /aerobic_today \/ (\d+)/.exec(formulaOf('Endurance pool ceiling'))!
    expect(Number(m[1])).toBe(data.factors.aerobicIndex.divideBy)
  })

  it('never carries the same impairment twice in a formula (BODY.md section 3)', () => {
    for (const row of capabilityRows()) {
      for (const attribute of [undefined, ...attributesOf(row)]) {
        const p = pathwaysOf(row, attribute)
        expect(pathwayClashes(p), `${row} ${attribute ?? ''}: ${p.join(', ')}`).toEqual([])
      }
    }
    // the rule's own example: an injury reaches Dexterity through woundDip only, pain through painFactor only
    const dex = pathwaysOf('Dexterity_today(limb)')
    expect(dex.filter(p => p === 'wound').length).toBe(1)
    expect(dex.filter(p => p === 'pain').length).toBe(1)
    // circadian sits inside alertness: one factor, never also a separate circadian term
    expect(Object.keys(data.factors).some(n => /circadian/i.test(n))).toBe(false)
    expect(pathwaysOf('Reflexes_today(limb)').filter(p => p === 'alertness').length).toBe(1)
  })

  it('catches a formula that does count one impairment twice', () => {
    expect(pathwayClashes(['wound', 'pain', 'wound'])).toEqual(['wound'])
    expect(pathwayClashes(pathwaysOf('Endurance pool now'))).toEqual([])
  })

  it('keeps the ceiling inside the pool, once', () => {
    expect(factorsOf('Endurance pool now')).toEqual(['aerobicIndex', ...specs.find(s => s.row === 'Endurance pool now')!.factors as string[]])
    expect(pathwaysOf('Endurance pool now').filter(p => p === 'oxygen-delivery').length).toBe(1)
  })

  it('applies Eyesight\'s extra factors to Eyesight only', () => {
    expect(factorsOf('Head attributes today')).toEqual(['alertness', 'headWoundDip', 'feverFactor'])
    expect(factorsOf('Head attributes today', 'Eyesight')).toEqual(['alertness', 'headWoundDip', 'feverFactor', 'light', 'nightBlindness'])
  })

  it('lists the rows it does not compute, each a row of the table', () => {
    for (const n of notComputed()) expect(body.capabilities.rows.some(r => String(r[0]).startsWith(n.row)), n.row).toBe(true)
    const covered = [...specs.map(s => s.row), ...notComputed().map(n => n.row)]
    for (const r of body.capabilities.rows) expect(covered.some(c => String(r[0]).startsWith(c)), String(r[0])).toBe(true)
  })
})

describe('what one dry sedentary day gives', () => {
  it('records water_deficit_pct after a day of standing watch with no drink (F-SE-11)', () => {
    const dry = simulateDay({ slug: 'dry-sailor', plan: awake }, 1)
    const threshold = (data.pushes.find(p => p.row === 12)!.when.find(c => c.output === 'water_deficit_pct') as { gt: number }).gt
    // Recorded, not tuned: one dry sedentary day now leaves about 1.57 %, short of P12's threshold, so P12 no longer fires after a single dry day (FIXTURES.md F-SE-11)
    expect(Number(dry.outputs.water_deficit_pct)).toBeCloseTo(1.57, 1)
    expect(Number(dry.outputs.water_deficit_pct)).toBeLessThan(threshold)
  })
})

describe('stats from the engine\'s outputs', () => {
  // A sailor with no sleep for a day, who owes 20 h at its end, and whose vitamin C pool has been used down to 250 mg (the table's 300 mg is where signs begin).
  const hand: GameCharacter = { slug: 'tired-sailor', plan: awake }
  const owed = 20
  const engine = engineOf(hand)
  const props = engine.world.registry.component(engine.body).props
  props.sleep_debt = owed - overnight(0, 0, 0).debtH
  const w = engine.world, flesh = w.registry.component(engine.body)
  // Explicit thirsty-sailor fixture (F-SE-11): the newer engine does not guarantee
  // dehydration over P12's threshold after just one sedentary day without a drink.
  const thirstCondition = data.pushes.find(p => p.row === 12)!.when.find(c => c.output === 'water_deficit_pct')!
  if (!('gt' in thirstCondition)) throw new Error('P12 has no dehydration threshold')
  const missingWaterKg = flesh.mass * thirstCondition.gt / 100
  w.registry.addContent(flesh, 'water', 'liquid', -missingWaterKg)
  props.waterDeficitKg = missingWaterKg
  w.trace.record({ t: w.t, process: 'test', quantity: 'mass:water', from: engine.body, to: 'prior-loss', amount: missingWaterKg })
  const used = 1.25e-3 // kg: 1,250 mg of the 1,500 mg pool, traced as the engine traces a day's use
  w.registry.addContent(flesh, 'nutrient:vit_c', 'solid', -used)
  w.trace.record({ t: w.t, process: 'test', quantity: 'mass:nutrient:vit_c', from: engine.body, to: 'metabolism', amount: used, note: 'a long voyage on biscuit' })
  const report = simulateDay(hand, 1)
  const outputs = report.outputs

  it('sets up the sailor from the engine\'s own books', () => {
    expect(outputs.sleep_debt).toBeCloseTo(owed, 6)
    expect(outputs.deficiency_vit_c).toBe(1)
    expect(report.failedChecks).toEqual([])
  })

  it('at sleep debt 20 h and vitamin C stage 1 the alertness, the faces and the pushes are the tables\'', () => {
    const row = sleepDebtRow(owed).row
    expect(outputs.sleep_debt_row).toBe(row.id)
    expect(outputs.alertness).toBeCloseTo(Number(row['Alertness multiplier']) * Number(outputs.circadian), 9)

    const reflexes = capabilityToday('Reflexes_today(limb)', 10, outputs)
    const arousal = Number(outputs.arousal), alertness = Number(outputs.alertness)
    expect(reflexes.factors.alertness).toBe(arousal < alertness ? arousal : alertness)
    expect(reflexes.factors.drinkFactor).toBe(outputs['motor-control'])
    expect(reflexes.value).toBeCloseTo(10 * Number(reflexes.factors.alertness) * Number(outputs['motor-control']), 9)
    expect(reflexes.missing).toEqual(['woundDip(limb)', 'coldFactor'])

    const sleepFace = physiology.sleep_debt.rows.find(r => r[0] === row.id)![1]
    const scurvyFace = nutrition.depletion.rows.find(r => r[0] === 'nutrition.depletion.vitamin-c')![1]
    const faces = facesOf(outputs)
    const sleep = faces.find(f => f.table === 'physiology.sleep_debt')!
    const vitC = faces.find(f => f.table === 'nutrition.depletion' && f.id === 'nutrition.depletion.vitamin-c')!
    expect(sleep.text).toBe(sleepFace)
    expect(sleep.text).toContain('misses a line')
    expect(vitC.stage).toBe(1)
    expect(vitC.text).toBe(scurvyFace)
    expect(vitC.shown).toBe('lassitude, low mood')
    expect(sleep.channels).toContain('Watching people work (duty results)')
    for (const c of [...sleep.channels, ...vitC.channels]) expect(body.visible_faces.rows.some(r => r[0] === c), c).toBe(true)

    const { pushes } = dayPushes(outputs)
    // The explicitly dehydrated sailor drinks nothing; the thirst push joins sleep debt and scurvy.
    expect(Number(outputs.water_deficit_pct)).toBeGreaterThan(2)
    expect(pushes.map(p => [p.id, p.meter, p.delta]).sort()).toEqual([['P01', 'mood', -1], ['P12', 'mood', -2], ['P17', 'mood', -1]])
  })

  it('reads the engine\'s numbers for the pool and leaves the rest of the formula named', () => {
    const mass = characters.body.massKg, aerobic = 40 * mass
    const pool = capabilityToday('Endurance pool now', 12, { ...outputs, aerobic_today: aerobic }, { massKg: mass })
    expect(pool.factors.aerobicIndex).toBe(1)
    expect(pool.factors.hydrationFactor).toBe(outputs.endurance_hydration)
    expect(pool.factors.glycogenFactor).toBe(outputs.glycogen_factor)
    expect(pool.factors.heatFactor).toBe(outputs.work_capacity_heat)
    expect(pool.value).toBeCloseTo(12 * Number(pool.factors.alertness) * Number(outputs.endurance_hydration) * Number(outputs.glycogen_factor) * Number(outputs.work_capacity_heat), 9)
    expect(pool.missing).toEqual(['fatigueDay', 'feverFactor', 'bloodFactor'])
    expect(capabilityToday('Endurance pool ceiling', 12, { ...outputs, aerobic_today: aerobic * 0.5 }, { massKg: mass }).value).toBeCloseTo(6, 9)
    // without the engine's aerobic_today or the body's mass the ceiling is not guessed
    expect(capabilityToday('Endurance pool ceiling', 12, outputs, { massKg: mass }).missing).toEqual(['aerobicIndex'])
    expect(capabilityToday('Endurance pool ceiling', 12, { ...outputs, aerobic_today: aerobic }).missing).toEqual(['aerobicIndex'])
  })

  it('every factor with engine outputs reads ids the engine writes', () => {
    const written = new Set([...Object.keys(outputs), 'aerobic_today']) // circulation's, not run by characters.ts yet (F-ST-1)
    for (const [name, f] of Object.entries(data.factors as Record<string, { outputs: string[] }>)) {
      for (const id of f.outputs) expect(written.has(id), `${name}: ${id}`).toBe(true)
    }
    for (const id of pushOutputs()) expect(written.has(id) || id.startsWith('medicine.'), id).toBe(true)
  })

  it('a missing factor counts as 1 and is named; the unsupported list is the factors with no outputs', () => {
    const strength = capabilityToday('Strength_today(limb)', 10, outputs)
    expect(strength.value).toBe(10)
    expect(strength.missing.length).toBe(5)
    const unsupported = new Set(unsupportedFactors().map(u => u.factor))
    for (const m of strength.missing) expect(unsupported.has(m), m).toBe(true)
    for (const u of unsupportedFactors()) {
      expect(u.why.length, u.factor).toBeGreaterThan(0)
      expect(fixtures, u.factor).toContain(u.factor)
    }
    const all = capabilitiesToday({ 'Strength_attr(limb)': 10, Endurance_attr: 12, 'Nerve_attr': 9 }, outputs, { massKg: characters.body.massKg })
    expect(Object.keys(all).sort()).toEqual(['Endurance pool ceiling', 'Endurance pool now', 'Nerve', 'Strength_today(limb)'])
    expect(all.Nerve.missing).toEqual(['drinkFactor(+)'])
    expect(all['Strength_today(limb)'].mark).toBe(String(body.capabilities.rows[0][3]))
  })

  it('shows no face and no push for a well body (every row the first of its table)', () => {
    const well = {
      sleep_debt: 0, sleep_debt_row: 'physiology.sleep_debt.0-to-4', hydration_row: 'physiology.hydration.0-to-1',
      core_row: 'physiology.core_temp.36-5-to-38-0', core_c: 37, water_deficit_pct: 0.2, deficiency_vit_c: 0, deficiency_vit_c_row: 'nutrition.depletion.vitamin-c',
      alcohol_withdrawal_stage: 'none', 'medicine.pain': 0, 'medicine.pain.0-to-2': 1,
    }
    expect(facesOf(well)).toEqual([])
    expect(dayPushes(well).pushes).toEqual([])
  })
})

describe('the faces', () => {
  it('chooses each by the engine\'s row ids, which are the game\'s rows', () => {
    const same = (library: string, name: string, game: { rows: string[][] }) => {
      const ids = libraryTable(library, name).map(r => String(r.id))
      for (const r of game.rows) expect(ids, `${library}.${name} ${r[0]}`).toContain(r[0])
    }
    same('physiology', 'sleep_debt', physiology.sleep_debt)
    same('physiology', 'hydration', physiology.hydration)
    same('physiology', 'core_temp', physiology.core_temp)
    same('nutrition', 'depletion', nutrition.depletion)
    same('medicine', 'diseases', medicine.diseases)
    same('medicine', 'wounds', medicine.wounds)
    same('medicine', 'pain', medicine.pain)
    same('medicine', 'exposure', medicine.exposure)
    same('circulation', 'delivery_failures', circulation.delivery_failures)
  })

  it('shows the symptoms of an ill man, the wound\'s face and the pain band the medicine engine reports', () => {
    const s = createMedicine('body', { seed: 7 })
    expect(expose(s, 'scurvy', 1, { incubationDays: 0 }).infected).toBe(true)
    inflictWound(s, 'cut-incised', { severity: 0.5 })
    const out = medicineOutputs(s)
    const faces = facesOf(out)
    const scurvy = medicine.diseases.rows.find(r => r[0] === 'scurvy')![3]
    const cut = medicine.wounds.rows.find(r => r[0] === 'medicine.wounds.cut-incised')![3]
    expect(faces.find(f => f.id === 'scurvy')!.text).toBe(scurvy)
    expect(faces.find(f => f.id === 'medicine.wounds.cut-incised')!.text).toBe(cut)
    for (const f of faces) expect(f.channels).toContain("The surgeon's morning report")
    // incubating shows nothing yet
    const s2 = createMedicine('body', { seed: 7 })
    expose(s2, 'scurvy', 1, { incubationDays: 3 })
    expect(facesOf(medicineOutputs(s2)).some(f => f.id === 'scurvy')).toBe(false)
  })

  it('shows the haemorrhage face for bleeding class II to IV and none for class I', () => {
    const face = circulation.delivery_failures.rows.find(r => r[0] === 'circulation.delivery_failures.haemorrhage-a-wound')![1]
    expect(facesOf({ 'circulation.bleeding.i': 1 })).toEqual([])
    expect(facesOf({ 'circulation.bleeding.ii': 1 }).map(f => f.text)).toEqual([face])
    expect(facesOf({ 'circulation.bleeding.iv': 1 }).map(f => f.text)).toEqual([face])
  })

  it('reads the stage faces by stage, and passes over a stage with no face', () => {
    const row = nutrition.depletion.rows.find(r => r[0] === 'nutrition.depletion.thiamin')!
    for (const stage of [1, 2, 3]) {
      const f = facesOf({ deficiency_thiamin: stage, deficiency_thiamin_row: 'nutrition.depletion.thiamin' })
      expect(f.map(x => x.text)).toEqual([row[stage]])
    }
    expect(facesOf({ deficiency_thiamin: 0, deficiency_thiamin_row: 'nutrition.depletion.thiamin' })).toEqual([])
    expect(facesOf({ deficiency_b12: 1, deficiency_b12_row: 'nutrition.depletion.b12' })).toEqual([])
    expect(facesOf({ deficiency_riboflavin: 3, deficiency_riboflavin_row: 'nutrition.depletion.riboflavin' })).toEqual([])
  })

  it('names the faces it cannot choose, in FIXTURES.md', () => {
    for (const n of facesNotExpressible()) {
      expect(n.why.length).toBeGreaterThan(0)
      expect(fixtures, n.id).toContain(n.id.replace(/^circulation\.delivery_failures\./, ''))
    }
  })
})

describe('the psychology pushes', () => {
  const rows = psychology.pushes.rows as string[][]
  const specsP = data.pushes as { row: number; state: string; meter: string; per: string; delta?: number; deltaFrom?: string; forDays?: number; when: { output: string; gt?: number; eq?: number; ne?: string }[] }[]

  it('takes each push from a row of the table: its state, its size and its threshold', () => {
    expect(rows.length).toBe(27)
    for (const p of specsP) {
      const r = rows[p.row - 1]
      expect(r[0], `row ${p.row}`).toContain(p.state)
      if (p.delta !== undefined) expect(r[2], `row ${p.row} size`).toContain(String(p.delta))
      if (p.deltaFrom) expect(r[2], `row ${p.row} size`).toContain('mood-bias output')
      for (const c of p.when) {
        const n = c.gt ?? c.eq
        if (n !== undefined) expect(`${r[0]} ${r[2]}`, `row ${p.row} threshold`).toContain(String(n))
      }
      if (p.forDays) expect(r[0]).toContain(`${p.forDays}+ days`)
    }
  })

  it('accounts for every row: driven, or listed with what it needs in FIXTURES.md', () => {
    const driven = new Set(specsP.map(p => p.row))
    const listed = new Set(inexpressiblePushes().map(i => i.row))
    for (let n = 1; n <= rows.length; n++) expect(driven.has(n) || listed.has(n), `row ${n}`).toBe(true)
    for (const i of inexpressiblePushes()) {
      expect(i.needs.length, i.id).toBeGreaterThan(0)
      expect(fixtures, i.id).toContain(i.id)
    }
  })

  it('reads only outputs the engine writes (the ones that are not are the listed rows)', () => {
    const ids = pushOutputs()
    expect(ids).toEqual(expect.arrayContaining(['sleep_debt', 'water_deficit_pct', 'core_c', 'deficiency_vit_c', 'mood-regulation', 'alcohol_withdrawal_stage']))
    expect(ids.every(id => !/hunger|starvation_stage|seasick|fever/.test(id))).toBe(true)
  })

  it('pushes by the thresholds, and only while they are crossed', () => {
    const ids = (o: Record<string, number | string | null>) => dayPushes(o).pushes.map(p => p.id + ':' + p.delta)
    expect(ids({ sleep_debt: 12 })).toEqual([])
    expect(ids({ sleep_debt: 13 })).toEqual(['P01:-1'])
    expect(ids({ sleep_debt: 25 })).toEqual(['P01:-1', 'P02:0.5'])
    expect(ids({ 'medicine.pain': 5 })).toEqual([])
    expect(ids({ 'medicine.pain': 6 })).toEqual(['P03:-2'])
    expect(ids({ water_deficit_pct: 2.5 })).toEqual(['P12:-2'])
    expect(ids({ core_c: 38.4 })).toEqual(['P15:-1'])
    expect(ids({ deficiency_vit_c: 1 })).toEqual(['P17:-1'])
    expect(ids({ deficiency_vit_c: 2 })).toEqual([])
    expect(ids({ alcohol_withdrawal_stage: 'none', 'mood-regulation': -0.4 })).toEqual([])
    expect(ids({ alcohol_withdrawal_stage: 'early', 'mood-regulation': -0.4 })).toEqual(['P27:-0.4'])
  })

  it('moves a slider for pain over 5 only from the seventh day', () => {
    let streaks = {}
    const fired: boolean[] = []
    for (let day = 1; day <= 9; day++) {
      const r = dayPushes({ 'medicine.pain': day === 8 ? 2 : 6 }, streaks)
      streaks = r.streaks
      fired.push(r.pushes.some(p => p.id === 'P04'))
    }
    expect(fired).toEqual([false, false, false, false, false, false, true, false, false])
  })

  it('computes no biology: no Math in the adapter', () => {
    expect(source).not.toMatch(/Math/)
  })
})
