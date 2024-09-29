import { memo } from "react";
import Image from "next/image";
import "@/styles/globals.css";

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
      className="animatedImageContainer"
      loading="eager" // Eager loading to ensure it loads quickly
      unoptimized={true} // Disable Next.js image optimization
      priority={true} // Preload image to avoid reloading
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
