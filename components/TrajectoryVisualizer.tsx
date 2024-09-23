import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Papa, { ParseResult } from "papaparse";
import TrajectoryLine from "./TrajectoryLine";
import styles from "./TrajectoryVisualizer.module.css";
import CameraSetup from "./CameraSetup";
import ScatterPlot from "./ScatterPlot";

interface TrajectoryPoint {
  x: number;
  y: number;
  z: number;
  roll: number;
  pitch: number;
  yaw: number;
}

// Define the props type for the component
interface TrajectoryVisualizerProps {
  folderName: string;
}

const TrajectoryVisualizer: React.FC<TrajectoryVisualizerProps> = ({
  folderName,
}) => {
  const [trajectoryData, setTrajectoryData] = useState<TrajectoryPoint[]>([]);

  useEffect(() => {
    if (folderName) {
      // Use PapaParse to load and parse the CSV file
      Papa.parse(`/${folderName}/trajectory.csv`, {
        download: true,
        header: true,
        complete: (
          result: ParseResult<{
            x: string;
            y: string;
            z: string;
            roll: string;
            pitch: string;
            yaw: string;
          }>,
        ) => {
          const data = result.data;
          const formattedData = data.map((row) => ({
            x: parseFloat(row.x),
            y: parseFloat(row.y),
            z: parseFloat(row.z),
            roll: parseFloat(row.roll),
            pitch: parseFloat(row.pitch),
            yaw: parseFloat(row.yaw),
          }));
          setTrajectoryData(formattedData);
        },
      });
    }
  }, [folderName]);

  const positions: [number, number, number][] = trajectoryData.map(
    (step) => [step.x, step.y, step.z] as [number, number, number],
  );

  const rotations: [number, number, number][] = trajectoryData.map(
    (step) => [step.roll, step.pitch, step.yaw] as [number, number, number],
  );

  return (
    <div className={styles.canvasContainer}>
      <Canvas>
        <CameraSetup
          fov={45}
          aspectRatio={window.innerWidth / window.innerHeight}
          near={1}
          far={500}
          positionX={0}
          positionY={0}
          positionZ={10}
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
          <ScatterPlot positions={positions} rotations={rotations} />
        )}
      </Canvas>
    </div>
  );
};

export default TrajectoryVisualizer;
