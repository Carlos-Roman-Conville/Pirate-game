import { describe, expect, it } from 'vitest'
import { silhouettesClearAt, silhouettesShownAtStage } from './silhouettes'

describe('fish silhouettes stay for aiming', () => {
  it('shows silhouettes from reading the water through power', () => {
    for (const s of ['readWater', 'aim', 'direction', 'power']) expect(silhouettesShownAtStage(s)).toBe(true)
  })

  it('hides silhouettes from the lure on', () => {
    for (const s of ['lure', 'bite', 'pullIn', 'result']) expect(silhouettesShownAtStage(s)).toBe(false)
  })

  it('clears silhouettes only after the cast lands', () => {
    expect(silhouettesClearAt('lure', true)).toBe(false)
    expect(silhouettesClearAt('lure', false)).toBe(true)
    expect(silhouettesClearAt('aim', false)).toBe(false)
  })
})
