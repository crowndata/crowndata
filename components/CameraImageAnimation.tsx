import { SharedState } from "@/utils/useTrajectoryData";
import { useCameraName } from "@/utils/useCameraName";
import styles from "./CameraImageAnimation.module.css";
import CameraImage from "@/components/CameraImage";

interface CameraImageAnimationProps {
  sharedState: SharedState;
  folderName: string;
  images: string[];
}

const CameraImageAnimation: React.FC<CameraImageAnimationProps> = ({
  sharedState,
  folderName,
  images,
}) => {
  const { currentPoint } = sharedState;

  const cameraName = useCameraName(folderName);

  return (
    <div className={styles.imageContainer}>
      <h2 className={styles.title}>Camera Image Animation</h2>
      <div className={styles.imageGrid}>
        {cameraName?.cameras.map((camera, index) => (
          <div key={index} className={styles.imageColumn}>
            <CameraImage
              camera={camera}
              currentPoint={currentPoint}
              folderName={folderName}
              images={images}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
export default CameraImageAnimation;
