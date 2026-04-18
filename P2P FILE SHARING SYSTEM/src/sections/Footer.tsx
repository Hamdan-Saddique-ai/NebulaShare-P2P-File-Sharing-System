import { useFileStore } from '@/hooks/useFileStore';
import { Github, Twitter } from 'lucide-react';

export default function Footer() {
  const { setView } = useFileStore();

  return (
    <footer className="relative border-t border-[#2A2A2A] bg-[#0A0A0A]" style={{ zIndex: 1 }}>
      <div className="max-w-[1100px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Left - Brand */}
          <div>
            <div className="flex items-center gap-2">
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
            </div>
            <p className="mt-3 text-sm text-[#A3A3A3]">
              P2P file sharing for everyone.
            </p>
            <div className="mt-4 flex items-center gap-4">
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="text-[#737373] hover:text-white transition-colors"
              >
                <Github size={16} />
              </a>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="text-[#737373] hover:text-white transition-colors"
              >
                <Twitter size={16} />
              </a>
            </div>
          </div>

          {/* Center - Nav */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Navigation</h4>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setView('home')}
                className="text-sm text-[#A3A3A3] hover:text-white transition-colors text-left"
              >
                Send File
              </button>
              <button
                onClick={() => setView('download')}
                className="text-sm text-[#A3A3A3] hover:text-white transition-colors text-left"
              >
                Receive File
              </button>
              <button
                onClick={() => setView('home')}
                className="text-sm text-[#A3A3A3] hover:text-white transition-colors text-left"
              >
                How It Works
              </button>
              <button
                onClick={() => setView('home')}
                className="text-sm text-[#A3A3A3] hover:text-white transition-colors text-left"
              >
                Features
              </button>
            </div>
          </div>

          {/* Right - Legal */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Legal</h4>
            <div className="flex flex-col gap-3">
              <button
                onClick={(e) => e.preventDefault()}
                className="text-sm text-[#A3A3A3] hover:text-white transition-colors text-left"
              >
                Privacy
              </button>
              <button
                onClick={(e) => e.preventDefault()}
                className="text-sm text-[#A3A3A3] hover:text-white transition-colors text-left"
              >
                Terms
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-[#2A2A2A] text-center">
          <p className="text-sm text-[#737373]">
            &copy; 2025 DropLink. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
