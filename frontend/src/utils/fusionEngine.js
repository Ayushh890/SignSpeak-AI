const EMOTION_MODIFIERS = {
  happy: { intensifier: 'happily', suffix: '!' },
  sad: { intensifier: 'sadly', suffix: '...' },
  angry: { intensifier: 'angrily', suffix: '!' },
  surprise: { intensifier: 'surprisingly', suffix: '!' },
  fear: { intensifier: 'fearfully', suffix: '...' },
  neutral: { intensifier: '', suffix: '.' },
}

const SIGN_MEANINGS = {
  A: 'A',
  B: 'B',
  C: 'C',
  D: 'D',
  E: 'E',
  F: 'F',
  G: 'G',
  I: 'I',
  K: 'K',
  L: 'L',
  O: 'O',
  R: 'R',
  U: 'U',
  V: 'V',
  W: 'W',
  Y: 'Y',
  'Open Hand (5)': 'Hello',
  'Thumbs Up': 'Good',
  'Fist (S)': 'Strong',
  'Point (1)': 'You',
}

const POSE_CONTEXT = {
  WAVE: 'greeting',
  BOW: 'respectful',
  HANDS_UP: 'excited',
  FOLDED_HANDS: 'please/prayer',
  RIGHT_HAND_RAISE: 'attention',
  LEFT_HAND_RAISE: 'attention',
  LEAN: 'interested',
  STANDING: 'neutral',
}

export function fuseModalities({ sign, signConfidence, emotion, emotionConfidence, lipState, poseGesture }) {
  const result = {
    primarySign: null,
    enhancedMeaning: null,
    emotionContext: null,
    poseContext: null,
    confidence: 0,
    components: [],
  }

  if (sign) {
    const meaning = SIGN_MEANINGS[sign] || sign
    result.primarySign = meaning
    result.confidence = signConfidence || 0
    result.components.push({ type: 'hand', value: sign, confidence: signConfidence })
  }

  if (emotion && emotion !== 'neutral') {
    const mod = EMOTION_MODIFIERS[emotion] || EMOTION_MODIFIERS.neutral
    result.emotionContext = {
      emotion,
      intensifier: mod.intensifier,
      suffix: mod.suffix,
      confidence: emotionConfidence,
    }
    result.components.push({ type: 'emotion', value: emotion, confidence: emotionConfidence })
  }

  if (poseGesture) {
    const context = POSE_CONTEXT[poseGesture.gesture] || 'neutral'
    result.poseContext = {
      gesture: poseGesture.gesture,
      label: poseGesture.label,
      context,
      confidence: poseGesture.confidence,
    }
    result.components.push({ type: 'pose', value: poseGesture.label, confidence: poseGesture.confidence })
  }

  if (lipState) {
    result.components.push({ type: 'lips', value: lipState, confidence: 0.7 })
  }

  result.enhancedMeaning = buildEnhancedMeaning(result)

  if (result.components.length > 0) {
    const totalWeight = result.components.reduce((sum, c) => sum + c.confidence, 0)
    result.confidence = totalWeight / result.components.length
  }

  return result
}

function buildEnhancedMeaning(result) {
  if (!result.primarySign) return null

  let meaning = result.primarySign

  if (result.primarySign === 'Hello' && result.poseContext?.context === 'greeting') {
    meaning = 'Hello! (waving)'
  } else if (result.primarySign === 'Good' && result.emotionContext?.emotion === 'happy') {
    meaning = 'Very good!'
  } else if (result.primarySign === 'Strong' && result.emotionContext?.emotion === 'angry') {
    meaning = 'No / Stop!'
  } else if (result.poseContext?.context === 'respectful') {
    meaning = `${meaning} (respectfully)`
  } else if (result.poseContext?.context === 'please/prayer') {
    meaning = `Please, ${meaning.toLowerCase()}`
  }

  if (result.emotionContext) {
    meaning += result.emotionContext.suffix
  }

  return meaning
}
