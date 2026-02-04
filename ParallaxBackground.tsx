import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
  delay: number;
}

export function ParallaxBackground() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [particles] = useState<Particle[]>(() => 
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 300 + 100,
      color: ['cyan', 'purple', 'pink'][Math.floor(Math.random() * 3)],
      speed: Math.random() * 0.5 + 0.5,
      delay: Math.random() * 5,
    }))
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const getColorClass = (color: string) => {
    switch (color) {
      case 'cyan':
        return 'bg-cyan-500/20';
      case 'purple':
        return 'bg-purple-500/20';
      case 'pink':
        return 'bg-pink-500/20';
      default:
        return 'bg-cyan-500/20';
    }
  };

  return (
    <>
      {/* Noise overlay */}
      <div className="noise-overlay" />
      
      {/* Grid pattern */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          transform: `translate(${mousePos.x * 0.1}px, ${mousePos.y * 0.1}px)`,
        }}
      />
      
      {/* Floating orbs */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`parallax-bg rounded-full blur-3xl ${getColorClass(particle.color)} animate-float`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            transform: `translate(${mousePos.x * particle.speed}px, ${mousePos.y * particle.speed}px)`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${6 + particle.delay}s`,
          }}
        />
      ))}
      
      {/* Gradient mesh */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-50"
        style={{
          background: `
            radial-gradient(ellipse at 20% 20%, rgba(6, 182, 212, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, rgba(168, 85, 247, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)
          `,
          transform: `translate(${mousePos.x * 0.3}px, ${mousePos.y * 0.3}px)`,
        }}
      />
      
      {/* Animated lines */}
      <svg className="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-20" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
            <stop offset="50%" stopColor="#06b6d4" stopOpacity="1" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line 
          x1="0%" y1="30%" x2="100%" y2="70%" 
          stroke="url(#lineGradient)" 
          strokeWidth="1"
          style={{
            transform: `translateY(${mousePos.y * 0.5}px)`,
          }}
        />
        <line 
          x1="0%" y1="70%" x2="100%" y2="30%" 
          stroke="url(#lineGradient)" 
          strokeWidth="1"
          style={{
            transform: `translateY(${-mousePos.y * 0.5}px)`,
          }}
        />
      </svg>
    </>
  );
}
