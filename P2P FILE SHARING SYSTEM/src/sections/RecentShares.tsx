import { useEffect, useRef } from 'react';
import { useFileStore } from '@/hooks/useFileStore';
import { File, Image, Video, Music, Archive, FileText, Copy } from 'lucide-react';
import { formatFileSize, formatTime, getFileIcon } from '@/lib/utils';
import gsap from 'gsap';

export default function RecentShares() {
  const { state, copyToClipboard } = useFileStore();
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sectionRef.current && state.recentShares.length > 0) {
      const cards = sectionRef.current.querySelectorAll('.share-card');
      gsap.fromTo(
        cards,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
        }
      );
    }
  }, [state.recentShares.length]);

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

  if (state.recentShares.length === 0) return null;

  return (
    <section ref={sectionRef} className="max-w-[1100px] mx-auto px-6 py-20">
      <h2 className="text-4xl font-semibold text-white tracking-[-0.01em]">
        Recent Shares
      </h2>
      <p className="mt-2 text-base text-[#A3A3A3]">
        Files you&apos;ve shared in this session
      </p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.recentShares.map((share) => {
          const { color } = getFileIcon(share.fileType);
          return (
            <div
              key={share.code}
              className="share-card group bg-[#141414] rounded-xl p-6 border border-[#2A2A2A] hover:border-[#3A3A3A] hover:-translate-y-1 transition-all duration-300"
              style={{
                boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4)',
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${color}15`, color }}
                >
                  {getIconComponent(share.fileType)}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-base font-medium text-white truncate">
                    {share.fileName}
                  </p>
                  <p className="text-sm text-[#A3A3A3]">
                    {formatFileSize(share.fileSize)}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-[#2A2A2A]">
                <div className="flex items-center justify-between">
                  <code className="text-lg font-semibold text-[#4F46E5] font-mono tracking-wider">
                    {share.code}
                  </code>
                  <button
                    onClick={() => copyToClipboard(share.code)}
                    className="p-2 rounded-lg hover:bg-[#2A2A2A] transition-colors text-[#A3A3A3] hover:text-white"
                    title="Copy code"
                  >
                    <Copy size={14} />
                  </button>
                </div>
                <p className="mt-2 text-xs text-[#737373]">
                  {formatTime(share.timestamp)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
