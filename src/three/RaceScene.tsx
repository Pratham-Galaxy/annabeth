import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { RaceTrack } from './RaceTrack';
import { F1Car } from './F1Car';
import { CameraRig } from './CameraRig';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';

type Props = {
  progress: number;
  tyreColor?: string;
  drsOpen?: boolean;
  cameraMode?: 'chase' | 'wide' | 'corner';
  staticView?: boolean;
};

export function RaceScene({
  progress,
  tyreColor = '#e10600',
  drsOpen = false,
  cameraMode = 'chase',
  staticView = false,
}: Props) {
  return (
    <ErrorBoundary fallback={<div className="absolute inset-0 bg-carbon-950" />}>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 8, 8], fov: 55 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#08090b']} />
        <fog attach="fog" args={['#08090b', 30, 90]} />

        <ambientLight intensity={0.25} />
        <directionalLight
          position={[20, 30, 10]}
          intensity={1.2}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-10, 6, -20]} intensity={0.5} color="#e10600" distance={40} />
        <pointLight position={[10, 6, 0]} intensity={0.4} color="#0080ff" distance={40} />

        <Suspense fallback={null}>
          <RaceTrack />
          <F1Car progress={progress} tyreColor={tyreColor} drsOpen={drsOpen} />
          <CameraRig progress={progress} mode={cameraMode} staticView={staticView} />
        </Suspense>
      </Canvas>
    </ErrorBoundary>
  );
}
