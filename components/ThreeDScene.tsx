import React, { useRef, useState, useEffect } from "react";
import { Slider } from "@mui/material"; // Use Material UI for Slider
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import URDFLoader, { URDFRobot } from "urdf-loader";
import * as THREE from "three";
import Objects from "@/components/Objects"; // Custom 3D objects
import CameraSetup from "@/components/CameraSetup";
import "@/styles/globals.css";
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
    if (!robotCache.current) {
      const loader = new URDFLoader();

      loader.load(
        "/geometries/franka_description/panda.urdf",
        (robot: URDFRobot) => {
          robotCache.current = robot;
          const robotGroup = robot as unknown as THREE.Group;
          robotGroup.position.set(0, 0, 0); // Set position if needed
          robotRef.current = robotGroup; // Store robot group reference

          // Set initial joint values from robot joints
          const initialJointValues: { [key: string]: number } = {};
          Object.keys(robot.joints).forEach((jointName) => {
            initialJointValues[jointName] =
              (robot.joints[jointName].angle as number) || 0; // Use the current joint angle or default to 0
          });
          setJointValues(initialJointValues); // Update state with initial joint values
        },
      );
    }
  }, []);

  return (
    <div className={styles.container}>
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
        {robotRef.current && <primitive object={robotRef.current} />}{" "}
        {/* Add robot to the scene */}
      </Canvas>
      {/* Joint sliders and input fields */}
      <div className={styles.controlsContainer}>
        {Object.entries(jointValues).map(
          ([jointName, value]) =>
            jointName.includes("panda_joint") ||
            jointName.includes("inner_finger_joint") ||
            jointName === "finger_joint" ? (
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
  );
};

export default ThreeDScene;
