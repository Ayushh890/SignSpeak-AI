const BLENDSHAPE_EMOTIONS = {
  happy: ['mouthSmileLeft', 'mouthSmileRight', 'cheekSquintLeft', 'cheekSquintRight'],
  sad: ['mouthFrownLeft', 'mouthFrownRight', 'browInnerUp'],
  angry: ['browDownLeft', 'browDownRight', 'mouthShrugLower', 'noseSneerLeft', 'noseSneerRight'],
  surprise: ['browInnerUp', 'browOuterUpLeft', 'browOuterUpRight', 'jawOpen', 'eyeWideLeft', 'eyeWideRight'],
  fear: ['browInnerUp', 'eyeWideLeft', 'eyeWideRight', 'mouthFrownLeft', 'mouthFrownRight'],
}

export function recognizeEmotion(blendshapes) {
  if (!blendshapes || blendshapes.length === 0) return null

  const shapes = {}
  for (const bs of blendshapes) {
    shapes[bs.categoryName] = bs.score
  }

  const scores = {}
  for (const [emotion, keys] of Object.entries(BLENDSHAPE_EMOTIONS)) {
    let sum = 0
    let count = 0
    for (const key of keys) {
      if (shapes[key] !== undefined) {
        sum += shapes[key]
        count++
      }
    }
    scores[emotion] = count > 0 ? sum / count : 0
  }

  const mouthOpen = shapes['jawOpen'] || 0
  const eyeBlink = ((shapes['eyeBlinkLeft'] || 0) + (shapes['eyeBlinkRight'] || 0)) / 2

  let bestEmotion = 'neutral'
  let bestScore = 0.15

  for (const [emotion, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score
      bestEmotion = emotion
    }
  }

  return {
    emotion: bestEmotion,
    confidence: Math.min(bestScore * 2, 1),
    details: {
      mouthOpen: mouthOpen > 0.3,
      eyesClosed: eyeBlink > 0.5,
      scores,
    },
  }
}

export function getEmotionEmoji(emotion) {
  const emojis = {
    happy: '😊',
    sad: '😢',
    angry: '😡',
    surprise: '😲',
    fear: '😨',
    neutral: '😐',
  }
  return emojis[emotion] || '😐'
}

export function extractLipLandmarks(faceLandmarks) {
  if (!faceLandmarks || faceLandmarks.length === 0) return null

  const outerLipIndices = [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95, 78]
  const innerLipIndices = [78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308, 291, 375, 321, 405, 314, 17, 84, 181, 91, 146, 61]

  const landmarks = faceLandmarks[0]

  const outerLip = outerLipIndices.map(i => landmarks[i]).filter(Boolean)
  const innerLip = innerLipIndices.map(i => landmarks[i]).filter(Boolean)

  const upperLip = landmarks[13]
  const lowerLip = landmarks[14]

  let lipDistance = 0
  if (upperLip && lowerLip) {
    lipDistance = Math.sqrt(
      (upperLip.x - lowerLip.x) ** 2 +
      (upperLip.y - lowerLip.y) ** 2
    )
  }

  const lipState = lipDistance > 0.04 ? 'open' : lipDistance > 0.02 ? 'slightly_open' : 'closed'

  return {
    outerLip,
    innerLip,
    lipDistance,
    lipState,
  }
}
