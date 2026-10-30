/**
 * The galley still: the pirate game's first use of the shared realism engine (@rex/realism, Toolchain/realism).
 * The game owns only the situation (where the still stands, who tends it, what the weather is); every formula,
 * material and simulation step belongs to the package (files/pirate-ship/science/ENGINE.md section 5).
 */
import { runStill, waterBoilingPoint, pressureAtAltitude, type StillOptions, type StillResult } from '@rex/realism'

export interface GalleySituation {
  /** Height of the still above the sea, m: 0 on deck, the hills of Jamaica inland. */
  altitudeM: number
  /** Air temperature where the still stands, C (the climate tables give it). */
  airC: number
  /** The tender's relevant skill, 0 to 100 (Distilling in STATS.md's skill list); it sets how steady the fire is, nothing else. */
  skill: number
  /** How long the tender keeps at it, minutes. */
  minutes: number
  /** Days since the glass was last checked against boiling water. */
  thermometerDays?: number
  /** Deterministic seed for a given day's run. */
  seed?: number
}

export interface GalleyReport {
  boilingPointC: number
  distillateL: number
  charcoalKg: number
  roomC: number
  co2ppm: number
  tenderWaterDeficitPct: number
  glassReadsC: number
  glassTrueC: number
  journal: string[]
  conserved: boolean
}

/** Run the still for a situation and return what the game shows and what it logs in the discovery journal. */
export function runGalleyStill(s: GalleySituation): GalleyReport {
  const o: StillOptions = { altitudeM: s.altitudeM, outsideC: s.airC, skill: s.skill, minutes: s.minutes, daysSinceCalibration: s.thermometerDays ?? 0, seed: s.seed ?? 1 }
  const r: StillResult = runStill(o)
  return {
    boilingPointC: r.boilingPointC,
    distillateL: r.distillateKg,          // water: 1 kg is 1 L near room temperature
    charcoalKg: r.charcoalBurnedKg,
    roomC: r.roomC,
    co2ppm: r.co2ppm,
    tenderWaterDeficitPct: r.waterDeficitPct,
    glassReadsC: r.thermometerReading,
    glassTrueC: r.thermometerTrue,
    journal: r.journal,
    conserved: r.conservationFailures === 0,
  }
}

/** What the glass should read when water boils here: the journal's check against a drifted thermometer. */
export function expectedBoilC(altitudeM: number): number {
  return waterBoilingPoint(pressureAtAltitude(altitudeM))
}
