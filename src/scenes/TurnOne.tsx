import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { Cake, Heart } from 'lucide-react';
import { audio } from '../lib/audio';
import { TURN_ONE_MESSAGE } from '../config/content';
import { SceneShell, ContinueButton } from '../components/ui/Overlay';
import { SceneHeader } from '../components/ui/SceneHeader';
import { Confetti } from '../components/ui/Confetti';
import { RaceScene } from '../three/RaceScene';

export function TurnOne({ onDone, progress, tyreColor = '#e10600' }: { onDone: () => void; progress: number; tyreColor?: string }) {
  useEffect(() => {
    audio.pop();
    const t = window.setTimeout(() => audio.ding(), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <SceneShell>
      {/* 3D background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <RaceScene progress={progress} tyreColor={tyreColor} cameraMode="corner" />
      </div>
      <Confetti count={100} />

      <SceneHeader corner="Turn 1 · Lap 1" title="Birthday Celebration" tag="Lights Out" />

      <div className="relative z-10 min-h-[100dvh] flex flex-col items-center justify-center px-6 text-center">
        {/* Cake */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="mb-8"
        >
          <div className="relative">
            <div className="w-40 h-32 bg-gradient-to-b from-racing-red to-racing-redDark rounded-lg shadow-2xl flex items-center justify-center">
              <Cake size={56} className="text-white" />
            </div>
            {/* Candle flame */}
            <motion.div
              animate={{ scaleY: [1, 1.2, 0.9, 1], opacity: [1, 0.8, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="absolute -top-5 left-1/2 -translate-x-1/2 w-2 h-6 bg-gradient-to-t from-racing-yellow to-racing-orange rounded-full"
              style={{ filter: 'blur(1px)' }}
            />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="font-display text-5xl md:text-7xl text-carbon-100 leading-none"
        >
          Happy Birthday <span className="text-racing-red glow-red">Aastha</span>{' '}
          <Heart className="inline text-racing-red fill-racing-red" size={40} />
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-6 font-body text-lg md:text-xl text-carbon-300 max-w-md whitespace-pre-line"
        >
          {TURN_ONE_MESSAGE.body}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="mt-10"
        >
          <ContinueButton onClick={onDone} label="Next Corner" />
        </motion.div>
      </div>
    </SceneShell>
  );
}
