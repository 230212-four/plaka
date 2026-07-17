import { useState, useEffect } from 'react'
import AuthForm from './components/AuthForm'

export default function App() {
  const [token, setToken] = useState<string | null>(null)

  // Hydrate user session context on browser load
  useEffect(() => {
    const savedToken = localStorage.getItem('plaka_token')
    if (savedToken) setToken(savedToken)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('plaka_token')
    setToken(null)
  }

  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center p-6 selection:bg-brand-terracotta selection:text-brand-cream">
      {!token ? (
        /* If visitor is unauthenticated, serve the entry workspace portal */
        <AuthForm onAuthSuccess={(newToken) => setToken(newToken)} />
      ) : (
        /* Authenticated Crate Canvas Screen Placeholder */
        <div className="bg-white border-3 border-brand-forest rounded-xl p-8 max-w-xl w-full text-center shadow-retro">
          <div className="inline-block p-4 bg-brand-moss rounded-full border-2 border-brand-forest mb-4 animate-bounce">
            <span className="text-4xl">🐸</span>
          </div>
          <h1 className="text-4xl font-black text-brand-forest uppercase tracking-tight mb-2">
            PLAKA Dashboard
          </h1>
          <p className="text-brand-moss font-medium max-w-md mx-auto mb-6">
            Authentication handshake clear. Your data streams are linked safely with the cloud via your unique secure session token.
          </p>

          <div className="flex gap-4 max-w-xs mx-auto">
            <button className="flex-1 py-2 bg-brand-cream text-brand-forest font-black border-2 border-brand-forest rounded-md shadow-retro-sm hover:-translate-y-0.5 transition-transform cursor-pointer">
              Go Digging
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 py-2 bg-brand-terracotta text-brand-cream font-black border-2 border-brand-forest rounded-md shadow-retro-sm hover:brightness-95 cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}