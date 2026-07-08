import { useMemo } from 'react';
import * as THREE from 'three';
import { useRaceTrack } from './useRaceTrack';

// Renders the ribbon track mesh + corner markers.
export function RaceTrack() {
  const { cornerStops, sampleAt } = useRaceTrack();

  const geometry = useMemo(() => {
    const segments = 240;
    const halfWidth = 1.6;
    const positions: number[] = [];
    const indices: number[] = [];
    const uvs: number[] = [];

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const { position, normal } = sampleAt(t);
      const left = position.clone().addScaledVector(normal, halfWidth);
      const right = position.clone().addScaledVector(normal, -halfWidth);
      positions.push(left.x, left.y + 0.02, left.z);
      positions.push(right.x, right.y + 0.02, right.z);
      uvs.push(0, t * 40);
      uvs.push(1, t * 40);
      if (i < segments) {
        const a = i * 2;
        indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }, [sampleAt]);

  const trackMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#15161a',
        roughness: 0.85,
        metalness: 0.1,
      }),
    [],
  );

  const kerbMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#e10600',
        emissive: '#e10600',
        emissiveIntensity: 0.3,
        roughness: 0.6,
      }),
    [],
  );

  const cornerMarkers = useMemo(
    () =>
      cornerStops.map((t) => {
        const { position, normal } = sampleAt(t);
        return { pos: position, normal, t };
      }),
    [cornerStops, sampleAt],
  );

  // Center line dashes
  const dashes = useMemo(() => {
    const arr: { pos: [number, number, number] }[] = [];
    for (let i = 0; i < 120; i++) {
      const t = i / 120;
      const { position } = sampleAt(t);
      arr.push({ pos: [position.x, 0.03, position.z] });
    }
    return arr;
  }, [sampleAt]);

  return (
    <group>
      {/* Track surface */}
      <mesh geometry={geometry} material={trackMat} receiveShadow />

      {/* Kerbs at corners */}
      {cornerMarkers.map((c, i) => (
        <mesh
          key={i}
          material={kerbMat}
          position={[c.pos.x, 0.04, c.pos.z]}
          rotation={[0, Math.atan2(c.normal.x, c.normal.z), 0]}
        >
          <boxGeometry args={[3.4, 0.04, 1.2]} />
        </mesh>
      ))}

      {/* Center dashed line */}
      {dashes.map((d, i) =>
        i % 2 === 0 ? (
          <mesh key={i} position={d.pos}>
            <boxGeometry args={[0.1, 0.01, 0.6]} />
            <meshStandardMaterial color="#f5f5f5" />
          </mesh>
        ) : null,
      )}

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, -22]} receiveShadow>
        <planeGeometry args={[160, 160]} />
        <meshStandardMaterial color="#0a0b0e" roughness={1} />
      </mesh>
    </group>
  );
}
