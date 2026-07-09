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
    <SceneShell>
      {/* Background Race Scene */}
      <div className="absolute inset-0 z-0 opacity-25 pointer-events-none">
        <RaceScene progress={progress} tyreColor={tyreColor} cameraMode="chase" />
      </div>

      <SceneHeader corner="Turn 3 · Lap 1" title="What I Admire" tag="Driver Profile" />

      <div className="relative z-10 min-h-[100dvh] flex flex-col items-center justify-center px-6 pt-24 pb-20">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-telemetry text-carbon-400 text-sm tracking-widest uppercase mb-8 text-center"
        >
          Telemetry review · Driver strengths identified
        </motion.p>

        {/* Traits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl w-full mb-12">
          {TURN_THREE_TRAITS.map((trait, i) => {
            const Icon = ICONS[trait.emoji] ?? Heart;
            return (
              <motion.div
                key={trait.title}
                initial={{ opacity: 0, y: 30, rotateY: 15 }}
                animate={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                whileHover={{ y: -6, scale: 1.03 }}
                onHoverStart={() => audio.click()}
                className="hud-panel p-5 group cursor-default"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-racing-red/15 flex items-center justify-center text-racing-red group-hover:bg-racing-red/30 transition-colors">
                    <Icon size={20} />
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
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="hud-panel p-6 max-w-md w-full border-racing-green/40 mb-10"
        >
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="text-racing-green" size={22} />
            <span className="font-telemetry text-xs tracking-widest text-carbon-400 uppercase">
              Mission
            </span>
          </div>
          <p className="font-display text-2xl text-carbon-100">{TURN_THREE_MISSION.mission}</p>
          <div className="mt-3 flex items-center gap-2">
            <span className="font-telemetry text-xs text-carbon-500 uppercase tracking-widest">
              Status:
            </span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="font-display text-xl text-racing-green glow-green"
            >
              {TURN_THREE_MISSION.status}
            </motion.span>
          </div>
        </motion.div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <ContinueButton onClick={onDone} label="Box Box Box" delay={0.3} />
        </motion.div>
      </div>
    </SceneShell>
  );
}