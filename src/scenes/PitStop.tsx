import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { audio } from '../lib/audio';
import { TYRE_CHOICES } from '../config/content';
import { SceneShell, ContinueButton } from '../components/ui/Overlay';
import { SceneHeader } from '../components/ui/SceneHeader';

type Phase = 'call' | 'pit' | 'choose' | 'fitted';

export function PitStop({
  onDone,
  onTyreSelect,
}: {
  onDone: () => void;
  onTyreSelect: (color: string) => void;
}) {
  const [phase, setPhase] = useState<Phase>('call');
  const [selected, setSelected] = useState<(typeof TYRE_CHOICES)[number] | null>(null);

  useEffect(() => {
    audio.radioStatic(0.6);
    const t1 = window.setTimeout(() => {
      audio.radioBeep();
      setPhase('pit');
    }, 1800);
    const t2 = window.setTimeout(() => setPhase('choose'), 4200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const handleSelect = (tyre: (typeof TYRE_CHOICES)[number]) => {
    audio.whoosh();
    audio.pop();
    setSelected(tyre);
    onTyreSelect(tyre.color);
    setPhase('fitted');
  };

  return (
    <SceneShell>
      <SceneHeader corner="Pit Lane" title="Box Box Box" tag="Stop 1" />

      <div className="relative z-10 min-h-[100dvh] flex flex-col items-center justify-center px-6">
        {/* Radio call */}
        {phase === 'call' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <motion.p
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="font-telemetry text-racing-red text-sm tracking-[0.3em] uppercase mb-3"
            >
              Engineer on radio...
            </motion.p>
            <p className="font-display text-4xl md:text-6xl text-carbon-100">Driver, Box this lap.</p>
          </motion.div>
        )}

        {/* Pit animation */}
        {phase === 'pit' && (
          <div className="text-center">
            <p className="font-display text-3xl md:text-5xl text-carbon-200 mb-8">Entering Pit Lane</p>
            <div className="flex items-center justify-center gap-6">
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: [30, 0, 30, 0] }}
                  transition={{ delay: i * 0.3, duration: 1.2, repeat: Infinity }}
                  className="w-12 h-12 rounded-full border-4 border-carbon-600"
                  style={{ borderTopColor: '#e10600', animation: 'tyreSpin 0.6s linear infinite' }}
                />
              ))}
            </div>
            <p className="mt-8 font-telemetry text-carbon-400 tracking-widest text-sm animate-pulse">
              CHANGING TYRES...
            </p>
          </div>
        )}

        {/* Tyre choice */}
        {phase === 'choose' && (
          <div className="text-center w-full max-w-3xl">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-3xl md:text-5xl text-carbon-100 mb-3"
            >
             
            </motion.h3>
            <p className="font-telemetry text-carbon-400 text-sm tracking-widest uppercase mb-10">
              Choose Your Compound
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {TYRE_CHOICES.map((tyre, i) => (
                <motion.button
                  key={tyre.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                  whileHover={{ y: -8, scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleSelect(tyre)}
                  className="hud-panel p-6 text-left group relative overflow-hidden no-select"
                >
                  <div
                    className="absolute -top-10 -right-10 w-28 h-28 rounded-full opacity-20 blur-xl group-hover:opacity-40 transition-opacity"
                    style={{ backgroundColor: tyre.color }}
                  />
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-4 font-display text-3xl text-carbon-950"
                    style={{ backgroundColor: tyre.color }}
                  >
                    {tyre.letter}
                  </div>
                  <h4 className="font-display text-2xl text-carbon-100 mb-2">{tyre.name}</h4>
                  <p className="font-body text-sm text-carbon-300 leading-relaxed">
                    {tyre.personality}
                  </p>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Fitted */}
        <AnimatePresence>
          {phase === 'fitted' && selected && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.3, 1] }}
                transition={{ duration: 0.6 }}
                className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center font-display text-5xl text-carbon-950 shadow-2xl"
                style={{ backgroundColor: selected.color }}
              >
                {selected.letter}
              </motion.div>
              <p className="font-telemetry text-racing-green text-sm tracking-widest uppercase mb-2">
                Tyres Fitted · 2.3s stop
              </p>
              <h3 className="font-display text-3xl md:text-5xl text-carbon-100 mb-2">
                {selected.name} Compound
              </h3>
              <p className="font-body text-carbon-300 max-w-md mx-auto mb-8">{selected.personality}</p>
              <ContinueButton onClick={onDone} label="Back to Racing" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SceneShell>
  );
}
