import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  opacity: number;
  baseOpacity: number;
}

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 25 : 50;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function createParticles() {
      const particles: Particle[] = [];
      for (let i = 0; i < particleCount; i++) {
        const baseOpacity = 0.15 + Math.random() * 0.35;
        particles.push({
          x: Math.random() * (canvas?.width || window.innerWidth),
          y: Math.random() * (canvas?.height || window.innerHeight),
          radius: 1.5 + Math.random() * 3,
          vx: (Math.random() - 0.5) * 0.3,
          vy: -0.2 - Math.random() * 0.4,
          opacity: baseOpacity,
          baseOpacity,
        });
      }
      return particles;
    }

    function drawParticle(p: Particle) {
      if (!ctx) return;

      // Glow effect
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3);
      gradient.addColorStop(0, `rgba(200, 180, 120, ${p.opacity})`);
      gradient.addColorStop(0.4, `rgba(180, 160, 100, ${p.opacity * 0.5})`);
      gradient.addColorStop(1, 'rgba(180, 160, 100, 0)');

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Core dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(220, 200, 140, ${p.opacity + 0.1})`;
      ctx.fill();
    }

    function updateParticle(p: Particle) {
      const w = canvas?.width || window.innerWidth;
      const h = canvas?.height || window.innerHeight;

      p.x += p.vx;
      p.y += p.vy;

      // Wrap around
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10;
      if (p.y > h + 10) p.y = -10;

      // Mouse interaction
      const dx = p.x - mouseRef.current.x;
      const dy = p.y - mouseRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 150) {
        const force = (150 - dist) / 150;
        p.opacity = Math.min(1, p.baseOpacity + force * 0.5);
        p.x += (dx / dist) * force * 1.5;
        p.y += (dy / dist) * force * 1.5;
      } else {
        p.opacity += (p.baseOpacity - p.opacity) * 0.05;
      }
    }

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particlesRef.current) {
        updateParticle(p);
        drawParticle(p);
      }

      animFrameRef.current = requestAnimationFrame(animate);
    }

    resize();
    particlesRef.current = createParticles();
    animate();

    const handleResize = () => {
      resize();
      particlesRef.current = createParticles();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
