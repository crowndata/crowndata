import React, { useRef } from "react";
import * as THREE from "three";
import { SharedState } from "@/types/pageInterface";
import "@/styles/globals.css";

interface TrajectoryDeviceOrientationAnimationProps {
  sharedState: SharedState;
  positions: [number, number, number][];
  rotations: [number, number, number][];
}

const TrajectoryDeviceOrientationAnimation: React.FC<
  TrajectoryDeviceOrientationAnimationProps
> = ({ sharedState, positions, rotations }) => {
  const arrowRef = useRef<THREE.ArrowHelper>(null);
  // If any of the required props are undefined, return an empty fragment
  if (!sharedState || !positions || !rotations || positions.length < 1) {
    return <></>;
  }
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
        object={
          new THREE.ArrowHelper(
            rotationVector,
            pointPos,
            0.1,
            0x0000ff,
            0.02,
            0.02,
          )
        }
      />
    </>
  );
};

export default TrajectoryDeviceOrientationAnimation;
