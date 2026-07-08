import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SceneId, RACE_ORDER } from './config/team';
import { audio } from './lib/audio';
import { MuteToggle } from './components/ui/Overlay';
import { ModeSelect } from './scenes/ModeSelect';
import { LoadingScreen } from './scenes/LoadingScreen';
import { RadioIntro } from './scenes/RadioIntro';
import { TurnOne } from './scenes/TurnOne';
import { TurnTwo } from './scenes/TurnTwo';
import { TurnThree } from './scenes/TurnThree';
import { PitStop } from './scenes/PitStop';
import { Telemetry } from './scenes/Telemetry';
import { DRSZone } from './scenes/DRSZone';
import { MemoryCircuit } from './scenes/MemoryCircuit';
import { MiniGames } from './scenes/MiniGames';
import { TeamRadio } from './scenes/TeamRadio';
import { TrophyRoom } from './scenes/TrophyRoom';
import { DriverLicence } from './scenes/DriverLicence';
import { FinalLap } from './scenes/FinalLap';
import { Paddock } from './scenes/Paddock';

// Map each scene to a track progress fraction (the car's position).
const SCENE_PROGRESS: Record<SceneId, number> = {
  start: 0.0,
  loading: 0.0,
  'radio-intro': 0.0,
  'turn-one': 0.1,
  'turn-two': 0.2,
  'turn-three': 0.3,
  'pit-stop': 0.42,
  telemetry: 0.5,
  drs: 0.55,
  'memory-circuit': 0.68,
  'mini-games': 0.75,
  'team-radio': 0.8,
  'trophy-room': 0.85,
  licence: 0.9,
  'final-lap': 0.95,
  'secret-ending': 1.0,
  paddock: 0.0,
};

export default function App() {
  const [scene, setScene] = useState<SceneId>('start');
  const [tyreColor, setTyreColor] = useState('#e10600');
  const [transitioning, setTransitioning] = useState(false);

  const goNext = useCallback(() => {
    setTransitioning(true);
    audio.whoosh();
    window.setTimeout(() => {
      setScene((current) => {
        const idx = RACE_ORDER.indexOf(current);
        if (idx === -1) return current;
        const next = RACE_ORDER[Math.min(idx + 1, RACE_ORDER.length - 1)];
        return next;
      });
      setTransitioning(false);
    }, 600);
  }, []);

  const replay = useCallback(() => {
    setTransitioning(true);
    window.setTimeout(() => {
      setScene('start');
      setTransitioning(false);
    }, 600);
  }, []);

  // Unlock audio on first interaction
  useEffect(() => {
    const handler = () => audio.unlock();
    window.addEventListener('pointerdown', handler, { once: true });
    window.addEventListener('keydown', handler, { once: true });
    return () => {
      window.removeEventListener('pointerdown', handler);
      window.removeEventListener('keydown', handler);
    };
  }, []);

  const startRace = useCallback(() => {
    setTransitioning(true);
    window.setTimeout(() => {
      setScene('loading');
      setTransitioning(false);
    }, 600);
  }, []);

  const openPaddock = useCallback(() => {
    setTransitioning(true);
    window.setTimeout(() => {
      setScene('paddock');
      setTransitioning(false);
    }, 600);
  }, []);

  const progress = SCENE_PROGRESS[scene] ?? 0;

  const renderScene = () => {
    switch (scene) {
      case 'start':
        return <ModeSelect onRace={startRace} onPaddock={openPaddock} />;
      case 'loading':
        return <LoadingScreen onDone={goNext} />;
      case 'radio-intro':
        return <RadioIntro onDone={goNext} />;
      case 'turn-one':
        return <TurnOne onDone={goNext} progress={progress} tyreColor={tyreColor} />;
      case 'turn-two':
        return <TurnTwo onDone={goNext} progress={progress} tyreColor={tyreColor} />;
      case 'turn-three':
        return <TurnThree onDone={goNext} progress={progress} tyreColor={tyreColor} />;
      case 'pit-stop':
        return <PitStop onDone={goNext} onTyreSelect={setTyreColor} />;
      case 'telemetry':
        return <Telemetry onDone={goNext} progress={progress} />;
      case 'drs':
        return <DRSZone onDone={goNext} progress={progress} tyreColor={tyreColor} />;
      case 'memory-circuit':
        return <MemoryCircuit onDone={goNext} progress={progress} tyreColor={tyreColor} />;
      case 'mini-games':
        return <MiniGames onDone={goNext} progress={progress} />;
      case 'team-radio':
        return <TeamRadio onDone={goNext} progress={progress} />;
      case 'trophy-room':
        return <TrophyRoom onDone={goNext} progress={progress} />;
      case 'licence':
        return <DriverLicence onDone={goNext} progress={progress} />;
      case 'final-lap':
        return <FinalLap onDone={() => setScene('paddock')} progress={progress} tyreColor={tyreColor} />;
      case 'paddock':
        return <Paddock onExit={replay} />;
      default:
        return <ModeSelect onRace={startRace} onPaddock={openPaddock} />;
    }
  };

  return (
    <div className="relative min-h-[100dvh] w-full bg-carbon-950">
      <MuteToggle />
      <div className="noise-overlay" />

      {/* Direct mount — no AnimatePresence to avoid keeping old WebGL canvases alive during transition */}
      <div key={scene} className="contents">
        {renderScene()}
      </div>

      {/* Transition wipe */}
      <AnimatePresence>
        {transitioning && (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            exit={{ scaleY: 0 }}
            transition={{ duration: 0.6, ease: [0.7, 0, 0.3, 1] }}
            className="fixed inset-0 z-[90] bg-carbon-950 origin-bottom pointer-events-none"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
