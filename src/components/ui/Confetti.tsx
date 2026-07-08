import { motion } from 'framer-motion';
import { useMemo } from 'react';

type Props = {
  count?: number;
  colors?: string[];
  duration?: number;
};

const F1_COLORS = ['#e10600', '#ffd700', '#00d46a', '#0080ff', '#ffffff', '#ff6a00'];

export function Confetti({ count = 80, colors = F1_COLORS, duration = 4 }: Props) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 2,
        duration: duration + Math.random() * 2,
        rotation: Math.random() * 720 - 360,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 6 + Math.random() * 8,
        drift: (Math.random() - 0.5) * 30,
      })),
    [count, colors, duration],
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -20, x: `${p.x}%`, opacity: 1, rotate: 0 }}
          animate={{ y: '110vh', x: `calc(${p.x}% + ${p.drift}px)`, opacity: [1, 1, 0], rotate: p.rotation }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
          className="absolute"
          style={{
            width: p.size,
            height: p.size * 0.5,
            backgroundColor: p.color,
            borderRadius: 1,
          }}
        />
      ))}
    </div>
  );
}
