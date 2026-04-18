import { useEffect, useRef } from 'react';
import { Link, Lock, Infinity, UserX, Timer, Monitor } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: Link,
    title: 'Peer-to-Peer',
    description: 'Files transfer directly between browsers. No data passes through our servers.',
    color: '#4F46E5',
  },
  {
    icon: Lock,
    title: 'End-to-End Encryption',
    description: 'Every transfer is encrypted with AES-256. Only you and the recipient can access the file.',
    color: '#7C3AED',
  },
  {
    icon: Infinity,
    title: 'No File Size Limits',
    description: 'Share files of any size. The only limit is your internet connection.',
    color: '#10B981',
  },
  {
    icon: UserX,
    title: 'No Registration',
    description: 'No accounts, no emails, no passwords. Just open and start sharing.',
    color: '#F59E0B',
  },
  {
    icon: Timer,
    title: 'Auto-Expire',
    description: 'Share links expire after 24 hours or when the browser tab closes.',
    color: '#EF4444',
  },
  {
    icon: Monitor,
    title: 'Cross-Platform',
    description: 'Works on any device with a modern browser. Desktop, mobile, tablet.',
    color: '#3B82F6',
  },
];

export default function Features() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const cards = sectionRef.current.querySelectorAll('.feature-card');
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="max-w-[1440px] mx-auto px-6 py-20">
      <h2 className="text-4xl font-semibold text-white tracking-[-0.01em] text-center">
        Built for Privacy
      </h2>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="feature-card group bg-[#141414] rounded-xl p-8 border border-[#2A2A2A] hover:border-[#3A3A3A] hover:bg-[#1A1A1A] hover:-translate-y-0.5 transition-all duration-300"
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background: `${feature.color}15`, color: feature.color }}
            >
              <feature.icon size={22} />
            </div>

            <h3 className="mt-4 text-xl font-semibold text-white">
              {feature.title}
            </h3>
            <p className="mt-2 text-base text-[#A3A3A3] leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
