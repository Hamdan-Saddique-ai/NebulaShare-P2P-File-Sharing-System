import { useEffect, useRef } from 'react';
import { Upload, QrCode, Download } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: '01',
    title: 'Upload Your File',
    description: 'Drag and drop any file up to 2GB. We instantly prepare it for peer-to-peer transfer.',
    icon: Upload,
  },
  {
    number: '02',
    title: 'Get a Share Code',
    description: 'Receive a unique 6-character code and a QR code. Send it to anyone, anywhere.',
    icon: QrCode,
  },
  {
    number: '03',
    title: 'Direct Download',
    description: 'The recipient enters the code and downloads directly from your browser. No cloud storage involved.',
    icon: Download,
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const items = sectionRef.current.querySelectorAll('.step-item');
    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
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
        How It Works
      </h2>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step) => (
          <div key={step.number} className="step-item">
            <div className="flex items-center gap-4">
              <span className="text-5xl font-bold text-gradient font-mono tracking-tight">
                {step.number}
              </span>
              <div className="w-12 h-12 rounded-xl bg-[#141414] border border-[#2A2A2A] flex items-center justify-center text-[#4F46E5]">
                <step.icon size={22} />
              </div>
            </div>

            <h3 className="mt-6 text-xl font-semibold text-white">
              {step.title}
            </h3>
            <p className="mt-2 text-base text-[#A3A3A3] leading-relaxed">
              {step.description}
            </p>

            <div className="mt-8 h-px bg-[#2A2A2A]" />
          </div>
        ))}
      </div>
    </section>
  );
}
