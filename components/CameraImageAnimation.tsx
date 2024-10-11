import "@/styles/globals.css";

import CameraImage from "@/components/CameraImage";
import { useCameraData } from "@/hooks/useCameraData";
import { useInfoData } from "@/hooks/useInfoData";
import { SharedState } from "@/types/pageInterface";

interface CameraImageAnimationProps {
  sharedState: SharedState;
  folderName: string;
}

const CameraImageAnimation: React.FC<CameraImageAnimationProps> = ({
  sharedState,
  folderName,
}) => {
  const { currentPoint } = sharedState;

  // Fetch camera information based on folderName
  const infoData = useInfoData(folderName);
  const cameras = infoData?.cameras ?? [];

  // Fetch camera data for the list of cameras
  const cameraDataArray = useCameraData(folderName, cameras);

  // If cameras or camera data are not loaded yet, show a loading message
  if (!cameras.length || !cameraDataArray || cameraDataArray.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="imageAnimationContainer">
      <h2 className="title">Camera Image Animation</h2>
      <div className="imageGrid">
        {cameras.map((camera, index) => (
          <div key={index} className="imageColumn">
            {cameraDataArray[index] ? (
              <CameraImage
                currentPoint={currentPoint}
                folderName={folderName}
                images={cameraDataArray[index].images} // Accessing the correct index
              />
            ) : (
              <div>No images available</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CameraImageAnimation;
