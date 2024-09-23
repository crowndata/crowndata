import React, { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ScatterPlotProps {
  positions: [number, number, number][];
  rotations: [number, number, number][];
}

const ScatterPlot: React.FC<ScatterPlotProps> = ({ positions, rotations }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const arrowRef = useRef<THREE.ArrowHelper>(null);
  const [currentPoint, setCurrentPoint] = useState(0);

  // Get the corresponding position  for the current point
  const [x, y, z] = positions[currentPoint];
  const pointPos = new THREE.Vector3(x, y, z);

  // Get the corresponding rotation (as direction) for the current point
  const [roll, pitch, yaw] = rotations[currentPoint];

  // Create an Euler object from roll, pitch, and yaw
  const euler = new THREE.Euler(roll, pitch, yaw, "XYZ");
  const rotationVector = new THREE.Vector3(0, 0, 1)
    .applyEuler(euler)
    .normalize(); // Normalize the rotation

  // Create a BufferGeometry and set its position attribute
  const geometry = useMemo(() => {
    const pointsGeometry = new THREE.BufferGeometry();
    const positionArray = new Float32Array(positions.flat());
    pointsGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positionArray, 3),
    );
    return pointsGeometry;
  }, [positions]);

  // Create the material for the points
  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: 0x0000ff, // Blue points
        size: 0.5, // Size of points
        transparent: true,
        opacity: 1.0, // Start fully opaque
      }),
    [],
  );

  // Animate the points using `useFrame`
  useFrame(() => {
    if (pointsRef.current) {
      const positionAttribute = pointsRef.current.geometry.attributes.position;
      const numPoints = positionAttribute.count;

      // Move to the next point, wrapping around if necessary
      setCurrentPoint((prev) => {
        const nextPoint = prev >= numPoints - 1 ? 0 : prev + 1;

        // Update the draw range to only render a small portion of the points
        geometry.setDrawRange(nextPoint, 1); // Render 1 points, or less if at the end

        return nextPoint;
      });
    }
  });

  return (
    <>
      {/* Render the points */}
      <points ref={pointsRef} geometry={geometry} material={material} />

      {/* Render the ArrowHelper */}
      <primitive
        ref={arrowRef}
        object={new THREE.ArrowHelper(rotationVector, pointPos, 1, 0xffff00)}
      />
    </>
  );
};

export default ScatterPlot;
