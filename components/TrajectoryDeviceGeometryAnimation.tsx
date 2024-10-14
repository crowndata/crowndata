import { useThree } from "@react-three/fiber";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import URDFLoader, { URDFRobot } from "urdf-loader";

import { SharedState } from "@/types/pageInterface";

interface TrajectoryDeviceGeometryAnimationProps {
  sharedState: SharedState;
  joints: { [key: string]: number[] };
  urdfFile: string;
}

const TrajectoryDeviceGeometryAnimation: React.FC<
  TrajectoryDeviceGeometryAnimationProps
> = ({ sharedState, joints, urdfFile }) => {
  const robotRef = useRef<THREE.Group | null>(null);
  const { scene } = useThree();
  const { currentPoint } = sharedState;

  // Cache robot globally
  const robotCache = useRef<URDFRobot | null>(null);

  useEffect(() => {
    if (!robotCache.current) {
      // Load the URDF model only if it's not cached
      const loader = new URDFLoader();

      loader.load(urdfFile, (robot: URDFRobot) => {
        robotCache.current = robot;
      });
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

    // Clean up the robot from the scene
    const currentRobotRef = robotRef.current; // Copy the current ref value
    return () => {
      if (currentRobotRef) {
        scene.remove(currentRobotRef); // Remove the robot from the scene

        // Dispose of all geometries, materials, and textures to prevent memory leaks
        currentRobotRef.traverse((object) => {
          if ((object as THREE.Mesh).geometry) {
            (object as THREE.Mesh).geometry.dispose();
          }
          if ((object as THREE.Mesh).material) {
            const material = (object as THREE.Mesh).material;
            if (Array.isArray(material)) {
              material.forEach((mat) => mat.dispose());
            } else {
              material.dispose();
            }
          }
        });
      }
    };
  }, [joints, currentPoint, scene, urdfFile]);

  return null;
};

export default TrajectoryDeviceGeometryAnimation;
