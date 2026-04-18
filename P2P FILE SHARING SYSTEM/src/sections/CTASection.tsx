import { useEffect, useRef, useState } from 'react';
import { useFileStore } from '@/hooks/useFileStore';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function CTASection() {
  const { showToast } = useFileStore();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      showToast('Thanks for subscribing!', 'success');
      setEmail('');
    }
  };

  return (
    <section
      ref={sectionRef}
      className="max-w-[1100px] mx-auto px-6 py-20"
    >
      <div className="brand-gradient rounded-2xl p-12 md:p-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div>
            <h2 className="text-4xl font-semibold text-white tracking-[-0.01em]">
              Ready to Share?
            </h2>
            <p className="mt-4 text-lg text-white/80 leading-relaxed">
              Start sharing files securely, right from your browser.
            </p>
          </div>

          {/* Right - Form */}
          <div>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 bg-white text-[#1A1A1A] rounded-full px-6 py-3.5 text-base placeholder:text-[#A3A3A3] focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <button
                type="submit"
                className="bg-white/20 hover:bg-white/30 text-white font-semibold px-8 py-3.5 rounded-full transition-colors duration-300 whitespace-nowrap"
              >
                Get Notified
              </button>
            </form>
            <p className="mt-3 text-xs text-white/60">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
