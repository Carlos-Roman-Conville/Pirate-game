import { describe, expect, it } from 'vitest'
import { libraryTable } from '@rex/realism'
import atmosphere from '../../../../files/pirate-ship/body/data/atmosphere.json'
import environment from '../../../../files/pirate-ship/body/data/environment.json'
import data from '../../../../data/pirate-ship/world/places.json'
import source from './places.ts?raw'
import { conditionsAt, places, roomForScenario, roomFor, scenarioNames, terrainKnown, weatherState } from './places.ts'

const heavyCeilingC = Number(libraryTable('physiology', 'wbgt_limits').find(r => String(r.id).endsWith('heavy-over-6'))!['WBGT ceiling, acclimatised (C)'])
const regionCell = (place: string, column: string): string => {
  const cols = atmosphere.regions.columns, row = atmosphere.regions.rows.find(r => r[0] === place)!
  return String(row[cols.indexOf(column)])
}
/** First day of a month in a non-leap year, from the data file's own calendar. */
const dayOf = (month: string, day = 1): number => {
  const i = data.calendar.months.indexOf(month)
  return data.calendar.monthDays.slice(0, i).reduce((a, b) => a + b, 0) + day
}

describe('places become engine rooms', () => {
  it('builds the hold as a box with its row\'s volume and air changes', () => {
    const hold = roomFor('hold')!
    expect(hold.kind).toBe('room')
    expect(hold.props.volume_m3).toBe(Number(/a brig (\d+)/.exec(regionCell('The hold', 'Volume (m3, placeholder)'))![1]))
    expect(hold.props.ach).toBe(2)
    expect(hold.contents.length).toBeGreaterThan(0)
    expect(hold.mass).toBeGreaterThan(0)
    expect(roomFor('hold', { vessel: 'ship' })!.props.volume_m3).toBe(Number(/a ship (\d+)/.exec(regionCell('The hold', 'Volume (m3, placeholder)'))![1]))
    expect(roomFor('hold', { state: 'battened' })!.props.ach).toBe(0.2)
    expect(() => roomFor('hold', { vessel: 'galleon' })).toThrow(/galleon/)
  })

  it('takes each row\'s volume as the table states it', () => {
    expect(roomFor('gun-deck')!.props.volume_m3).toBe(300)
    expect(roomFor('gun-deck')!.props.ach).toBe(20)
    expect(roomFor('great-cabin')!.props.volume_m3).toBe(40)
    expect(roomFor('orlop')!.props.volume_m3).toBe(150)
    expect(roomFor('tavern')!.props.volume_m3).toBe(80)
    expect(roomFor('tavern')!.props.ach).toBe(3)
  })

  it('gives open air and a place with no row no box', () => {
    for (const id of ['open-deck', 'aloft', 'beach', 'swamp-anchorage', 'rainforest', 'town-street', 'galley']) expect(roomFor(id), id).toBeNull()
  })

  it('builds a scenario as the place\'s box with the air changes its row states', () => {
    expect(scenarioNames().length).toBe(4)
    expect(roomForScenario('The hold battened down with men in it (prisoners, a storm)').props.ach).toBe(0.2)
    expect(roomForScenario('A charcoal brazier in a shut cabin on a cold night').props.ach).toBe(0.5)
    expect(roomForScenario('Opening a long-sealed hold or well').props.ach).toBe(0.05)
    const gun = roomForScenario('The gun deck in a long action')
    expect(gun.props.ach).toBe(20)
    expect(gun.props.volume_m3).toBe(roomFor('gun-deck')!.props.volume_m3)
    expect(() => roomForScenario('Fire below decks')).toThrow(/mapped/)
  })

  it('maps every place to a terrain both the engine and the game have', () => {
    for (const p of places) expect(terrainKnown(p.id), p.id).toBe(true)
  })
})

describe('the climate feeds the engine\'s environment', () => {
  it('gives August noon on the open deck a WBGT over the heavy-work ceiling', () => {
    for (const seed of [1, 2, 3, 4, 5, 6]) {
      const c = conditionsAt('open-deck', dayOf('Aug', 15), 12, seed)
      expect(c.month).toBe('Aug')
      expect(c.wbgt_c!, `seed ${seed}`).toBeGreaterThan(heavyCeilingC)
      expect(c.sun_exposure).toBe(1)
      expect(c.vector_exposure).toBeNull()
    }
  })

  it('follows the exposure rows: below decks is the row\'s delta over the open deck, the cold row has no WBGT', () => {
    const at = (id: string) => conditionsAt(id, dayOf('Aug', 15), 12, 7)
    expect(at('great-cabin').wbgt_c! - at('open-deck').wbgt_c!).toBeCloseTo(3, 9)
    expect(at('galley').wbgt_c! - at('open-deck').wbgt_c!).toBeCloseTo(6, 9)
    expect(at('aloft').wbgt_c! - at('open-deck').wbgt_c!).toBeCloseTo(-1, 9)
    expect(at('galley').sun_exposure).toBe(0)
  })

  it('curves the air by the hour between the month\'s night minimum and day maximum, and sets the sun by the month\'s day', () => {
    const night = conditionsAt('open-deck', dayOf('Jan', 15), 5, 3), noon = conditionsAt('open-deck', dayOf('Jan', 15), 15, 3)
    expect(noon.air_c).toBeGreaterThan(night.air_c)
    expect(night.sun_exposure).toBe(0)
    expect(night.is_day).toBe(false)
    const jun = conditionsAt('open-deck', dayOf('Jun', 15), 12, 3), dec = conditionsAt('open-deck', dayOf('Dec', 15), 12, 3)
    expect(jun.daylight_h!).toBeGreaterThan(dec.daylight_h!)
    expect(jun.sunburn_min!).toBeLessThan(dec.sunburn_min!)
    const feb = conditionsAt('open-deck', dayOf('Feb', 15), 12, 3).daylight_h!
    expect(feb).toBeGreaterThan(dec.daylight_h!)
    expect(feb).toBeLessThan(conditionsAt('open-deck', dayOf('Mar', 15), 12, 3).daylight_h!)
  })
})

describe('the weather state is drawn from the rows', () => {
  const names = (() => { const seen = new Set<string>(); for (let s = 1; s <= 20; s++) for (let d = 1; d <= 365; d += 5) seen.add(weatherState(d, s)); return seen })()

  it('is seeded: the same seed gives the same day, whatever the hour', () => {
    for (const d of [10, 100, 250]) {
      expect(weatherState(d, 42)).toBe(weatherState(d, 42))
      expect(conditionsAt('open-deck', d, 3, 42).weather).toBe(conditionsAt('open-deck', d, 20, 42).weather)
    }
    const days = Array.from({ length: 60 }, (_, i) => weatherState(i + 1, 1)), other = Array.from({ length: 60 }, (_, i) => weatherState(i + 1, 2))
    expect(days).not.toEqual(other)
  })

  it('only names the table\'s states, and the trade winds are the commonest', () => {
    const table = new Set(environment.weather_states.rows.map(r => String(r[0])))
    for (const n of names) expect(table.has(n), n).toBe(true)
    const count = new Map<string, number>()
    for (let s = 1; s <= 20; s++) for (let d = 1; d <= 365; d++) { const n = weatherState(d, s); count.set(n, (count.get(n) ?? 0) + 1) }
    const top = [...count.entries()].sort((a, b) => b[1] - a[1])[0]![0]
    expect(top).toMatch(/^Trade-wind fair/)
  })

  it('draws no hurricane or norther where the season\'s weight is zero, and a stay chance holds a state', () => {
    for (let s = 1; s <= 30; s++) {
      for (let d = dayOf('Jan', 2); d <= dayOf('Mar', 31); d++) expect(weatherState(d, s)).not.toMatch(/^Hurricane/)
      for (let d = dayOf('Jun', 1); d <= dayOf('Sep', 30); d++) expect(weatherState(d, s)).not.toMatch(/^Norther/)
    }
    let same = 0, total = 0
    for (let s = 1; s <= 20; s++) for (let d = 2; d <= 365; d++) { total++; if (weatherState(d, s) === weatherState(d - 1, s)) same++ }
    expect(same / total).toBeGreaterThan(0.3)
    // many seeds over a year of days: ~5 s under load, past vitest's 5000 ms default, so the limit is explicit (2644)
  }, 30000)

  it('applies the hurricane row\'s period factor to years before its date', () => {
    const count = (year: number | undefined) => {
      let n = 0
      for (let s = 1; s <= 40; s++) for (let d = dayOf('Aug', 1); d <= dayOf('Oct', 31); d++) if (weatherState(d, s, year).startsWith('Hurricane')) n++
      return n
    }
    expect(count(1700)).toBeLessThan(count(1730))
  })
})

describe('no climate number is typed in the adapter', () => {
  it('holds only structural numeric literals', () => {
    const code = source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '').replace(/'[^']*'|`[^`]*`/g, "''")
    const literals = new Set(code.match(/\b\d+(?:\.\d+)?\b/g) ?? [])
    // 0, 1 and 2 index and count; 1852 and 3600 define the knot (a nautical mile an hour)
    const allowed = new Set(['0', '1', '2', '1852', '3600'])
    expect([...literals].filter(l => !allowed.has(l))).toEqual([])
  })
})
