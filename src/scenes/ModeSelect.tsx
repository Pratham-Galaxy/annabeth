import { motion } from 'framer-motion';
import { Flag, Wrench, Radio } from 'lucide-react';
import { audio } from '../lib/audio';
import { TEAM } from '../config/team';

export function ModeSelect({ onRace, onPaddock }: { onRace: () => void; onPaddock: () => void }) {
  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden bg-carbon-950">
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-carbon-950 via-carbon-900 to-carbon-950" />
      <div
        className="absolute inset-0 z-0 opacity-25"
        style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(225,6,0,0.15), transparent 60%)' }}
      />

      {/* Animated grid floor */}
      <div className="absolute bottom-0 left-0 right-0 h-[40vh] z-0 overflow-hidden perspective-grid" />

      <div className="relative z-10 min-h-[100dvh] flex flex-col items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="font-telemetry text-racing-red text-xs tracking-[0.5em] uppercase mb-3">
            {TEAM.teamName}
          </div>
          <h1 className="font-display text-5xl md:text-7xl text-carbon-100 leading-none">
            Friendship <span className="text-racing-red">Grand Prix</span>
          </h1>
          <p className="font-body text-carbon-400 mt-4 max-w-md mx-auto">
            For {TEAM.driver} — from your Race Engineer.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl w-full">
          {/* Experience mode */}
          <motion.button
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { audio.click(); audio.whoosh(); onRace(); }}
            className="hud-panel-large group no-select text-left relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-racing-red/10 to-transparent group-hover:from-racing-red/20 transition-all duration-500" />
            <div className="relative p-7">
              <div className="w-14 h-14 rounded-xl bg-racing-red/15 flex items-center justify-center text-racing-red group-hover:bg-racing-red/30 transition-colors mb-5">
                <Flag size={28} />
              </div>
              <h2 className="font-display text-2xl text-carbon-100 mb-2">Experience the Race</h2>
              <p className="font-body text-sm text-carbon-400 leading-relaxed">
                The full journey. Lights out, 16 corners, and a finish line you will not forget.
                Best experienced in order, first time.
              </p>
              <div className="mt-5 font-telemetry text-[11px] text-racing-red tracking-[0.3em] uppercase">
                Lights Out &rarr;
              </div>
            </div>
          </motion.button>

          {/* Paddock mode */}
          <motion.button
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { audio.click(); onPaddock(); }}
            className="hud-panel-large group no-select text-left relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-racing-gold/10 to-transparent group-hover:from-racing-gold/20 transition-all duration-500" />
            <div className="relative p-7">
              <div className="w-14 h-14 rounded-xl bg-racing-gold/15 flex items-center justify-center text-racing-gold group-hover:bg-racing-gold/30 transition-colors mb-5">
                <Wrench size={28} />
              </div>
              <h2 className="font-display text-2xl text-carbon-100 mb-2">The Paddock</h2>
              <p className="font-body text-sm text-carbon-400 leading-relaxed">
                Jump straight into the garage. Trophies, complaints, radio, games, licence,
                and every memory — all unlocked, anytime.
              </p>
              <div className="mt-5 font-telemetry text-[11px] text-racing-gold tracking-[0.3em] uppercase">
                Enter Garage &rarr;
              </div>
            </div>
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-10 flex items-center gap-2 font-telemetry text-carbon-500 text-[10px] tracking-widest uppercase"
        >
          <Radio size={12} className="text-racing-red" />
          <span>Radio Online · Track Clear</span>
        </motion.div>
      </div>
    </div>
  );
}
