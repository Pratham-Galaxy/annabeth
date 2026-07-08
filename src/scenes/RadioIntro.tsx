import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Radio } from 'lucide-react';
import { audio } from '../lib/audio';
import { RADIO_INTRO } from '../config/content';
import { SceneShell, RadioStaticOverlay, ContinueButton } from '../components/ui/Overlay';

export function RadioIntro({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const [staticActive, setStaticActive] = useState(true);

  const advance = () => setStep((s) => Math.min(s + 1, RADIO_INTRO.lines.length));

  useEffect(() => {
    if (step < RADIO_INTRO.lines.length) {
      setStaticActive(true);
      audio.radioStatic(0.5);
      const t = window.setTimeout(() => setStaticActive(false), 500);
      return () => clearTimeout(t);
    }
  }, [step]);

  const current = RADIO_INTRO.lines[step];
  const isCopyPrompt = current && 'copyPrompt' in current;
  const finished = step >= RADIO_INTRO.lines.length;

  return (
    <SceneShell>
      <RadioStaticOverlay active={staticActive} />
      <div className="relative z-10 min-h-[100dvh] flex flex-col items-center justify-center px-6 no-select">
        {/* Radio device */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="hud-panel scanlines p-8 md:p-12 max-w-lg w-full text-center relative overflow-hidden">
            <div className="flex items-center justify-center gap-3 mb-6 text-racing-red">
              <Radio className="animate-pulse" size={28} />
              <span className="font-telemetry text-xs tracking-[0.3em] uppercase">
                Pit Wall · Channel 1
              </span>
            </div>

            {/* Signal bars */}
            <div className="flex items-end justify-center gap-1 h-6 mb-6">
              {[0.3, 0.5, 0.7, 1].map((h, i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: staticActive ? [0.3, 1, 0.3] : 0.8 }}
                  transition={{ duration: 0.5, repeat: staticActive ? Infinity : 0 }}
                  className="w-1.5 bg-racing-green rounded-sm"
                  style={{ height: `${h * 100}%` }}
                />
              ))}
            </div>

            <div className="min-h-[120px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                {current && !isCopyPrompt && (
                  <motion.p
                    key={step}
                    initial={{ opacity: 0, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, filter: 'blur(8px)' }}
                    transition={{ duration: 0.4 }}
                    className="font-display text-2xl md:text-4xl text-carbon-100 leading-tight"
                  >
                    {current.engineer}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Copy prompt button */}
            {isCopyPrompt && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => {
                  audio.radioBeep();
                  audio.radioStatic(0.4);
                  setStaticActive(true);
                  window.setTimeout(() => setStaticActive(false), 400);
                  advance();
                }}
                className="mt-6 px-10 py-3.5 font-display text-lg tracking-[0.2em] text-carbon-100 border border-racing-green/60 hover:border-racing-green hover:bg-racing-green/10 transition-all rounded-lg no-select"
              >
                COPY
              </motion.button>
            )}

            {/* Tap to advance (engineer lines) */}
            {current && !isCopyPrompt && (
              <button
                onClick={() => {
                  audio.click();
                  advance();
                }}
                className="mt-6 text-carbon-500 hover:text-carbon-300 font-telemetry text-xs tracking-widest transition-colors no-select"
              >
                TAP TO CONTINUE →
              </button>
            )}
          </div>
        </motion.div>

        {finished && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-10"
          >
            <ContinueButton onClick={onDone} label="Race Begins" />
          </motion.div>
        )}
      </div>
    </SceneShell>
  );
}
