import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';
import { audio } from '../lib/audio';
import { MEMORY_CORNERS } from '../config/content';
import { SceneShell, ContinueButton } from '../components/ui/Overlay';
import { CornerBadge } from '../components/ui/SceneHeader';
import { RaceScene } from '../three/RaceScene';

export function MemoryCircuit({
  onDone,
  progress,
  tyreColor = '#e10600',
}: {
  onDone: () => void;
  progress: number;
  tyreColor?: string;
}) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const total = MEMORY_CORNERS.length;
  const memory = MEMORY_CORNERS[index];

  const goNext = () => {
    audio.whoosh();
    if (index < total - 1) {
      setDirection(1);
      setIndex((i) => i + 1);
    } else {
      onDone();
    }
  };

  const goPrev = () => {
    if (index > 0) {
      audio.whoosh();
      setDirection(-1);
      setIndex((i) => i - 1);
    }
  };

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
  };

  return (
    <SceneShell>
      <div className="absolute inset-0 z-0 opacity-35">
        <RaceScene progress={progress} tyreColor={tyreColor} cameraMode="corner" />
      </div>

      {/* Top HUD */}
      <div className="absolute top-[8vh] left-0 right-0 z-10 flex flex-col items-center gap-3 no-select px-6">
        <div className="font-telemetry text-racing-red text-xs tracking-[0.4em] uppercase">
          Memory Circuit · {memory.corner}
        </div>
        <CornerBadge index={index} total={total} />
      </div>

      <div className="relative z-10 min-h-[100dvh] flex flex-col items-center justify-center px-6 py-[16vh]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={memory.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4 }}
            className="max-w-2xl w-full"
          >
            <div className="hud-panel overflow-hidden">
              {/* Photo */}
              <div className="relative h-56 md:h-64 overflow-hidden bg-carbon-800">
                <img
                  src={memory.image}
                  alt={memory.title}
                  className="w-full h-full object-cover opacity-80"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-carbon-950 via-carbon-950/30 to-transparent" />
                <div className="absolute top-3 left-3 px-3 py-1 bg-racing-red rounded-full font-telemetry text-[10px] tracking-widest text-white uppercase">
                  {memory.tag}
                </div>
                <div className="absolute bottom-3 left-4">
                  <h2 className="font-display text-3xl md:text-4xl text-white drop-shadow-lg">
                    {memory.title}
                  </h2>
                </div>
                {/* Placeholder hint */}
                <div className="absolute bottom-3 right-3 flex items-center gap-1.5 text-carbon-400 font-telemetry text-[10px] uppercase tracking-wider bg-carbon-950/70 px-2 py-1 rounded">
                  <ImageIcon size={12} /> Replaceable
                </div>
              </div>

              {/* Message */}
              <div className="p-6 md:p-8">
                <p className="font-body text-base md:text-lg text-carbon-200 leading-relaxed">
                  {memory.message}
                </p>
                <div className="mt-4 text-xs text-carbon-500 font-telemetry uppercase tracking-wider">
                  {memory.placeholder}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Nav */}
        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={goPrev}
            disabled={index === 0}
            className="p-2.5 hud-panel text-carbon-300 disabled:opacity-30 hover:text-racing-red transition-colors no-select"
            aria-label="Previous memory"
          >
            <ChevronLeft size={22} />
          </button>

          <div className="font-telemetry text-carbon-400 text-sm tracking-widest">
            {index + 1} / {total}
          </div>

          <button
            onClick={goNext}
            className="p-2.5 hud-panel text-carbon-300 hover:text-racing-red transition-colors no-select"
            aria-label="Next memory"
          >
            <ChevronRight size={22} />
          </button>
        </div>

        {index === total - 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6"
          >
            <ContinueButton onClick={onDone} label="Trophy Room" />
          </motion.div>
        )}
      </div>
    </SceneShell>
  );
}
