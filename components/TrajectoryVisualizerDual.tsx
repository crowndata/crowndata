import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useTrajectoryDataDual } from "@/utils/useTrajectoryData";
import { SharedState } from "@/types/pageInterface";
import TrajectoryLine from "@/components/TrajectoryLine";
import styles from "@/styles/TrajectoryVisualizerDual.module.css";
import CameraSetup from "@/components/CameraSetup";
import TrajectoryDeviceOrientationAnimation from "./TrajectoryDeviceOrientationAnimation";
import { useInfoData } from "@/utils/useInfoData";
import "@/styles/globals.css";

// Define the props type for the component
interface TrajectoryVisualizerProps {
  sharedState1: SharedState;
  folderName1: string;
  sharedState2: SharedState;
  folderName2: string;
}

const TrajectoryVisualizerDual: React.FC<TrajectoryVisualizerProps> = ({
  sharedState1,
  folderName1,
  sharedState2,
  folderName2,
}) => {
  const infoData = useInfoData(folderName1);

  const joints = infoData?.joints ?? [];

  // Use the custom hook
  const { results1: trajectoryDataArray1, results2: trajectoryDataArray2 } =
    useTrajectoryDataDual(folderName1, folderName2, joints);

  return (
    <div className={styles.columns}>
      <div className={styles.column}>
        <div className="container">
          {/* First Column */}
          <h2 className="title">Trajectory Visualizer</h2>
          <div className={styles.canvasContainer}>
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
              {trajectoryDataArray1.map((data, index) => (
                <TrajectoryLine
                  key={`trajectory-${index}`}
                  positions={data.positions}
                />
              ))}

              {/* Render Joint Orientation and animation for each joint */}
              {trajectoryDataArray1.map((data, index) => (
                <TrajectoryDeviceOrientationAnimation
                  key={`arrow-${index}`}
                  sharedState={sharedState1}
                  positions={data.positions}
                  rotations={data.rotations}
                />
              ))}
            </Canvas>
          </div>
        </div>
      </div>
      <div className={styles.column}>
        <div className="container">
          <h2 className="title">Trajectory Visualizer</h2>
          <div className={styles.canvasContainer}>
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
              {trajectoryDataArray2.map((data, index) => (
                <TrajectoryLine
                  key={`trajectory-${index}`}
                  positions={data.positions}
                />
              ))}

              {/* Render Joint Orientation and animation for each joint */}
              {trajectoryDataArray2.map((data, index) => (
                <TrajectoryDeviceOrientationAnimation
                  key={`arrow-${index}`}
                  sharedState={sharedState2}
                  positions={data.positions}
                  rotations={data.rotations}
                />
              ))}
            </Canvas>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrajectoryVisualizerDual;
