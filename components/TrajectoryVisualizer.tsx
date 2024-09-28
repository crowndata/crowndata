import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useTrajectoryData } from "@/utils/useTrajectoryData";
import { SharedState } from "@/types/pageInterface";
import TrajectoryLine from "@/components/TrajectoryLine";
import styles from "@/styles/TrajectoryVisualizer.module.css";
import CameraSetup from "@/components/CameraSetup";
import TrajectoryDeviceOrientationAnimation from "./TrajectoryDeviceOrientationAnimation";
import { useInfoData } from "@/utils/useInfoData";

// Define the props type for the component
interface TrajectoryVisualizerProps {
  sharedState: SharedState;
  folderName: string;
}

const TrajectoryVisualizer: React.FC<TrajectoryVisualizerProps> = ({
  sharedState,
  folderName,
}) => {
  const infoData = useInfoData(folderName);

  const joints = infoData?.joints ?? [];

  // Use the custom hook
  const trajectoryDataArray = useTrajectoryData(folderName, joints);

  return (
    <div className={styles.canvasContainer}>
      <h2 className={styles.title}>Trajectory Visualizer</h2>
      <div className={styles.container}>
        <Canvas>
          <CameraSetup
            fov={45}
            aspectRatio={1}
            near={1}
            far={500}
            positionX={0}
            positionY={-2}
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

          {/* Render TrajectoryLines for each joint */}
          {trajectoryDataArray.map((data, index) => (
            <TrajectoryLine
              key={`trajectory-${index}`}
              positions={data.positions}
            />
          ))}

          {/* Render Joint Orientation and animation for each joint */}
          {trajectoryDataArray.map((data, index) => (
            <TrajectoryDeviceOrientationAnimation
              key={`arrow-${index}`}
              sharedState={sharedState}
              positions={data.positions}
              rotations={data.rotations}
            />
          ))}
        </Canvas>
      </div>
    </div>
  );
};

export default TrajectoryVisualizer;
