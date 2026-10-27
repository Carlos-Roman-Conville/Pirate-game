import Phaser from 'phaser'
import dock from '../../../data/pirate-ship/maps/dock.json'
import { biteSubmergeBeat, syncBitePhaseToClock, type BiteSchedule } from '../fishing/bite'
import { lureRhythmIds } from '../fishing/lure'
import {
  applyFishingRun,
  dismissResultPanel,
  dockAllowsWalking,
  initialDockLoop,
  resultPanelMessage,
  RESULT_PANEL_CLASS,
  stubAdvanceRun,
  tryStartFishingAtDock,
  type DockLoopState,
} from '../fishing/loop'
import { loadFishingConfig, type FishingRun } from '../fishing/machine'
import {
  readWaterTuning,
  silhouetteDistanceTiles,
  visibleFishSilhouettes,
} from '../fishing/readWater'
import {
  castViewAimDraw,
  castViewAimInput,
  castViewDirectionCone,
  castViewFlyProgress,
  castViewFlySegment,
  castViewOnSpace,
  castViewPowerMeter,
  castViewShowsOverlay,
  createCastView,
  type CastViewState,
} from './castView'
import {
  catchViewBobberDraw,
  catchViewCreateBiteSchedule,
  catchViewLurePickInput,
  catchViewOnSpaceBite,
  catchViewOnSpaceLure,
  catchViewOnPullRelease,
  catchViewPullHoldStart,
  catchViewResetPullLine,
  catchViewRhythmMeter,
  catchViewShowsBobber,
  catchViewTensionMeter,
  createCatchView,
  type CatchViewState,
} from './catchView'
import { silhouettesClearAt } from './silhouettes'
import { mapCameraBounds } from './camera'
import { atDockEdge, facingOf, integerZoom, loadMap, moveBody, tileAt, type Facing, type MapData } from './map'

// The dock world: three-quarter top-down, square tiles, script-drawn placeholder art (Rex's renders replace it).
// All rules about where you can stand live in map.ts; this file only draws and reads the keys.

const SPEED = 64            // pixels per second at zoom 1
const HALF = { hw: 4, hh: 3 }   // the feet box

const PALETTE: Record<string, number> = { water: 0x2f6f9f, planks: 0x9a7448, hull: 0x5b3a22, deck: 0xb08a58, post: 0x3b2a1a }

const STAGE_PROMPT: Record<string, string> = {
  readWater: 'Reading the water… Space to cast',
  aim: 'Aim — Space to set target',
  direction: 'Direction — Space to set angle',
  power: 'Power — Space to cast',
  lure: 'Lure — ←/→ rhythm, Space to play',
  lurePlay: 'Lure — Space on the beats',
  bite: 'Bite — Space when the bobber dives',
  pullIn: 'Pull it in — hold Space, release to pull (gentle!)',
}

function facingStep(facing: Facing, flipX: boolean): { dx: number; dy: number } {
  if (facing === 'down') return { dx: 0, dy: 1 }
  if (facing === 'up') return { dx: 0, dy: -1 }
  return { dx: flipX ? -1 : 1, dy: 0 }
}

export class DockScene extends Phaser.Scene {
  private map = loadMap(dock as MapData)
  private fishingConfig = loadFishingConfig()
  private keys!: Record<
    'up' | 'down' | 'left' | 'right' | 'w' | 'a' | 's' | 'd' | 'f' | 'space',
    Phaser.Input.Keyboard.Key
  >
  private player!: Phaser.GameObjects.Image
  private pos = { x: 0, y: 0 }
  private facing: Facing = 'down'
  private sideFlip = false
  private walked = 0
  private dockLoop: DockLoopState = initialDockLoop()
  private fishSilhouettes: Phaser.GameObjects.Image[] = []
  private readWaterLabel: Phaser.GameObjects.Text | null = null
  private stageHud: Phaser.GameObjects.Text | null = null
  private resultHud: Phaser.GameObjects.Text | null = null
  private biteSchedule: BiteSchedule | null = null
  private biteSubmergeFxPlayed = false
  private castView: CastViewState | null = null
  private catchView: CatchViewState | null = null
  private castGfx: Phaser.GameObjects.Graphics | null = null
  private castMeterGfx: Phaser.GameObjects.Graphics | null = null
  private catchGfx: Phaser.GameObjects.Graphics | null = null
  private catchHudGfx: Phaser.GameObjects.Graphics | null = null
  private pullInLabels: Phaser.GameObjects.Text[] = []
  private rhythmLabels: Phaser.GameObjects.Text[] = []
  private hudKey = ''
  /** Zoom-1 camera that draws only the HUD; the main camera (zoomed, following the player) draws only the world. */
  private hudCam!: Phaser.Cameras.Scene2D.Camera

  constructor() { super('dock') }

  /** World objects are hidden from the HUD camera. */
  private world<T extends Phaser.GameObjects.GameObject>(obj: T): T {
    this.hudCam.ignore(obj)
    return obj
  }

  /** HUD objects are hidden from the zoomed main camera and drawn in screen pixels. */
  private hud<T extends Phaser.GameObjects.GameObject>(obj: T): T {
    this.cameras.main.ignore(obj)
    return obj
  }

  create() {
    this.hudCam = this.cameras.add(0, 0, this.scale.width, this.scale.height)
    this.hudCam.setZoom(1)
    const t = this.map.tileSize
    this.drawTextures(t)
    for (let y = 0; y < this.map.height; y++) {
      for (let x = 0; x < this.map.width; x++) {
        const kind = this.map.data.legend[this.map.data.rows[y][x]].name
        this.world(this.add.image(x * t, y * t, `tile-${kind}`).setOrigin(0, 0))
      }
    }
    this.pos = { x: (this.map.data.spawn.x + 0.5) * t, y: (this.map.data.spawn.y + 0.5) * t }
    this.player = this.world(this.add.image(this.pos.x, this.pos.y, 'player-down').setOrigin(0.5, 0.85).setDepth(10))

    const kb = this.input.keyboard!
    this.keys = {
      ...kb.createCursorKeys(),
      w: kb.addKey('W'), a: kb.addKey('A'), s: kb.addKey('S'), d: kb.addKey('D'),
      f: kb.addKey('F'),
      space: kb.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
    } as typeof this.keys

    const cam = this.cameras.main
    cam.startFollow(this.player, true)
    cam.setRoundPixels(true)
    this.scale.on('resize', () => {
      this.hudCam.setSize(this.scale.width, this.scale.height)
      this.applyZoom(this.fishSilhouettes.length > 0)
    })
    this.applyZoom()
  }

  update(_time: number, delta: number) {
    if (Phaser.Input.Keyboard.JustDown(this.keys.f)) {
      this.dockLoop = tryStartFishingAtDock(
        this.dockLoop,
        atDockEdge(this.map, this.pos.x, this.pos.y),
        this.fishingConfig,
      )
      if (this.dockLoop.mode === 'fishing' && this.dockLoop.run) {
        this.enterReadWater()
      }
    }

    if (this.dockLoop.mode === 'showingResult') {
      if (Phaser.Input.Keyboard.JustDown(this.keys.space)) {
        this.clearResultPanel()
        this.dockLoop = dismissResultPanel(this.dockLoop)
        this.applyZoom(false)
      }
      this.player.setPosition(Math.round(this.pos.x), Math.round(this.pos.y))
      return
    }

    if (this.dockLoop.mode === 'fishing' && this.dockLoop.run) {
      this.tickFishing(delta)
      this.player.setPosition(Math.round(this.pos.x), Math.round(this.pos.y))
      return
    }

    if (!dockAllowsWalking(this.dockLoop)) {
      this.player.setPosition(Math.round(this.pos.x), Math.round(this.pos.y))
      return
    }

    const k = this.keys
    const dx = (k.right.isDown || k.d.isDown ? 1 : 0) - (k.left.isDown || k.a.isDown ? 1 : 0)
    const dy = (k.down.isDown || k.s.isDown ? 1 : 0) - (k.up.isDown || k.w.isDown ? 1 : 0)
    const step = (SPEED * delta) / 1000
    const norm = dx !== 0 && dy !== 0 ? Math.SQRT1_2 : 1
    const next = moveBody(this.map, { ...this.pos, ...HALF }, dx * step * norm, dy * step * norm)
    const moved = next.x !== this.pos.x || next.y !== this.pos.y
    this.pos = next

    const f = facingOf(dx, dy)
    if (f) this.facing = f
    if (f === 'side' && dx !== 0) this.sideFlip = dx < 0
    this.player.setTexture(`player-${this.facing}`)
    this.player.setFlipX(this.facing === 'side' && this.sideFlip)
    if (moved) this.walked += delta
    const bob = moved ? Math.round(Math.sin(this.walked / 90)) : 0
    this.player.setPosition(Math.round(this.pos.x), Math.round(this.pos.y) + bob)
  }

  private tickFishing(_delta: number) {
    let run = this.dockLoop.run!
    const prevStage = run.stage
    const clock = { now: () => this.time.now }

    if (run.stage === 'bite' && this.biteSchedule) {
      const beforePhase = run.bitePhase
      run = syncBitePhaseToClock(run, this.biteSchedule, clock)
      if (
        !this.biteSubmergeFxPlayed &&
        beforePhase === 'nibbling' &&
        (run.bitePhase === 'submerged' || run.bitePhase === 'hookWindow')
      ) {
        this.biteSubmergeFxPlayed = true
        biteSubmergeBeat(this, this.pos.x, this.pos.y + this.map.tileSize).then((splash) => {
          this.world(splash)
        })
      }
    }

    if (this.castView && (run.stage === 'aim' || run.stage === 'direction' || run.stage === 'power')) {
      this.castView = castViewAimInput(this.castView, this.aimKeyInput(), run.stats, this.fishingConfig)
    }

    if (Phaser.Input.Keyboard.JustDown(this.keys.space)) {
      run = this.onFishingSpace(run)
    }
    if (run.stage === 'pullIn' && this.catchView && Phaser.Input.Keyboard.JustUp(this.keys.space)) {
      const out = catchViewOnPullRelease(this.catchView, this.time.now, run, run.stats, this.fishingConfig)
      this.catchView = out.state
      run = out.run
    }

    if (this.catchView && run.stage === 'lure') {
      this.catchView = catchViewLurePickInput(this.catchView, this.rhythmPickInput(), this.fishingConfig)
    }

    this.drawCastOverlay(run)
    this.drawCatchOverlay(run)

    if (this.fishSilhouettes.length > 0) {
      const flying = this.castView ? castViewFlyProgress(this.castView, this.time.now, this.fishingConfig) !== null : false
      if (silhouettesClearAt(run.stage, flying)) {
        this.clearSilhouettes()
        this.applyZoom(false)
      }
    }

    if (run.stage === 'result' && run.result) {
      this.dockLoop = applyFishingRun(this.dockLoop, run)
      this.clearFishingHud()
      this.showResultPanel(run)
      return
    }

    this.dockLoop = applyFishingRun(this.dockLoop, run)
    if (run.stage === 'bite' && !this.biteSchedule) {
      this.biteSubmergeFxPlayed = false
      this.biteSchedule = catchViewCreateBiteSchedule(
        this.time.now,
        run.stats,
        this.fishingConfig,
        { next: () => 0.5 },
        run.lureDrawn,
      )
    }
    if (run.stage !== prevStage) {
      if (run.stage === 'lure' && this.castView?.landing) {
        this.catchView = createCatchView(this.castView.landing, this.map.tileSize, this.fishingConfig)
      }
      if (run.stage === 'pullIn' && this.catchView) {
        this.catchView = catchViewResetPullLine(this.catchView, this.fishingConfig)
      }
      if (run.stage === 'aim') {
        this.castView = createCastView(this.castContext(), run.stats, this.fishingConfig, this.time.now)
      }
    }
    const key = `${run.stage}:${this.catchView?.lurePhase ?? ''}`
    if (key !== this.hudKey) {
      this.hudKey = key
      this.updateStageHud(run)
    }
  }

  private onFishingSpace(run: FishingRun): FishingRun {
    const stage = run.stage
    if (stage === 'readWater') {
      return stubAdvanceRun(run, true)
    }
    if (stage === 'aim' || stage === 'direction' || stage === 'power') {
      if (!this.castView) {
        this.castView = createCastView(this.castContext(), run.stats, this.fishingConfig, this.time.now)
      }
      const out = castViewOnSpace(this.castView, this.time.now, run, run.stats, this.fishingConfig)
      this.castView = out.state
      return out.run
    }
    if (stage === 'lure' && this.catchView) {
      const out = catchViewOnSpaceLure(this.catchView, this.time.now, run, this.fishingConfig)
      this.catchView = out.state
      return out.run
    }
    if (stage === 'bite' && this.biteSchedule) {
      return catchViewOnSpaceBite(run, this.biteSchedule, this.time.now, this.fishingConfig)
    }
    if (stage === 'pullIn' && this.catchView) {
      this.catchView = catchViewPullHoldStart(this.catchView, this.time.now, run)
      return run
    }
    return run
  }

  private enterReadWater() {
    this.clearReadWaterOverlay()
    this.hudKey = 'readWater:'
    this.biteSchedule = null
    this.biteSubmergeFxPlayed = false
    this.catchView = null
    this.applyZoom(true)
    const run = this.dockLoop.run!
    const visible = visibleFishSilhouettes(run.stats, this.fishingConfig)
    const step = facingStep(this.facing, this.sideFlip)
    const t = this.map.tileSize
    const ptx = Math.floor(this.pos.x / t)
    const pty = Math.floor(this.pos.y / t)

    visible.forEach((fish, i) => {
      const dist = Math.round(silhouetteDistanceTiles(fish))
      const lateral = i - (visible.length - 1) / 2
      let tx = ptx + step.dx * dist + (step.dy !== 0 ? lateral : 0)
      let ty = pty + step.dy * dist + (step.dx !== 0 ? lateral : 0)
      if (tileAt(this.map, tx, ty)?.name !== 'water') {
        for (let d = dist; d >= 1; d--) {
          tx = ptx + step.dx * d + (step.dy !== 0 ? lateral : 0)
          ty = pty + step.dy * d + (step.dx !== 0 ? lateral : 0)
          if (tileAt(this.map, tx, ty)?.name === 'water') break
        }
      }
      const img = this.world(
        this.add.image((tx + 0.5) * t, (ty + 0.5) * t, 'fish-silhouette').setDepth(5).setAlpha(0.85),
      )
      this.fishSilhouettes.push(img)
    })

    this.readWaterLabel = this.hud(
      this.add
        .text(8, 8, STAGE_PROMPT.readWater, { fontSize: '11px', color: '#e8f4ff', backgroundColor: '#00000088' })
        .setScrollFactor(0)
        .setDepth(100),
    )
  }

  private updateStageHud(run: FishingRun) {
    let prompt = STAGE_PROMPT[run.stage]
    if (run.stage === 'lure' && this.catchView?.lurePhase === 'play') {
      prompt = STAGE_PROMPT.lurePlay
    }
    if (!prompt) return
    this.stageHud?.destroy()
    this.stageHud = this.hud(
      this.add
        .text(8, 8, prompt, { fontSize: '11px', color: '#e8f4ff', backgroundColor: '#00000088' })
        .setScrollFactor(0)
        .setDepth(100),
    )
    this.readWaterLabel?.destroy()
    this.readWaterLabel = null
  }

  private showResultPanel(run: FishingRun) {
    this.resultHud?.destroy()
    const body = resultPanelMessage(run.result!, this.fishingConfig, run.gotAwayReason)
    this.resultHud = this.hud(
      this.add
        .text(8, 8, body, {
          fontSize: '12px',
          color: '#ffe8a0',
          backgroundColor: '#000000aa',
        })
        .setName(RESULT_PANEL_CLASS)
        .setScrollFactor(0)
        .setDepth(110),
    )
  }

  private clearResultPanel() {
    this.resultHud?.destroy()
    this.resultHud = null
    this.biteSchedule = null
  }

  private clearFishingHud() {
    this.clearReadWaterOverlay()
    this.clearCastOverlay()
    this.clearCatchOverlay()
    this.stageHud?.destroy()
    this.stageHud = null
  }

  private rhythmPickInput() {
    const k = this.keys
    return {
      cycleLeft: Phaser.Input.Keyboard.JustDown(k.left) || Phaser.Input.Keyboard.JustDown(k.a),
      cycleRight: Phaser.Input.Keyboard.JustDown(k.right) || Phaser.Input.Keyboard.JustDown(k.d),
    }
  }

  private drawCatchOverlay(run: FishingRun) {
    if (!this.catchView || !catchViewShowsBobber(run)) {
      this.catchGfx?.clear()
      this.catchHudGfx?.clear()
      this.destroyPullInLabels()
      this.destroyRhythmLabels()
      return
    }
    const now = this.time.now
    const stats = run.stats
    this.catchGfx ??= this.world(this.add.graphics().setDepth(23))
    this.catchHudGfx ??= this.hud(this.add.graphics().setScrollFactor(0).setDepth(102))
    const g = this.catchGfx
    const hud = this.catchHudGfx
    g.clear()
    hud.clear()

    const bob = catchViewBobberDraw(this.catchView, now, run, this.biteSchedule, stats, this.fishingConfig)
    g.fillStyle(0xff6622, bob.submerged ? 0.35 : 0.95)
    g.fillCircle(bob.x, bob.y, bob.submerged ? 2 : 4)
    if (!bob.submerged) {
      g.lineStyle(1, 0xc8e8ff, 0.7)
      g.lineBetween(bob.x, bob.y - 14, bob.x, bob.y - 3)
    }
    if (bob.nibbleDip) {
      g.lineStyle(1, 0xa8d8f0, 0.5)
      g.strokeCircle(bob.x, bob.y, 8)
    }

    if (run.stage !== 'pullIn') this.destroyPullInLabels()
    if (run.stage !== 'lure') this.destroyRhythmLabels()

    if (run.stage === 'lure') {
      const meter = catchViewRhythmMeter(this.catchView, this.fishingConfig)
      const rhythmIds = lureRhythmIds(this.fishingConfig)
      const boxW = 50
      const gap = 4
      const panelW = rhythmIds.length * (boxW + gap) + gap
      const x = Math.round(this.scale.width / 2 - panelW / 2)
      const y = 56
      hud.fillStyle(0x1a2838, 0.85)
      hud.fillRect(x, y, panelW, 54)
      if (this.rhythmLabels.length === 0) {
        this.rhythmLabels = rhythmIds.map((id) =>
          this.hud(this.add.text(0, 0, id, { fontSize: '9px', color: '#e8f4ff' }).setOrigin(0.5).setScrollFactor(0).setDepth(103)),
        )
      }
      for (let i = 0; i < rhythmIds.length; i++) {
        const bx = x + gap + i * (boxW + gap)
        const picked = i === this.catchView!.rhythmIndex
        hud.fillStyle(picked ? 0xffe066 : 0x3a5068, meter.picking ? 0.95 : 0.5)
        hud.fillRect(bx, y + 6, boxW, 16)
        this.rhythmLabels[i]?.setPosition(bx + boxW / 2, y + 14).setColor(picked ? '#1a2838' : '#e8f4ff')
      }
      if (!meter.picking) {
        const span = meter.beats[meter.beats.length - 1]! + meter.periodMs
        const lx = x + 8
        const lw = panelW - 16
        for (const beat of meter.beats) {
          hud.fillStyle(0x5ec8ff, 0.85)
          hud.fillCircle(lx + (beat / span) * lw, y + 38, 4)
        }
        for (const tap of meter.taps) {
          hud.fillStyle(0xffe066, 0.95)
          hud.fillCircle(lx + (tap / span) * lw, y + 38, 3)
        }
      }
    }

    if (run.stage === 'pullIn') {
      const t = catchViewTensionMeter(this.catchView, this.fishingConfig, this.time.now, run.stats)
      const w = 160
      const h = 12
      const bx = this.scale.width / 2 - w / 2
      const by = 48
      hud.fillStyle(0x1a2838, 0.85)
      hud.fillRect(bx, by, w, h)
      const fill = Math.min(1, t.tension / t.breakAt)
      hud.fillStyle(t.weakening ? 0xff6644 : 0x5ec8ff, 0.9)
      hud.fillRect(bx + 2, by + 2, (w - 4) * fill, h - 4)
      hud.lineStyle(1, 0xffaa44, 0.9)
      const weakMark = bx + 2 + (w - 4) * (t.weakenAt / t.breakAt)
      hud.lineBetween(weakMark, by - 2, weakMark, by + h + 2)
      hud.lineStyle(1, 0xff4444, 0.9)
      const mark = bx + w - 2
      hud.lineBetween(mark, by - 2, mark, by + h + 2)
      // Line integrity (weakens on hard pulls) and the fish's progress to the landing point.
      hud.fillStyle(0x1a2838, 0.85)
      hud.fillRect(bx, by + 16, w, 6)
      hud.fillStyle(t.integrity < t.maxIntegrity ? 0xffaa44 : 0x88dd88, 0.9)
      hud.fillRect(bx + 1, by + 17, (w - 2) * (t.integrity / t.maxIntegrity), 4)
      hud.fillStyle(0x1a2838, 0.85)
      hud.fillRect(bx, by + 26, w, 6)
      hud.fillStyle(0xffe066, 0.9)
      hud.fillRect(bx + 1, by + 27, (w - 2) * t.progress, 4)
      if (this.pullInLabels.length === 0) {
        const style = { fontSize: '9px', color: '#e8f4ff' }
        this.pullInLabels = [t.lineTensionLabel, t.lineIntegrityLabel, t.landingPointLabel].map((text) =>
          this.hud(this.add.text(0, 0, text, style).setOrigin(1, 0.5).setScrollFactor(0).setDepth(103)),
        )
      }
      const rows = [by + h / 2, by + 19, by + 29]
      this.pullInLabels.forEach((l, i) => l.setPosition(bx - 6, rows[i]!))
    }
  }

  private destroyRhythmLabels() {
    for (const l of this.rhythmLabels) l.destroy()
    this.rhythmLabels = []
  }

  private destroyPullInLabels() {
    for (const l of this.pullInLabels) l.destroy()
    this.pullInLabels = []
  }

  private clearCatchOverlay() {
    this.destroyPullInLabels()
    this.destroyRhythmLabels()
    this.catchGfx?.destroy()
    this.catchGfx = null
    this.catchHudGfx?.destroy()
    this.catchHudGfx = null
    this.catchView = null
  }

  private castContext() {
    const t = this.map.tileSize
    const step = facingStep(this.facing, this.sideFlip)
    return {
      originTiles: { x: this.pos.x / t, y: this.pos.y / t },
      facing: { dx: step.dx, dy: step.dy },
      tileSize: t,
    }
  }

  private aimKeyInput() {
    // Keys move the target in screen directions; map them onto the cast's forward/sideways axes.
    const k = this.keys
    const sx = (k.right.isDown || k.d.isDown ? 1 : 0) - (k.left.isDown || k.a.isDown ? 1 : 0)
    const sy = (k.down.isDown || k.s.isDown ? 1 : 0) - (k.up.isDown || k.w.isDown ? 1 : 0)
    const f = facingStep(this.facing, this.sideFlip)
    const fwd = sx * f.dx + sy * f.dy
    const side = -sx * f.dy + sy * f.dx
    return { forward: fwd > 0, back: fwd < 0, left: side < 0, right: side > 0 }
  }

  private drawCastOverlay(run: FishingRun) {
    if (!this.castView || !castViewShowsOverlay(run, this.castView, this.time.now, this.fishingConfig)) {
      this.castGfx?.clear()
      this.castMeterGfx?.clear()
      return
    }
    const stats = run.stats
    const now = this.time.now
    const t = this.map.tileSize
    this.castGfx ??= this.world(this.add.graphics().setDepth(22))
    this.castMeterGfx ??= this.hud(this.add.graphics().setScrollFactor(0).setDepth(101))
    const g = this.castGfx
    const hud = this.castMeterGfx
    g.clear()
    hud.clear()

    const fly = castViewFlyProgress(this.castView, now, this.fishingConfig)
    if (fly !== null) {
      const seg = castViewFlySegment(this.castView, fly, t)
      g.lineStyle(1, 0xc8e8ff, 0.85)
      g.lineBetween(seg.from.x, seg.from.y, seg.bobber.x, seg.bobber.y)
      g.fillStyle(0xff8844, 0.95)
      g.fillCircle(seg.bobber.x, seg.bobber.y, 3)
      if (fly > 0.85) {
        g.fillStyle(0xffffff, 0.35)
        g.fillCircle(seg.to.x, seg.to.y, 5)
      }
      return
    }

    if (run.stage === 'aim') {
      const aim = castViewAimDraw(this.castView)
      g.lineStyle(1, 0xffe066, 0.9)
      g.strokeCircle(aim.marker.x, aim.marker.y, 6)
      g.lineStyle(1, 0xffe066, 0.45)
      g.lineBetween(aim.apex.x, aim.apex.y, aim.marker.x, aim.marker.y)
      return
    }
    if (run.stage === 'direction') {
      const cone = castViewDirectionCone(this.castView, now, stats, this.fishingConfig)
      g.lineStyle(1, 0x88c8ff, 0.55)
      g.lineBetween(cone.apex.x, cone.apex.y, cone.left.x, cone.left.y)
      g.lineBetween(cone.apex.x, cone.apex.y, cone.right.x, cone.right.y)
      g.lineStyle(2, 0xfff0a0, 0.95)
      g.lineBetween(cone.apex.x, cone.apex.y, cone.lineEnd.x, cone.lineEnd.y)
      return
    }
    if (run.stage === 'power') {
      const meter = castViewPowerMeter(this.castView, now, stats, this.fishingConfig)
      const w = 14
      const h = 120
      const x = this.scale.width - 28
      const y = 48
      hud.fillStyle(0x1a2838, 0.85)
      hud.fillRect(x - w / 2, y, w, h)
      const fillY = y + h * (1 - meter.fill)
      hud.fillStyle(0x5ec8ff, 0.9)
      hud.fillRect(x - w / 2 + 2, fillY, w - 4, y + h - fillY)
      const targetY = y + h * (1 - meter.target)
      hud.lineStyle(2, 0xffe066, 1)
      hud.lineBetween(x - w / 2 - 4, targetY, x + w / 2 + 4, targetY)
    }
  }

  private clearCastOverlay() {
    this.castGfx?.destroy()
    this.castGfx = null
    this.castMeterGfx?.destroy()
    this.castMeterGfx = null
    this.castView = null
  }

  private clearSilhouettes() {
    for (const img of this.fishSilhouettes) img.destroy()
    this.fishSilhouettes = []
  }

  private clearReadWaterOverlay() {
    this.clearSilhouettes()
    this.readWaterLabel?.destroy()
    this.readWaterLabel = null
  }

  private applyZoom(readWater = false) {
    const t = this.map.tileSize
    const view = readWaterTuning(this.fishingConfig)
    const wide = readWater ? view.viewTilesWide : 20
    const high = readWater ? view.viewTilesHigh : 12
    const cam = this.cameras.main
    cam.setZoom(integerZoom(this.scale.width, this.scale.height, t, wide, high))
    const mapW = this.map.width * t
    const mapH = this.map.height * t
    const b = mapCameraBounds(mapW, mapH, this.scale.width, this.scale.height, cam.zoom)
    cam.setBounds(b.x, b.y, b.width, b.height)
  }

  private drawTextures(t: number) {
    const g = this.add.graphics()
    for (const [name, color] of Object.entries(PALETTE)) {
      g.clear().fillStyle(color).fillRect(0, 0, t, t)
      if (name === 'planks') g.lineStyle(1, 0x7a5a36).lineBetween(0, t / 2, t, t / 2).lineBetween(t / 2, 0, t / 2, t / 2)
      if (name === 'water') g.fillStyle(0x4b8fbf).fillRect(3, 4, 5, 1).fillRect(9, 11, 4, 1)
      g.generateTexture(`tile-${name}`, t, t)
    }
    g.clear().fillStyle(0x0a1520).fillEllipse(t / 2, t / 2, t - 4, t - 6)
    g.generateTexture('fish-silhouette', t, t)
    for (const face of ['down', 'up', 'side'] as const) {
      g.clear()
      g.fillStyle(0x222222).fillRect(4, 0, 8, 3)
      g.fillStyle(face === 'up' ? 0x6b4a2a : 0xe0b48a).fillRect(4, 3, 8, 5)
      g.fillStyle(0xaa2222).fillRect(3, 8, 10, 6)
      g.fillStyle(0x333366).fillRect(4, 14, 3, 2).fillRect(9, 14, 3, 2)
      if (face === 'down') g.fillStyle(0x000000).fillRect(5, 5, 1, 1).fillRect(10, 5, 1, 1)
      if (face === 'side') g.fillStyle(0x000000).fillRect(10, 5, 1, 1)
      g.generateTexture(`player-${face}`, t, t)
    }
    g.destroy()
  }
}
