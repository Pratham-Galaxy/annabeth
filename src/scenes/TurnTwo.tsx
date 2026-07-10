import { motion } from 'framer-motion';
import { PenLine } from 'lucide-react';
import { SceneShell, ContinueButton } from '../components/ui/Overlay';
import { SceneHeader } from '../components/ui/SceneHeader';
import { RaceScene } from '../three/RaceScene';
import { TURN_TWO_LETTER } from '../config/content';

export function TurnTwo({
  onDone,
  progress,
  tyreColor = '#e10600',
}: {
  onDone: () => void;
  progress: number;
  tyreColor?: string;
}) {
  return (
    <SceneShell>
      <div className="absolute inset-0 z-0 opacity-30">
        <RaceScene
          progress={progress}
          tyreColor={tyreColor}
          cameraMode="wide"
        />
      </div>

      <SceneHeader
        corner="Turn 2 · Lap 1"
        title="A Letter from the Engineer"
        tag="Personal"
      />

      <div className="relative z-10 min-h-[100dvh] flex flex-col items-center justify-center px-6 py-[14vh]">
        <motion.div
          initial={{ opacity: 0, y: 30, rotateX: 10 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.8 }}
          className="hud-panel max-w-2xl w-full p-6 md:p-10 relative"
          style={{ transformPerspective: 800 }}
        >
          {/* Header */}
          <div className="flex items-center gap-2 mb-5 text-racing-gold">
            <PenLine size={18} />
            <span className="font-telemetry text-xs tracking-[0.3em] uppercase">
              Classified · Pit Wall Memo
            </span>
          </div>

          {/* Letter */}
          <div className="font-body text-base md:text-lg text-carbon-200 leading-relaxed whitespace-pre-line min-h-[300px]">
            {TURN_TWO_LETTER.text}
          </div>

          {/* Signature */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 text-right"
          >
            <p className="font-handwritten text-3xl text-racing-gold">
              — {TURN_TWO_LETTER.signature}
            </p>
          </motion.div>
        </motion.div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <ContinueButton
            onClick={onDone}
            label="Next Corner"
            delay={0.2}
          />
        </motion.div>
      </div>
    </SceneShell>
  );
}