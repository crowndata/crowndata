import { useInfoData } from "@/utils/useInfoData";
import styles from "@/styles/CameraImageAnimation.module.css";
import CameraImage from "@/components/CameraImage";
import { SharedState } from "@/types/pageInterface";
import { useCameraData } from "@/utils/useCameraData";

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
    <div className={styles.imageContainer}>
      <h2 className={styles.title}>Camera Image Animation</h2>
      <div className={styles.imageGrid}>
        {cameras.map((camera, index) => (
          <div key={index} className={styles.imageColumn}>
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
