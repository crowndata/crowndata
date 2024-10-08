import React, { useRef, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import URDFLoader, { URDFRobot } from "urdf-loader";
import { SharedState } from "@/types/pageInterface";
import * as THREE from "three";

interface TrajectoryDeviceGeometryAnimationProps {
  sharedState: SharedState;
  joints: { [key: string]: number[] };
}

const TrajectoryDeviceGeometryAnimation: React.FC<
  TrajectoryDeviceGeometryAnimationProps
> = ({ sharedState, joints }) => {
  const robotRef = useRef<THREE.Group | null>(null);
  const { scene } = useThree();
  const { currentPoint } = sharedState;

  // Cache robot globally
  const robotCache = useRef<URDFRobot | null>(null);

  useEffect(() => {
    if (!robotCache.current) {
      // Load the URDF model only if it's not cached
      const loader = new URDFLoader();

      loader.load(
        "/geometries/franka_description/panda.urdf",
        (robot: URDFRobot) => {
          robotCache.current = robot;
        },
      );
    } else {
      // Update joint values if the robot is already loaded
      const robot = robotCache.current;
      if (robot) {
        for (const key in joints) {
          if (joints.hasOwnProperty(key) && robot.joints[key]) {
            robot.joints[key].setJointValue(joints[key][currentPoint]);
          }
        }
        const robotGroup = robot as unknown as THREE.Group;
        robotGroup.position.set(0, 0, 0);
        scene.add(robotGroup);
        robotRef.current = robotGroup; // Set the robotRef to reference the added robot
      }
    }

    // Clean up
    const currentRobotRef = robotRef.current; // Copy the current ref value
    return () => {
      if (currentRobotRef) {
        scene.remove(currentRobotRef); // Use the copied ref value in the cleanup
      }
    };
  }, [joints, currentPoint, scene]);

  return null;
};

export default TrajectoryDeviceGeometryAnimation;
