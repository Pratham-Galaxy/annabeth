import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { X, Award } from 'lucide-react';
import { audio } from '../lib/audio';
import { TROPHIES, TROPHY_MATERIAL } from '../config/content';
import { SceneShell, ContinueButton } from '../components/ui/Overlay';
import { SceneHeader } from '../components/ui/SceneHeader';

function Trophy3D({ material }: { material: string }) {
  const colors = TROPHY_MATERIAL[material] ?? TROPHY_MATERIAL.gold;
  return (
    <div className="relative w-16 h-20 mx-auto">
      {/* Cup */}
      <motion.div
        whileHover={{ rotateY: 10 }}
        className="absolute top-0 left-1/2 -translate-x-1/2"
      >
        <div
          className="w-12 h-14 rounded-t-full rounded-b-lg"
          style={{
            background: `linear-gradient(135deg, ${colors.metal}, ${colors.base}, ${colors.metal})`,
            boxShadow: `0 0 20px ${colors.metal}66, inset 0 -4px 8px ${colors.base}`,
          }}
        />
        {/* Handles */}
        <div
          className="absolute -left-2 top-3 w-4 h-6 rounded-full border-2"
          style={{ borderColor: colors.rim }}
        />
        <div
          className="absolute -right-2 top-3 w-4 h-6 rounded-full border-2"
          style={{ borderColor: colors.rim }}
        />
      </motion.div>
      {/* Base */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-3 rounded"
        style={{ background: colors.base }}
      />
      <div
        className="absolute bottom-3 left-1/2 -translate-x-1/2 w-10 h-2"
        style={{ background: colors.rim }}
      />
    </div>
  );
}

export function TrophyRoom({ onDone, progress: _progress }: { onDone: () => void; progress: number }) {
  const [selected, setSelected] = useState<(typeof TROPHIES)[number] | null>(null);

  return (
    <SceneShell>
      {/* Dark museum ambient */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-carbon-950 via-carbon-900 to-carbon-950" />
      <div
        className="absolute inset-0 z-0 opacity-30"
        style={{
          background:
            'radial-gradient(ellipse at 50% 30%, rgba(212,175,55,0.15), transparent 60%)',
        }}
      />

      <SceneHeader corner="Hall of Fame" title="Trophy Room" tag="Permanent Collection" />

      <div className="relative z-10 min-h-[100dvh] flex flex-col items-center justify-center px-6 py-[14vh]">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 max-w-3xl w-full">
          {TROPHIES.map((trophy, i) => (
            <motion.button
              key={trophy.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, type: 'spring' }}
              whileHover={{ y: -8 }}
              onClick={() => {
                audio.ding();
                setSelected(trophy);
              }}
              className="hud-panel p-5 text-center group no-select relative overflow-hidden"
            >
              {/* Spotlight effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: 'radial-gradient(ellipse at top, rgba(255,255,255,0.08), transparent 70%)' }}
              />
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
                className="relative mb-3"
              >
                <Trophy3D material={trophy.material} />
              </motion.div>
              <h3 className="font-display text-lg text-carbon-100 leading-tight">{trophy.title}</h3>
              <p className="font-telemetry text-[10px] text-carbon-500 uppercase tracking-widest mt-1 group-hover:text-racing-gold transition-colors">
                View Story →
              </p>
            </motion.button>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-10"
        >
          <ContinueButton onClick={onDone} label="Driver Licence" delay={0.2} />
        </motion.div>
      </div>

      {/* Story modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-[75] bg-carbon-950/90 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="hud-panel max-w-lg w-full p-8 relative"
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 text-carbon-500 hover:text-racing-red transition-colors"
              >
                <X size={20} />
              </button>
              <div className="flex flex-col items-center text-center">
                <div className="scale-150 mb-6">
                  <Trophy3D material={selected.material} />
                </div>
                <Award className="text-racing-gold mb-2" size={20} />
                <h2 className="font-display text-3xl text-carbon-100 mb-4">{selected.title}</h2>
                <p className="font-body text-carbon-200 leading-relaxed">{selected.story}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SceneShell>
  );
}
