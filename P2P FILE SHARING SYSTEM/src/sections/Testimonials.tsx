import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Designer',
    quote: 'The fastest way to share large design files with clients. No more uploading to cloud storage and waiting for sync.',
    gradient: 'from-[#7C3AED] to-[#4F46E5]',
  },
  {
    name: 'Marcus Johnson',
    role: 'Developer',
    quote: 'Finally a file sharing tool that respects privacy. P2P encryption means I can share sensitive code without worrying.',
    gradient: 'from-[#4F46E5] to-[#10B981]',
  },
  {
    name: 'Aiko Tanaka',
    role: 'Photographer',
    quote: 'I share 500MB+ RAW photos daily. DropLink handles them effortlessly. The share codes are genius.',
    gradient: 'from-[#10B981] to-[#3B82F6]',
  },
  {
    name: 'Leo Petrov',
    role: 'Journalist',
    quote: 'When working with sensitive sources, this is the only tool I trust. No logs, no servers, no trail.',
    gradient: 'from-[#3B82F6] to-[#7C3AED]',
  },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const cards = sectionRef.current.querySelectorAll('.testimonial-card');
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
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
    <section ref={sectionRef} className="max-w-[1100px] mx-auto px-6 py-20">
      <h2 className="text-4xl font-semibold text-white tracking-[-0.01em] text-center">
        Loved by Users
      </h2>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((t) => (
          <div
            key={t.name}
            className="testimonial-card bg-[#141414] rounded-xl p-8 border border-[#2A2A2A] hover:border-[#3A3A3A] hover:-translate-y-0.5 transition-all duration-300"
          >
            <span className="text-5xl text-gradient leading-none">&ldquo;</span>

            <p className="mt-2 text-base text-[#A3A3A3] leading-relaxed italic">
              {t.quote}
            </p>

            <div className="mt-6 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} p-[2px]`}>
                <div className="w-full h-full rounded-full bg-[#141414] flex items-center justify-center">
                  <span className="text-sm font-semibold text-white">
                    {t.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{t.name}</p>
                <p className="text-sm text-[#737373]">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
