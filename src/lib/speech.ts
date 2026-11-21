import { duckForSpeech } from './audio'

let preferredVoice: SpeechSynthesisVoice | null = null
let voicesReady = false
let duckingActive = false

function loadVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !window.speechSynthesis) return []
  return window.speechSynthesis.getVoices()
}

function pickEnGbVoice(): SpeechSynthesisVoice | null {
  const voices = loadVoices()
  if (!voices.length) return null

  const enGb = voices.filter((v) => /^en-GB/i.test(v.lang) || /British|UK|England/i.test(v.name))
  const en = voices.filter((v) => /^en/i.test(v.lang))
  const pool = enGb.length ? enGb : en
  if (!pool.length) return voices[0] ?? null

  const preferred = pool.find((v) => /Female|Samantha|Google UK English Female|Karen|Serena/i.test(v.name))
  return preferred ?? pool[0] ?? null
}

function beginDuck(): void {
  if (duckingActive) return
  duckingActive = true
  duckForSpeech(true)
}

function endDuck(): void {
  if (!duckingActive) return
  duckingActive = false
  duckForSpeech(false)
}

export function initSpeech(): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  const assign = () => {
    preferredVoice = pickEnGbVoice()
    voicesReady = true
  }
  assign()
  window.speechSynthesis.onvoiceschanged = assign
}

export function isSpeechAvailable(): boolean {
  return typeof window !== 'undefined' && !!window.speechSynthesis
}

function speakRaw(text: string, rate = 0.85): void {
  if (!isSpeechAvailable()) return
  if (!voicesReady) preferredVoice = pickEnGbVoice()

  window.speechSynthesis.cancel()
  endDuck()

  const utter = new SpeechSynthesisUtterance(text)
  utter.lang = preferredVoice?.lang ?? 'en-GB'
  utter.rate = rate
  utter.pitch = 1.05
  if (preferredVoice) utter.voice = preferredVoice
  beginDuck()
  utter.onend = () => endDuck()
  utter.onerror = () => endDuck()
  window.speechSynthesis.speak(utter)
}

/** Speak a phoneme cue (e.g. "sss", "mmm") slowly for matching */
export function speakPhoneme(sound: string): void {
  speakRaw(sound, 0.7)
}

/** Speak a whole word */
export function speakWord(word: string): void {
  speakRaw(word, 0.9)
}

/** Sound out then blend: "s… a… t… sat" */
export async function speakBlend(sounds: string[], word: string): Promise<void> {
  if (!isSpeechAvailable()) return
  window.speechSynthesis.cancel()
  endDuck()
  beginDuck()

  try {
    for (const sound of sounds) {
      await speakAndWait(sound, 0.65)
      await pause(220)
    }
    await pause(180)
    await speakAndWait(word, 0.9)
  } finally {
    endDuck()
  }
}

function speakAndWait(text: string, rate: number): Promise<void> {
  return new Promise((resolve) => {
    if (!isSpeechAvailable()) {
      resolve()
      return
    }
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = preferredVoice?.lang ?? 'en-GB'
    utter.rate = rate
    utter.pitch = 1.05
    if (preferredVoice) utter.voice = preferredVoice
    utter.onend = () => resolve()
    utter.onerror = () => resolve()
    window.speechSynthesis.speak(utter)
  })
}

function pause(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function stopSpeech(): void {
  if (isSpeechAvailable()) window.speechSynthesis.cancel()
  endDuck()
}
