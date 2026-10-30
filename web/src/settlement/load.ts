/**
 * The pirate adapter's loader: replays data/pirate-ship/settlement/start.json into @rex/settlement commands and
 * returns the engine runner with the derived port.* -> engine id bindings. The alignment engine is not touched.
 * Geometry is a placeholder until MIGRATION step 3 derives the map.
 */
import startData from '../../../data/pirate-ship/settlement/start.json'
import { Runner, initialState, defaultConfig, stubProviders, type Providers, type Room, type SettlementConfig, type SettlementEvent, type Transferable } from '@rex/settlement'

export interface Binding { parcels: string[]; buildings: string[]; businesses: string[]; offices: string[]; titles: string[]; leases: string[] }
export type Bindings = Record<string, Binding>

interface StartPlace {
  place: string
  holder: string
  class: string
  transferable: Transferable
  building?: { fixtures: string[]; rooms?: { id: string; name: string; use: string }[]; condition?: number; decayClass?: string | null; exposure?: string }
  business?: { kind: string; operator: string; publicWorks?: boolean; lease?: { rent: number } }
  office?: { name: string; powers: string[] }
}

interface StartData {
  district: { name: string; kind: string; parcelSize: number; gap: number }
  places: StartPlace[]
  residences: { person: string; place: string }[]
}

export interface LoadedPort {
  runner: Runner
  bindings: Bindings
  settlementId: string
  /** The engine events since the last call, for the bridge; drained on read. */
  events(): SettlementEvent[]
}

export function loadPort(providers: Providers = stubProviders(), config: SettlementConfig = defaultConfig(), raw: StartData = startData as StartData): LoadedPort {
  const runner = new Runner(initialState('stl.port', 'the starting port'), config, providers)
  const size = raw.district.parcelSize
  const gap = raw.district.gap
  const district = runner.run<string>({ type: 'addDistrict', name: raw.district.name, kind: raw.district.kind,
    bounds: { x: 0, y: 0, w: raw.places.length * (size + gap), h: size } })
  const bindings: Bindings = {}
  raw.places.forEach((entry, i) => {
    const binding: Binding = { parcels: [], buildings: [], businesses: [], offices: [], titles: [], leases: [] }
    const parcel = runner.run<string>({ type: 'addParcel', district, footprint: { x: i * (size + gap), y: 0, w: size, h: size }, access: ['road'] })
    binding.parcels.push(parcel)
    if (entry.holder !== 'none') {
      binding.titles.push(runner.run<string>({ type: 'grantTitle', subject: parcel, holder: entry.holder, class: entry.class, transferable: entry.transferable }))
    }
    if (entry.building) {
      const footprint = { x: i * (size + gap) + 1, y: 1, w: size - 2, h: size - 2 }
      const rooms: Room[] = (entry.building.rooms ?? [{ id: 'main', name: 'main', use: 'any' }]).map((room) => ({ ...room, tiles: footprint }))
      const bldg = runner.run<string>({ type: 'addBuilding', parcel, footprint, condition: entry.building.condition ?? 0.6, rooms,
        decayClass: entry.building.decayClass ?? undefined, exposure: entry.building.exposure, fixtures: entry.building.fixtures })
      binding.buildings.push(bldg)
      if (entry.holder !== 'none') {
        binding.titles.push(runner.run<string>({ type: 'grantTitle', subject: bldg, holder: entry.holder, class: entry.class, transferable: entry.transferable }))
      }
      if (entry.business) {
        const title = binding.titles[binding.titles.length - 1]
        if (entry.business.lease) {
          binding.leases.push(runner.run<string>({ type: 'lease', title, tenant: entry.business.operator, rent: entry.business.lease.rent }))
        }
        binding.businesses.push(runner.run<string>({ type: 'openBusiness', kind: entry.business.kind, premises: [{ bldg, rooms: rooms.map((room) => room.id) }],
          operator: entry.business.operator, inventory: `inv.${entry.place}`, publicWorks: entry.business.publicWorks ?? false }))
      }
      if (entry.office) {
        binding.offices.push(runner.run<string>({ type: 'createOffice', name: entry.office.name, powers: entry.office.powers, seat: bldg }))
      }
    }
    bindings[entry.place] = binding
  })
  for (const residence of raw.residences) {
    const bldg = bindings[residence.place]?.buildings[0]
    if (!bldg) throw new Error(`residence at a place with no building: ${residence.place}`)
    runner.run({ type: 'assign', person: residence.person, kind: 'residence', target: bldg })
  }
  runner.events.length = 0   // seeding is not news
  return { runner, bindings, settlementId: 'stl.port', events: () => runner.events.splice(0, runner.events.length) }
}

/** The place a settlement subject (a parcel, building, business, office or title id) belongs to, or null. */
export function placeOf(bindings: Bindings, subject: string): string | null {
  for (const [place, binding] of Object.entries(bindings)) {
    if (binding.parcels.includes(subject) || binding.buildings.includes(subject) || binding.businesses.includes(subject)
      || binding.offices.includes(subject) || binding.titles.includes(subject) || binding.leases.includes(subject)) return place
  }
  return null
}
