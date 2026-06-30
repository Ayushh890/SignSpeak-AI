import { createContext, useContext, useReducer } from 'react'

const AppContext = createContext(null)

const initialState = {
  isDetecting: false,
  detectedSign: null,
  confidence: 0,
  sentence: [],
  translatedSentence: '',
  targetLanguage: 'en',
  history: [],
  fps: 0,
  handsDetected: 0,
  emotion: null,
  emotionConfidence: 0,
  lipState: null,
  faceDetected: false,
  poseDetected: false,
  poseGesture: null,
  fusedOutput: null,
  isSpeaking: false,
}

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_DETECTING':
      return { ...state, isDetecting: action.payload }
    case 'SET_DETECTED_SIGN':
      return {
        ...state,
        detectedSign: action.payload.sign,
        confidence: action.payload.confidence,
      }
    case 'ADD_TO_SENTENCE':
      return { ...state, sentence: [...state.sentence, action.payload] }
    case 'CLEAR_SENTENCE':
      return { ...state, sentence: [], translatedSentence: '' }
    case 'SET_TRANSLATED_SENTENCE':
      return { ...state, translatedSentence: action.payload }
    case 'SET_TARGET_LANGUAGE':
      return { ...state, targetLanguage: action.payload }
    case 'ADD_TO_HISTORY':
      return { ...state, history: [action.payload, ...state.history].slice(0, 100) }
    case 'SET_FPS':
      return { ...state, fps: action.payload }
    case 'SET_HANDS_DETECTED':
      return { ...state, handsDetected: action.payload }
    case 'SET_EMOTION':
      return {
        ...state,
        emotion: action.payload.emotion,
        emotionConfidence: action.payload.confidence,
      }
    case 'SET_LIP_STATE':
      return { ...state, lipState: action.payload }
    case 'SET_FACE_DETECTED':
      return { ...state, faceDetected: action.payload }
    case 'SET_POSE_DETECTED':
      return { ...state, poseDetected: action.payload }
    case 'SET_POSE_GESTURE':
      return { ...state, poseGesture: action.payload }
    case 'SET_FUSED_OUTPUT':
      return { ...state, fusedOutput: action.payload }
    case 'SET_SPEAKING':
      return { ...state, isSpeaking: action.payload }
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}
