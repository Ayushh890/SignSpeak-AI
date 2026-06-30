import { useEffect, useRef, useState, useCallback } from 'react'
import { PoseLandmarker, FilesetResolver } from '@mediapipe/tasks-vision'

export default function usePoseDetection() {
  const poseLandmarkerRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function init() {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        )
        const poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
            delegate: 'GPU',
          },
          runningMode: 'VIDEO',
          numPoses: 1,
          minPoseDetectionConfidence: 0.5,
          minPosePresenceConfidence: 0.5,
          minTrackingConfidence: 0.5,
        })

        if (!cancelled) {
          poseLandmarkerRef.current = poseLandmarker
          setIsLoading(false)
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to load pose detection model:', err)
          setError(err.message)
          setIsLoading(false)
        }
      }
    }

    init()
    return () => { cancelled = true }
  }, [])

  const detect = useCallback((video, timestamp) => {
    if (!poseLandmarkerRef.current || !video) return null
    try {
      return poseLandmarkerRef.current.detectForVideo(video, timestamp)
    } catch {
      return null
    }
  }, [])

  return { detect, isLoading, error }
}
