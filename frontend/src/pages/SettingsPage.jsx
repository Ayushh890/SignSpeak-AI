import { useState } from 'react'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    detectionConfidence: 0.5,
    trackingConfidence: 0.5,
    maxHands: 2,
    showLandmarks: true,
    autoSpeak: false,
    theme: 'dark',
  })

  const update = (key, value) =>
    setSettings((prev) => ({ ...prev, [key]: value }))

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="space-y-6">
        <Section title="Detection">
          <Slider
            label="Min Detection Confidence"
            value={settings.detectionConfidence}
            onChange={(v) => update('detectionConfidence', v)}
          />
          <Slider
            label="Min Tracking Confidence"
            value={settings.trackingConfidence}
            onChange={(v) => update('trackingConfidence', v)}
          />
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Max Hands</span>
            <select
              value={settings.maxHands}
              onChange={(e) => update('maxHands', Number(e.target.value))}
              className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-primary-500"
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
            </select>
          </div>
        </Section>

        <Section title="Display">
          <Toggle
            label="Show Landmarks"
            checked={settings.showLandmarks}
            onChange={(v) => update('showLandmarks', v)}
          />
          <Toggle
            label="Auto Speak Translations"
            checked={settings.autoSpeak}
            onChange={(v) => update('autoSpeak', v)}
          />
        </Section>

        <Section title="About">
          <div className="text-sm text-gray-400 space-y-1">
            <p><strong className="text-gray-300">SignSpeak AI</strong> v1.0.0</p>
            <p>Real-time multimodal sign language translator</p>
            <p>Powered by MediaPipe, TensorFlow, and React</p>
          </div>
        </Section>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="p-5 bg-gray-900 rounded-xl border border-gray-800">
      <h2 className="text-sm font-medium text-gray-400 mb-4">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

function Slider({ label, value, onChange }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-gray-300">{label}</span>
        <span className="text-xs text-gray-500">{value.toFixed(2)}</span>
      </div>
      <input
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-primary-500"
      />
    </div>
  )
}

function Toggle({ label, checked, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-300">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors ${
          checked ? 'bg-primary-600' : 'bg-gray-700'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
            checked ? 'translate-x-5' : ''
          }`}
        />
      </button>
    </div>
  )
}
