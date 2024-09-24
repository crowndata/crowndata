import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { SharedState } from "@/utils/useTrajectoryData";
import TrajectoryLine from "./TrajectoryLine";
import styles from "./TrajectoryVisualizer.module.css";
import CameraSetup from "./CameraSetup";
import TrajectoryDeviceOrientationAnimation from "./TrajectoryDeviceOrientationAnimation";

// Define the props type for the component
interface TrajectoryVisualizerProps {
  currentPoint: SharedState;
  positions: [number, number, number][];
  rotations: [number, number, number][];
}

const TrajectoryVisualizer: React.FC<TrajectoryVisualizerProps> = ({
  sharedState,
  positions,
  rotations,
}) => {
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

        <TrajectoryLine positions={positions} />

        <TrajectoryDeviceOrientationAnimation
          sharedState={sharedState}
          positions={positions}
          rotations={rotations}
        />
      </Canvas>
    </div>
  );
};

export default TrajectoryVisualizer;
