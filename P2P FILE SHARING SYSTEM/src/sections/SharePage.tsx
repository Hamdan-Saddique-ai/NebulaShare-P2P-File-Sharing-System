import { useEffect, useRef, useState } from 'react';
import { useFileStore } from '@/hooks/useFileStore';
import { Check, Copy, ArrowLeft, File, Image, Video, Music, Archive, FileText } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { getFileIcon } from '@/lib/utils';
import gsap from 'gsap';

export default function SharePage() {
  const { state, setView, copyToClipboard } = useFileStore();
  const cardRef = useRef<HTMLDivElement>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const code = state.shareCode || '------';
  const shareUrl = `https://droplink.app/d/${code}`;

  useEffect(() => {
    if (cardRef.current) {
      const elements = cardRef.current.querySelectorAll('.animate-in');
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 40, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' }
      );
      gsap.fromTo(
        elements,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, delay: 0.3, ease: 'power3.out' }
      );
    }
  }, []);

  const handleCopyLink = () => {
    copyToClipboard(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCode = () => {
    copyToClipboard(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const getIconComponent = (type: string) => {
    const { icon } = getFileIcon(type);
    switch (icon) {
      case 'image': return <Image size={20} />;
      case 'video': return <Video size={20} />;
      case 'audio': return <Music size={20} />;
      case 'archive': return <Archive size={20} />;
      case 'doc': return <FileText size={20} />;
      default: return <File size={20} />;
    }
  };

  return (
    <div className="relative min-h-screen pt-32 pb-20 px-6" style={{ zIndex: 1 }}>
      {/* Background glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(79, 70, 229, 0.12) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-[500px] mx-auto relative">
        {/* Back button */}
        <button
          onClick={() => setView('home')}
          className="flex items-center gap-2 text-sm text-[#A3A3A3] hover:text-white transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Back to home
        </button>

        {/* Share Card */}
        <div
          ref={cardRef}
          className="bg-[#141414] rounded-2xl p-10 border border-[#2A2A2A]"
          style={{ boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4)' }}
        >
          {/* Success Icon */}
          <div className="animate-in flex justify-center">
            <div className="w-16 h-16 rounded-full bg-[rgba(16,185,129,0.1)] flex items-center justify-center">
              <Check size={32} className="text-[#10B981]" />
            </div>
          </div>

          {/* Title */}
          <div className="animate-in text-center mt-6">
            <h2 className="text-[28px] font-semibold text-white">
              Ready to Share!
            </h2>
            <p className="mt-2 text-base text-[#A3A3A3]">
              Your file is ready. Share this code with the recipient.
            </p>
          </div>

          {/* Share Code */}
          <div className="animate-in mt-8">
            <div
              className="bg-[rgba(79,70,229,0.08)] border border-dashed border-[#4F46E5] rounded-xl p-6 text-center"
            >
              <code className="text-4xl font-bold text-white font-mono tracking-[0.1em]">
                {code.split('').map((char, i) => (
                  <span
                    key={i}
                    className="inline-block"
                    style={{
                      animationDelay: `${i * 0.05}s`,
                    }}
                  >
                    {char}
                  </span>
                ))}
              </code>
            </div>
            <p className="mt-3 text-sm text-[#A3A3A3] text-center flex items-center justify-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              Valid for 24 hours
            </p>
          </div>

          {/* QR Code */}
          <div className="animate-in flex flex-col items-center mt-6">
            <div className="bg-white rounded-lg p-3">
              <QRCodeSVG value={shareUrl} size={140} level="M" />
            </div>
            <p className="mt-3 text-sm text-[#A3A3A3]">
              Scan to download
            </p>
          </div>

          {/* Action Buttons */}
          <div className="animate-in mt-8 flex flex-col gap-3">
            <button
              onClick={handleCopyLink}
              className="w-full brand-gradient text-white font-semibold py-4 px-6 rounded-full hover:brightness-110 transition-all duration-300 flex items-center justify-center gap-2"
            >
              {copiedLink ? (
                <>
                  <Check size={18} />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={18} />
                  Copy Link
                </>
              )}
            </button>

            <button
              onClick={handleCopyCode}
              className="w-full bg-transparent border border-[#2A2A2A] text-white font-medium py-4 px-6 rounded-full hover:border-[#A3A3A3] transition-all duration-300 flex items-center justify-center gap-2"
            >
              {copiedCode ? (
                <>
                  <Check size={18} />
                  Code Copied!
                </>
              ) : (
                <>
                  <Copy size={18} />
                  Copy Code
                </>
              )}
            </button>

            <button
              onClick={() => setView('home')}
              className="text-sm text-[#A3A3A3] hover:text-white transition-colors py-2"
            >
              Share Another File
            </button>
          </div>

          {/* File Info */}
          {state.currentFileMeta && (
            <div className="animate-in mt-6 pt-6 border-t border-[#2A2A2A]">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    background: `${getFileIcon(state.currentFileMeta.type).color}15`,
                    color: getFileIcon(state.currentFileMeta.type).color,
                  }}
                >
                  {getIconComponent(state.currentFileMeta.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#A3A3A3] truncate">
                    {state.currentFileMeta.name}
                  </p>
                  <p className="text-xs text-[#737373]">
                    {(state.currentFileMeta.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
