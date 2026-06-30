function isFingerExtended(landmarks, finger) {
  const tips = { thumb: 4, index: 8, middle: 12, ring: 16, pinky: 20 }
  const pips = { thumb: 3, index: 6, middle: 10, ring: 14, pinky: 18 }
  const mcps = { thumb: 2, index: 5, middle: 9, ring: 13, pinky: 17 }

  const tip = landmarks[tips[finger]]
  const pip = landmarks[pips[finger]]
  const mcp = landmarks[mcps[finger]]

  if (finger === 'thumb') {
    return Math.abs(tip.x - mcp.x) > Math.abs(pip.x - mcp.x) * 1.2
  }
  return tip.y < pip.y
}

function getFingerStates(landmarks) {
  return {
    thumb: isFingerExtended(landmarks, 'thumb'),
    index: isFingerExtended(landmarks, 'index'),
    middle: isFingerExtended(landmarks, 'middle'),
    ring: isFingerExtended(landmarks, 'ring'),
    pinky: isFingerExtended(landmarks, 'pinky'),
  }
}

function distance(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2)
}

function areTouching(landmarks, i, j, threshold = 0.05) {
  return distance(landmarks[i], landmarks[j]) < threshold
}

export function recognizeSign(landmarks) {
  if (!landmarks || landmarks.length < 21) return null

  const f = getFingerStates(landmarks)
  const allDown = !f.index && !f.middle && !f.ring && !f.pinky

  // A — fist with thumb to the side
  if (allDown && f.thumb) {
    return { sign: 'A', confidence: 0.85 }
  }

  // B — all fingers up, thumb tucked
  if (f.index && f.middle && f.ring && f.pinky && !f.thumb) {
    return { sign: 'B', confidence: 0.85 }
  }

  // C — curved hand (all fingers partially bent in same direction)
  // Simplified: check if fingertips form a curve
  if (!f.index && !f.middle && !f.ring && !f.pinky && !f.thumb) {
    const tipSpread = distance(landmarks[8], landmarks[4])
    if (tipSpread > 0.08 && tipSpread < 0.18) {
      return { sign: 'C', confidence: 0.7 }
    }
  }

  // D — index up, others touch thumb
  if (f.index && !f.middle && !f.ring && !f.pinky) {
    if (areTouching(landmarks, 4, 12, 0.06)) {
      return { sign: 'D', confidence: 0.8 }
    }
  }

  // E — all fingers curled, thumb tucked
  if (!f.thumb && !f.index && !f.middle && !f.ring && !f.pinky) {
    return { sign: 'E', confidence: 0.65 }
  }

  // F — index and thumb touch, others extended
  if (areTouching(landmarks, 4, 8, 0.06) && f.middle && f.ring && f.pinky) {
    return { sign: 'F', confidence: 0.85 }
  }

  // G — index pointing sideways, thumb parallel
  if (f.index && !f.middle && !f.ring && !f.pinky && f.thumb) {
    const indexDir = landmarks[8].x - landmarks[5].x
    if (Math.abs(indexDir) > 0.05) {
      return { sign: 'G', confidence: 0.7 }
    }
  }

  // I — pinky up only
  if (!f.index && !f.middle && !f.ring && f.pinky && !f.thumb) {
    return { sign: 'I', confidence: 0.85 }
  }

  // K — index and middle up, spread, thumb between
  if (f.index && f.middle && !f.ring && !f.pinky) {
    const spread = distance(landmarks[8], landmarks[12])
    if (spread > 0.06) {
      return { sign: 'K', confidence: 0.75 }
    }
  }

  // L — L shape: index up, thumb out
  if (f.index && f.thumb && !f.middle && !f.ring && !f.pinky) {
    const angle = Math.abs(landmarks[4].x - landmarks[8].x)
    if (angle > 0.06) {
      return { sign: 'L', confidence: 0.85 }
    }
  }

  // O — all fingertips touch thumb
  if (areTouching(landmarks, 4, 8, 0.06) &&
      areTouching(landmarks, 4, 12, 0.08)) {
    return { sign: 'O', confidence: 0.7 }
  }

  // R — index and middle crossed
  if (f.index && f.middle && !f.ring && !f.pinky) {
    const crossed = landmarks[8].x - landmarks[12].x
    if (Math.abs(crossed) < 0.02) {
      return { sign: 'R', confidence: 0.7 }
    }
  }

  // U — index and middle up together
  if (f.index && f.middle && !f.ring && !f.pinky) {
    return { sign: 'U', confidence: 0.75 }
  }

  // V — peace sign
  if (f.index && f.middle && !f.ring && !f.pinky) {
    const spread = distance(landmarks[8], landmarks[12])
    if (spread > 0.08) {
      return { sign: 'V', confidence: 0.85 }
    }
  }

  // W — index, middle, ring up
  if (f.index && f.middle && f.ring && !f.pinky) {
    return { sign: 'W', confidence: 0.8 }
  }

  // Y — thumb and pinky out
  if (f.thumb && f.pinky && !f.index && !f.middle && !f.ring) {
    return { sign: 'Y', confidence: 0.85 }
  }

  // 5 / Open hand — all fingers extended
  if (f.thumb && f.index && f.middle && f.ring && f.pinky) {
    return { sign: 'OPEN_HAND', confidence: 0.9 }
  }

  // Thumbs up
  if (f.thumb && !f.index && !f.middle && !f.ring && !f.pinky) {
    if (landmarks[4].y < landmarks[3].y) {
      return { sign: 'THUMBS_UP', confidence: 0.9 }
    }
  }

  // Fist
  if (!f.thumb && !f.index && !f.middle && !f.ring && !f.pinky) {
    return { sign: 'FIST', confidence: 0.8 }
  }

  // Point — index only
  if (f.index && !f.middle && !f.ring && !f.pinky) {
    return { sign: 'POINT', confidence: 0.8 }
  }

  return null
}

export function getSignDisplayName(sign) {
  const names = {
    OPEN_HAND: 'Open Hand (5)',
    THUMBS_UP: 'Thumbs Up',
    FIST: 'Fist (S)',
    POINT: 'Point (1)',
  }
  return names[sign] || sign
}
