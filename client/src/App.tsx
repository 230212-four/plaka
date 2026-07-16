export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream p-6">
      {/* Neo-Brutalist Crate Widget */}
      <div className="bg-white border-3 border-brand-forest rounded-xl p-6 max-w-sm shadow-retro transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0">
        <div className="w-full h-48 bg-brand-moss rounded-lg border-2 border-brand-forest mb-4 flex items-center justify-center">
          <span className="text-brand-cream font-bold text-xl">🐸 Mascot Crate</span>
        </div>
        
        <h1 className="text-2xl font-black text-brand-forest mb-2">PLAKA App</h1>
        <p className="text-brand-moss mb-4 font-medium">
          kokak!
        </p>
        
        <button className="w-full py-3 bg-brand-terracotta text-brand-cream font-bold border-2 border-brand-forest rounded-md shadow-retro-sm hover:brightness-95 cursor-pointer">
          Open Crate
        </button>
      </div>
    </div>
  )
}