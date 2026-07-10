import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Trophy, Droplet } from 'lucide-react';
import { audio } from '../lib/audio';
import { HYDRATION_DIALOGUES, HYDRATION_ACHIEVEMENTS } from '../config/content';
import { SceneShell, ContinueButton } from '../components/ui/Overlay';
import { SceneHeader } from '../components/ui/SceneHeader';

export function HydrationPitStop({ onDone, progress: _progress }: { onDone: () => void; progress: number }) {
  const [glasses, setGlasses] = useState(0);
  const [dialogue, setDialogue] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState<string[]>([]);
  const [carPos, setCarPos] = useState({ x: 0, y: 0 });
  const [drinking, setDrinking] = useState(false);

  useEffect(() => {
    const milestones = [1, 3, 5, 8, 10];
    milestones.forEach((m) => {
      if (glasses === m && !unlocked.includes(HYDRATION_ACHIEVEMENTS[m === 1 ? 0 : m === 3 ? 1 : m === 5 ? 2 : m === 8 ? 3 : 4].id)) {
        const ach = HYDRATION_ACHIEVEMENTS[m === 1 ? 0 : m === 3 ? 1 : m === 5 ? 2 : m === 8 ? 3 : 4];
        setUnlocked((u) => [...u, ach.id]);
        audio.achievement();
      }
    });
  }, [glasses, unlocked]);

  const handleDrink = () => {
    if (drinking) return;
    
    audio.hit(); // Reuse or replace with sip sound if available
    const newGlasses = glasses + 1;
    setGlasses(newGlasses);
    
    setDialogue(HYDRATION_DIALOGUES[Math.floor(Math.random() * HYDRATION_DIALOGUES.length)]);
    setDrinking(true);
    
    setCarPos({
      x: (Math.random() - 0.5) * 180,
      y: (Math.random() - 0.5) * 90,
    });

    window.setTimeout(() => setDrinking(false), 600);
  };

  return (
    <SceneShell>
      <SceneHeader 
        corner="Paddock Activity" 
        title="Hydration Pit Stop" 
        tag="Water Reminder" 
      />
      
      <div className="relative z-10 min-h-[100dvh] flex flex-col items-center justify-center px-6 py-[12vh]">
        {/* Score HUD */}
        <div className="flex items-center gap-6 mb-8">
          <div className="hud-panel px-5 py-3 text-center">
            <div className="font-telemetry text-[10px] tracking-widest text-carbon-500 uppercase">Glasses</div>
            <div className="font-display text-3xl text-racing-blue flex items-center justify-center gap-1">
              {glasses} <Droplet className="w-6 h-6" />
            </div>
          </div>
          <div className="hud-panel px-5 py-3 text-center">
            <div className="font-telemetry text-[10px] tracking-widest text-carbon-500 uppercase">Achievements</div>
            <div className="font-display text-3xl text-racing-gold">{unlocked.length}/{HYDRATION_ACHIEVEMENTS.length}</div>
          </div>
        </div>

        {/* Cute F1 Race Car Target */}
        <div className="relative h-72 w-full max-w-md flex items-center justify-center mb-6">
          <motion.button
            onClick={handleDrink}
            animate={{
              x: carPos.x,
              y: carPos.y,
              scale: drinking ? 0.9 : 1,
              rotate: drinking ? (Math.random() - 0.5) * 25 : 0,
            }}
            transition={{ type: 'spring', stiffness: 280, damping: 18 }}
            whileHover={{ scale: drinking ? 0.9 : 1.08 }}
            className="relative no-select cursor-pointer"
          >
            {/* Cute Pixel Race Car */}
            <div className="w-40 h-32 relative">
              {/* Car Body */}
              <div className="absolute top-8 left-1/2 -translate-x-1/2 w-36 h-20 bg-racing-red rounded-2xl shadow-xl border-4 border-racing-gold/30">
                {/* Racing Stripes */}
                <div className="absolute top-2 left-3 right-3 h-2 bg-white/80 rounded" />
                <div className="absolute top-6 left-3 right-3 h-2 bg-racing-blue rounded" />
                
                {/* Cockpit */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-10 bg-carbon-950 rounded-xl border border-racing-gold/40" />
                
                {/* Wheels */}
                <div className="absolute -bottom-3 left-6 w-8 h-8 bg-carbon-950 rounded-full border-4 border-racing-gold" />
                <div className="absolute -bottom-3 right-6 w-8 h-8 bg-carbon-950 rounded-full border-4 border-racing-gold" />
                
                {/* Headlights */}
                <div className="absolute top-6 -left-1 w-4 h-6 bg-racing-yellow rounded" />
                <div className="absolute top-6 -right-1 w-4 h-6 bg-racing-yellow rounded" />
              </div>

              {/* Driver Helmet */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-12">
                <div className="w-full h-full bg-carbon-300 rounded-full border-4 border-racing-gold flex items-center justify-center">
                  <div className="w-6 h-6 bg-racing-blue rounded-full" />
                </div>
              </div>
            </div>

            {/* Drink Splash Effect */}
            {drinking && (
              <motion.div
                initial={{ opacity: 1, scale: 0.4, y: 20 }}
                animate={{ opacity: 0, scale: 1.6, y: -60 }}
                transition={{ duration: 0.6 }}
                className="absolute top-12 left-1/2 -translate-x-1/2 text-racing-blue font-display text-3xl drop-shadow-lg"
              >
                💧 GLUG!
              </motion.div>
            )}
          </motion.button>
        </div>

        {/* Encouraging Dialogue */}
        <AnimatePresence mode="wait">
          {dialogue && (
            <motion.div
              key={dialogue}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="hud-panel px-6 py-4 max-w-md text-center mb-6"
            >
              <span className="font-telemetry text-racing-blue text-[10px] tracking-widest uppercase">Pit Crew Radio:</span>
              <p className="font-body text-carbon-200 text-sm mt-1">"{dialogue}"</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Achievements Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 max-w-3xl w-full mb-8">
          {HYDRATION_ACHIEVEMENTS.map((ach) => {
            const isUnlocked = unlocked.includes(ach.id);
            return (
              <motion.div
                key={ach.id}
                animate={isUnlocked ? { scale: [1, 1.06, 1], rotate: [0, 3, -3, 0] } : {}}
                transition={{ duration: 0.4 }}
                className={`hud-panel p-4 text-center transition-all ${isUnlocked ? 'border-racing-gold/60 shadow-lg' : 'opacity-50'}`}
              >
                <Trophy size={20} className={isUnlocked ? 'text-racing-gold mx-auto' : 'text-carbon-600 mx-auto'} />
                <div className="font-telemetry text-[10px] text-carbon-200 mt-2 uppercase tracking-wide leading-tight">{ach.title}</div>
              </motion.div>
            );
          })}
        </div>

        <ContinueButton onClick={onDone} label="Back to Garage" />
      </div>
    </SceneShell>
  );
}