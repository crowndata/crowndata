import { memo } from "react";
import Image from "next/image";
import styles from "@/styles/CameraImage.module.css"; // Assuming your CSS module is imported here

// Define prop types
type CameraImageProps = {
  currentPoint: number;
  folderName: string;
  images: string[]; // Assuming images is a list of string paths
};

// Memoized CameraImage
const CameraImage = memo(
  ({ currentPoint, folderName, images }: CameraImageProps) => (
    <Image
      src={`/data/${folderName}/images/${images[currentPoint]}`}
      alt={`Image ${currentPoint + 1}`}
      width={300}
      height={200}
      className={styles.animatedImage}
      loading="eager" // Eager loading to ensure it loads quickly
      priority={true} // Forces image to load earlier to avoid jumps
    />
  ),
  // Optional custom comparison function for memoization
  (prevProps, nextProps) => {
    return (
      prevProps.currentPoint === nextProps.currentPoint &&
      prevProps.folderName === nextProps.folderName &&
      prevProps.images === nextProps.images
    );
  },
);

// Add displayName for debugging
CameraImage.displayName = "CameraImage";

export default CameraImage;
