import Image from "next/image";
import { SharedState } from "@/utils/useTrajectoryData";
import styles from "./ImageAnimation.module.css";

interface ImageAnimationProps {
  sharedState: SharedState;
  folderName: string;
  images: string[];
}

const ImageAnimation: React.FC<ImageAnimationProps> = ({
  sharedState,
  folderName,
  images,
}) => {
  const { currentPoint, setCurrentPoint } = sharedState;

  return (
    <div className={styles.imageContainer}>
      <Image
        src={`/${folderName}/images/${images[currentPoint]}`} // Dynamic image path
        alt={`Image ${currentPoint + 1}`}
        width={1000} // Required by Next.js for aspect ratio
        height={200} // Required by Next.js for aspect ratio
        className={styles.animatedImage} // Using CSS Module class
      />
    </div>
  );
};

export default ImageAnimation;
