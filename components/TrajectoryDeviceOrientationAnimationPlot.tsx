import React, { useRef } from "react";
import * as THREE from "three";

// Define the shared state interface
interface SharedState {
  currentPoint: number;
  setCurrentPoint: React.Dispatch<React.SetStateAction<number>>;
}

interface TrajectoryDeviceOrientationAnimationPlotProps {
  sharedState: SharedState;
  positions: [number, number, number][];
  rotations: [number, number, number][];
}

const TrajectoryDeviceOrientationAnimationPlot: React.FC<
  TrajectoryDeviceOrientationAnimationPlotProps
> = ({ sharedState, positions, rotations }) => {
  const arrowRef = useRef<THREE.ArrowHelper>(null);
  const { currentPoint } = sharedState;

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

  return (
    <>
      {/* Render the ArrowHelper */}
      <primitive
        ref={arrowRef}
        object={new THREE.ArrowHelper(rotationVector, pointPos, 1, 0x0000ff)}
      />
    </>
  );
};

export default TrajectoryDeviceOrientationAnimationPlot;
