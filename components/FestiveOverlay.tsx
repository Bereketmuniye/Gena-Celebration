
import React, { useEffect, useRef, useCallback, useState } from 'react';
import { playBurstSound, playMelkamGennaSpeech } from '../services/audio';
import { Tab } from '../types';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  life: number;
  flicker: number;
  rotation: number;
  rotationSpeed: number;
  type: 'flower' | 'grass' | 'pollen' | 'star';
  swirlAngle: number;
  swirlRadius: number;
  swirlSpeed: number;
}

const COLORS = {
  green: '#006400',    // Dark Green
  gold: '#FFD700',     // Gold
  red: '#8B0000',      // Deep Red
  adeyAbeba: '#FFD700',
  ketema: '#006400',
  glow: '#FFD700',
};

interface FestiveOverlayProps {
  activeTab: Tab;
}

const FestiveOverlay: React.FC<FestiveOverlayProps> = ({ activeTab }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const messageAlphaRef = useRef(0);
  const activeTabRef = useRef(activeTab);

  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);

  const drawFlower = (ctx: CanvasRenderingContext2D, radius: number) => {
    ctx.save();
    for (let i = 0; i < 5; i++) {
      ctx.rotate((Math.PI * 2) / 5);
      ctx.beginPath();
      ctx.ellipse(0, -radius, radius / 1.6, radius, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = COLORS.red;
    ctx.beginPath();
    ctx.arc(0, 0, radius / 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  const drawStar = (ctx: CanvasRenderingContext2D, radius: number) => {
    ctx.save();
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      ctx.lineTo(Math.cos((18 + i * 72) / 180 * Math.PI) * radius,
        -Math.sin((18 + i * 72) / 180 * Math.PI) * radius);
      ctx.lineTo(Math.cos((54 + i * 72) / 180 * Math.PI) * (radius / 2),
        -Math.sin((54 + i * 72) / 180 * Math.PI) * (radius / 2));
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  const spawnFlowerGalaxy = useCallback((originX: number, originY: number, intensity: number = 80, playAudio: boolean = true) => {
    if (playAudio) {
      playBurstSound(intensity > 100);
    }

    if (intensity > 150) {
      messageAlphaRef.current = 1; // Trigger "Melkam Genna" display
      if (playAudio) {
        playMelkamGennaSpeech(); // Play the actual greeting
      }
    }

    for (let i = 0; i < intensity; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 1;
      const rand = Math.random();

      let type: Particle['type'] = 'flower';
      let color = COLORS.gold;
      let radius = Math.random() * 12 + 8; // Increased size
      let life = 0.002 + Math.random() * 0.007;

      if (rand > 0.7) {
        type = 'grass';
        color = COLORS.ketema;
        radius = Math.random() * 20 + 10; // Increased size
      } else if (rand < 0.1) {
        type = 'star';
        color = '#FFFFFF';
        radius = Math.random() * 6 + 4; // Increased size
        life = 0.01 + Math.random() * 0.01;
      } else if (rand < 0.2) {
        type = 'pollen';
        color = COLORS.glow;
        radius = Math.random() * 4 + 2; // Increased size
        life = 0.01 + Math.random() * 0.02;
      } else {
        // Randomize flower colors from the festive palette
        const flowerColors = [COLORS.red, COLORS.gold, COLORS.green];
        color = flowerColors[Math.floor(Math.random() * flowerColors.length)];
      }

      particles.current.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius,
        color,
        alpha: 1,
        life,
        flicker: type === 'pollen' || type === 'star' ? 0.9 : Math.random() * 0.2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.1,
        type,
        swirlAngle: Math.random() * Math.PI * 2,
        swirlRadius: Math.random() * 60,
        swirlSpeed: (Math.random() - 0.5) * 0.04
      });
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrame: number;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const drawMessage = (alpha: number) => {
      if (alpha <= 0) return;
      ctx.save();
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2.5;

      ctx.globalAlpha = alpha;
      ctx.textAlign = 'center';

      // Shadow glow
      ctx.shadowBlur = 30;
      ctx.shadowColor = COLORS.gold;

      // Amharic Greeting
      const isMobile = canvas.width < 768;
      const fontSize = isMobile ? 40 : 64;
      ctx.font = `bold ${fontSize}px "Playfair Display", serif`;
      const gradient = ctx.createLinearGradient(centerX - 100, 0, centerX + 100, 0);
      gradient.addColorStop(0, COLORS.green);
      gradient.addColorStop(0.5, COLORS.gold);
      gradient.addColorStop(1, COLORS.red);

      ctx.fillStyle = gradient;
      ctx.fillText('መልካም ገና!', centerX, centerY);

      // English Translation
      const subFontSize = isMobile ? 20 : 32;
      ctx.font = `300 ${subFontSize}px "Inter", sans-serif`;
      ctx.fillStyle = COLORS.glow;
      ctx.fillText('Melkam Genna', centerX, centerY + (isMobile ? 35 : 50));

      ctx.restore();
    };

    const animate = () => {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.globalCompositeOperation = 'lighter';

      // Handle the "Melkam Genna" message fade
      messageAlphaRef.current = Math.max(0, messageAlphaRef.current - 0.005);
      drawMessage(messageAlphaRef.current);

      particles.current = particles.current.filter(p => {
        p.vx *= 0.99;
        p.vy *= 0.99;

        p.swirlAngle += p.swirlSpeed;
        const sx = Math.cos(p.swirlAngle) * 0.6;
        const sy = Math.sin(p.swirlAngle) * 0.6;

        p.x += p.vx + sx;
        p.y += p.vy + sy + (p.type === 'pollen' ? 0.2 : 0.9);

        p.x += Math.sin(Date.now() * 0.001 + p.y * 0.01) * 0.7;

        p.alpha -= p.life;
        p.rotation += p.rotationSpeed;

        if (p.alpha <= 0 || p.y > canvas.height + 20) return false;

        const alpha = p.alpha * (1 - Math.sin(Date.now() * 0.01) * p.flicker);
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;

        switch (p.type) {
          case 'flower':
            drawFlower(ctx, p.radius);
            break;
          case 'star':
            drawStar(ctx, p.radius);
            break;
          case 'grass':
            ctx.beginPath();
            ctx.moveTo(0, -p.radius);
            ctx.quadraticCurveTo(p.radius / 3, 0, 0, p.radius);
            ctx.quadraticCurveTo(-p.radius / 3, 0, 0, -p.radius);
            ctx.fill();
            break;
          case 'pollen':
            ctx.beginPath();
            ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
            ctx.fill();
            break;
        }
        ctx.restore();

        return true;
      });

      animationFrame = requestAnimationFrame(animate);
    };

    const handleWindowClick = (e: MouseEvent) => {
      if (activeTabRef.current === Tab.GIFT) return;
      spawnFlowerGalaxy(e.clientX, e.clientY, 60, false);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousedown', handleWindowClick);
    handleResize();
    animate();

    const initialCelebration = () => {
      // Spawn from all 4 corners
      const corners = [
        { x: 0, y: 0 },
        { x: window.innerWidth, y: 0 },
        { x: 0, y: window.innerHeight },
        { x: window.innerWidth, y: window.innerHeight }
      ];

      corners.forEach((corner, i) => {
        setTimeout(() => {
          spawnFlowerGalaxy(corner.x, corner.y, 120, false);
        }, i * 300);
      });

      // Multiple waves of "Melkam Genna" rain from top
      for (let i = 0; i < 6; i++) {
        setTimeout(() => {
          const x = Math.random() * window.innerWidth;
          const y = -30;
          spawnFlowerGalaxy(x, y, 70, false);
        }, (i + 4) * 400);
      }

      // Central "Melkam Genna" blast with voice
      setTimeout(() => {
        spawnFlowerGalaxy(window.innerWidth / 2, window.innerHeight / 2.5, 400, false);
      }, 1500);
    };

    const startTimer = setTimeout(initialCelebration, 1200);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousedown', handleWindowClick);
      cancelAnimationFrame(animationFrame);
      clearTimeout(startTimer);
    };
  }, [spawnFlowerGalaxy]);

  useEffect(() => {
    if (activeTab === Tab.CHAT) {
      const surprise = () => {
        for (let i = 0; i < 8; i++) {
          setTimeout(() => {
            const edge = Math.floor(Math.random() * 4);
            let x, y;
            switch (edge) {
              case 0: x = Math.random() * window.innerWidth; y = -20; break;
              case 1: x = window.innerWidth + 20; y = Math.random() * window.innerHeight; break;
              case 2: x = Math.random() * window.innerWidth; y = window.innerHeight + 20; break;
              case 3: x = -20; y = Math.random() * window.innerHeight; break;
              default: x = 0; y = 0;
            }
            spawnFlowerGalaxy(x, y, 50, false);
          }, i * 200);
        }
        // Central burst
        setTimeout(() => {
          spawnFlowerGalaxy(window.innerWidth / 2, window.innerHeight / 2, 100, false);
        }, 1000);
      };
      surprise();
    }
  }, [activeTab, spawnFlowerGalaxy]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[9999]"
        style={{
          mixBlendMode: 'normal',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
        }}
      />
      <button
        onClick={() => spawnFlowerGalaxy(window.innerWidth / 2, window.innerHeight / 2.5, 350, true)}
        className="fixed bottom-24 md:bottom-6 right-4 md:right-6 z-[10000] bg-amber-600/80 hover:bg-amber-500 text-white p-3 rounded-full shadow-lg transition-all hover:scale-110 backdrop-blur-sm"
        title="Replay Celebration"
      >
        🎉
      </button>
    </>
  );
};

export default FestiveOverlay;
