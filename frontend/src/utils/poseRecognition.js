const POSE_LANDMARKS = {
  NOSE: 0,
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28,
}

function angle(a, b, c) {
  const ba = { x: a.x - b.x, y: a.y - b.y }
  const bc = { x: c.x - b.x, y: c.y - b.y }
  const dot = ba.x * bc.x + ba.y * bc.y
  const magBA = Math.sqrt(ba.x ** 2 + ba.y ** 2)
  const magBC = Math.sqrt(bc.x ** 2 + bc.y ** 2)
  if (magBA === 0 || magBC === 0) return 0
  return Math.acos(Math.min(1, Math.max(-1, dot / (magBA * magBC)))) * (180 / Math.PI)
}

export function recognizePoseGesture(landmarks) {
  if (!landmarks || landmarks.length < 29) return null

  const lm = landmarks
  const nose = lm[POSE_LANDMARKS.NOSE]
  const lShoulder = lm[POSE_LANDMARKS.LEFT_SHOULDER]
  const rShoulder = lm[POSE_LANDMARKS.RIGHT_SHOULDER]
  const lElbow = lm[POSE_LANDMARKS.LEFT_ELBOW]
  const rElbow = lm[POSE_LANDMARKS.RIGHT_ELBOW]
  const lWrist = lm[POSE_LANDMARKS.LEFT_WRIST]
  const rWrist = lm[POSE_LANDMARKS.RIGHT_WRIST]
  const lHip = lm[POSE_LANDMARKS.LEFT_HIP]
  const rHip = lm[POSE_LANDMARKS.RIGHT_HIP]

  const lArmAngle = angle(lShoulder, lElbow, lWrist)
  const rArmAngle = angle(rShoulder, rElbow, rWrist)

  const bothArmsUp = lWrist.y < lShoulder.y && rWrist.y < rShoulder.y
  const leftArmUp = lWrist.y < lShoulder.y - 0.1
  const rightArmUp = rWrist.y < rShoulder.y - 0.1

  const shoulderMid = { x: (lShoulder.x + rShoulder.x) / 2, y: (lShoulder.y + rShoulder.y) / 2 }
  const hipMid = { x: (lHip.x + rHip.x) / 2, y: (lHip.y + rHip.y) / 2 }
  const torsoTilt = Math.abs(shoulderMid.x - hipMid.x)

  if (bothArmsUp && lArmAngle > 150 && rArmAngle > 150) {
    return { gesture: 'HANDS_UP', confidence: 0.9, label: 'Hands Raised' }
  }

  if (bothArmsUp && lArmAngle < 120 && rArmAngle < 120) {
    return { gesture: 'WAVE', confidence: 0.75, label: 'Waving' }
  }

  const wristDist = Math.sqrt((lWrist.x - rWrist.x) ** 2 + (lWrist.y - rWrist.y) ** 2)
  if (wristDist < 0.08 && lWrist.y > lShoulder.y && lWrist.y < lHip.y) {
    return { gesture: 'FOLDED_HANDS', confidence: 0.8, label: 'Folded Hands' }
  }

  if (rightArmUp && rArmAngle > 150 && !leftArmUp) {
    return { gesture: 'RIGHT_HAND_RAISE', confidence: 0.8, label: 'Right Hand Raised' }
  }
  if (leftArmUp && lArmAngle > 150 && !rightArmUp) {
    return { gesture: 'LEFT_HAND_RAISE', confidence: 0.8, label: 'Left Hand Raised' }
  }

  if (nose.y > shoulderMid.y + 0.05) {
    return { gesture: 'BOW', confidence: 0.7, label: 'Bowing' }
  }

  if (torsoTilt > 0.08) {
    return { gesture: 'LEAN', confidence: 0.65, label: 'Leaning' }
  }

  return { gesture: 'STANDING', confidence: 0.9, label: 'Standing' }
}

const POSE_CONNECTIONS = [
  [11, 12], [11, 13], [13, 15], [12, 14], [14, 16],
  [11, 23], [12, 24], [23, 24], [23, 25], [24, 26],
  [25, 27], [26, 28],
]

export function drawPoseLandmarks(ctx, landmarks, width, height) {
  if (!landmarks || landmarks.length === 0) return

  for (const [start, end] of POSE_CONNECTIONS) {
    const p1 = landmarks[start]
    const p2 = landmarks[end]
    if (!p1 || !p2) continue
    ctx.beginPath()
    ctx.moveTo(p1.x * width, p1.y * height)
    ctx.lineTo(p2.x * width, p2.y * height)
    ctx.strokeStyle = '#f97316'
    ctx.lineWidth = 2.5
    ctx.stroke()
  }

  for (let i = 11; i <= 28; i++) {
    const p = landmarks[i]
    if (!p) continue
    ctx.beginPath()
    ctx.arc(p.x * width, p.y * height, 5, 0, 2 * Math.PI)
    ctx.fillStyle = '#fb923c'
    ctx.fill()
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 1
    ctx.stroke()
  }
}
