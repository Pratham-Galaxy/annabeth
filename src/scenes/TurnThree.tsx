import { motion } from 'framer-motion';
import { Heart, Laugh, Sparkles, Flame, Shield, CheckCircle2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { audio } from '../lib/audio';
import { TURN_THREE_TRAITS, TURN_THREE_MISSION } from '../config/content';
import { SceneShell, ContinueButton } from '../components/ui/Overlay';
import { SceneHeader } from '../components/ui/SceneHeader';
import { RaceScene } from '../three/RaceScene';

const ICONS: Record<string, LucideIcon> = {
  heart: Heart,
  laugh: Laugh,
  sparkles: Sparkles,
  flame: Flame,
  shield: Shield,
};

export function TurnThree({ 
  onDone, 
  progress, 
  tyreColor = '#e10600' 
}: { 
  onDone: () => void; 
  progress: number; 
  tyreColor?: string 
}) {
  return (
    <SceneShell className="overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0 opacity-25 pointer-events-none">
        <RaceScene progress={progress} tyreColor={tyreColor} cameraMode="chase" />
      </div>

      <SceneHeader corner="Turn 3 · Lap 1" title="What I Admire" tag="Driver Profile" />

      <div className="relative z-10 min-h-[100dvh] flex flex-col px-6 pt-20 pb-24">
        {/* Telemetry Header */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-telemetry text-carbon-400 text-sm tracking-widest uppercase mb-10 text-center"
        >
         
        </motion.p>

        {/* Traits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl w-full mx-auto mb-12">
          {TURN_THREE_TRAITS.map((trait, i) => {
            const Icon = ICONS[trait.emoji] ?? Heart;
            return (
              <motion.div
                key={trait.title}
                initial={{ opacity: 0, y: 30, rotateY: 15 }}
                animate={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -6, scale: 1.02 }}
                onHoverStart={() => audio.click()}
                className="hud-panel p-6 group cursor-default"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-racing-red/15 flex items-center justify-center text-racing-red group-hover:bg-racing-red/30 transition-colors">
                    <Icon size={24} />
                  </div>
                  <h3 className="font-display text-2xl text-carbon-100">{trait.title}</h3>
                </div>
                <p className="font-body text-sm text-carbon-300 leading-relaxed">
                  {trait.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Mission Status */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="hud-panel p-6 max-w-md w-full mx-auto border-racing-green/40 mb-10"
        >
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle2 className="text-racing-green" size={26} />
            <span className="font-telemetry text-xs tracking-widest text-carbon-400 uppercase">
              Mission
            </span>
          </div>
          <p className="font-display text-2xl text-carbon-100 leading-tight">
            {TURN_THREE_MISSION.mission}
          </p>
          <div className="mt-4 flex items-center gap-2">
            <span className="font-telemetry text-xs text-carbon-500 uppercase tracking-widest">
              Status:
            </span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="font-display text-xl text-racing-green glow-green"
            >
              {TURN_THREE_MISSION.status}
            </motion.span>
          </div>
        </motion.div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-auto"
        >
          <ContinueButton onClick={onDone} label="Box Box Box" delay={0.3} />
        </motion.div>
      </div>
    </SceneShell>
  );
}