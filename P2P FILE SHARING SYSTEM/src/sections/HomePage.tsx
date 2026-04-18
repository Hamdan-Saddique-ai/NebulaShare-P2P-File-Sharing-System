import { useEffect, useRef } from 'react';
import DropZone from './DropZone';
import RecentShares from './RecentShares';
import MarqueeRibbon from './MarqueeRibbon';
import HowItWorks from './HowItWorks';
import Features from './Features';
import Testimonials from './Testimonials';
import CTASection from './CTASection';
import gsap from 'gsap';

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Hero title character animation
    if (titleRef.current) {
      const chars = titleRef.current.querySelectorAll('.char');
      gsap.fromTo(
        chars,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.03,
          stagger: 0.03,
          ease: 'none',
          delay: 0.3,
        }
      );
    }
  }, []);

  const splitText = (text: string) => {
    return text.split('').map((char, i) => (
      <span
        key={i}
        className="char inline-block opacity-0"
        style={{ whiteSpace: char === ' ' ? 'pre' : undefined }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  return (
    <div ref={heroRef} className="relative" style={{ zIndex: 1 }}>
      {/* Hero Glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(79, 70, 229, 0.15) 0%, transparent 70%)',
        }}
      />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-[680px] mx-auto text-center">
          {/* Title */}
          <h1
            ref={titleRef}
            className="text-[32px] sm:text-[40px] lg:text-[48px] font-semibold leading-[1.1] tracking-[-0.02em]"
          >
            <span className="text-white block">
              {splitText('Share Files')}
            </span>
            <span className="text-gradient block mt-1">
              {splitText('Directly.')}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg text-[#A3A3A3] leading-relaxed max-w-[500px] mx-auto opacity-0 animate-[fadeIn_0.6s_ease-out_1.2s_forwards]">
            No servers. No storage limits. Just peer-to-peer file transfers, encrypted end-to-end.
          </p>

          {/* Drop Zone */}
          <div className="mt-10 opacity-0 animate-[fadeInUp_0.6s_ease-out_1.5s_forwards]">
            <DropZone />
          </div>

          {/* Stats Bar */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 lg:gap-12 opacity-0 animate-[fadeInUp_0.6s_ease-out_2s_forwards]">
            <StatItem label="Free Forever" />
            <div className="hidden sm:block w-px h-4 bg-[#2A2A2A]" />
            <StatItem label="End-to-End Encrypted" />
            <div className="hidden sm:block w-px h-4 bg-[#2A2A2A]" />
            <StatItem label="No File Size Limit" />
            <div className="hidden lg:block w-px h-4 bg-[#2A2A2A]" />
            <StatItem label="Direct P2P" />
          </div>
        </div>
      </section>

      {/* Marquee Ribbon */}
      <MarqueeRibbon />

      {/* Recent Shares */}
      <RecentShares />

      {/* How It Works */}
      <HowItWorks />

      {/* Features */}
      <Features />

      {/* Testimonials */}
      <Testimonials />

      {/* CTA Section */}
      <CTASection />

      {/* Spacer before footer */}
      <div className="h-20" />
    </div>
  );
}

function StatItem({ label }: { label: string }) {
  const chars = label.split('');

  return (
    <div className="group relative overflow-hidden h-5 cursor-default">
      <div className="flex">
        {chars.map((char, i) => (
          <span
            key={i}
            className="inline-block text-sm font-medium text-[#A3A3A3] transition-transform duration-400 ease-out group-hover:-translate-y-full"
            style={{
              transitionDelay: `${i * 15}ms`,
              whiteSpace: char === ' ' ? 'pre' : undefined,
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </div>
      <div className="flex absolute top-full left-0">
        {chars.map((char, i) => (
          <span
            key={i}
            className="inline-block text-sm font-medium text-white transition-transform duration-400 ease-out group-hover:-translate-y-full"
            style={{
              transitionDelay: `${i * 15}ms`,
              whiteSpace: char === ' ' ? 'pre' : undefined,
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </div>
    </div>
  );
}

// CSS keyframes for initial animations
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);
