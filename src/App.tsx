import { VoiceShoppingAssistant } from './components/VoiceShoppingAssistant';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-gray-900">
      {/* App Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛒</span>
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">
              VoiceCart <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-full">AI Beta</span>
            </h1>
          </div>
          <div className="h-8 w-8 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
              alt="User" 
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="py-8 px-4">
        <VoiceShoppingAssistant />
      </main>

      {/* Footer / Attribution */}
      <footer className="text-center text-gray-400 text-xs py-8">
        <p>Powered by Web Speech API & Gemini Flash</p>
      </footer>
    </div>
  );
}

export default App;