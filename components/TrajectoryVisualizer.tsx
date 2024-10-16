import "@/styles/globals.css";

import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { useEffect } from "react";

import CameraSetup from "@/components/CameraSetup";
import TrajectoryDeviceGeometryAnimation from "@/components/TrajectoryDeviceGeometryAnimation";
import TrajectoryDeviceOrientationAnimation from "@/components/TrajectoryDeviceOrientationAnimation";
import TrajectoryLine from "@/components/TrajectoryLine";
import TrajectoryVelocityLine from "@/components/TrajectoryVelocityLine";
import { useInfoData } from "@/hooks/useInfoData";
import { useJointPositionData } from "@/hooks/useJointPositionData";
import { useTrajectoryData } from "@/hooks/useTrajectoryData";
import { useURDFFiles } from "@/hooks/useURDFFile";
import { SharedState } from "@/types/pageInterface";
import { urdfFiles } from "@/utils/geometry";

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

  const { selectedKey, setSelectedKey } = useURDFFiles();

  useEffect(() => {
    if (infoData?.robotEmbodiment) {
      setSelectedKey(infoData.robotEmbodiment);
    }
  }, [infoData?.robotEmbodiment, setSelectedKey]); // Only run when infoData.robotEmbodiment changes

  return (
    <Card shadow="sm" className="py-4 w-full">
      <CardHeader className="pb-0 pt-2 px-4 flex flex-col items-start">
        <h4 className="font-bold text-lg">Trajectory 3D Visualizer</h4>
      </CardHeader>
      <CardBody className="overflow-visible py-2">
        <div className="canvasContainer">
          <Canvas>
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
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1} />

            {/* AxesHelper to show the coordinate system */}
            <axesHelper args={[5]} />

            {/* Render TrajectoryLines for each joint */}
            {trajectoryDataArray.map((data, index) => (
              <TrajectoryVelocityLine
                key={`trajectory-velocity-${index}`}
                positions={data.positions}
              />
            ))}
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
            {selectedKey ? (
              <TrajectoryDeviceGeometryAnimation
                sharedState={sharedState}
                joints={jointPositionDataArray.joints}
                urdfFile={urdfFiles[selectedKey]}
              />
            ) : null}
          </Canvas>
        </div>
      </CardBody>
    </Card>
  );
};

export default TrajectoryVisualizer;
