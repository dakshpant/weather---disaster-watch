import React, { useEffect, useRef } from 'react';
import { StateSelector } from './StateSelector';
import { motion } from 'motion/react';

export const Hero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', resize);
    resize();

    const dots: { x: number; y: number; baseY: number; offset: number }[] = [];
    const spacing = 30;
    const rows = Math.ceil(height / spacing);
    const cols = Math.ceil(width / spacing);

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        dots.push({
          x: i * spacing,
          y: j * spacing,
          baseY: j * spacing,
          offset: i * 0.2 + j * 0.1, // Phase shift
        });
      }
    }

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.fillStyle = '#0a0a0a'; // Background color
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#1a1a1a'; // Dot color (faint)

      dots.forEach((dot) => {
        // Wave calculation
        const wave = Math.sin(dot.x * 0.005 + time + dot.offset) * Math.cos(dot.y * 0.005 + time) * 15;
        const y = dot.baseY + wave;
        
        // Distance from center for opacity/size
        // const dx = dot.x - width / 2;
        // const dy = y - height / 2;
        // const dist = Math.sqrt(dx * dx + dy * dy);
        // const maxDist = Math.sqrt((width/2)**2 + (height/2)**2);
        
        const size = 1.5;
        
        // Draw dot
        ctx.beginPath();
        ctx.arc(dot.x, y, size, 0, Math.PI * 2);
        
        // Dynamic color based on wave height
        const intensity = (wave + 15) / 30; // 0 to 1
        if (intensity > 0.8) {
            ctx.fillStyle = `rgba(0, 240, 255, ${intensity * 0.5})`; // Electric blue highlights
        } else {
            ctx.fillStyle = `rgba(50, 50, 50, 0.3)`;
        }
        
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className="relative h-screen flex flex-col justify-center items-center overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-0"
      />
      
      <div className="relative z-10 w-full max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">
            FORTIS
          </h1>
          <p className="text-lg md:text-xl text-fortis-muted mb-12 tracking-wide max-w-2xl mx-auto">
            FOREWARNING & RISK TRACKING INTELLIGENT SYSTEM
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <StateSelector />
        </motion.div>
      </div>
      
      <div className="absolute bottom-10 left-0 right-0 flex justify-center">
        <div className="animate-bounce text-fortis-muted/50">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                <path d="M7 13l5 5 5-5M7 6l5 5 5-5"/>
            </svg>
        </div>
      </div>
    </section>
  );
};
