import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { useEffect, useState } from 'react';
import { audio } from '../../lib/audio';

export function MuteToggle() {
  const [muted, setMuted] = useState(audio.isMuted());
  useEffect(() => {
    const off = audio.onMuteChange(setMuted);
    return () => { off(); };
  }, []);
  return (
    <button
      onClick={() => {
        audio.unlock();
        setMuted(audio.toggleMute());
      }}
      className="fixed top-4 right-4 z-[70] hud-panel p-2.5 text-carbon-200 hover:text-racing-red transition-colors no-select"
      aria-label={muted ? 'Unmute' : 'Mute'}
    >
      {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
    </button>
  );
}

export function RadioStaticOverlay({ active }: { active: boolean }) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: active ? 0.12 : 0 }}
      transition={{ duration: 0.4 }}
      className="pointer-events-none fixed inset-0 z-50 radio-static-bg"
    />
  );
}

export function Vignette() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-40"
      style={{
        background:
          'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)',
      }}
    />
  );
}

export function CinematicBars({ show }: { show: boolean }) {
  return (
    <>
      <motion.div
        initial={false}
        animate={{ height: show ? '7vh' : 0 }}
        transition={{ duration: 0.6, ease: [0.7, 0, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-[65] bg-carbon-950 pointer-events-none"
      />
      <motion.div
        initial={false}
        animate={{ height: show ? '7vh' : 0 }}
        transition={{ duration: 0.6, ease: [0.7, 0, 0.3, 1] }}
        className="fixed bottom-0 left-0 right-0 z-[65] bg-carbon-950 pointer-events-none"
      />
    </>
  );
}

export function SceneShell({
  children,
  bars = true,
}: {
  children: React.ReactNode;
  bars?: boolean;
}) {
  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden">
      <CinematicBars show={bars} />
      <Vignette />
      {children}
    </div>
  );
}

export function ContinueButton({
  onClick,
  label = 'Continue',
  delay = 0,
}: {
  onClick: () => void;
  label?: string;
  delay?: number;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      onClick={() => {
        audio.unlock();
        audio.click();
        onClick();
      }}
      className="group relative px-10 py-3.5 font-display text-lg tracking-wider text-carbon-100 no-select"
    >
      <span className="absolute inset-0 border border-racing-red/50 rounded-lg group-hover:border-racing-red transition-colors" />
      <span className="absolute inset-0 bg-racing-red/0 group-hover:bg-racing-red/10 transition-colors rounded-lg" />
      <span className="relative flex items-center gap-2">
        {label}
        <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
      </span>
    </motion.button>
  );
}
