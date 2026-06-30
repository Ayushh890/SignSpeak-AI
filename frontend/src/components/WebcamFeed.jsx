import { useRef, useEffect, useCallback, useState } from 'react'
import useHandDetection from '../hooks/useHandDetection'
import useFaceDetection from '../hooks/useFaceDetection'
import usePoseDetection from '../hooks/usePoseDetection'
import { drawHandLandmarks } from '../utils/drawUtils'
import { drawFaceLandmarks } from '../utils/drawFace'
import { recognizeSign, getSignDisplayName } from '../utils/signRecognition'
import { recognizeEmotion, getEmotionEmoji, extractLipLandmarks } from '../utils/emotionRecognition'
import { recognizePoseGesture, drawPoseLandmarks } from '../utils/poseRecognition'
import { fuseModalities } from '../utils/fusionEngine'
import { useApp } from '../context/AppContext'

export default function WebcamFeed() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const animFrameRef = useRef(null)
  const lastTimestampRef = useRef(-1)
  const fpsCounterRef = useRef({ frames: 0, lastTime: performance.now() })

  const { detect: detectHands, isLoading: handsLoading, error: handsError } = useHandDetection()
  const { detect: detectFace, isLoading: faceLoading, error: faceError } = useFaceDetection()
  const { detect: detectPose, isLoading: poseLoading, error: poseError } = usePoseDetection()
  const { state, dispatch } = useApp()
  const [cameraReady, setCameraReady] = useState(false)

  const isLoading = handsLoading || faceLoading || poseLoading
  const error = handsError || faceError || poseError

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.addEventListener('loadeddata', () => setCameraReady(true))
      }
    } catch (err) {
      console.error('Camera access denied:', err)
    }
  }, [])

  useEffect(() => {
    startCamera()
    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((t) => t.stop())
      }
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [startCamera])

  useEffect(() => {
    if (!cameraReady || isLoading || !state.isDetecting) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      return
    }

    function processFrame() {
      const video = videoRef.current
      const canvas = canvasRef.current
      if (!video || !canvas || video.readyState < 2) {
        animFrameRef.current = requestAnimationFrame(processFrame)
        return
      }

      const now = performance.now()
      if (now === lastTimestampRef.current) {
        animFrameRef.current = requestAnimationFrame(processFrame)
        return
      }
      lastTimestampRef.current = now

      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const handResult = detectHands(video, now)
      if (handResult?.landmarks?.length > 0) {
        const hands = handResult.landmarks.map((landmarks, i) => ({
          landmarks,
          handedness: handResult.handednesses?.[i]?.[0]?.categoryName || 'Unknown',
        }))
        drawHandLandmarks(ctx, hands, canvas.width, canvas.height)
        dispatch({ type: 'SET_HANDS_DETECTED', payload: hands.length })

        const recognition = recognizeSign(handResult.landmarks[0])
        if (recognition) {
          dispatch({
            type: 'SET_DETECTED_SIGN',
            payload: { sign: getSignDisplayName(recognition.sign), confidence: recognition.confidence },
          })
        }
      } else {
        dispatch({ type: 'SET_HANDS_DETECTED', payload: 0 })
      }

      const faceResult = detectFace(video, now + 1)
      if (faceResult?.faceLandmarks?.length > 0) {
        dispatch({ type: 'SET_FACE_DETECTED', payload: true })
        drawFaceLandmarks(ctx, faceResult.faceLandmarks, canvas.width, canvas.height)

        if (faceResult.faceBlendshapes?.[0]?.categories) {
          const emotionResult = recognizeEmotion(faceResult.faceBlendshapes[0].categories)
          if (emotionResult) {
            dispatch({ type: 'SET_EMOTION', payload: emotionResult })
          }
        }

        const lipData = extractLipLandmarks(faceResult.faceLandmarks)
        if (lipData) {
          dispatch({ type: 'SET_LIP_STATE', payload: lipData.lipState })
        }
      } else {
        dispatch({ type: 'SET_FACE_DETECTED', payload: false })
      }

      const poseResult = detectPose(video, now + 2)
      if (poseResult?.landmarks?.length > 0) {
        dispatch({ type: 'SET_POSE_DETECTED', payload: true })
        drawPoseLandmarks(ctx, poseResult.landmarks[0], canvas.width, canvas.height)

        const poseGesture = recognizePoseGesture(poseResult.landmarks[0])
        if (poseGesture) {
          dispatch({ type: 'SET_POSE_GESTURE', payload: poseGesture })
        }
      } else {
        dispatch({ type: 'SET_POSE_DETECTED', payload: false })
      }

      const fused = fuseModalities({
        sign: state.detectedSign,
        signConfidence: state.confidence,
        emotion: state.emotion,
        emotionConfidence: state.emotionConfidence,
        lipState: state.lipState,
        poseGesture: state.poseGesture,
      })
      if (fused.primarySign || fused.components.length > 1) {
        dispatch({ type: 'SET_FUSED_OUTPUT', payload: fused })
      }

      fpsCounterRef.current.frames++
      if (now - fpsCounterRef.current.lastTime >= 1000) {
        dispatch({ type: 'SET_FPS', payload: fpsCounterRef.current.frames })
        fpsCounterRef.current = { frames: 0, lastTime: now }
      }

      animFrameRef.current = requestAnimationFrame(processFrame)
    }

    processFrame()
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [cameraReady, isLoading, state.isDetecting, detectHands, detectFace, detectPose, dispatch])

  if (error) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-900 rounded-xl border border-red-800">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-2">Failed to load AI model</p>
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative rounded-xl overflow-hidden bg-black">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-auto transform -scale-x-100"
        width={640}
        height={480}
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full transform -scale-x-100 pointer-events-none"
        width={640}
        height={480}
      />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-950/80">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-300">Loading AI models...</p>
            <p className="text-gray-500 text-xs mt-1">
              {handsLoading && 'Hands '}
              {faceLoading && 'Face '}
              {poseLoading && 'Pose'}
            </p>
          </div>
        </div>
      )}

      <div className="absolute top-3 left-3 flex items-center gap-2">
        <span className={`w-2.5 h-2.5 rounded-full ${state.isDetecting ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
        <span className="text-xs text-gray-300 bg-gray-900/70 px-2 py-1 rounded">
          {state.isDetecting ? `${state.fps} FPS` : 'Paused'}
        </span>
      </div>

      <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
        {state.handsDetected > 0 && (
          <span className="text-xs bg-primary-600/80 text-white px-2 py-1 rounded">
            {state.handsDetected} hand{state.handsDetected > 1 ? 's' : ''}
          </span>
        )}
        {state.faceDetected && (
          <span className="text-xs bg-green-600/80 text-white px-2 py-1 rounded">
            Face
          </span>
        )}
        {state.emotion && state.faceDetected && (
          <span className="text-xs bg-yellow-600/80 text-white px-2 py-1 rounded">
            {getEmotionEmoji(state.emotion)} {state.emotion}
          </span>
        )}
        {state.lipState && state.faceDetected && (
          <span className="text-xs bg-pink-600/80 text-white px-2 py-1 rounded">
            Lips: {state.lipState}
          </span>
        )}
        {state.poseGesture && state.poseDetected && (
          <span className="text-xs bg-orange-600/80 text-white px-2 py-1 rounded">
            {state.poseGesture.label}
          </span>
        )}
      </div>
    </div>
  )
}
