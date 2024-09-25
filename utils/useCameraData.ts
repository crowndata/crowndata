import { useState, useEffect } from "react";

export interface CameraData {
  image: string;
}

export interface UseCameraDataResult {
  images: string[];
}

export const useCameraData = (
  folderName: string,
  cameras: string[],
): UseCameraDataResult[] => {
  const [cameraData, setCameraData] = useState<CameraData[][]>([]);

  useEffect(() => {
    if (folderName && cameras.length > 0) {
      const fetchCameraData = async () => {
        const allData: CameraData[][] = await Promise.all(
          cameras.map(async (camera) => {
            const response = await fetch(
              `/data/${folderName}/images/${camera}__image.json`,
            );
            const data = await response.json();
            const formattedData = data.map((row: CameraData) => ({
              image: row.image,
            }));
            return formattedData;
          }),
        );
        setCameraData(allData);
      };

      fetchCameraData().catch((error) => {
        console.error("Error loading JSON files:", error);
      });
    }
  }, [folderName, cameras]);

  const results = cameraData.map((data) => {
    const images: string[] = data.map((step) => step.image as string);

    return {
      images,
    };
  });

  return results;
};
