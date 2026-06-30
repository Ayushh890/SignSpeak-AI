import { useEffect, useRef, useState, useCallback } from 'react'
import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision'

export default function useHandDetection() {
  const handLandmarkerRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function init() {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        )
        const handLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
            delegate: 'GPU',
          },
          runningMode: 'VIDEO',
          numHands: 2,
          minHandDetectionConfidence: 0.5,
          minHandPresenceConfidence: 0.5,
          minTrackingConfidence: 0.5,
        })

        if (!cancelled) {
          handLandmarkerRef.current = handLandmarker
          setIsLoading(false)
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to load hand detection model:', err)
          setError(err.message)
          setIsLoading(false)
        }
      }
    }

    init()
    return () => { cancelled = true }
  }, [])

  const detect = useCallback((video, timestamp) => {
    if (!handLandmarkerRef.current || !video) return null
    try {
      return handLandmarkerRef.current.detectForVideo(video, timestamp)
    } catch {
      return null
    }
  }, [])

  return { detect, isLoading, error }
}
