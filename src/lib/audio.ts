import type { ThemeId } from '../themes/themes'

export type SfxKind = 'tap' | 'correct' | 'wrong'

type ThemeAmbient = {
  frequencies: number[]
  pulseHz: number
  detune: number
}

const THEME_AMBIENT: Record<ThemeId, ThemeAmbient> = {
  trains: { frequencies: [110, 165, 220], pulseHz: 0.35, detune: 4 },
  planes: { frequencies: [146.83, 220, 293.66], pulseHz: 0.22, detune: 2 },
  dinosaurs: { frequencies: [98, 146.83, 196], pulseHz: 0.28, detune: 8 },
  farm: { frequencies: [130.81, 196, 261.63], pulseHz: 0.4, detune: 3 },
  space: { frequencies: [87.31, 130.81, 174.61], pulseHz: 0.16, detune: 6 },
  sea: { frequencies: [123.47, 164.81, 246.94], pulseHz: 0.2, detune: 3 },
}

const MUSIC_GAIN = 0.045
const DUCKED_GAIN = 0.012
const SFX_GAIN = 0.18

let ctx: AudioContext | null = null
let masterGain: GainNode | null = null
let musicGain: GainNode | null = null
let sfxGain: GainNode | null = null
let lfo: OscillatorNode | null = null
let ambientBus: GainNode | null = null
let oscillators: OscillatorNode[] = []
let unlocked = false
let musicEnabled = true
let sfxEnabled = true
let currentTheme: ThemeId = 'trains'
let ducking = false
let speechDuckDepth = 0

function ensureContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AC) return null
    ctx = new AC()
    masterGain = ctx.createGain()
    masterGain.gain.value = 1
    masterGain.connect(ctx.destination)

    musicGain = ctx.createGain()
    musicGain.gain.value = musicEnabled ? MUSIC_GAIN : 0
    musicGain.connect(masterGain)

    sfxGain = ctx.createGain()
    sfxGain.gain.value = sfxEnabled ? SFX_GAIN : 0
    sfxGain.connect(masterGain)
  }
  return ctx
}

function targetMusicLevel(): number {
  if (!musicEnabled) return 0
  return ducking ? DUCKED_GAIN : MUSIC_GAIN
}

function rampMusic(level: number, seconds = 0.35): void {
  if (!ctx || !musicGain) return
  const g = musicGain.gain
  const now = ctx.currentTime
  g.cancelScheduledValues(now)
  g.setValueAtTime(g.value, now)
  g.linearRampToValueAtTime(level, now + seconds)
}

function stopAmbientNodes(): void {
  for (const osc of oscillators) {
    try {
      osc.stop()
      osc.disconnect()
    } catch {
      /* already stopped */
    }
  }
  oscillators = []
  if (lfo) {
    try {
      lfo.stop()
      lfo.disconnect()
    } catch {
      /* already stopped */
    }
    lfo = null
  }
  if (ambientBus) {
    try {
      ambientBus.disconnect()
    } catch {
      /* noop */
    }
    ambientBus = null
  }
}

function startAmbient(theme: ThemeId): void {
  const audio = ensureContext()
  if (!audio || !musicGain || !unlocked) return

  stopAmbientNodes()
  currentTheme = theme
  const spec = THEME_AMBIENT[theme]

  ambientBus = audio.createGain()
  ambientBus.gain.value = 0.7
  ambientBus.connect(musicGain)

  // Soft tremolo on the ambient bus (does not fight musicGain ducking ramps)
  lfo = audio.createOscillator()
  lfo.type = 'sine'
  lfo.frequency.value = spec.pulseHz
  const lfoDepth = audio.createGain()
  lfoDepth.gain.value = 0.18
  lfo.connect(lfoDepth)
  lfoDepth.connect(ambientBus.gain)
  lfo.start()

  oscillators = spec.frequencies.map((freq, i) => {
    const osc = audio.createOscillator()
    osc.type = i === 0 ? 'sine' : 'triangle'
    osc.frequency.value = freq
    osc.detune.value = (i - 1) * spec.detune

    const voice = audio.createGain()
    voice.gain.value = i === 0 ? 0.55 : 0.28
    osc.connect(voice)
    voice.connect(ambientBus!)
    osc.start()
    return osc
  })

  rampMusic(targetMusicLevel(), 0.5)
}

/** Resume AudioContext after a user gesture; starts ambient if music is on. */
export async function unlockAudio(theme: ThemeId = currentTheme): Promise<void> {
  const audio = ensureContext()
  if (!audio) return
  if (audio.state === 'suspended') {
    try {
      await audio.resume()
    } catch {
      return
    }
  }
  unlocked = true
  currentTheme = theme
  if (musicEnabled) startAmbient(theme)
}

export function isAudioUnlocked(): boolean {
  return unlocked
}

export function setTheme(theme: ThemeId): void {
  currentTheme = theme
  if (!unlocked || !musicEnabled) return
  startAmbient(theme)
}

export function setMusicEnabled(enabled: boolean): void {
  musicEnabled = enabled
  if (!unlocked) return
  if (enabled) {
    startAmbient(currentTheme)
  } else {
    rampMusic(0, 0.25)
    window.setTimeout(() => {
      if (!musicEnabled) stopAmbientNodes()
    }, 280)
  }
}

export function setSfxEnabled(enabled: boolean): void {
  sfxEnabled = enabled
  if (!ctx || !sfxGain) return
  const now = ctx.currentTime
  sfxGain.gain.cancelScheduledValues(now)
  sfxGain.gain.setValueAtTime(enabled ? SFX_GAIN : 0, now)
}

export function getMusicEnabled(): boolean {
  return musicEnabled
}

export function getSfxEnabled(): boolean {
  return sfxEnabled
}

export function duckForSpeech(active: boolean): void {
  if (active) {
    speechDuckDepth += 1
  } else {
    speechDuckDepth = Math.max(0, speechDuckDepth - 1)
  }
  ducking = speechDuckDepth > 0
  if (unlocked && musicEnabled) rampMusic(targetMusicLevel(), active ? 0.12 : 0.4)
}

export function playSfx(kind: SfxKind): void {
  if (!sfxEnabled) return
  const audio = ensureContext()
  if (!audio || !sfxGain || !unlocked) return

  const now = audio.currentTime

  if (kind === 'correct') {
    const notes = [523.25, 659.25, 783.99]
    notes.forEach((freq, i) => {
      const o = audio.createOscillator()
      const g = audio.createGain()
      o.type = 'sine'
      o.frequency.value = freq
      o.connect(g)
      g.connect(sfxGain!)
      const t = now + i * 0.07
      g.gain.setValueAtTime(0.001, t)
      g.gain.exponentialRampToValueAtTime(0.4, t + 0.02)
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.22)
      o.start(t)
      o.stop(t + 0.24)
    })
    return
  }

  const osc = audio.createOscillator()
  const gain = audio.createGain()
  osc.connect(gain)
  gain.connect(sfxGain)

  if (kind === 'tap') {
    osc.type = 'sine'
    osc.frequency.setValueAtTime(520, now)
    osc.frequency.exponentialRampToValueAtTime(380, now + 0.06)
    gain.gain.setValueAtTime(0.001, now)
    gain.gain.exponentialRampToValueAtTime(0.35, now + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08)
    osc.start(now)
    osc.stop(now + 0.09)
    return
  }

  // wrong
  osc.type = 'triangle'
  osc.frequency.setValueAtTime(180, now)
  osc.frequency.exponentialRampToValueAtTime(90, now + 0.18)
  gain.gain.setValueAtTime(0.001, now)
  gain.gain.exponentialRampToValueAtTime(0.4, now + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2)
  osc.start(now)
  osc.stop(now + 0.22)
}

export function stopAudio(): void {
  stopAmbientNodes()
  speechDuckDepth = 0
  ducking = false
  if (ctx) {
    void ctx.close().catch(() => undefined)
  }
  ctx = null
  masterGain = null
  musicGain = null
  sfxGain = null
  unlocked = false
}
