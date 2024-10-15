import "@/styles/globals.css";

import { Slider } from "@mui/material"; // Use Material UI for Slider
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import URDFLoader, { URDFRobot } from "urdf-loader";

import CameraSetup from "@/components/CameraSetup";
import Objects from "@/components/Objects";
import { useURDFFiles } from "@/hooks/useURDFFiles";
import styles from "@/styles/ThreeDScene.module.css";

type HandleJointChange = (jointName: string, newValue: number) => void;

interface Props {
  jointName: string;
  value: number;
  handleJointChange: HandleJointChange;
}

const MySlider: React.FC<Props> = ({ jointName, value, handleJointChange }) => {
  return (
    <div className={styles.controlItem}>
      {/* Display the joint name */}
      <label className={styles.label}>{jointName}</label>
      <Slider
        step={0.01}
        value={value}
        onChange={(_event: Event, newValue: number | number[]) => {
          handleJointChange(jointName, newValue as number);
        }}
        min={-Math.PI}
        max={Math.PI}
        className={styles.slider}
      />
    </div>
  );
};

const ThreeDScene: React.FC = () => {
  const [pickedObject] = useState<THREE.Object3D | null>(null);
  const [jointValues, setJointValues] = useState<{ [key: string]: number }>({}); // Object to store joint angles using joint names
  const objectRefs = useRef<THREE.Object3D[]>([]); // Track the objects in the scene
  const robotRef = useRef<THREE.Group | null>(null);
  const robotCache = useRef<URDFRobot | null>(null); // Cache robot globally

  const { urdfFiles, selectedKey, selectedFile, handleSelectChange } =
    useURDFFiles();

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
    if (selectedFile) {
      const loader = new URDFLoader();

      // Clear the previous robot from the cache before loading a new one
      robotCache.current = null;

      // Load the URDF file, skipping mass and inertia
      loader.load(selectedFile, (robot: URDFRobot) => {
        // Traverse the robot's links and remove mass and inertia if applicable
        robot.traverse((object) => {
          // Check if the object is a URDF link by checking for the presence of mass or inertia properties
          console.log(object);

          // Hide collision geometry if present
          if (object.name.includes("collision")) {
            object.visible = false;
          }
        });

        // Cache the loaded robot for rendering
        robotCache.current = robot;
      });
    }
  }, [selectedFile]); // Effect will run whenever selectedFile changes

  useEffect(() => {
    if (selectedFile && !robotCache.current) {
      const loader = new URDFLoader();

      loader.load(selectedFile, (robot: URDFRobot) => {
        robotCache.current = robot;
        const robotGroup = robot as unknown as THREE.Group;
        robotGroup.position.set(0, 0, 0); // Set position if needed
        robotRef.current = robotGroup; // Store robot group reference

        // Set initial joint values from robot joints
        const initialJointValues: { [key: string]: number } = {};
        Object.keys(robot.joints).forEach((jointName) => {
          const joint = robot.joints[jointName];
          if (joint.jointType === "fixed") {
            return; // Skip processing this joint
          }
          if (joint.type !== "fixed") {
            // Use strict equality check
            initialJointValues[jointName] =
              typeof joint.angle === "number" ? joint.angle : 0; // Ensure angle is a number, otherwise default to 0
          }
        });
        setJointValues(initialJointValues); // Update state with initial joint values
      });
    }
  }, [selectedFile]);

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.controlsContainer}>
          <label className="label">Embodiment: </label>
          <select
            onChange={handleSelectChange}
            value={selectedKey || ""}
            className="value"
          >
            <option value="" disabled>
              Select a Robot Embodiment
            </option>
            {useMemo(
              () =>
                Object.entries(urdfFiles).map(([key]) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                )),
              [urdfFiles],
            )}
          </select>
        </div>
        {/* Joint sliders and input fields */}
        <div className={styles.controlsContainer}>
          {Object.entries(jointValues).map(
            ([jointName, value]) =>
              jointName ? (
                <MySlider
                  key={jointName} // Add a key for each MySlider component for better performance
                  jointName={jointName}
                  value={value}
                  handleJointChange={handleJointChange}
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
