import { useState } from 'react'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="flex gap-2 mb-6">
        {['overview', 'models', 'datasets'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
              activeTab === tab ? 'bg-primary-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && <OverviewTab />}
      {activeTab === 'models' && <ModelsTab />}
      {activeTab === 'datasets' && <DatasetsTab />}
    </div>
  )
}

function OverviewTab() {
  const stats = [
    { label: 'Active Models', value: '3', desc: 'Hand, Face, Pose' },
    { label: 'Supported Signs', value: '16+', desc: 'ASL Alphabet + Gestures' },
    { label: 'Languages', value: '8', desc: 'Translation targets' },
    { label: 'Modalities', value: '5', desc: 'Hand, Face, Pose, Lips, Emotion' },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="p-4 bg-gray-900 rounded-xl border border-gray-800 text-center">
            <p className="text-2xl font-bold text-primary-400">{s.value}</p>
            <p className="text-sm text-white mt-1">{s.label}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.desc}</p>
          </div>
        ))}
      </div>

      <div className="p-5 bg-gray-900 rounded-xl border border-gray-800">
        <h2 className="text-sm font-medium text-gray-400 mb-4">System Status</h2>
        <div className="space-y-3">
          <StatusRow label="MediaPipe Hand Landmarker" status="loaded" />
          <StatusRow label="MediaPipe Face Landmarker" status="loaded" />
          <StatusRow label="MediaPipe Pose Landmarker" status="loaded" />
          <StatusRow label="Translation Engine" status="ready" />
          <StatusRow label="Speech Synthesis" status="ready" />
          <StatusRow label="WebSocket Connection" status="disconnected" />
        </div>
      </div>
    </div>
  )
}

function ModelsTab() {
  const models = [
    { name: 'Hand Landmarker', size: '~5 MB', type: 'MediaPipe', status: 'Active' },
    { name: 'Face Landmarker', size: '~5 MB', type: 'MediaPipe', status: 'Active' },
    { name: 'Pose Landmarker Lite', size: '~3 MB', type: 'MediaPipe', status: 'Active' },
    { name: 'Sign Classifier (CNN)', size: 'TBD', type: 'TensorFlow', status: 'Planned' },
    { name: 'Lip Reading (LSTM)', size: 'TBD', type: 'PyTorch', status: 'Planned' },
    { name: 'NLLB Translation', size: '~600 MB', type: 'HuggingFace', status: 'Planned' },
    { name: 'Coqui TTS', size: '~100 MB', type: 'Coqui', status: 'Planned' },
  ]

  return (
    <div className="p-5 bg-gray-900 rounded-xl border border-gray-800">
      <h2 className="text-sm font-medium text-gray-400 mb-4">AI Models</h2>
      <div className="space-y-2">
        {models.map(m => (
          <div key={m.name} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
            <div>
              <p className="text-sm text-white font-medium">{m.name}</p>
              <p className="text-xs text-gray-500">{m.type} | {m.size}</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded ${
              m.status === 'Active' ? 'bg-green-900/50 text-green-400' : 'bg-gray-700 text-gray-400'
            }`}>
              {m.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function DatasetsTab() {
  const datasets = [
    { name: 'ASL Alphabet', count: '87,000+', type: 'Hand Signs', source: 'Kaggle' },
    { name: 'ISL Dataset', count: '~5,000', type: 'Hand Signs', source: 'Research' },
    { name: 'FER2013', count: '35,887', type: 'Facial Expressions', source: 'Kaggle' },
    { name: 'AffectNet', count: '400,000+', type: 'Facial Expressions', source: 'Research' },
    { name: 'LRW', count: '500,000+', type: 'Lip Reading', source: 'Oxford' },
    { name: 'COCO Pose', count: '200,000+', type: 'Body Pose', source: 'Microsoft' },
  ]

  return (
    <div className="p-5 bg-gray-900 rounded-xl border border-gray-800">
      <h2 className="text-sm font-medium text-gray-400 mb-4">Training Datasets</h2>
      <div className="space-y-2">
        {datasets.map(d => (
          <div key={d.name} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
            <div>
              <p className="text-sm text-white font-medium">{d.name}</p>
              <p className="text-xs text-gray-500">{d.type} | {d.source}</p>
            </div>
            <span className="text-xs text-primary-400">{d.count} samples</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function StatusRow({ label, status }) {
  const colors = {
    loaded: 'bg-green-500',
    ready: 'bg-green-500',
    disconnected: 'bg-gray-500',
    error: 'bg-red-500',
  }
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-300">{label}</span>
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${colors[status] || 'bg-gray-500'}`} />
        <span className="text-xs text-gray-500 capitalize">{status}</span>
      </div>
    </div>
  )
}
