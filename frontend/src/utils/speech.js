const LANG_CODES = {
  en: 'en-US',
  hi: 'hi-IN',
  fr: 'fr-FR',
  es: 'es-ES',
  ja: 'ja-JP',
  de: 'de-DE',
  pt: 'pt-BR',
  ar: 'ar-SA',
}

let currentUtterance = null

export function speak(text, language = 'en', onStart, onEnd) {
  if (!window.speechSynthesis || !text) return

  stop()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = LANG_CODES[language] || language
  utterance.rate = 0.9
  utterance.pitch = 1.0
  utterance.volume = 1.0

  const voices = window.speechSynthesis.getVoices()
  const langCode = LANG_CODES[language] || language
  const voice = voices.find(v => v.lang.startsWith(langCode.split('-')[0]))
  if (voice) utterance.voice = voice

  utterance.onstart = () => onStart?.()
  utterance.onend = () => { currentUtterance = null; onEnd?.() }
  utterance.onerror = () => { currentUtterance = null; onEnd?.() }

  currentUtterance = utterance
  window.speechSynthesis.speak(utterance)
}

export function stop() {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel()
  }
  currentUtterance = null
}

export function isSpeaking() {
  return window.speechSynthesis?.speaking || false
}

export function getAvailableVoices(language) {
  if (!window.speechSynthesis) return []
  const langCode = LANG_CODES[language] || language
  return window.speechSynthesis.getVoices().filter(v =>
    v.lang.startsWith(langCode.split('-')[0])
  )
}
