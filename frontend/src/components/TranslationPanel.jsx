import { useCallback } from 'react'
import { useApp } from '../context/AppContext'
import { getEmotionEmoji } from '../utils/emotionRecognition'
import { buildSentence, predictNextSign } from '../utils/contextEngine'
import { translateText } from '../utils/translate'
import { speak, stop as stopSpeech } from '../utils/speech'

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
  { code: 'fr', name: 'French' },
  { code: 'es', name: 'Spanish' },
  { code: 'ja', name: 'Japanese' },
  { code: 'de', name: 'German' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ar', name: 'Arabic' },
]

export default function TranslationPanel() {
  const { state, dispatch } = useApp()

  const addToSentence = useCallback(() => {
    const text = state.fusedOutput?.enhancedMeaning || state.detectedSign
    if (text) {
      dispatch({ type: 'ADD_TO_SENTENCE', payload: text })
    }
  }, [state.fusedOutput, state.detectedSign, dispatch])

  const clearSentence = () => {
    stopSpeech()
    dispatch({ type: 'CLEAR_SENTENCE' })
  }

  const handleTranslate = useCallback(async () => {
    if (state.sentence.length === 0) return
    const natural = buildSentence(state.sentence)
    const translated = await translateText(natural, state.targetLanguage)
    dispatch({ type: 'SET_TRANSLATED_SENTENCE', payload: translated })
  }, [state.sentence, state.targetLanguage, dispatch])

  const handleSpeak = useCallback(() => {
    const text = state.translatedSentence || state.sentence.join(' ')
    if (!text) return
    const lang = state.translatedSentence ? state.targetLanguage : 'en'
    speak(
      text,
      lang,
      () => dispatch({ type: 'SET_SPEAKING', payload: true }),
      () => dispatch({ type: 'SET_SPEAKING', payload: false })
    )
  }, [state.translatedSentence, state.sentence, state.targetLanguage, dispatch])

  const saveSentence = () => {
    if (state.sentence.length > 0) {
      dispatch({
        type: 'ADD_TO_HISTORY',
        payload: {
          text: state.sentence.join(' '),
          translated: state.translatedSentence || state.sentence.join(' '),
          language: state.targetLanguage,
          timestamp: new Date().toLocaleString(),
        },
      })
    }
  }

  const predictions = predictNextSign(state.sentence)

  return (
    <div className="space-y-4">
      <div className="p-5 bg-gray-900 rounded-xl border border-gray-800">
        <h3 className="text-sm font-medium text-gray-400 mb-3">Detected Sign</h3>
        <div className="flex items-center justify-between">
          <div>
            {state.detectedSign ? (
              <>
                <p className="text-3xl font-bold text-white">{state.detectedSign}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Confidence: {Math.round(state.confidence * 100)}%
                </p>
              </>
            ) : (
              <p className="text-gray-600">No sign detected</p>
            )}
          </div>
          <button
            onClick={addToSentence}
            disabled={!state.detectedSign}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-700 disabled:text-gray-500 rounded-lg text-sm font-medium transition-colors"
          >
            Add
          </button>
        </div>
      </div>

      {state.fusedOutput?.enhancedMeaning && (
        <div className="p-5 bg-gradient-to-br from-primary-900/40 to-purple-900/40 rounded-xl border border-primary-800/30">
          <h3 className="text-sm font-medium text-primary-300 mb-2">AI Interpretation</h3>
          <p className="text-lg font-semibold text-white">{state.fusedOutput.enhancedMeaning}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {state.fusedOutput.components.map((c, i) => (
              <span key={i} className="text-xs px-2 py-1 rounded bg-gray-800/60 text-gray-300">
                {c.type}: {c.value} ({Math.round(c.confidence * 100)}%)
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 bg-gray-900 rounded-xl border border-gray-800">
        <h3 className="text-sm font-medium text-gray-400 mb-3">Active Modalities</h3>
        <div className="grid grid-cols-2 gap-2">
          <ModalityBadge active={state.handsDetected > 0} label="Hands" icon="🤟" />
          <ModalityBadge active={state.faceDetected} label="Face" icon="😊" />
          <ModalityBadge
            active={state.emotion && state.emotion !== 'neutral'}
            label={state.emotion ? `${getEmotionEmoji(state.emotion)} ${state.emotion}` : 'Emotion'}
          />
          <ModalityBadge
            active={state.poseGesture && state.poseGesture.gesture !== 'STANDING'}
            label={state.poseGesture?.label || 'Pose'}
            icon="🧍"
          />
          <ModalityBadge active={state.lipState === 'open'} label={`Lips: ${state.lipState || 'N/A'}`} icon="👄" />
        </div>
      </div>

      <div className="p-5 bg-gray-900 rounded-xl border border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-400">Sentence</h3>
          <div className="flex gap-2">
            <button onClick={saveSentence} disabled={state.sentence.length === 0}
              className="text-xs text-primary-400 hover:text-primary-300 disabled:text-gray-600 transition-colors">Save</button>
            <button onClick={clearSentence}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Clear</button>
          </div>
        </div>
        <div className="min-h-[3rem] p-3 bg-gray-800 rounded-lg">
          {state.sentence.length > 0 ? (
            <p className="text-lg text-white">{state.sentence.join(' ')}</p>
          ) : (
            <p className="text-gray-600 text-sm">Signs will appear here as you add them...</p>
          )}
        </div>

        {predictions.length > 0 && (
          <div className="mt-2">
            <p className="text-xs text-gray-500 mb-1">Predicted next:</p>
            <div className="flex flex-wrap gap-1">
              {predictions.map(p => (
                <span key={p} className="text-xs px-2 py-1 bg-gray-800 text-primary-400 rounded cursor-pointer hover:bg-gray-700"
                  onClick={() => dispatch({ type: 'ADD_TO_SENTENCE', payload: p })}>
                  {p}
                </span>
              ))}
            </div>
          </div>
        )}

        {state.translatedSentence && (
          <div className="mt-3 p-3 bg-primary-900/30 rounded-lg border border-primary-800/30">
            <p className="text-xs text-primary-400 mb-1">
              Translation ({LANGUAGES.find(l => l.code === state.targetLanguage)?.name})
            </p>
            <p className="text-lg text-white">{state.translatedSentence}</p>
          </div>
        )}

        <div className="flex gap-2 mt-3">
          <button onClick={handleTranslate} disabled={state.sentence.length === 0}
            className="flex-1 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-700 disabled:text-gray-500 rounded-lg text-sm font-medium transition-colors">
            Translate
          </button>
          <button onClick={handleSpeak}
            disabled={state.sentence.length === 0 && !state.translatedSentence}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              state.isSpeaking
                ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-700 disabled:text-gray-500 text-white'
            }`}>
            {state.isSpeaking ? '🔊 Speaking...' : '🔊 Speak'}
          </button>
        </div>
      </div>

      <div className="p-5 bg-gray-900 rounded-xl border border-gray-800">
        <h3 className="text-sm font-medium text-gray-400 mb-3">Translate To</h3>
        <select value={state.targetLanguage}
          onChange={(e) => dispatch({ type: 'SET_TARGET_LANGUAGE', payload: e.target.value })}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500">
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>{lang.name}</option>
          ))}
        </select>
      </div>

      <div className="p-5 bg-gray-900 rounded-xl border border-gray-800">
        <button onClick={() => dispatch({ type: 'SET_DETECTING', payload: !state.isDetecting })}
          className={`w-full py-3 rounded-lg font-medium transition-colors ${
            state.isDetecting ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'
          }`}>
          {state.isDetecting ? 'Stop Detection' : 'Start Detection'}
        </button>
      </div>
    </div>
  )
}

function ModalityBadge({ active, label, icon }) {
  return (
    <div className={`flex items-center gap-2 p-2 rounded-lg text-xs ${
      active ? 'bg-green-900/30 text-green-400 border border-green-800/30' : 'bg-gray-800 text-gray-500'
    }`}>
      <span className={`w-2 h-2 rounded-full ${active ? 'bg-green-500' : 'bg-gray-600'}`} />
      {icon && <span>{icon}</span>}
      <span>{label}</span>
    </div>
  )
}
