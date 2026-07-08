import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Package, Zap } from 'lucide-react';
import { audio } from '../lib/audio';
import { DRS_SECRET } from '../config/content';
import { SceneShell, ContinueButton } from '../components/ui/Overlay';
import { SceneHeader } from '../components/ui/SceneHeader';
import { RaceScene } from '../three/RaceScene';

type Phase = 'idle' | 'activated' | 'reveal';

export function DRSZone({ onDone, progress, tyreColor = '#e10600' }: { onDone: () => void; progress: number; tyreColor?: string }) {
  const [phase, setPhase] = useState<Phase>('idle');

  useEffect(() => {
    if (phase === 'activated') {
      audio.drs();
      const t = window.setTimeout(() => {
        audio.pop();
        setPhase('reveal');
      }, 1800);
      return () => clearTimeout(t);
    }
  }, [phase]);

  return (
    <SceneShell>
      <div className="absolute inset-0 z-0 opacity-50">
        <RaceScene progress={progress} tyreColor={tyreColor} drsOpen={phase !== 'idle'} cameraMode="chase" />
      </div>

      <SceneHeader corner="Detection Zone" title="DRS Available" tag="Overtake" />

      <div className="relative z-10 min-h-[100dvh] flex flex-col items-center justify-center px-6 text-center">
        {phase === 'idle' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="font-telemetry text-racing-green text-sm tracking-[0.3em] uppercase mb-6"
            >
              DRS Activated · 1.0s
            </motion.div>
            <p className="font-display text-4xl md:text-6xl text-carbon-100 mb-8">
              Deploy Rear Wing?
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                audio.unlock();
                setPhase('activated');
              }}
              className="px-12 py-4 font-display text-2xl tracking-[0.2em] text-carbon-950 bg-racing-green rounded-lg hover:shadow-[0_0_30px_rgba(0,212,106,0.6)] transition-shadow no-select"
            >
              <span className="flex items-center gap-3 justify-center">
                <Zap size={26} /> ENABLE DRS
              </span>
            </motion.button>
          </motion.div>
        )}

        {phase === 'activated' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <p className="font-display text-5xl md:text-7xl text-racing-green glow-green mb-6">
              DRS OPEN
            </p>
            <motion.div
              animate={{ x: [0, 200, 400], opacity: [1, 1, 0] }}
              transition={{ duration: 1.5 }}
              className="font-telemetry text-racing-green text-sm tracking-widest"
            >
              +15 KM/H · OVERTAKE MODE
            </motion.div>
          </motion.div>
        )}

        <AnimatePresence>
          {phase === 'reveal' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <motion.div
                initial={{ y: -20, rotate: -5 }}
                animate={{ y: 0, rotate: 0 }}
                className="inline-block mb-6"
              >
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-racing-gold to-racing-red flex items-center justify-center shadow-2xl">
                  <Package size={40} className="text-carbon-950" />
                </div>
              </motion.div>
              <p className="font-telemetry text-carbon-400 text-sm tracking-widest uppercase mb-2">
                Mystery Box Unlocked · Secret Nickname
              </p>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-display text-6xl md:text-8xl text-racing-gold glow-gold mb-4"
              >
                {DRS_SECRET.nickname}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="font-body text-carbon-300 max-w-md mx-auto mb-8"
              >
                {DRS_SECRET.meaning}
              </motion.p>
              <ContinueButton onClick={onDone} label="Memory Circuit" delay={0.3} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SceneShell>
  );
}
