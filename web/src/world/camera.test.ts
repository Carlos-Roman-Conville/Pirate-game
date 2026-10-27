import { describe, expect, it } from 'vitest'
import { mapCameraBounds } from './camera'

describe('map camera bounds', () => {
  it('centred when the map is smaller than the view on both axes', () => {
    const mapW = 384
    const mapH = 224
    const viewW = 1920
    const viewH = 1080
    const zoom = 2
    const b = mapCameraBounds(mapW, mapH, viewW, viewH, zoom)
    const visibleW = viewW / zoom
    const visibleH = viewH / zoom
    expect(b.x).toBe(-(visibleW - mapW) / 2)
    expect(b.y).toBe(-(visibleH - mapH) / 2)
    expect(b.width).toBe(visibleW)
    expect(b.height).toBe(visibleH)
    expect(b.x + (b.width - mapW) / 2).toBe(0)
    expect(b.y + (b.height - mapH) / 2).toBe(0)
  })

  it('keeps flush bounds when the map is larger than the view', () => {
    const mapW = 800
    const mapH = 600
    const b = mapCameraBounds(mapW, mapH, 640, 480, 1)
    expect(b).toEqual({ x: 0, y: 0, width: mapW, height: mapH })
  })
})
