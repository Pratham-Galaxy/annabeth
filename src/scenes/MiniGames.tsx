import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';import { audio } from '../lib/audio';
import { HIT_ENGINEER_DIALOGUES, HIT_ENGINEER_ACHIEVEMENTS } from '../config/content';
import { SceneShell, ContinueButton } from '../components/ui/Overlay';
import { SceneHeader } from '../components/ui/SceneHeader';

export function MiniGames({ onDone, progress: _progress }: { onDone: () => void; progress: number }) {
  const [hits, setHits] = useState(0);
  const [dialogue, setDialogue] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState<string[]>([]);
  const [engineerPos, setEngineerPos] = useState({ x: 0, y: 0 });
  const [stunned, setStunned] = useState(false);

  useEffect(() => {
    const milestones = [1, 5, 10, 20];
    milestones.forEach((m) => {
      if (hits === m && !unlocked.includes(HIT_ENGINEER_ACHIEVEMENTS[m === 1 ? 0 : m === 5 ? 1 : m === 10 ? 2 : 3].id)) {
        const ach = HIT_ENGINEER_ACHIEVEMENTS[m === 1 ? 0 : m === 5 ? 1 : m === 10 ? 2 : 3];
        setUnlocked((u) => [...u, ach.id]);
        audio.achievement();
      }
    });
  }, [hits, unlocked]);

  const handleHit = () => {
    if (stunned) return;
    audio.hit();
    const newHits = hits + 1;
    setHits(newHits);
    setDialogue(HIT_ENGINEER_DIALOGUES[Math.floor(Math.random() * HIT_ENGINEER_DIALOGUES.length)]);
    setStunned(true);
    setEngineerPos({
      x: (Math.random() - 0.5) * 200,
      y: (Math.random() - 0.5) * 100,
    });
    window.setTimeout(() => setStunned(false), 500);
  };

  return (
    <SceneShell>
      <SceneHeader corner="Paddock Activity" title="Hit the Engineer" tag="Mini Game" />

      <div className="relative z-10 min-h-[100dvh] flex flex-col items-center justify-center px-6 py-[12vh]">
        {/* Score HUD */}
        <div className="flex items-center gap-6 mb-8">
          <div className="hud-panel px-5 py-3 text-center">
            <div className="font-telemetry text-[10px] tracking-widest text-carbon-500 uppercase">Hits</div>
            <div className="font-display text-3xl text-racing-red">{hits}</div>
          </div>
          <div className="hud-panel px-5 py-3 text-center">
            <div className="font-telemetry text-[10px] tracking-widest text-carbon-500 uppercase">Achievements</div>
            <div className="font-display text-3xl text-racing-gold">{unlocked.length}/{HIT_ENGINEER_ACHIEVEMENTS.length}</div>
          </div>
        </div>

        {/* Engineer target */}
        <div className="relative h-72 w-full max-w-md flex items-center justify-center mb-6">
          <motion.button
            onClick={handleHit}
            animate={{
              x: engineerPos.x,
              y: engineerPos.y,
              scale: stunned ? 0.85 : 1,
              rotate: stunned ? (Math.random() - 0.5) * 20 : 0,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            whileHover={{ scale: stunned ? 0.85 : 1.05 }}
            className="relative no-select cursor-pointer"
          >
            {/* Pixel-style engineer */}
            <div className="w-32 h-40 relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-16 bg-carbon-300 rounded-lg" style={{ imageRendering: 'pixelated' }}>
                {/* Headphones */}
                <div className="absolute -left-2 top-6 w-3 h-6 bg-carbon-700 rounded-sm" />
                <div className="absolute -right-2 top-6 w-3 h-6 bg-carbon-700 rounded-sm" />
                <div className="absolute left-0 right-0 top-5 h-1.5 bg-racing-red rounded-full" />
                {/* Face */}
                <div className="absolute top-7 left-3 w-2 h-2 bg-carbon-950 rounded-full" />
                <div className="absolute top-7 right-3 w-2 h-2 bg-carbon-950 rounded-full" />
                <div className={`absolute top-11 left-1/2 -translate-x-1/2 w-6 h-1 ${stunned ? 'bg-racing-red rotate-12' : 'bg-carbon-950'}`} />
              </div>
              {/* Body */}
              <div className="absolute top-16 left-1/2 -translate-x-1/2 w-20 h-24 bg-racing-red rounded-lg">
                <div className="absolute top-2 left-1/2 -translate-x-1/2 font-display text-xs text-white">ENG</div>
              </div>
            </div>
            {stunned && (
              <motion.div
                initial={{ opacity: 1, scale: 0.5 }}
                animate={{ opacity: 0, scale: 1.5, y: -30 }}
                transition={{ duration: 0.5 }}
                className="absolute top-0 left-1/2 -translate-x-1/2 text-racing-yellow font-display text-2xl"
              >
                BONK!
              </motion.div>
            )}
          </motion.button>
        </div>

        {/* Dialogue */}
        <AnimatePresence mode="wait">
          {dialogue && (
            <motion.div
              key={dialogue}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="hud-panel px-5 py-3 max-w-md text-center mb-6"
            >
              <span className="font-telemetry text-racing-red text-[10px] tracking-widest uppercase">Engineer:</span>
              <p className="font-body text-carbon-200 text-sm mt-1">"{dialogue}"</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Achievements grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-w-2xl w-full mb-8">
          {HIT_ENGINEER_ACHIEVEMENTS.map((ach) => {
            const isUnlocked = unlocked.includes(ach.id);
            return (
              <motion.div
                key={ach.id}
                animate={isUnlocked ? { scale: [1, 1.05, 1] } : {}}
                className={`hud-panel p-3 text-center ${isUnlocked ? 'border-racing-gold/50' : 'opacity-40'}`}
              >
                <Trophy size={18} className={isUnlocked ? 'text-racing-gold mx-auto' : 'text-carbon-600 mx-auto'} />
                <div className="font-telemetry text-[10px] text-carbon-200 mt-1 uppercase tracking-wide">{ach.title}</div>
              </motion.div>
            );
          })}
        </div>

        <ContinueButton onClick={onDone} label="Complaint Box" />
      </div>
    </SceneShell>
  );
}
