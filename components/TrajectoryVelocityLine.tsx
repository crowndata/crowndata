import "@/styles/globals.css";

import { useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import * as THREE from "three";

import { useDeepCompareMemoWithTolerance } from "@/hooks/useDeepCompareMemoWithTolerance";

interface TrajectoryVelocityLineProps {
  positions: [number, number, number][];
}

const TrajectoryVelocityLine: React.FC<TrajectoryVelocityLineProps> = ({
  positions,
}) => {
  // Memoize conversion of [x, y, z] arrays to THREE.Vector3 objects
  const vectorPoints = useDeepCompareMemoWithTolerance(
    () => positions.map((point) => new THREE.Vector3(...point)),
    [positions], // Dependency array
    1e-4, // Tolerance for comparison
  );

  // Memoize the array of line segments
  const lines = useMemo(() => {
    // Calculate distances between consecutive points
    const calculateDistances = (points: THREE.Vector3[]): number[] =>
      points.slice(1).map((p, i) => p.distanceTo(points[i]));

    // Calculate thickness based on distance, mapping it between min/max
    const calculateLinewidths = (
      points: THREE.Vector3[],
      minLinewidth: number,
      maxLinewidth: number,
    ): number[] => {
      const distances = calculateDistances(points);
      const [minDistance, maxDistance] = [
        Math.min(...distances),
        Math.max(...distances),
      ];
      const range = maxDistance - minDistance || 1e-7; // Avoid division by zero

      return distances.map(
        (distance) =>
          minLinewidth +
          ((maxLinewidth - minLinewidth) / range) * (distance - minDistance),
      );
    };

    // Create a cylindrical line segment with variable thickness
    const createThickLine = (
      start: THREE.Vector3,
      end: THREE.Vector3,
      linewidth: number,
    ) => {
      const direction = new THREE.Vector3().subVectors(end, start);
      const midPoint = new THREE.Vector3()
        .addVectors(start, end)
        .multiplyScalar(0.5);
      const length = direction.length();

      const geometry = new THREE.CylinderGeometry(
        linewidth,
        linewidth,
        length,
        8,
      );
      const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const cylinder = new THREE.Mesh(geometry, material);

      // Calculate orientation for the line segment
      const orientation = new THREE.Matrix4();
      const up = new THREE.Vector3(0, 1, 0);
      const rotationAxis = up.clone().cross(direction).normalize();
      if (rotationAxis.length() > 0) {
        const angle = Math.acos(up.dot(direction.clone().normalize()));
        orientation.makeRotationAxis(rotationAxis, angle);
      }
      cylinder.applyMatrix4(orientation);
      cylinder.position.copy(midPoint);

      return cylinder;
    };
    const linewidths = calculateLinewidths(vectorPoints, 0.0001, 0.01);
    return vectorPoints
      .slice(0, -1)
      .map((start, i) =>
        createThickLine(start, vectorPoints[i + 1], linewidths[i]),
      );
  }, [vectorPoints]);

  const { scene } = useThree();

  useEffect(() => {
    // Add lines to the scene
    lines.forEach((line) => {
      scene.add(line);
    });

    // Cleanup function to remove lines when the component unmounts
    return () => {
      lines.forEach((line) => {
        scene.remove(line);
      });
    };
  }, [lines, scene]); // Re-run if lines or scene changes

  return null;
};

export default TrajectoryVelocityLine;
