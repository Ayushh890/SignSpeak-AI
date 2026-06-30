import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'

const defaultProfile = {
  name: '',
  preferredLanguage: 'en',
  signLanguage: 'ASL',
  autoSpeak: false,
  showLandmarks: true,
}

export default function ProfilePage() {
  const { state } = useApp()
  const [profile, setProfile] = useState(defaultProfile)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('signspeak_profile')
    if (stored) setProfile(JSON.parse(stored))
  }, [])

  const update = (key, value) => setProfile(prev => ({ ...prev, [key]: value }))

  const save = () => {
    localStorage.setItem('signspeak_profile', JSON.stringify(profile))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>

      <div className="space-y-6">
        <Section title="Personal Info">
          <Field label="Display Name">
            <input type="text" value={profile.name} onChange={e => update('name', e.target.value)}
              placeholder="Your name"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500" />
          </Field>
          <Field label="Preferred Sign Language">
            <select value={profile.signLanguage} onChange={e => update('signLanguage', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500">
              <option value="ASL">American Sign Language (ASL)</option>
              <option value="ISL">Indian Sign Language (ISL)</option>
              <option value="BSL">British Sign Language (BSL)</option>
            </select>
          </Field>
          <Field label="Default Output Language">
            <select value={profile.preferredLanguage} onChange={e => update('preferredLanguage', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500">
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="fr">French</option>
              <option value="es">Spanish</option>
              <option value="ja">Japanese</option>
              <option value="de">German</option>
            </select>
          </Field>
        </Section>

        <Section title="Stats">
          <div className="grid grid-cols-3 gap-4">
            <StatCard label="Translations" value={state.history.length} />
            <StatCard label="Signs Learned" value={Object.keys({A:1,B:1,C:1,D:1,E:1,F:1,G:1,I:1,K:1,L:1,O:1,R:1,U:1,V:1,W:1,Y:1}).length} />
            <StatCard label="Languages" value={8} />
          </div>
        </Section>

        <button onClick={save}
          className={`w-full py-3 rounded-lg font-medium transition-all ${
            saved ? 'bg-green-600 text-white' : 'bg-primary-600 hover:bg-primary-700 text-white'
          }`}>
          {saved ? 'Saved!' : 'Save Profile'}
        </button>
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

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm text-gray-300 mb-1">{label}</label>
      {children}
    </div>
  )
}

function StatCard({ label, value }) {
  return (
    <div className="text-center p-3 bg-gray-800 rounded-lg">
      <p className="text-2xl font-bold text-primary-400">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  )
}
