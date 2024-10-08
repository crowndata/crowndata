import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useTrajectoryData } from "@/hooks/useTrajectoryData";
import { useJointPositionData } from "@/hooks/useJointPositionData";
import { SharedState } from "@/types/pageInterface";
import TrajectoryLine from "@/components/TrajectoryLine";
import CameraSetup from "@/components/CameraSetup";
import TrajectoryDeviceOrientationAnimation from "@/components/TrajectoryDeviceOrientationAnimation";
import TrajectoryDeviceGeometryAnimation from "@/components/TrajectoryDeviceGeometryAnimation";
import { useInfoData } from "@/hooks/useInfoData";
import "@/styles/globals.css";

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
  const jointPositionDataArray = useJointPositionData(folderName);

  return (
    <>
      <h3 className="title">Trajectory 3D Visualizer</h3>
      <div className="canvasContainer">
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
          <directionalLight position={[5, 5, 5]} intensity={1} />

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

          {/* Render Robot Geometry */}
          <TrajectoryDeviceGeometryAnimation
            sharedState={sharedState}
            joints={jointPositionDataArray.joints}
          />
        </Canvas>
      </div>
    </>
  );
};

export default TrajectoryVisualizer;
