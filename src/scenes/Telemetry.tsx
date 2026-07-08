import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Gauge, X } from 'lucide-react';
import { audio } from '../lib/audio';
import { TELEMETRY_DATA } from '../config/content';
import { SceneShell, ContinueButton } from '../components/ui/Overlay';
import { SceneHeader } from '../components/ui/SceneHeader';

function AnimatedBar({ value, color, delay }: { value: number; color: string; delay: number }) {
  return (
    <div className="h-3 w-full bg-carbon-800 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(value, 100)}%` }}
        transition={{ delay, duration: 1.4, ease: [0.2, 0.8, 0.2, 1] }}
        className="h-full rounded-full"
        style={{ backgroundColor: color, boxShadow: `0 0 12px ${color}88` }}
      />
    </div>
  );
}

export function Telemetry({ onDone, progress: _progress }: { onDone: () => void; progress: number }) {
  const [openMemory, setOpenMemory] = useState<(typeof TELEMETRY_DATA)[number] | null>(null);

  return (
    <SceneShell>
      <SceneHeader corner="Sector 2" title="Friendship Telemetry" tag="Live Data" />

      <div className="relative z-10 min-h-[100dvh] flex flex-col items-center justify-center px-6 py-[14vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-8 text-racing-green"
        >
          <Gauge className="animate-pulse" size={22} />
          <span className="font-telemetry text-xs tracking-[0.3em] uppercase">
            Telemetry Feed · Active
          </span>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl w-full">
          {TELEMETRY_DATA.map((metric, i) => (
            <motion.button
              key={metric.id}
              initial={{ opacity: 0, x: i % 2 ? 30 : -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => {
                audio.ding();
                setOpenMemory(metric);
              }}
              className="hud-panel p-5 text-left group no-select"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-telemetry text-sm text-carbon-300 uppercase tracking-wider">
                  {metric.label}
                </span>
                <span className="font-display text-xl" style={{ color: metric.color }}>
                  {metric.value.toLocaleString()}
                  {metric.unit}
                </span>
              </div>
              <AnimatedBar value={metric.value} color={metric.color} delay={i * 0.1 + 0.3} />
              <p className="mt-2 font-telemetry text-[11px] text-carbon-500 group-hover:text-racing-red transition-colors uppercase tracking-widest">
                Click to view memory →
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
          <ContinueButton onClick={onDone} label="Open DRS" delay={0.2} />
        </motion.div>
      </div>

      {/* Memory modal */}
      <AnimatePresence>
        {openMemory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenMemory(null)}
            className="fixed inset-0 z-[75] bg-carbon-950/80 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="hud-panel max-w-lg w-full p-8 relative"
            >
              <button
                onClick={() => setOpenMemory(null)}
                className="absolute top-4 right-4 text-carbon-500 hover:text-racing-red transition-colors"
              >
                <X size={20} />
              </button>
              <div className="font-telemetry text-xs tracking-widest uppercase mb-3" style={{ color: openMemory.color }}>
                {openMemory.label} · Memory Unlocked
              </div>
              <p className="font-body text-lg text-carbon-100 leading-relaxed">{openMemory.memory}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SceneShell>
  );
}
