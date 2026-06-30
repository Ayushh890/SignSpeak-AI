const FACE_OVAL = [
  10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379,
  378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127,
  162, 21, 54, 103, 67, 109, 10,
]

const LIPS_OUTER = [
  61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 308, 324, 318, 402,
  317, 14, 87, 178, 88, 95, 78, 61,
]

const LEFT_EYE = [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246, 33]
const RIGHT_EYE = [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398, 362]

const LEFT_EYEBROW = [70, 63, 105, 66, 107, 55, 65, 52, 53, 46]
const RIGHT_EYEBROW = [300, 293, 334, 296, 336, 285, 295, 282, 283, 276]

function drawPath(ctx, landmarks, indices, width, height, color, lineWidth = 1) {
  if (!landmarks || indices.length < 2) return
  ctx.beginPath()
  const first = landmarks[indices[0]]
  if (!first) return
  ctx.moveTo(first.x * width, first.y * height)
  for (let i = 1; i < indices.length; i++) {
    const p = landmarks[indices[i]]
    if (p) ctx.lineTo(p.x * width, p.y * height)
  }
  ctx.strokeStyle = color
  ctx.lineWidth = lineWidth
  ctx.stroke()
}

export function drawFaceLandmarks(ctx, faceLandmarks, width, height) {
  if (!faceLandmarks || faceLandmarks.length === 0) return

  const landmarks = faceLandmarks[0]

  drawPath(ctx, landmarks, FACE_OVAL, width, height, '#4ade80', 1.5)
  drawPath(ctx, landmarks, LIPS_OUTER, width, height, '#f472b6', 2)
  drawPath(ctx, landmarks, LEFT_EYE, width, height, '#60a5fa', 1.5)
  drawPath(ctx, landmarks, RIGHT_EYE, width, height, '#60a5fa', 1.5)
  drawPath(ctx, landmarks, LEFT_EYEBROW, width, height, '#fbbf24', 1.5)
  drawPath(ctx, landmarks, RIGHT_EYEBROW, width, height, '#fbbf24', 1.5)
}
