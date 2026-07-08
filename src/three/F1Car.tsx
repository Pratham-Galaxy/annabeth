import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useRaceTrack } from './useRaceTrack';

type Props = {
  progress: number; // 0..1 position along track
  tyreColor?: string;
  drsOpen?: boolean;
};

// A stylised low-poly F1 car. No external model needed.
export function F1Car({ progress, tyreColor = '#e10600', drsOpen = false }: Props) {
  const group = useRef<THREE.Group>(null);
  const wheels = useRef<(THREE.Group | null)[]>([]);
  const wing = useRef<THREE.Mesh>(null);
  const { sampleAt } = useRaceTrack();

  useFrame((_, delta) => {
    if (!group.current) return;
    if (!isFinite(delta) || delta <= 0) return;
    const { position, tangent } = sampleAt(progress);
    group.current.position.lerp(position, Math.min(1, delta * 8));
    const lookAt = position.clone().add(tangent);
    group.current.lookAt(lookAt);

    wheels.current.forEach((w) => {
      if (w) w.rotation.x += delta * 18;
    });

    if (wing.current) {
      const target = drsOpen ? -0.5 : 0;
      wing.current.rotation.x = THREE.MathUtils.lerp(
        wing.current.rotation.x,
        target,
        Math.min(1, delta * 6),
      );
    }
  });

  const bodyMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#0d0e12', metalness: 0.7, roughness: 0.3 }),
    [],
  );
  const accentMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: tyreColor, metalness: 0.4, roughness: 0.4 }),
    [tyreColor],
  );
  const tyreMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#1a1a1a', roughness: 0.9 }),
    [],
  );
  const glassMat = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: '#111827',
      metalness: 0.9,
      roughness: 0.1,
      transparent: true,
      opacity: 0.8,
    }),
    [],
  );

  return (
    <group ref={group} scale={0.65}>
      {/* Main body */}
      <mesh material={bodyMat} castShadow>
        <boxGeometry args={[0.5, 0.18, 2.2]} />
      </mesh>
      {/* Nose cone */}
      <mesh material={bodyMat} position={[0, 0, 1.4]} castShadow>
        <boxGeometry args={[0.18, 0.12, 0.7]} />
      </mesh>
      {/* Front wing */}
      <mesh material={accentMat} position={[0, -0.06, 1.85]} castShadow>
        <boxGeometry args={[1.1, 0.04, 0.22]} />
      </mesh>
      <mesh material={bodyMat} position={[0, -0.12, 1.95]}>
        <boxGeometry args={[0.9, 0.1, 0.1]} />
      </mesh>
      {/* Side pods */}
      <mesh material={accentMat} position={[0.42, 0, -0.2]} castShadow>
        <boxGeometry args={[0.28, 0.22, 1.1]} />
      </mesh>
      <mesh material={accentMat} position={[-0.42, 0, -0.2]} castShadow>
        <boxGeometry args={[0.28, 0.22, 1.1]} />
      </mesh>
      {/* Cockpit / halo */}
      <mesh material={bodyMat} position={[0, 0.18, 0.1]}>
        <boxGeometry args={[0.34, 0.2, 0.6]} />
      </mesh>
      <mesh material={glassMat} position={[0, 0.28, 0.05]}>
        <sphereGeometry args={[0.18, 16, 12]} />
      </mesh>
      {/* Halo bar */}
      <mesh material={bodyMat} position={[0, 0.32, 0.1]}>
        <torusGeometry args={[0.22, 0.03, 8, 16, Math.PI]} />
      </mesh>
      {/* Airbox / roll hoop */}
      <mesh material={accentMat} position={[0, 0.34, -0.3]}>
        <boxGeometry args={[0.2, 0.22, 0.3]} />
      </mesh>
      {/* Rear wing (DRS flap) */}
      <group position={[0, 0.28, -1.15]}>
        <mesh material={bodyMat} position={[0, -0.1, 0]}>
          <boxGeometry args={[0.08, 0.22, 0.08]} />
        </mesh>
        <mesh material={bodyMat} position={[0, 0.1, 0]}>
          <boxGeometry args={[0.08, 0.22, 0.08]} />
        </mesh>
        <mesh ref={wing} material={accentMat} position={[0, 0.18, 0]} castShadow>
          <boxGeometry args={[1.0, 0.32, 0.06]} />
        </mesh>
      </group>

      {/* Wheels */}
      {[
        [0.5, -0.08, 1.0],
        [-0.5, -0.08, 1.0],
        [0.55, -0.05, -0.8],
        [-0.55, -0.05, -0.8],
      ].map((p, i) => (
        <group
          key={i}
          ref={(el) => {
            wheels.current[i] = el;
          }}
          position={p as [number, number, number]}
        >
          <mesh material={tyreMat} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.28, 0.28, 0.22, 18]} />
          </mesh>
          <mesh material={accentMat} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.14, 0.14, 0.24, 12]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
