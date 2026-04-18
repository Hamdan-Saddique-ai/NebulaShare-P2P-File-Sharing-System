import { useEffect, useRef, useState, useCallback } from 'react';
import { useFileStore } from '@/hooks/useFileStore';
import { Download, File, Image, Video, Music, Archive, FileText, ArrowLeft, Check, AlertCircle, Send } from 'lucide-react';
import { getFileIcon, formatFileSize } from '@/lib/utils';
import gsap from 'gsap';
import confetti from 'canvas-confetti';

export default function DownloadPage() {
  const { state, dispatch, setView, startDownload } = useFileStore();
  const cardRef = useRef<HTMLDivElement>(null);
  const [codeDigits, setCodeDigits] = useState(['', '', '', '', '', '']);
  const [lookupDone, setLookupDone] = useState(false);
  const [foundFile, setFoundFile] = useState<{ name: string; size: number; type: string } | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-focus first input on mount
  useEffect(() => {
    setTimeout(() => inputRefs.current[0]?.focus(), 400);
  }, []);

  // Animation on mount
  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      );
      const boxes = cardRef.current.querySelectorAll('.code-box');
      gsap.fromTo(
        boxes,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.3, stagger: 0.05, delay: 0.2, ease: 'back.out(1.7)' }
      );
    }
  }, []);

  // Check if all digits are filled
  useEffect(() => {
    const code = codeDigits.join('');
    if (code.length === 6 && !lookupDone) {
      dispatch({ type: 'SET_DOWNLOAD_CODE', code });
      // Simulate lookup
      setTimeout(() => {
        // 70% chance to find a file (for demo)
        if (Math.random() > 0.3) {
          const fileNames = ['document.pdf', 'photo.jpg', 'video.mp4', 'archive.zip', 'music.mp3'];
          const fileName = fileNames[Math.floor(Math.random() * fileNames.length)];
          const sizes = [1024 * 1024, 5 * 1024 * 1024, 50 * 1024 * 1024, 200 * 1024 * 1024];
          const size = sizes[Math.floor(Math.random() * sizes.length)];
          const typeMap: Record<string, string> = {
            '.pdf': 'application/pdf',
            '.jpg': 'image/jpeg',
            '.mp4': 'video/mp4',
            '.zip': 'application/zip',
            '.mp3': 'audio/mpeg',
          };
          const ext = fileName.substring(fileName.lastIndexOf('.'));
          setFoundFile({
            name: fileName,
            size,
            type: typeMap[ext] || 'application/octet-stream',
          });
          dispatch({ type: 'SET_DOWNLOAD_ERROR', error: null });
        } else {
          dispatch({ type: 'SET_DOWNLOAD_ERROR', error: 'Invalid code. Please check and try again.' });
          // Shake animation
          const boxes = document.querySelectorAll('.code-box');
          boxes.forEach((box) => {
            box.classList.add('animate-shake');
            setTimeout(() => box.classList.remove('animate-shake'), 300);
          });
        }
        setLookupDone(true);
      }, 500);
    }
  }, [codeDigits, lookupDone, dispatch]);

  // Download complete effect
  useEffect(() => {
    if (state.downloadProgress === 100 && state.isDownloading && !isComplete) {
      setIsComplete(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4F46E5', '#7C3AED', '#10B981', '#F59E0B'],
      });
    }
  }, [state.downloadProgress, state.isDownloading, isComplete]);

  const handleDigitChange = useCallback((index: number, value: string) => {
    const digit = value.replace(/[^a-zA-Z0-9]/, '').toUpperCase();
    if (digit.length > 1) return;

    const newDigits = [...codeDigits];
    newDigits[index] = digit;
    setCodeDigits(newDigits);
    setLookupDone(false);
    setFoundFile(null);
    dispatch({ type: 'SET_DOWNLOAD_ERROR', error: null });

    // Auto-advance to next input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }, [codeDigits, dispatch]);

  const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !codeDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }, [codeDigits]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 6);
    if (pasted.length === 6) {
      setCodeDigits(pasted.split(''));
      setLookupDone(false);
      setFoundFile(null);
      dispatch({ type: 'SET_DOWNLOAD_ERROR', error: null });
    }
  }, [dispatch]);

  const handleReset = () => {
    setCodeDigits(['', '', '', '', '', '']);
    setLookupDone(false);
    setFoundFile(null);
    setIsComplete(false);
    dispatch({ type: 'RESET_DOWNLOAD' });
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
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
          background: 'radial-gradient(ellipse at 50% 50%, rgba(16, 185, 129, 0.1) 0%, transparent 60%)',
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

        {/* Download Card */}
        <div
          ref={cardRef}
          className="bg-[#141414] rounded-2xl p-10 border border-[#2A2A2A]"
          style={{ boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4)' }}
        >
          {/* Title */}
          <div className="text-center">
            <h2 className="text-[28px] font-semibold text-white">
              Receive File
            </h2>
            <p className="mt-2 text-base text-[#A3A3A3]">
              Enter the 6-character share code to download.
            </p>
          </div>

          {/* Code Input */}
          <div className="mt-8 flex justify-center gap-2">
            {codeDigits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={i === 0 ? handlePaste : undefined}
                className={`
                  code-box w-14 h-14 text-center text-2xl font-bold font-mono
                  bg-[#141414] border-2 rounded-xl text-white
                  focus:outline-none transition-all duration-200
                  ${state.downloadError
                    ? 'border-red-500'
                    : digit
                      ? 'border-[#4F46E5]'
                      : 'border-[#2A2A2A] focus:border-[#4F46E5]'
                  }
                `}
                style={digit ? {
                  boxShadow: '0 0 0 3px rgba(79, 70, 229, 0.15)',
                } : {}}
                aria-label={`Share code digit ${i + 1}`}
              />
            ))}
          </div>

          {/* Error Message */}
          {state.downloadError && (
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-red-400 animate-[fadeIn_0.3s_ease-out]">
              <AlertCircle size={16} />
              {state.downloadError}
            </div>
          )}

          {/* File Found + Download Button */}
          {foundFile && !state.isDownloading && state.downloadProgress === 0 && (
            <div className="mt-6 animate-[fadeInUp_0.4s_ease-out]">
              <div className="bg-[#1A1A1A] rounded-xl p-4 flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background: `${getFileIcon(foundFile.type).color}15`,
                    color: getFileIcon(foundFile.type).color,
                  }}
                >
                  {getIconComponent(foundFile.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {foundFile.name}
                  </p>
                  <p className="text-xs text-[#A3A3A3]">
                    {formatFileSize(foundFile.size)}
                  </p>
                </div>
              </div>

              <button
                onClick={startDownload}
                className="w-full mt-4 bg-[#10B981] hover:bg-[#10B981]/90 text-white font-semibold py-4 px-6 rounded-full transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]"
              >
                <Download size={18} />
                Download File
              </button>
            </div>
          )}

          {/* Peer Connection + Download Progress */}
          {(state.isDownloading || isComplete) && (
            <div className="mt-6 animate-[fadeIn_0.3s_ease-out]">
              {/* Peer Animation */}
              <div className="flex items-center justify-center gap-4 py-4">
                {/* Sender */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center">
                    <Send size={20} className="text-[#4F46E5]" />
                  </div>
                  <span className="text-xs text-[#737373]">Sender</span>
                </div>

                {/* Connection Line */}
                <div className="flex-1 max-w-[120px] relative h-8 flex items-center">
                  <div className="w-full h-0.5 bg-[#2A2A2A] relative overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#4F46E5] to-[#10B981] transition-all duration-300"
                      style={{ width: state.isConnected ? '100%' : '0%' }}
                    />
                  </div>
                  {/* Animated dots */}
                  {state.isConnected && state.downloadProgress < 100 && (
                    <>
                      <div
                        className="absolute w-1 h-1 rounded-full bg-[#4F46E5] animate-peer-dot"
                        style={{ left: 0, top: '50%', marginTop: '-2px' }}
                      />
                      <div
                        className="absolute w-1 h-1 rounded-full bg-[#10B981] animate-peer-dot"
                        style={{ left: 0, top: '50%', marginTop: '-2px', animationDelay: '0.5s' }}
                      />
                    </>
                  )}
                  {state.isConnected && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] text-[#10B981] whitespace-nowrap">
                      {state.downloadProgress < 100 ? 'Transferring...' : 'Complete'}
                    </div>
                  )}
                </div>

                {/* Receiver */}
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-colors duration-300 ${
                    state.isConnected
                      ? 'bg-[rgba(16,185,129,0.1)] border-[#10B981]'
                      : 'bg-[#1A1A1A] border-[#2A2A2A]'
                  }`}>
                    <Download size={20} className={state.isConnected ? 'text-[#10B981]' : 'text-[#737373]'} />
                  </div>
                  <span className="text-xs text-[#737373]">You</span>
                </div>
              </div>

              {/* Status */}
              <p className="text-center text-sm text-[#A3A3A3] mt-2">
                {!state.isConnected
                  ? 'Establishing P2P connection...'
                  : state.downloadProgress < 100
                    ? `Downloading... ${state.downloadProgress}%`
                    : 'Download Complete!'
                }
              </p>

              {/* Progress Bar */}
              <div className="mt-4 w-full h-1 bg-[#1A1A1A] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-100"
                  style={{
                    width: `${state.downloadProgress}%`,
                    background: 'linear-gradient(90deg, #4F46E5, #10B981)',
                    boxShadow: '0 0 8px rgba(79, 70, 229, 0.3)',
                  }}
                />
              </div>

              {/* Complete State */}
              {isComplete && (
                <div className="mt-6 text-center animate-[fadeIn_0.5s_ease-out]">
                  <div className="w-14 h-14 rounded-full bg-[rgba(16,185,129,0.1)] flex items-center justify-center mx-auto">
                    <Check size={28} className="text-[#10B981]" />
                  </div>
                  <p className="mt-3 text-lg font-semibold text-white">
                    Download Complete!
                  </p>
                  <button
                    onClick={handleReset}
                    className="mt-4 text-sm text-[#A3A3A3] hover:text-white transition-colors"
                  >
                    Download Another File
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Alternative Link */}
          {!state.isDownloading && !isComplete && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setView('home')}
                className="text-sm text-[#A3A3A3] hover:text-white transition-colors flex items-center gap-1.5 mx-auto"
              >
                <Send size={14} />
                Send a file instead
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
