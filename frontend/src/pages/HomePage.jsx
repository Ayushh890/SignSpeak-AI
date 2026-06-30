import { Link } from 'react-router-dom'

const features = [
  {
    icon: '🤟',
    title: 'Hand Sign Detection',
    desc: 'Real-time detection of hand signs using MediaPipe with 21 landmark points per hand.',
  },
  {
    icon: '😊',
    title: 'Facial Expression',
    desc: 'Recognize emotions like happy, sad, angry, surprise to add context to translations.',
  },
  {
    icon: '👄',
    title: 'Lip Reading',
    desc: 'AI-powered lip movement analysis for improved accuracy when signs are ambiguous.',
  },
  {
    icon: '🧍',
    title: 'Body Pose',
    desc: 'Full body pose estimation with 33 landmarks for gesture and posture recognition.',
  },
  {
    icon: '🌐',
    title: 'Multi-Language',
    desc: 'Translate detected signs into Hindi, English, French, Spanish, Japanese, and more.',
  },
  {
    icon: '🔊',
    title: 'Text-to-Speech',
    desc: 'Convert translated text to natural speech output in the selected language.',
  },
]

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto">
      <section className="text-center py-20">
        <div className="text-6xl mb-6">🤟</div>
        <h1 className="text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-primary-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            SignSpeak AI
          </span>
        </h1>
        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          Real-time multimodal sign language translator powered by AI.
          Detects hand signs, facial expressions, and body pose — translates
          into any language instantly.
        </p>
        <Link
          to="/translate"
          className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-700 rounded-xl text-lg font-semibold transition-all hover:scale-105 shadow-lg shadow-primary-600/25"
        >
          Start Translating
          <span>→</span>
        </Link>
      </section>

      <section className="py-12">
        <h2 className="text-2xl font-bold text-center mb-10 text-gray-200">
          Capabilities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="p-6 rounded-xl bg-gray-900 border border-gray-800 hover:border-primary-600/50 transition-colors"
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-12 text-center">
        <div className="p-8 rounded-2xl bg-gradient-to-r from-primary-900/50 to-purple-900/50 border border-primary-800/30">
          <h2 className="text-2xl font-bold mb-3">How It Works</h2>
          <div className="flex flex-wrap items-center justify-center gap-4 text-gray-300">
            <Step label="Open Webcam" />
            <Arrow />
            <Step label="AI Detects Signs" />
            <Arrow />
            <Step label="Convert to Text" />
            <Arrow />
            <Step label="Translate" />
            <Arrow />
            <Step label="Speak Aloud" />
          </div>
        </div>
      </section>
    </div>
  )
}

function Step({ label }) {
  return (
    <span className="px-4 py-2 bg-gray-800 rounded-lg text-sm font-medium">
      {label}
    </span>
  )
}

function Arrow() {
  return <span className="text-primary-400 text-xl">→</span>
}
