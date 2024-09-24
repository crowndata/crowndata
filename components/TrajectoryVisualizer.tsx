import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Papa, { ParseResult } from "papaparse";
import TrajectoryLine from "./TrajectoryLine";
import styles from "./TrajectoryVisualizer.module.css";
import CameraSetup from "./CameraSetup";
import ScatterPlot from "./TrajectoryDeviceOrientationAnimationPlot";

interface TrajectoryPoint {
  x: string | number;
  y: string | number;
  z: string | number;
  roll: string | number;
  pitch: string | number;
  yaw: string | number;
}

// Define the props type for the component
interface TrajectoryVisualizerProps {
  folderName: string;
}

const TrajectoryVisualizer: React.FC<TrajectoryVisualizerProps> = ({
  folderName,
}) => {
  const [trajectoryData, setTrajectoryData] = useState<TrajectoryPoint[]>([]);
  const [currentPoint, setCurrentPoint] = useState(0);
  const sharedState = { currentPoint, setCurrentPoint };

  useEffect(() => {
    if (folderName) {
      // Use PapaParse to load and parse the CSV file
      fetch(`/${folderName}/trajectory.json`)
        .then((response) => response.json())
        .then((data) => {
          const formattedData = data.map((row: TrajectoryPoint) => ({
            x: typeof row.x === "string" ? parseFloat(row.x) : row.x,
            y: typeof row.y === "string" ? parseFloat(row.y) : row.y,
            z: typeof row.z === "string" ? parseFloat(row.z) : row.z,
            roll:
              typeof row.roll === "string" ? parseFloat(row.roll) : row.roll,
            pitch:
              typeof row.pitch === "string" ? parseFloat(row.pitch) : row.pitch,
            yaw: typeof row.yaw === "string" ? parseFloat(row.yaw) : row.yaw,
          }));
          setTrajectoryData(formattedData);
        })
        .catch((error) => {
          console.error("Error loading JSON file:", error);
        });
    }
  }, [folderName]);

  const positions: [number, number, number][] = trajectoryData.map(
    (step) => [step.x, step.y, step.z] as [number, number, number],
  );

  const rotations: [number, number, number][] = trajectoryData.map(
    (step) => [step.roll, step.pitch, step.yaw] as [number, number, number],
  );

  // Add an effect to loop through trajectory points
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPoint((prevPoint) => {
        if (trajectoryData.length > 0) {
          return (prevPoint + 1) % trajectoryData.length;
        }
        return prevPoint;
      });
    }, 10); // Adjust speed (1000ms = 1 second)

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [trajectoryData]);

  return (
    <div className={styles.canvasContainer}>
      <Canvas>
        <CameraSetup
          fov={45}
          aspectRatio={window.innerWidth / window.innerHeight}
          near={1}
          far={500}
          positionX={0}
          positionY={-10}
          positionZ={0}
          lookAtX={0}
          lookAtY={0}
          lookAtZ={0}
        />
        <OrbitControls />
        <ambientLight intensity={0.5} />

        {/* AxesHelper to show the coordinate system */}
        <axesHelper args={[5]} />

        {trajectoryData.length > 0 && <TrajectoryLine positions={positions} />}

        {trajectoryData.length > 0 && (
          <ScatterPlot
            sharedState={sharedState}
            positions={positions}
            rotations={rotations}
          />
        )}
      </Canvas>
    </div>
  );
};

export default TrajectoryVisualizer;
