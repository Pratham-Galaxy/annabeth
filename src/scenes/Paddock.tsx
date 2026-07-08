import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  Mail, CreditCard, Activity, Trophy, Images, MessageSquareWarning,
  Radio, Gamepad2, Infinity as InfinityIcon, X, Home,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { audio } from '../lib/audio';
import { PADDOCK_MODULES, TURN_TWO_LETTER, MEMORY_CORNERS } from '../config/content';
import { TEAM } from '../config/team';
import { SceneShell } from '../components/ui/Overlay';
import { Telemetry } from './Telemetry';
import { TrophyRoom } from './TrophyRoom';
import { DriverLicence } from './DriverLicence';
import { ComplaintBox } from './ComplaintBox';
import { TeamRadio } from './TeamRadio';
import { MiniGames } from './MiniGames';

const ICONS: Record<string, LucideIcon> = {
  mail: Mail,
  'id-card': CreditCard,
  activity: Activity,
  trophy: Trophy,
  images: Images,
  'message-square-warning': MessageSquareWarning,
  radio: Radio,
  'gamepad-2': Gamepad2,
  infinity: InfinityIcon,
};

type ModuleId = (typeof PADDOCK_MODULES)[number]['id'] | null;

export function Paddock({ onExit }: { onExit: () => void }) {
  const [active, setActive] = useState<ModuleId>(null);

  return (
    <SceneShell bars={false}>
      {/* Ambient background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-carbon-950 via-carbon-900 to-carbon-950" />
      <div
        className="absolute inset-0 z-0 opacity-20"
        style={{ background: 'radial-gradient(ellipse at 50% 20%, rgba(225,6,0,0.12), transparent 60%)' }}
      />

      <div className="relative z-10 min-h-[100dvh] flex flex-col items-center justify-center px-6 py-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="font-telemetry text-racing-red text-xs tracking-[0.4em] uppercase mb-2">
            Race Complete · Permanent Garage
          </div>
          <h1 className="font-display text-5xl md:text-7xl text-carbon-100 leading-none">The Paddock</h1>
          <p className="font-body text-carbon-400 mt-3 max-w-md mx-auto">
            The race is over, but the garage stays open forever. Come back any time, Driver.
          </p>
        </motion.div>

        {/* Module grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 max-w-2xl w-full mb-8">
          {PADDOCK_MODULES.map((mod, i) => {
            const Icon = ICONS[mod.icon] ?? Mail;
            return (
              <motion.button
                key={mod.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ y: -6, scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  audio.click();
                  setActive(mod.id);
                }}
                className="hud-panel p-5 text-center group no-select"
              >
                <div className="w-12 h-12 mx-auto rounded-lg bg-racing-red/15 flex items-center justify-center text-racing-red group-hover:bg-racing-red/30 transition-colors mb-3">
                  <Icon size={22} />
                </div>
                <span className="font-display text-base text-carbon-100">{mod.label}</span>
              </motion.button>
            );
          })}
        </div>

        <button
          onClick={() => { audio.click(); onExit(); }}
          className="flex items-center gap-2 font-telemetry text-carbon-400 hover:text-racing-red text-sm tracking-widest uppercase transition-colors no-select"
        >
          <Home size={16} /> Replay Race
        </button>
      </div>

      {/* Module overlays */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-carbon-950/95 backdrop-blur-md overflow-y-auto"
          >
            <button
              onClick={() => { audio.click(); setActive(null); }}
              className="fixed top-4 right-4 z-[85] hud-panel p-2.5 text-carbon-300 hover:text-racing-red transition-colors no-select"
            >
              <X size={20} />
            </button>
            <div className="min-h-[100dvh] pt-4">
              {active === 'letter' && <PaddockLetter />}
              {active === 'licence' && <PaddockLicence />}
              {active === 'telemetry' && <PaddockTelemetry />}
              {active === 'trophies' && <PaddockTrophies />}
              {active === 'gallery' && <PaddockGallery />}
              {active === 'complaints' && <PaddockComplaints />}
              {active === 'radio' && <PaddockRadio />}
              {active === 'games' && <PaddockGames />}
              {active === 'future' && <PaddockFuture />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </SceneShell>
  );
}

// --- Paddock sub-views (lightweight wrappers) ---

function PaddockLetter() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h2 className="font-display text-4xl text-carbon-100 mb-6 text-center">The Letter</h2>
      <div className="hud-panel p-8">
        <p className="font-body text-carbon-200 leading-relaxed whitespace-pre-line">{TURN_TWO_LETTER.text}</p>
        <p className="font-handwritten text-3xl text-racing-gold text-right mt-6">— {TURN_TWO_LETTER.signature}</p>
      </div>
    </div>
  );
}

function PaddockLicence() {
  return <DriverLicence onDone={() => {}} progress={0.92} />;
}

function PaddockTelemetry() {
  return <Telemetry onDone={() => {}} progress={0.55} />;
}

function PaddockTrophies() {
  return <TrophyRoom onDone={() => {}} progress={0.75} />;
}

function PaddockGallery() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h2 className="font-display text-4xl text-carbon-100 mb-6 text-center">Memory Gallery</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {MEMORY_CORNERS.map((m) => (
          <div key={m.id} className="hud-panel overflow-hidden">
            <div className="relative h-48">
              <img src={m.image} alt={m.title} className="w-full h-full object-cover opacity-80" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-carbon-950 to-transparent" />
              <div className="absolute bottom-3 left-4">
                <span className="font-telemetry text-[10px] text-racing-red uppercase tracking-widest">{m.corner}</span>
                <h3 className="font-display text-xl text-white">{m.title}</h3>
              </div>
            </div>
            <p className="p-4 font-body text-sm text-carbon-300">{m.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PaddockComplaints() {
  return <ComplaintBox onDone={() => {}} progress={0.6} />;
}

function PaddockRadio() {
  return <TeamRadio onDone={() => {}} progress={0.65} />;
}

function PaddockGames() {
  return <MiniGames onDone={() => {}} progress={0.5} />;
}

function PaddockFuture() {
  return (
    <div className="max-w-xl mx-auto px-6 py-16 text-center">
      <InfinityIcon size={48} className="text-racing-gold mx-auto mb-6" />
      <h2 className="font-display text-4xl text-carbon-100 mb-4">Future Memories</h2>
      <p className="font-body text-carbon-300 leading-relaxed mb-6">
        This garage grows every birthday. New corners. New trophies. New inside jokes that only we will understand.
      </p>
      <div className="hud-panel p-6">
        <p className="font-telemetry text-racing-red text-sm tracking-widest uppercase mb-2">Next Season</p>
        <p className="font-display text-2xl text-carbon-100">To be continued...</p>
        <p className="font-handwritten text-2xl text-racing-gold mt-4">— {TEAM.engineer}, your Race Engineer</p>
      </div>
    </div>
  );
}
