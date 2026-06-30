import WebcamFeed from '../components/WebcamFeed'
import TranslationPanel from '../components/TranslationPanel'

export default function LiveTranslationPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Live Translation</h1>
        <p className="text-gray-400 text-sm mt-1">
          Show hand signs to the camera and watch them get recognized in real time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WebcamFeed />
          <div className="mt-4 p-4 bg-gray-900 rounded-xl border border-gray-800">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Quick Guide</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-gray-500">
              <Hint sign="A" desc="Fist, thumb out" />
              <Hint sign="B" desc="Fingers up, thumb in" />
              <Hint sign="L" desc="L shape" />
              <Hint sign="V" desc="Peace sign" />
              <Hint sign="W" desc="Three fingers up" />
              <Hint sign="Y" desc="Thumb + pinky" />
              <Hint sign="F" desc="OK sign, 3 up" />
              <Hint sign="I" desc="Pinky only" />
            </div>
          </div>
        </div>

        <div>
          <TranslationPanel />
        </div>
      </div>
    </div>
  )
}

function Hint({ sign, desc }) {
  return (
    <div className="p-2 bg-gray-800 rounded-lg">
      <span className="font-bold text-primary-400">{sign}</span>
      <span className="ml-1 text-gray-500">— {desc}</span>
    </div>
  )
}
