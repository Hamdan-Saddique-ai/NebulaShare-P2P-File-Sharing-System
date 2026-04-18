import { useFileStore } from '@/hooks/useFileStore';
import { Upload, Download } from 'lucide-react';

export default function Header() {
  const { state, setView } = useFileStore();

  const isActive = (view: string) => state.view === view;

  return (
    <header
      className="fixed top-0 left-0 right-0 h-16 flex items-center px-6 lg:px-12"
      style={{
        zIndex: 100,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        background: 'rgba(10, 10, 10, 0.8)',
        borderBottom: '1px solid #2A2A2A',
      }}
    >
      <div className="max-w-[1440px] mx-auto w-full flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => setView('home')}
          className="flex items-center gap-2 group"
        >
          <div className="relative w-5 h-5">
            <div
              className="absolute w-3.5 h-3.5 rounded"
              style={{ background: 'rgba(79, 70, 229, 0.8)', top: 0, left: 0 }}
            />
            <div
              className="absolute w-3.5 h-3.5 rounded"
              style={{ background: 'rgba(124, 58, 237, 0.6)', bottom: 0, right: 0 }}
            />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">
            DropLink
          </span>
        </button>

        {/* Center Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => setView('home')}
            className={`relative flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] transition-colors duration-300 ${
              isActive('home') || isActive('share')
                ? 'text-white'
                : 'text-[#A3A3A3] hover:text-white'
            }`}
          >
            <Upload size={14} />
            Send File
            {(isActive('home') || isActive('share')) && (
              <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-[#4F46E5] rounded-full" />
            )}
          </button>
          <button
            onClick={() => setView('download')}
            className={`relative flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] transition-colors duration-300 ${
              isActive('download')
                ? 'text-white'
                : 'text-[#A3A3A3] hover:text-white'
            }`}
          >
            <Download size={14} />
            Receive File
            {isActive('download') && (
              <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-[#4F46E5] rounded-full" />
            )}
          </button>
        </nav>

        {/* Right CTA */}
        <button
          onClick={() => setView('home')}
          className="brand-gradient text-white text-[13px] font-semibold px-5 py-2 rounded-full hover:brightness-125 transition-all duration-300"
        >
          Get Started
        </button>
      </div>
    </header>
  );
}
