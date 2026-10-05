import { useState, useEffect } from 'react';
import Home from './pages/Home';
import History from './pages/History';
import Settings from './pages/Settings';
import { BottomNav } from './components/BottomNav';
import { InstallPrompt } from './components/InstallPrompt';
import { initVoices } from './lib/speech';

type Page = 'home' | 'history' | 'settings';

export default function App() {
  const [page, setPage] = useState<Page>('home');

  useEffect(() => {
    initVoices();
  }, []);

  return (
    <div className="font-cairo min-h-screen bg-gradient-to-b from-blue-50 to-amber-50 flex justify-center text-right" dir="rtl">
      <div className="w-full max-w-[480px] relative pb-20">
        <InstallPrompt />
        <main className="px-4 py-6">
          {page === 'home' && <Home />}
          {page === 'history' && <History />}
          {page === 'settings' && <Settings />}
        </main>
        <BottomNav activePage={page} onNavigate={setPage} />
      </div>
    </div>
  );
}
