import { useRef } from 'react';
export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  color: string;
}
export const useParticles = () => {
  const particlesRef = useRef<Particle[]>([]);
  const spawnParticle = (x: number, y: number, color: string = '#ffffff', count: number = 5) => {
    for (let i = 0; i < count; i++) {
      particlesRef.current.push({
        id: Math.random(),
        x,
        y,
        life: 1.0,
        size: Math.random() * 4 + 2,
        color,
      });
    }
  };
  const updateAndDrawParticles = (ctx: CanvasRenderingContext2D) => {
    if (particlesRef.current.length === 0) return;
    for (let i = particlesRef.current.length - 1; i >= 0; i--) {
      const p = particlesRef.current[i];
      p.x += p.vx;
      p.y += p.vy;
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      if (p.life <= 0) {
        particlesRef.current.splice(i, 1);
      }
    }
  };
  return {
    spawnParticle,
    updateAndDrawParticles
  };
};
