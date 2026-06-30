const HAND_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [0, 9], [9, 10], [10, 11], [11, 12],
  [0, 13], [13, 14], [14, 15], [15, 16],
  [0, 17], [17, 18], [18, 19], [19, 20],
  [5, 9], [9, 13], [13, 17],
]

export function drawHandLandmarks(ctx, landmarks, width, height) {
  if (!landmarks || landmarks.length === 0) return

  ctx.clearRect(0, 0, width, height)

  for (const hand of landmarks) {
    const points = hand.landmarks

    for (const [start, end] of HAND_CONNECTIONS) {
      const p1 = points[start]
      const p2 = points[end]
      ctx.beginPath()
      ctx.moveTo(p1.x * width, p1.y * height)
      ctx.lineTo(p2.x * width, p2.y * height)
      ctx.strokeStyle = '#818cf8'
      ctx.lineWidth = 2
      ctx.stroke()
    }

    for (let i = 0; i < points.length; i++) {
      const p = points[i]
      const x = p.x * width
      const y = p.y * height

      ctx.beginPath()
      ctx.arc(x, y, 4, 0, 2 * Math.PI)
      ctx.fillStyle = i === 0 ? '#f472b6' : i % 4 === 0 ? '#34d399' : '#6366f1'
      ctx.fill()
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 1
      ctx.stroke()
    }
  }
}
