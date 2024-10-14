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

  // Function to create colored line segments
  const createColorLine = (
    start: THREE.Vector3,
    end: THREE.Vector3,
    color: THREE.Color | string | number,
  ) => {
    // Create geometry
    const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);

    // Create material with the specified color
    const material = new THREE.LineBasicMaterial({ color });

    // Create the line object
    return new THREE.Line(geometry, material);
  };

  // Memoize the array of line segments
  const lines = useMemo(() => {
    // Function to calculate interpolated colors
    const calculateColors = (
      vectorPoints: THREE.Vector3[],
      startColor: THREE.Color | string | number = 0xff0000, // Default start color (red)
      endColor: THREE.Color | string | number = 0x0000ff, // Default end color (blue)
    ) => {
      const numSegments = vectorPoints.length - 1; // Number of line segments
      const colors: (THREE.Color | string | number)[] = [];

      // Convert startColor and endColor to THREE.Color if they are not already
      const colorStart = new THREE.Color(startColor);
      const colorEnd = new THREE.Color(endColor);

      // Interpolate color for each segment
      for (let i = 0; i < numSegments; i++) {
        const t = numSegments > 1 ? i / (numSegments - 1) : 0; // Handle single-segment case
        const color = colorStart.clone().lerp(colorEnd, t);
        colors.push(color);
      }

      return colors;
    };

    const colors = calculateColors(vectorPoints);
    return vectorPoints
      .slice(0, -1)
      .map((start, i) =>
        createColorLine(start, vectorPoints[i + 1], colors[i]),
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
