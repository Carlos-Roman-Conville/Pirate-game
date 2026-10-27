import { describe, expect, it } from 'vitest'
import dock from '../../../data/pirate-ship/maps/dock.json'
import { boxFree, facingOf, integerZoom, isSolid, loadMap, moveBody, tileAt, type MapData } from './map'

const map = loadMap(dock as MapData)

describe('the dock map', () => {
  it('loads with equal rows and a spawn on the planks', () => {
    expect(map.width).toBe(24)
    expect(map.height).toBe(14)
    expect(tileAt(map, dock.spawn.x, dock.spawn.y)?.name).toBe('planks')
  })
  it('water blocks and planks do not', () => {
    expect(tileAt(map, 10, 0)?.name).toBe('water')
    expect(isSolid(map, 10, 0)).toBe(true)
    expect(tileAt(map, 2, 3)?.name).toBe('planks')
    expect(isSolid(map, 2, 3)).toBe(false)
  })
  it('the moored boat hull blocks', () => {
    expect(isSolid(map, 9, 8)).toBe(true)
  })
  it('off the map is solid', () => {
    expect(isSolid(map, -1, 0)).toBe(true)
    expect(isSolid(map, 0, 99)).toBe(true)
  })
  it('rejects a ragged or unknown map', () => {
    expect(() => loadMap({ ...(dock as MapData), rows: ['==', '='] })).toThrow()
    expect(() => loadMap({ ...(dock as MapData), rows: ['=?'] })).toThrow()
  })
})

describe('movement', () => {
  const body = { hw: 4, hh: 3 }
  it('walks on planks', () => {
    const p = moveBody(map, { x: 24, y: 56, ...body }, 2, 0)
    expect(p).toEqual({ x: 26, y: 56 })
  })
  it('stops at the water', () => {
    // The quay's edge is x = 96 (tile 6) on rows 2-5; the box's right side is at x + 4.
    const p = moveBody(map, { x: 91, y: 48, ...body }, 4, 0)
    expect(p.x).toBe(91)
    expect(boxFree(map, p.x, p.y, body.hw, body.hh)).toBe(true)
  })
  it('slides along the edge', () => {
    const p = moveBody(map, { x: 91, y: 48, ...body }, 4, 2)
    expect(p).toEqual({ x: 91, y: 50 })
  })
})

describe('facing and zoom', () => {
  it('picks a facing', () => {
    expect(facingOf(0, 1)).toBe('down')
    expect(facingOf(0, -1)).toBe('up')
    expect(facingOf(-1, 0)).toBe('side')
    expect(facingOf(0, 0)).toBeNull()
  })
  it('zoom is a whole number, at least 1', () => {
    expect(integerZoom(1920, 1080, 16)).toBe(5)
    expect(Number.isInteger(integerZoom(1366, 768, 16))).toBe(true)
    expect(integerZoom(200, 100, 16)).toBe(1)
  })
})
