import { describe, expect, it, vi } from 'vitest'
import { attachSubmergeSplashToWorld } from './submergeSplash'

describe('attachSubmergeSplashToWorld', () => {
  it('passes the resolved splash container through world once', async () => {
    const splash = { name: 'splash' }
    const world = vi.fn((obj: typeof splash) => ({ ...obj, registered: true }))
    const out = await attachSubmergeSplashToWorld(Promise.resolve(splash), world)
    expect(world).toHaveBeenCalledOnce()
    expect(world).toHaveBeenCalledWith(splash)
    expect(out).toEqual({ name: 'splash', registered: true })
  })

  it('rejects when the submerge promise rejects', async () => {
    const world = vi.fn()
    const err = new Error('lazy import failed')
    await expect(
      attachSubmergeSplashToWorld(Promise.reject(err), world),
    ).rejects.toThrow('lazy import failed')
    expect(world).not.toHaveBeenCalled()
  })

  it('dock chain warns on lazy-import failure without calling world', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const world = vi.fn()
    const err = new Error('lazy import failed')
    attachSubmergeSplashToWorld(Promise.reject(err), world).catch((e) => {
      console.warn('bite submerge fx failed', e)
    })
    await new Promise((r) => setTimeout(r, 0))
    expect(world).not.toHaveBeenCalled()
    expect(warn).toHaveBeenCalledWith('bite submerge fx failed', err)
    warn.mockRestore()
  })
})
