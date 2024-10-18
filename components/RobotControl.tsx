import "@/styles/globals.css";

import { Slider } from "@nextui-org/slider";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import URDFLoader, { URDFRobot } from "urdf-loader";

import CameraSetup from "@/components/CameraSetup";
import Objects from "@/components/Objects";
import styles from "@/styles/ThreeDScene.module.css";

type JointLimit = {
  lowerLimit: number;
  upperLimit: number;
};

interface RobotControlProps {
  geometry: string;
}

const RobotControl: React.FC<RobotControlProps> = ({ geometry }) => {
  const [pickedObject] = useState<THREE.Object3D | null>(null);
  const [jointValues, setJointValues] = useState<{ [key: string]: number }>({});
  const [jointLimits, setJointLimits] = useState<{ [key: string]: JointLimit }>(
    {},
  );
  const objectRefs = useRef<THREE.Object3D[]>([]);
  const robotRef = useRef<THREE.Group | null>(null);
  const robotCache = useRef<URDFRobot | null>(null);

  // Update joint angles
  const handleJointChange = (jointName: string, newValue: number) => {
    setJointValues((prev) => ({ ...prev, [jointName]: newValue }));
    robotCache.current?.joints[jointName]?.setJointValue(newValue);
  };

  useEffect(() => {
    if (!geometry) return;

    const loader = new URDFLoader();
    robotCache.current = null; // Clear previous robot

    const handleRobotLoad = (robot: URDFRobot) => {
      robot.traverse((object) => {
        if (object.name.includes("collision")) object.visible = false; // Hide collision geometry
      });

      robotCache.current = robot;
      robotRef.current = robot as unknown as THREE.Group;

      const jointValues: { [key: string]: number } = {};
      const jointLimits: { [key: string]: JointLimit } = {};

      Object.entries(robot.joints).forEach(([name, joint]) => {
        if (joint.jointType === "fixed") return;

        jointValues[name] = (joint.angle as number) || 0;
        jointLimits[name] = {
          lowerLimit: (joint.limit.lower as number) ?? -10, // use -10 as default lower limit
          upperLimit: (joint.limit.upper as number) ?? 10, // use 10 as default upper limit
        };
      });

      setJointLimits(jointLimits);
      setJointValues(jointValues);
    };

    loader.load(geometry, handleRobotLoad);
  }, [geometry]);

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        {/* Joint sliders and input fields */}
        <div className={styles.controlsContainer}>
          {Object.entries(jointValues).map(
            ([jointName, value]) =>
              jointName ? (
                <Slider
                  label={jointName}
                  size="sm"
                  step={0.01}
                  aria-label="control"
                  key={`control-${jointName}`}
                  value={value}
                  onChange={(newValue: number | number[]) => {
                    handleJointChange(jointName, newValue as number);
                  }}
                  minValue={
                    Math.round(jointLimits[jointName].lowerLimit * 100) / 100
                  }
                  maxValue={
                    Math.round(jointLimits[jointName].upperLimit * 100) / 100
                  }
                  className="max-w-md w-full"
                />
              ) : null, // Return null for joints that don't match
          )}
        </div>
      </div>

      <div className={styles.right}>
        <Canvas className={styles.canvas}>
          <CameraSetup
            fov={45}
            aspectRatio={1}
            near={1}
            far={500}
            positionX={0}
            positionY={-2}
            positionZ={2}
            lookAtX={0}
            lookAtY={0}
            lookAtZ={0}
          />
          <OrbitControls
            enablePan={true} // Panning is enabled by default, but you can ensure it is enabled
            panSpeed={1.5} // Adjust pan speed (default is 1)
            screenSpacePanning={false} // If true, panning moves in screen space, false moves in world space
          />
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[5, 5, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <Objects ref={objectRefs} pickedObject={pickedObject} />
          {robotRef.current && <primitive object={robotRef.current} />}
        </Canvas>
      </div>
    </div>
  );
};

export default RobotControl;
