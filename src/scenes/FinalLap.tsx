import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { audio } from '../lib/audio';
import { TEAM } from '../config/team';
import { SceneShell } from '../components/ui/Overlay';
import { RaceScene } from '../three/RaceScene';

type Phase = 'radio' | 'finish' | 'podium' | 'ending' | 'lost';

export function FinalLap({ onDone, progress, tyreColor = '#e10600' }: { onDone: () => void; progress: number; tyreColor?: string }) {
  const [phase, setPhase] = useState<Phase>('radio');

  useEffect(() => {
    audio.radioStatic(0.8);
    const timers: number[] = [];
    timers.push(window.setTimeout(() => { audio.radioBeep(); setPhase('finish'); }, 2000));
    timers.push(window.setTimeout(() => { audio.chequered(); setPhase('podium'); }, 5000));
    timers.push(window.setTimeout(() => { audio.applause(); audio.firework(); }, 6500));
    timers.push(window.setTimeout(() => audio.firework(), 7500));
    timers.push(window.setTimeout(() => audio.firework(), 8500));
    timers.push(window.setTimeout(() => { audio.radioStatic(0.8); setPhase('ending'); }, 10000));
    timers.push(window.setTimeout(() => { audio.radioStatic(1.2); setPhase('lost'); }, 14000));
    timers.push(window.setTimeout(() => onDone(), 19000));
    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  return (
    <SceneShell>
      {/* 3D scene */}
      <div className="absolute inset-0 z-0">
        <RaceScene progress={progress} tyreColor={tyreColor} cameraMode="wide" staticView={phase === 'podium' || phase === 'ending'} />
      </div>

      {/* Fireworks */}
      {(phase === 'podium' || phase === 'ending') && <Fireworks />}

      <div className="relative z-10 min-h-[100dvh] flex flex-col items-center justify-center px-6 text-center">
        <AnimatePresence mode="wait">
          {phase === 'radio' && (
            <motion.div key="radio" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <p className="font-telemetry text-racing-red text-sm tracking-[0.3em] uppercase mb-4 animate-pulse">
                Engineer on radio...
              </p>
              <p className="font-display text-5xl md:text-7xl text-carbon-100">Driver...</p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="font-display text-5xl md:text-7xl text-racing-red glow-red mt-2"
              >
                Final Lap.
              </motion.p>
            </motion.div>
          )}

          {phase === 'finish' && (
            <motion.div key="finish" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              {/* Chequered flag */}
              <motion.div
                animate={{ rotate: [0, -3, 3, 0] }}
                transition={{ duration: 0.5, repeat: 3 }}
                className="inline-block mb-6"
              >
                <div className="w-32 h-20 rounded shadow-2xl overflow-hidden grid grid-cols-4 grid-rows-4">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className={(Math.floor(i / 4) + i) % 2 === 0 ? 'bg-white' : 'bg-carbon-950'} />
                  ))}
                </div>
              </motion.div>
              <p className="font-display text-6xl md:text-8xl text-racing-green glow-green">FINISH</p>
            </motion.div>
          )}

          {phase === 'podium' && (
            <motion.div key="podium" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <motion.h1
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="font-display text-6xl md:text-9xl text-racing-gold glow-gold leading-none"
              >
                P1!! P1!!
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="font-display text-2xl md:text-4xl text-carbon-100 mt-4"
              >
                YOU ARE THE FRIENDSHIP WORLD CHAMPION!
              </motion.p>
              {/* Podium */}
              <div className="flex items-end justify-center gap-3 mt-10">
                <div className="w-20 h-16 bg-carbon-700 rounded-t flex items-center justify-center">
                  <span className="font-display text-2xl text-carbon-300">P2</span>
                </div>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 80 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="w-24 bg-gradient-to-t from-racing-gold to-racing-gold/70 rounded-t flex items-center justify-center shadow-2xl"
                >
                  <div className="text-center">
                    <span className="font-display text-3xl text-carbon-950">P1</span>
                    <p className="font-telemetry text-[10px] text-carbon-950 uppercase">{TEAM.driver}</p>
                  </div>
                </motion.div>
                <div className="w-20 h-12 bg-carbon-700 rounded-t flex items-center justify-center">
                  <span className="font-display text-2xl text-carbon-300">P3</span>
                </div>
              </div>
              {/* Champagne */}
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: -45 }}
                transition={{ delay: 1 }}
                className="text-4xl mt-4"
              >
                🍾
              </motion.div>
            </motion.div>
          )}

          {phase === 'ending' && (
            <motion.div key="ending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <p className="font-display text-3xl md:text-5xl text-carbon-200 leading-tight max-w-xl">
                "No matter how many races life has left..."
              </p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="font-display text-3xl md:text-5xl text-racing-gold glow-gold mt-4 max-w-xl"
              >
                "Thank you for letting me be part of your team."
              </motion.p>
            </motion.div>
          )}

          {phase === 'lost' && (
            <motion.div key="lost" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="font-display text-2xl md:text-4xl text-carbon-300 max-w-xl leading-tight"
              >
                "Whenever life gets difficult..."
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="font-display text-2xl md:text-4xl text-carbon-100 max-w-xl mt-2"
              >
                "...this garage will always be here."
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ delay: 3, duration: 2 }}
                className="font-telemetry text-racing-red text-lg tracking-[0.4em] uppercase mt-10"
              >
                Connection Lost.
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fade to black for ending */}
      <AnimatePresence>
        {phase === 'lost' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 2 }}
            className="absolute inset-0 bg-carbon-950 z-20 pointer-events-none"
          />
        )}
      </AnimatePresence>
    </SceneShell>
  );
}

function Fireworks() {
  const bursts = [
    { x: 15, y: 30, delay: 0, color: '#e10600' },
    { x: 80, y: 25, delay: 0.3, color: '#ffd700' },
    { x: 50, y: 20, delay: 0.6, color: '#00d46a' },
    { x: 25, y: 40, delay: 1, color: '#0080ff' },
    { x: 70, y: 35, delay: 1.3, color: '#ff6a00' },
  ];
  return (
    <div className="pointer-events-none fixed inset-0 z-20">
      {bursts.map((b, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 1, x: `${b.x}%`, y: `${b.y}%` }}
          animate={{ scale: [0, 1, 0], opacity: [1, 1, 0] }}
          transition={{ delay: b.delay, duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
          className="absolute"
        >
          {Array.from({ length: 12 }).map((_, j) => (
            <div
              key={j}
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{
                backgroundColor: b.color,
                transform: `rotate(${j * 30}deg) translateY(-40px)`,
                transformOrigin: 'center',
              }}
            />
          ))}
        </motion.div>
      ))}
    </div>
  );
}
