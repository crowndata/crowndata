import "@/styles/globals.css";

import { Card, CardBody, CardHeader } from "@nextui-org/card";

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
    <Card shadow="sm" className="py-4 w-full">
      <CardHeader className="pb-0 pt-2 px-4 flex flex-col items-start">
        <h4 className="font-bold text-lg">Camera Image Animation</h4>
      </CardHeader>
      <CardBody className="overflow-visible py-2">
        <div className="imageGrid">
          {cameras.map((_, index) => (
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
      </CardBody>
    </Card>
  );
};

export default CameraImageAnimation;
