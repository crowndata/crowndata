import "@/styles/globals.css";

import { useThree } from "@react-three/fiber";
import React, { useEffect, useMemo } from "react";
import * as THREE from "three";

interface TrajectoryLineProps {
  positions: [number, number, number][];
}

const TrajectoryLine: React.FC<TrajectoryLineProps> = ({ positions }) => {
  // Create a BufferGeometry and set its position attribute
  const geometry = useMemo(() => {
    const lineGeometry = new THREE.BufferGeometry();

    // Flatten positions and create a typed Float32Array
    const positionArray = new Float32Array(positions.flat());

    // Set the position attribute for the geometry
    lineGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positionArray, 3),
    );

    return lineGeometry;
  }, [positions]);

  // Create the material for the line
  const material = useMemo(
    () => new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 2 }),
    [],
  );

  const { scene } = useThree();

  useEffect(() => {
    const line = new THREE.Line(geometry, material);
    scene.add(line); // Add line to scene when component mounts

    // Clean up: Remove the line from the scene and dispose of resources
    return () => {
      scene.remove(line);
      geometry.dispose(); // Dispose of geometry to avoid memory leak
      material.dispose(); // Dispose of material to avoid memory leak
    };
  }, [geometry, material, scene]); // Run only when geometry or material changes

  return null; // No JSX since we're adding the object directly to the scene
};

export default TrajectoryLine;
