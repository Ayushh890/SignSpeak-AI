import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'

export default function HistoryPage() {
  const { state } = useApp()
  const [savedHistory, setSavedHistory] = useState([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const stored = localStorage.getItem('signspeak_history')
    if (stored) setSavedHistory(JSON.parse(stored))
  }, [])

  useEffect(() => {
    if (state.history.length > 0) {
      const merged = [...state.history, ...savedHistory]
      const unique = merged.filter((item, i, arr) =>
        arr.findIndex(t => t.timestamp === item.timestamp && t.text === item.text) === i
      )
      localStorage.setItem('signspeak_history', JSON.stringify(unique.slice(0, 200)))
      setSavedHistory(unique)
    }
  }, [state.history])

  const allHistory = [...state.history, ...savedHistory].filter((item, i, arr) =>
    arr.findIndex(t => t.timestamp === item.timestamp && t.text === item.text) === i
  )

  const filtered = filter === 'all' ? allHistory : allHistory.filter(h => h.language === filter)

  const clearHistory = () => {
    localStorage.removeItem('signspeak_history')
    setSavedHistory([])
  }

  const languages = [...new Set(allHistory.map(h => h.language).filter(Boolean))]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Translation History</h1>
        <div className="flex items-center gap-3">
          {languages.length > 0 && (
            <select value={filter} onChange={e => setFilter(e.target.value)}
              className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-primary-500">
              <option value="all">All Languages</option>
              {languages.map(l => <option key={l} value={l}>{l.toUpperCase()}</option>)}
            </select>
          )}
          <button onClick={clearHistory}
            className="text-xs text-red-400 hover:text-red-300 transition-colors">
            Clear All
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">📋</div>
          <p className="text-gray-400 text-lg">No translations yet</p>
          <p className="text-gray-600 text-sm mt-2">Your saved translations will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item, i) => (
            <div key={i} className="p-4 bg-gray-900 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-white font-medium">{item.text}</p>
                  {item.translated && item.translated !== item.text && (
                    <p className="text-primary-400 mt-1">{item.translated}</p>
                  )}
                </div>
                <div className="text-right ml-4 shrink-0">
                  <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded">
                    {item.language?.toUpperCase()}
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-2">{item.timestamp}</p>
            </div>
          ))}
        </div>
      )}

      {filtered.length > 0 && (
        <p className="text-center text-xs text-gray-600 mt-6">
          {filtered.length} translation{filtered.length !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  )
}
