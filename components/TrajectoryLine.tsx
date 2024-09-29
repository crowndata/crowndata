import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import "@/styles/globals.css";

interface TrajectoryLineProps {
  positions: [number, number, number][];
}

const TrajectoryLine: React.FC<TrajectoryLineProps> = ({ positions }) => {
  // Correctly typing the ref for a THREE.Line object
  const lineRef = useRef<THREE.Line>(null);

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

  // Optionally update or animate the line in the useFrame hook
  useFrame(() => {
    if (lineRef.current) {
      // You can manipulate the lineRef here
    }
  });

  return (
    // Use <primitive> to render a Three.js object with a ref
    <primitive object={new THREE.Line(geometry, material)} ref={lineRef} />
  );
};

export default TrajectoryLine;
