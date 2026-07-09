import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { X } from 'lucide-react';
import { audio } from '../lib/audio';
import { DRIVERS, CIRCUIT_TURNS, VIBE_TRACE, DELTA_TRACE } from '../config/content';
import { SceneShell, ContinueButton } from '../components/ui/Overlay';
import { SceneHeader } from '../components/ui/SceneHeader';

type Turn = (typeof CIRCUIT_TURNS)[number];
type Driver = (typeof DRIVERS)[number];

/* ---------- small building blocks ---------- */

function StatBar({
  label,
  value,
  color,
  align,
  delay,
}: {
  label: string;
  value: number;
  color: string;
  align: 'left' | 'right';
  delay: number;
}) {
  const flip = align === 'right';
  return (
    <div className={`flex items-center gap-3 ${flip ? 'flex-row-reverse' : ''}`}>
      <span
        className={`font-telemetry text-[9px] tracking-widest uppercase text-carbon-500 w-28 shrink-0 ${
          flip ? 'text-right' : ''
        }`}
      >
        {label}
      </span>
      <div className="h-1.5 flex-1 bg-carbon-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(value, 100)}%` }}
          transition={{ delay, duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }}
          className={`h-full rounded-full ${flip ? 'ml-auto' : ''}`}
          style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}88` }}
        />
      </div>
      <span
        className="font-telemetry text-xs font-semibold w-9 shrink-0 tabular-nums"
        style={{ color, textAlign: flip ? 'left' : 'right' }}
      >
        {value}%
      </span>
    </div>
  );
}

function DriverCard({ driver, side, delay }: { driver: Driver; side: 'left' | 'right'; delay: number }) {
  const flip = side === 'right';
  return (
    <motion.div
      initial={{ opacity: 0, x: flip ? 30 : -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="hud-panel p-5 relative overflow-hidden"
      style={{ borderLeft: flip ? undefined : `3px solid ${driver.color}`, borderRight: flip ? `3px solid ${driver.color}` : undefined }}
    >
      <div className={`flex items-center justify-between font-telemetry text-[9px] tracking-widest uppercase text-carbon-600 mb-3 ${flip ? 'flex-row-reverse' : ''}`}>
        <span>Position</span>
        <span>Driver</span>
      </div>

      <div className={`flex items-center gap-4 mb-4 ${flip ? 'flex-row-reverse text-right' : ''}`}>
        <span className="font-display text-3xl italic font-black" style={{ color: driver.color }}>
          {driver.position}
        </span>
        <div>
          <span className="block font-telemetry text-[11px] text-carbon-500 tracking-wider">{driver.tag}</span>
          <span className="block font-display text-lg font-black uppercase tracking-wide" style={{ color: driver.color }}>
            {driver.name}
          </span>
          <span className="block font-telemetry text-[9px] text-carbon-600 tracking-widest uppercase mt-0.5">
            {driver.team}
          </span>
        </div>
      </div>

      <div className={`flex gap-7 mb-4 ${flip ? 'flex-row-reverse' : ''}`}>
        <div>
          <div className="font-telemetry text-[9px] text-carbon-600 tracking-widest uppercase">Reply Time</div>
          <div className="font-telemetry text-lg font-semibold text-carbon-100">{driver.replyTime}</div>
        </div>
        <div>
          <div className="font-telemetry text-[9px] text-carbon-600 tracking-widest uppercase">Gap</div>
          <div className="font-telemetry text-lg font-semibold" style={{ color: driver.color }}>
            {driver.gap}
          </div>
        </div>
      </div>

      <div className="space-y-2.5">
        {driver.stats.map((s, i) => (
          <StatBar key={s.label} label={s.label} value={s.value} color={driver.color} align={side} delay={delay + 0.15 + i * 0.1} />
        ))}
      </div>
    </motion.div>
  );
}

function CircuitMap({ onSelect }: { onSelect: (t: Turn) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      className="hud-panel p-4 flex flex-col items-center justify-center"
    >
      <span className="font-telemetry text-[10px] tracking-[0.25em] uppercase text-carbon-500 mb-2">
        Friendship Circuit
      </span>

      <svg width="260" height="230" viewBox="0 0 300 260" className="overflow-visible">
        <path
          id="track"
          d="M50,210 L50,150 C50,120 65,110 90,105 L120,98 C140,94 145,80 130,65
             C118,53 122,35 145,30 L190,20 C220,13 250,25 255,55 C258,75 245,88 220,92
             L180,98 C158,102 155,120 172,132 C188,143 185,160 165,166 L110,182
             C85,189 75,200 90,215 C102,226 95,242 75,238 C58,235 48,225 50,210 Z"
          fill="none"
          stroke="#23232f"
          strokeWidth="15"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <motion.path
          d="M50,210 L50,150 C50,120 65,110 90,105 L120,98 C140,94 145,80 130,65
             C118,53 122,35 145,30 L190,20 C220,13 250,25 255,55 C258,75 245,88 220,92
             L180,98 C158,102 155,120 172,132 C188,143 185,160 165,166 L110,182
             C85,189 75,200 90,215 C102,226 95,242 75,238 C58,235 48,225 50,210 Z"
          fill="none"
          stroke="var(--racing-red, #e8121c)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.2, ease: 'easeInOut', delay: 0.4 }}
        />
        <line x1="50" y1="196" x2="50" y2="224" stroke="#f4f4f8" strokeWidth="3" strokeDasharray="4 3" />

        {CIRCUIT_TURNS.map((t, i) => (
          <g key={t.id}>
            <motion.circle
              cx={t.x}
              cy={t.y}
              r="7"
              fill="transparent"
              className="cursor-pointer"
              whileHover={{ scale: 1.3 }}
              onClick={() => {
                audio.ding();
                onSelect(t);
              }}
            />
            <circle cx={t.x} cy={t.y} r="3.5" fill="#f4f4f8" pointerEvents="none" />
            <text
              x={t.x + t.labelDx}
              y={t.y + t.labelDy}
              fontFamily="JetBrains Mono, monospace"
              fontSize="9"
              fontWeight={700}
              fill="#9494a3"
              pointerEvents="none"
            >
              {i + 1} · {t.label}
            </text>
          </g>
        ))}
      </svg>

      <div className="flex gap-4 mt-1 font-telemetry text-[9px] text-carbon-600 tracking-wider uppercase">
        <span className="text-carbon-500">● low speed = deep talks</span>
        <span className="text-carbon-500">● high speed = pure chaos</span>
      </div>
    </motion.div>
  );
}

function VibeTrace() {
  const toPoints = (arr: number[]) =>
    arr.map((v, i) => `${(i / (arr.length - 1)) * 1000},${150 - v * 1.3}`).join(' ');

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="hud-panel p-5 mt-4"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-telemetry text-[10px] tracking-[0.25em] uppercase text-carbon-400 font-semibold">
          Vibe Level Through The Years
        </span>
        <div className="flex gap-4 font-telemetry text-[9px] tracking-widest uppercase text-carbon-500">
          {DRIVERS.map((d) => (
            <span key={d.id} className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded-full inline-block" style={{ backgroundColor: d.color }} />
              {d.name}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-6 text-center font-telemetry text-[9px] tracking-widest uppercase text-carbon-600 mb-2">
        {VIBE_TRACE.phases.map((p) => (
          <div key={p}>{p}</div>
        ))}
      </div>

      <svg width="100%" height="130" viewBox="0 0 1000 150" preserveAspectRatio="none">
        {[10, 50, 90, 130].map((y) => (
          <line key={y} x1="0" y1={y} x2="1000" y2={y} stroke="#1c1c26" strokeWidth="1" />
        ))}
        {DRIVERS.map((d, idx) => (
          <motion.polyline
            key={d.id}
            fill="none"
            stroke={d.color}
            strokeWidth="2.5"
            points={toPoints(VIBE_TRACE.series[idx])}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.8, delay: 0.9, ease: 'easeInOut' }}
          />
        ))}
      </svg>

      <div className="mt-3">
        <span className="font-telemetry text-[9px] tracking-widest uppercase text-carbon-600">
          Delta — Who Brought More Chaos
        </span>
        <svg width="100%" height="50" viewBox="0 0 1000 50" preserveAspectRatio="none" className="mt-1">
          <line x1="0" y1="25" x2="1000" y2="25" stroke="#4a4a5a" strokeWidth="1" strokeDasharray="4 4" />
          <motion.polyline
            fill="none"
            stroke="var(--racing-red, #e8121c)"
            strokeWidth="2"
            points={toPoints(DELTA_TRACE)}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.6, delay: 1.3, ease: 'easeInOut' }}
          />
        </svg>
      </div>
    </motion.div>
  );
}

/* ---------- main scene ---------- */

export function Telemetry({ onDone, progress: _progress }: { onDone: () => void; progress: number }) {
  const [openTurn, setOpenTurn] = useState<Turn | null>(null);

  return (
    <SceneShell>
      <SceneHeader corner="Sector 2" title="Bestie Qualifying Analysis" tag="Telemetry Live" />

      <div className="relative z-10 min-h-[100dvh] flex flex-col items-center justify-center px-6 py-[10vh]">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 max-w-4xl w-full items-stretch">
          <DriverCard driver={DRIVERS[0]} side="left" delay={0.1} />
          <div className="md:w-[280px]">
            <CircuitMap onSelect={setOpenTurn} />
          </div>
          <DriverCard driver={DRIVERS[1]} side="right" delay={0.2} />
        </div>

        <div className="max-w-4xl w-full">
          <VibeTrace />
        </div>

        <p className="font-telemetry text-[11px] text-carbon-600 tracking-wide text-center mt-6">
          Click any turn on the circuit to pull up the memory →
        </p>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }} className="mt-8">
          <ContinueButton onClick={onDone} label="Open DRS" delay={0.2} />
        </motion.div>
      </div>

      {/* Memory modal, reused for circuit turns */}
      <AnimatePresence>
        {openTurn && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenTurn(null)}
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
                onClick={() => setOpenTurn(null)}
                className="absolute top-4 right-4 text-carbon-500 hover:text-racing-red transition-colors"
              >
                <X size={20} />
              </button>
              <div className="font-telemetry text-xs tracking-widest uppercase mb-3 text-racing-red">
                Turn {CIRCUIT_TURNS.findIndex((t) => t.id === openTurn.id) + 1} · {openTurn.label} · Memory Unlocked
              </div>
              <p className="font-body text-lg text-carbon-100 leading-relaxed">{openTurn.memory}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SceneShell>
  );
}