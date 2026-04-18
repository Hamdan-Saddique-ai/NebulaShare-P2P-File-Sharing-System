import { useEffect } from 'react';
import { FileStoreProvider, useFileStore } from '@/hooks/useFileStore';
import ParticleCanvas from '@/sections/ParticleCanvas';
import Header from '@/sections/Header';
import HomePage from '@/sections/HomePage';
import SharePage from '@/sections/SharePage';
import DownloadPage from '@/sections/DownloadPage';
import Footer from '@/sections/Footer';
import Toast from '@/sections/Toast';

function AppContent() {
  const { state } = useFileStore();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + U - focus upload or code input
      if ((e.metaKey || e.ctrlKey) && e.key === 'u') {
        e.preventDefault();
        if (state.view === 'home') {
          document.querySelector<HTMLDivElement>('[role="button"][aria-label="Upload file"]')?.focus();
        } else if (state.view === 'download') {
          document.querySelector<HTMLInputElement>('input[aria-label="Share code digit 1"]')?.focus();
        }
      }

      // Esc - reset
      if (e.key === 'Escape') {
        if (state.view === 'share') {
          window.location.reload();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.view]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-[rgba(79,70,229,0.3)]">
      <ParticleCanvas />
      <Header />

      <main className="relative">
        {state.view === 'home' && <HomePage />}
        {state.view === 'share' && <SharePage />}
        {state.view === 'download' && <DownloadPage />}
      </main>

      {state.view !== 'share' && <Footer />}
      <Toast />
    </div>
  );
}

function App() {
  return (
    <FileStoreProvider>
      <AppContent />
    </FileStoreProvider>
  );
}

export default App;
