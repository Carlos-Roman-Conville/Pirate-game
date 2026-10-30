// TESTS.md T0, T1, A1, A2: the settlement engine beside the alignment engine, which it never touches.
import { describe, expect, it } from 'vitest'
import institutions from '../../../data/pirate-ship/alignment/institutions.json'
import { hasFixture, holderOf, ledger, stubProviders, type Command as SettlementCommand } from '@rex/settlement'
import { ending, initialState, loadAlignmentConfig, loadStarts, reduce, townPosition, type AlignmentState, type Command } from '../alignment'
import { currentCommand } from '../alignment/sim/scenario'
import { random } from '../alignment/sim/strategies'
import { fold, loadPort, placeOf } from './index'

const PREFIXES = ['dist.', 'parcel.', 'bldg.', 'title.', 'lease.', 'txn.', 'acct.', 'biz.', 'post.', 'asg.', 'proj.', 'office.', 'perm.']

function providers() {
  const p = stubProviders({
    'salt-meat': { inputs: [{ good: 'meat', units: 1 }, { good: 'salt', units: 1 }], output: 'salt-meat', yield: 1, unitsPerFixtureDay: 10, labourPerUnit: 0.25 },
    'smoked-meat': { inputs: [{ good: 'meat', units: 1 }], output: 'smoked-meat', yield: 1, unitsPerFixtureDay: 6, labourPerUnit: 0.25 },
  })
  p.labour.pools['pool.housing'] = 5
  p.labour.pools['pool.builders'] = 1
  return p
}

/** A scripted settlement day: a sale, a lease, a hire, a renovation step, a tick. */
function settlementDay(port: ReturnType<typeof loadPort>, step: number): SettlementCommand[] {
  const shop = port.bindings['port.bakery']
  const commands: SettlementCommand[] = []
  if (step === 0) {
    commands.push({ type: 'credit', holder: 'player', amount: 500 }, { type: 'sell', title: shop.titles[1], buyer: 'player', price: 40 })
  }
  if (step === 1) commands.push({ type: 'lease', title: shop.titles[1], tenant: 'esfp-f', rent: 2 })
  if (step === 2) {
    const post = port.runner.run<string>({ type: 'addPost', biz: shop.businesses[0], role: 'labourer', wage: 1 })
    commands.push({ type: 'hire', post, holder: 'pool.housing' })
  }
  if (step === 3) commands.push({ type: 'startProject', kind: 'renovate', target: shop.buildings[0], account: 'esfp-f', pool: 'pool.builders', labourDays: 1, plan: { addFixtures: ['smokehouse'] } })
  commands.push({ type: 'tick' })
  return commands
}

describe('T0 alignment invariance', () => {
  it('a seeded random alignment walk is byte-identical with and without the settlement engine running beside it', () => {
    const config = loadAlignmentConfig()
    const route = random(42, config, 64).route
    const bare: string[] = []
    let state = initialState(loadStarts(), config.thresholds, config.gates)
    for (const command of route) { state = reduce(state, currentCommand(state, command), config).state; bare.push(JSON.stringify(state)) }
    const port = loadPort(providers())
    const alignmentCommandsFromBridge: Command[] = []
    let beside = initialState(loadStarts(), config.thresholds, config.gates)
    route.forEach((command, i) => {
      for (const sc of settlementDay(port, i)) port.runner.run(sc)
      fold(port.events(), port.bindings)   // hooks go to the story; nothing comes back as an alignment command
      beside = reduce(beside, currentCommand(beside, command), config).state
      expect(JSON.stringify(beside)).toBe(bare[i])
    })
    expect(alignmentCommandsFromBridge).toHaveLength(0)
    expect(townPosition(beside, config)).toEqual(townPosition(state, config))
    expect(ending(beside, config)).toEqual(ending(state, config))
    expect(port.runner.state.settlement.day).toBe(route.length)
  })
})

describe('T1 bindings cover the institutions', () => {
  it('every slot with a port id has a parcel and a building; no engine id appears in the alignment data', () => {
    const port = loadPort(providers())
    for (const sector of institutions) for (const slot of sector.slots) {
      if (!slot.slot) continue
      const binding = port.bindings[slot.slot]
      expect(binding, slot.slot).toBeDefined()
      expect(binding.parcels.length, slot.slot).toBeGreaterThan(0)
      if (slot.slot !== 'port.esfj_shop') expect(binding.buildings.length, slot.slot).toBeGreaterThan(0)
      for (const id of [...binding.parcels, ...binding.buildings, ...binding.businesses]) expect(placeOf(port.bindings, id)).toBe(slot.slot)
    }
    const alignmentData = JSON.stringify(institutions)
    for (const prefix of PREFIXES) expect(alignmentData.includes(`"${prefix}`)).toBe(false)
    // port.* never enters engine state: the only occurrences are inventory refs the adapter chose
    const stateText = JSON.stringify(port.runner.state).replace(/inv\.port\.[a-z_]+/g, '')
    expect(stateText.includes('port.')).toBe(false)
  })
})

function alignmentStart() {
  const config = loadAlignmentConfig()
  return { config, state: initialState(loadStarts(), config.thresholds, config.gates) }
}

describe('A1 the acceptance scenario', () => {
  it('buy, transfer, lease, staff, renovate, produce: the alignment state is unchanged until its own commands run', () => {
    const p = providers()
    const port = loadPort(p)
    const { config, state: S0 } = alignmentStart()
    const snapshot = JSON.stringify(S0)
    const P0 = townPosition(S0, config)
    const E0 = ending(S0, config)
    const shop = port.bindings['port.bakery']
    const bldg = shop.buildings[0]
    const bldgTitle = shop.titles[1]
    const r = port.runner
    for (const holder of ['player', 'esfp-f', 'farm-son']) r.run({ type: 'credit', holder, amount: 100 })
    // 1 sell
    r.run({ type: 'sell', title: bldgTitle, buyer: 'player', price: 60 }); r.tick()
    expect(holderOf(r.state, bldg)).toBe('player')
    // 2 transfer
    r.run({ type: 'transfer', title: bldgTitle, to: 'farm-son', kind: 'gift' }); r.tick()
    expect(holderOf(r.state, bldg)).toBe('farm-son')
    // 3 lease to the cook; the seeded business keeps operating; the son manages
    r.run({ type: 'lease', title: bldgTitle, tenant: 'esfp-f', scope: ['shop'], rent: 2 })
    const biz = shop.businesses[0]
    r.run({ type: 'assign', person: 'farm-son', kind: 'management', target: biz })
    r.run({ type: 'setLines', biz, lines: [
      { recipe: 'salt-meat', equipment: ['salting-house'] }, { recipe: 'smoked-meat', equipment: ['smokehouse'] }] })
    r.run({ type: 'credit', holder: biz, amount: 100 }); r.tick()
    // 4 staff
    const p1 = r.run<string>({ type: 'addPost', biz, role: 'butcher', wage: 2 })
    const p2 = r.run<string>({ type: 'addPost', biz, role: 'labourer', wage: 1 })
    r.run({ type: 'hire', post: p1, holder: 'esfp-f' }); r.run({ type: 'hire', post: p2, holder: 'pool.housing' }); r.tick()
    expect(r.state.businesses[biz].status).toBe('staffed')
    // 5 renovate
    p.materials.set('esfp-f', 'timber', 10)
    const proj = r.run<string>({ type: 'startProject', kind: 'renovate', target: bldg, account: 'esfp-f', pool: 'pool.builders', wage: 1, labourDays: 2,
      materials: [{ material: 'timber', units: 5 }],
      plan: { rooms: [{ id: 'back', name: 'back room', tiles: { x: 0, y: 0, w: 1, h: 1 }, use: 'smoke' }], addFixtures: ['smokehouse'],
        placements: [{ fixture: 'smokehouse', room: 'back', at: { x: 0, y: 0 } }] } })
    r.tick(2)
    expect(r.state.projects[proj].status).toBe('done')
    expect(r.state.buildings[bldg].layout.version).toBe(2)
    expect(JSON.parse(JSON.stringify(r.state)).buildings[bldg].layout).toEqual(r.state.buildings[bldg].layout)
    // 6 produce
    p.materials.set('inv.port.bakery', 'meat', 100); p.materials.set('inv.port.bakery', 'salt', 100); r.tick()
    expect(r.state.production[biz]!.lines[0]).toMatchObject({ recipe: 'salt-meat', q: 8 })
    expect(r.state.businesses[biz].status).toBe('producing')
    expect(hasFixture(r.state, null, 'smokehouse')).toBe(true)
    // the ledger
    const kinds = ledger(r.state).map((row) => row.kind)
    expect(kinds.filter((kind) => kind === 'sale')).toHaveLength(1)
    expect(kinds.filter((kind) => kind === 'gift')).toHaveLength(1)
    expect(ledger(r.state, { kind: 'lease', from: 'farm-son', to: 'esfp-f' })).toHaveLength(1)   // the seed's clinic and church leases are the town's
    // the story and alignment side: untouched by all of the above
    const hooks = fold(port.events(), port.bindings)
    expect(hooks.filter((hook) => hook.kind === 'titleChanged')).toEqual([
      { kind: 'titleChanged', place: 'port.bakery', from: 'esfp-f', to: 'player' },
      { kind: 'titleChanged', place: 'port.bakery', from: 'player', to: 'farm-son' },
    ])
    expect(JSON.stringify(S0)).toBe(snapshot)
    expect(S0.slots['port.bakery']).toMatchObject({ owner: 'esfp-f', developed: false, pos: null, pending: false })
    expect(townPosition(S0, config)).toEqual(P0)
    expect(ending(S0, config)).toEqual(E0)
    // 7 the story's own commands, exactly as a run without the settlement engine
    const script: Command[] = [{ type: 'unlock', slug: 'esfp-f' }, { type: 'recruit', slug: 'esfp-f' }, { type: 'supply', slot: 'port.bakery', what: 'bodies' },
      { type: 'develop', slot: 'port.bakery' }, { type: 'leave', slug: 'esfp-f' }, { type: 'sleep' }]
    let withSettlement: AlignmentState = S0
    let without: AlignmentState = alignmentStart().state
    for (const command of script) {
      withSettlement = reduce(withSettlement, command, config).state
      without = reduce(without, command, config).state
    }
    expect(JSON.stringify(withSettlement)).toBe(JSON.stringify(without))
    expect(withSettlement.slots['port.bakery'].developed).toBe(true)
    expect(withSettlement.slots['port.bakery'].pos).toEqual(withSettlement.characters['esfp-f'].pos)
    expect(withSettlement.slots['port.bakery'].pending).toBe(false)
    // recruiting touched no title, lease, post or assignment (Q2)
    expect(holderOf(r.state, bldg)).toBe('farm-son')
    expect(r.state.posts[p1].holder).toBe('esfp-f')
  })
})

describe('A2 a transfer reaches the story without touching alignment', () => {
  it('the sale of the butcher shop is one relationship hook; a title not for sale gives none', () => {
    const port = loadPort(providers())
    const { state: S0 } = alignmentStart()
    const snapshot = JSON.stringify(S0)
    const shop = port.bindings['port.bakery']
    port.runner.run({ type: 'credit', holder: 'player', amount: 100 })
    port.runner.run({ type: 'sell', title: shop.titles[1], buyer: 'player', price: 40 })
    port.runner.tick()
    const hooks = fold(port.events(), port.bindings)
    expect(hooks.filter((hook) => hook.kind === 'titleChanged')).toEqual([{ kind: 'titleChanged', place: 'port.bakery', from: 'esfp-f', to: 'player' }])
    expect(JSON.stringify(S0)).toBe(snapshot)
    expect(S0.slots['port.bakery'].owner).toBe('esfp-f')
    const church = port.bindings['port.church']
    const rows = port.runner.state.ledger.length
    expect(() => port.runner.run({ type: 'sell', title: church.titles[1], buyer: 'player', price: 1 })).toThrow(/not for sale/)
    expect(port.runner.state.ledger.length).toBe(rows)
    expect(fold(port.events(), port.bindings).filter((hook) => hook.place === 'port.church')).toHaveLength(0)
  })
})
