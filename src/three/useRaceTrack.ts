import * as THREE from 'three';
import { useMemo } from 'react';

export type TrackPoint = {
  position: THREE.Vector3;
  tangent: THREE.Vector3;
  normal: THREE.Vector3;
};

// Build a closed-loop racing circuit with corners at known t values.
// The track lives in the XZ plane; Y is up.
export function useRaceTrack() {
  const { curve, length, cornerStops } = useMemo(() => {
    // Define a flowing circuit via control points.
    const controlPts = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(18, 0, -6),
      new THREE.Vector3(30, 0, -22),
      new THREE.Vector3(26, 0, -44),
      new THREE.Vector3(8, 0, -52),
      new THREE.Vector3(-14, 0, -48),
      new THREE.Vector3(-30, 0, -34),
      new THREE.Vector3(-38, 0, -14),
      new THREE.Vector3(-30, 0, 8),
      new THREE.Vector3(-10, 0, 14),
      new THREE.Vector3(6, 0, 10),
    ];

    const curve = new THREE.CatmullRomCurve3(controlPts, true, 'catmullrom', 0.5);
    const length = curve.getLength();

    // Corner stop t-values (where memories / scenes pause the car).
    const cornerStops = [0.0, 0.1, 0.2, 0.3, 0.42, 0.55, 0.68, 0.8, 0.92];

    return { curve, length, cornerStops };
  }, []);

  const sampleAt = (t: number): TrackPoint => {
    const tt = ((t % 1) + 1) % 1;
    const position = curve.getPointAt(tt);
    const tangent = curve.getTangentAt(tt).normalize();
    const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
    return { position, tangent, normal };
  };

  return { curve, length, cornerStops, sampleAt };
}
