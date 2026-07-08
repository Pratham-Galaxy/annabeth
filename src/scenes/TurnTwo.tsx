import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { PenLine } from 'lucide-react';
import { audio } from '../lib/audio';
import { TURN_TWO_LETTER } from '../config/content';
import { SceneShell, ContinueButton } from '../components/ui/Overlay';
import { SceneHeader } from '../components/ui/SceneHeader';
import { RaceScene } from '../three/RaceScene';

export function TurnTwo({ onDone, progress, tyreColor = '#e10600' }: { onDone: () => void; progress: number; tyreColor?: string }) {
  const [typed, setTyped] = useState('');
  const [done, setDone] = useState(false);
  const idx = useRef(0);

  useEffect(() => {
    const text = TURN_TWO_LETTER.text;
    const interval = window.setInterval(() => {
      if (idx.current >= text.length) {
        window.clearInterval(interval);
        setDone(true);
        audio.ding();
        return;
      }
      const char = text[idx.current];
      setTyped((t) => t + char);
      idx.current++;
      if (char !== ' ' && char !== '\n' && idx.current % 3 === 0) {
        audio.tone(2200 + Math.random() * 200, 0.02, 'square', 0.02);
      }
    }, 28);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <SceneShell>
      <div className="absolute inset-0 z-0 opacity-30">
        <RaceScene progress={progress} tyreColor={tyreColor} cameraMode="wide" />
      </div>

      <SceneHeader corner="Turn 2 · Lap 1" title="A Letter from the Engineer" tag="Personal" />

      <div className="relative z-10 min-h-[100dvh] flex flex-col items-center justify-center px-6 py-[14vh]">
        <motion.div
          initial={{ opacity: 0, y: 30, rotateX: 10 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.8 }}
          className="hud-panel max-w-2xl w-full p-6 md:p-10 relative"
          style={{ transformPerspective: 800 }}
        >
          {/* Paper texture header */}
          <div className="flex items-center gap-2 mb-5 text-racing-gold">
            <PenLine size={18} />
            <span className="font-telemetry text-xs tracking-[0.3em] uppercase">
              Classified · Pit Wall Memo
            </span>
          </div>

          <div className="font-body text-base md:text-lg text-carbon-200 leading-relaxed whitespace-pre-line min-h-[300px]">
            {typed}
            {!done && <span className="inline-block w-[2px] h-5 bg-racing-red animate-pulse ml-0.5" />}
          </div>

          {done && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-6 text-right"
            >
              <p className="font-handwritten text-3xl text-racing-gold">— {TURN_TWO_LETTER.signature}</p>
            </motion.div>
          )}
        </motion.div>

        {done && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-8"
          >
            <ContinueButton onClick={onDone} label="Next Corner" delay={0.2} />
          </motion.div>
        )}
      </div>
    </SceneShell>
  );
}
