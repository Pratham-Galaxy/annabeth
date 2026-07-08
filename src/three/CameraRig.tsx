import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useRaceTrack } from './useRaceTrack';

type Props = {
  progress: number;
  mode?: 'chase' | 'wide' | 'corner';
  staticView?: boolean;
};

// Cinematic camera that follows the car along the track.
export function CameraRig({ progress, mode = 'chase', staticView = false }: Props) {
  const { camera } = useThree();
  const { sampleAt } = useRaceTrack();
  const target = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    if (!isFinite(delta) || delta <= 0) return;
    const { position, tangent } = sampleAt(progress);
    target.current.copy(position);

    let camPos: THREE.Vector3;
    let lookAt: THREE.Vector3;

    if (staticView) {
      camPos = new THREE.Vector3(0, 30, -22);
      lookAt = new THREE.Vector3(0, 0, -22);
    } else if (mode === 'wide') {
      camPos = position
        .clone()
        .addScaledVector(tangent, -10)
        .add(new THREE.Vector3(0, 9, 0));
      lookAt = position.clone().add(new THREE.Vector3(0, 1, 0));
    } else if (mode === 'corner') {
      camPos = position
        .clone()
        .addScaledVector(tangent, 4)
        .add(new THREE.Vector3(0, 3.5, 0));
      lookAt = position.clone();
    } else {
      // chase
      camPos = position
        .clone()
        .addScaledVector(tangent, -5.5)
        .add(new THREE.Vector3(0, 3.2, 0));
      lookAt = position.clone().addScaledVector(tangent, 4);
    }

    const lerpFactor = Math.min(1, delta * (mode === 'wide' ? 3 : 5));
    camera.position.lerp(camPos, lerpFactor);
    camera.lookAt(lookAt);
  });

  return null;
}
