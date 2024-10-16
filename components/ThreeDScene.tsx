import "@/styles/globals.css";

import { Select, SelectItem, SelectSection } from "@nextui-org/select";
import { Slider } from "@nextui-org/slider";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import URDFLoader, { URDFRobot } from "urdf-loader";

import CameraSetup from "@/components/CameraSetup";
import Objects from "@/components/Objects";
import { useURDFFiles } from "@/hooks/useURDFFile";
import styles from "@/styles/ThreeDScene.module.css";
import {
  armURDFFiles,
  assemblyURDFFiles,
  gripperURDFFiles,
} from "@/utils/geometry";

type JointLimit = {
  lowerLimit: number;
  upperLimit: number;
};

const ThreeDScene: React.FC = () => {
  const [pickedObject] = useState<THREE.Object3D | null>(null);
  const [jointValues, setJointValues] = useState<{ [key: string]: number }>({}); // Object to store joint angles using joint names
  const [jointLimits, setJointLimits] = useState<{ [key: string]: JointLimit }>(
    {},
  ); // Object to store joint angles using joint names

  const objectRefs = useRef<THREE.Object3D[]>([]); // Track the objects in the scene
  const robotRef = useRef<THREE.Group | null>(null);
  const robotCache = useRef<URDFRobot | null>(null); // Cache robot globally

  const { selectedKey, selectedFile, handleSelectChange } = useURDFFiles();

  // Handle joint angle updates
  const handleJointChange = (jointName: string, newValue: number) => {
    const updatedJoints = { ...jointValues, [jointName]: newValue };
    setJointValues(updatedJoints);

    const robot = robotCache.current;
    if (robot && robot.joints[jointName]) {
      robot.joints[jointName].setJointValue(newValue);
    }
  };

  useEffect(() => {
    if (selectedKey) {
      const loader = new URDFLoader();

      // Clear the previous robot from the cache before loading a new one
      robotCache.current = null;

      // Load the URDF file, skipping mass and inertia
      if (selectedFile) {
        loader.load(selectedFile, (robot: URDFRobot) => {
          // Traverse the robot's links and remove mass and inertia if applicable
          robot.traverse((object) => {
            // Hide collision geometry if present
            if (object.name.includes("collision")) {
              object.visible = false;
            }
          });

          // Cache the loaded robot for rendering
          robotCache.current = robot;
        });
      }
    }
  }, [selectedKey, selectedFile]); // Effect will run whenever selectedFile changes

  useEffect(() => {
    if (selectedKey && !robotCache.current) {
      const loader = new URDFLoader();
      if (selectedFile) {
        loader.load(selectedFile, (robot: URDFRobot) => {
          robotCache.current = robot;
          const robotGroup = robot as unknown as THREE.Group;
          robotGroup.position.set(0, 0, 0); // Set position if needed
          robotRef.current = robotGroup; // Store robot group reference

          // Set initial joint values from robot joints
          const initialJointValues: { [key: string]: number } = {};
          const initialJointLimits: {
            [key: string]: { lowerLimit: number; upperLimit: number };
          } = {};
          Object.keys(robot.joints).forEach((jointName) => {
            const joint = robot.joints[jointName];
            if (joint.jointType === "fixed") {
              return; // Skip processing this joint
            }
            if (joint.type !== "fixed") {
              // Use strict equality check
              initialJointValues[jointName] =
                typeof joint.angle === "number" ? joint.angle : 0; // Ensure angle is a number, otherwise default to 0

              initialJointLimits[jointName] = {
                lowerLimit:
                  typeof joint.limit.lower === "number"
                    ? joint.limit.lower
                    : -Infinity,
                upperLimit:
                  typeof joint.limit.upper === "number"
                    ? joint.limit.upper
                    : Infinity,
              };
            }
          });
          setJointLimits(initialJointLimits);
          setJointValues(initialJointValues); // Update state with initial joint values
        });
      }
    }
  }, [selectedKey, selectedFile]);

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className="flex w-full max-w-xs items-center gap-2 primary">
          <Select
            label="Embodiment"
            labelPlacement="inside"
            variant="underlined"
            placeholder="Select a model"
            selectedKeys={selectedKey ? [selectedKey] : []}
            onChange={handleSelectChange}
            className="max-w-xs w-full primary bg-gray-900"
            scrollShadowProps={{ isEnabled: false }}
          >
            <SelectSection showDivider title="assembly">
              {Object.keys(assemblyURDFFiles).map((key) => (
                <SelectItem key={key} className="w-full primary bg-gray-500">
                  {key}
                </SelectItem>
              ))}
            </SelectSection>
            <SelectSection showDivider title="arm only">
              {Object.keys(armURDFFiles).map((key) => (
                <SelectItem key={key} className="w-full primary bg-gray-500">
                  {key}
                </SelectItem>
              ))}
            </SelectSection>
            <SelectSection showDivider title="gripper only">
              {Object.keys(gripperURDFFiles).map((key) => (
                <SelectItem key={key} className="w-full primary bg-gray-500">
                  {key}
                </SelectItem>
              ))}
            </SelectSection>
          </Select>
        </div>
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

export default ThreeDScene;
