import { useEffect, useRef, useState, useCallback } from 'react'
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision'

export default function useFaceDetection() {
  const faceLandmarkerRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function init() {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        )
        const faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
            delegate: 'GPU',
          },
          runningMode: 'VIDEO',
          numFaces: 1,
          outputFaceBlendshapes: true,
          outputFacialTransformationMatrixes: false,
          minFaceDetectionConfidence: 0.5,
          minFacePresenceConfidence: 0.5,
          minTrackingConfidence: 0.5,
        })

        if (!cancelled) {
          faceLandmarkerRef.current = faceLandmarker
          setIsLoading(false)
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to load face detection model:', err)
          setError(err.message)
          setIsLoading(false)
        }
      }
    }

    init()
    return () => { cancelled = true }
  }, [])

  const detect = useCallback((video, timestamp) => {
    if (!faceLandmarkerRef.current || !video) return null
    try {
      return faceLandmarkerRef.current.detectForVideo(video, timestamp)
    } catch {
      return null
    }
  }, [])

  return { detect, isLoading, error }
}
