import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { audio } from '../lib/audio';
import { TEAM } from '../config/team';

type Phase = 'logo' | 'lights' | 'out' | 'launch';

export function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<Phase>('logo');
  const [lit, setLit] = useState(0);

  useEffect(() => {
    const timers: number[] = [];
    // Play ambience on first user gesture; we attempt unlock on mount.
    audio.unlock();
    audio.radioStatic(1.5);

    timers.push(window.setTimeout(() => setPhase('lights'), 2200));

    // Light sequence: 5 reds, then out.
    [0, 1, 2, 3, 4].forEach((i) => {
      timers.push(
        window.setTimeout(() => {
          setLit(i + 1);
          audio.tone(700 + i * 40, 0.18, 'square', 0.08);
        }, 2800 + i * 900),
      );
    });
    // Lights out after all 5
    timers.push(
      window.setTimeout(() => {
        setPhase('out');
        setLit(0);
        audio.lightsOut();
      }, 2800 + 5 * 900 + 700),
    );
    // Launch
    timers.push(
      window.setTimeout(() => {
        setPhase('launch');
        audio.engineStart();
      }, 2800 + 5 * 900 + 700 + 400),
    );
    timers.push(
      window.setTimeout(() => onDone(), 2800 + 5 * 900 + 700 + 400 + 2600),
    );

    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-[80] bg-carbon-950 flex flex-col items-center justify-center no-select">
      {/* Logo phase */}
      {phase === 'logo' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="text-center"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-carbon-500 font-telemetry text-xs tracking-[0.4em] uppercase mb-3"
          >
            Welcome to the
          </motion.div>
          <h1 className="font-display text-6xl md:text-8xl text-carbon-100 leading-none">
            FRIENDSHIP
          </h1>
          <h1 className="font-display text-6xl md:text-8xl text-racing-red glow-red leading-none">
            GRAND PRIX
          </h1>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '60%' }}
            transition={{ delay: 0.5, duration: 1 }}
            className="h-px bg-gradient-to-r from-transparent via-racing-red to-transparent mx-auto mt-6"
          />
          <p className="mt-6 font-telemetry text-carbon-400 tracking-widest text-sm">
            {TEAM.teamName.toUpperCase()} · ENGINEER: {TEAM.engineer.toUpperCase()} · DRIVER:{' '}
            {TEAM.driver.toUpperCase()}
          </p>
        </motion.div>
      )}

      {/* Lights phase */}
      {(phase === 'lights' || phase === 'out' || phase === 'launch') && (
        <div className="flex flex-col items-center gap-8">
          <div className="bg-carbon-800 border-2 border-carbon-600 rounded-xl px-5 py-3 flex gap-3 shadow-2xl">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                animate={{
                  backgroundColor: lit > i ? '#e10600' : '#1c2024',
                  boxShadow: lit > i ? '0 0 24px rgba(225,6,0,0.8)' : 'none',
                }}
                transition={{ duration: 0.15 }}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full"
              />
            ))}
          </div>
          <motion.p
            key={phase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-2xl md:text-4xl tracking-wider text-carbon-200"
          >
            {phase === 'lights' && lit < 5 && 'FORMATION LAP'}
            {phase === 'lights' && lit === 5 && 'WAITING FOR LIGHTS...'}
            {phase === 'out' && (
              <span className="text-racing-red glow-red">LIGHTS OUT AND AWAY WE GO</span>
            )}
            {phase === 'launch' && (
              <span className="text-racing-green glow-green">RACE START</span>
            )}
          </motion.p>

          {phase === 'launch' && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 2 }}
              className="h-1 bg-racing-red origin-left w-64 rounded-full"
            />
          )}
        </div>
      )}

      <p className="absolute bottom-6 font-telemetry text-carbon-600 text-xs tracking-widest">
        BESTO RACING MOTORSPORT
      </p>
    </div>
  );
}
