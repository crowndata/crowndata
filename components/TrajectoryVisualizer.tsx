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
  sharedState: SharedState;
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
          positionY={-5}
          positionZ={0}
          lookAtX={0}
          lookAtY={0}
          lookAtZ={0}
        />
        <OrbitControls
          enablePan={true} // Panning is enabled by default, but you can ensure it is enabled
          panSpeed={1.5} // Adjust pan speed (default is 1)
          screenSpacePanning={false} // If true, panning moves in screen space, false moves in world space
        />
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
