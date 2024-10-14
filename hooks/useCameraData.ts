"use client";

import { useEffect, useState } from "react";

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
    let isMounted = true; // Track whether the component is mounted

    if (folderName && cameras.length > 0) {
      const fetchCameraData = async () => {
        try {
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

          if (isMounted) {
            setCameraData(allData); // Only update state if component is still mounted
          }
        } catch (error) {
          if (isMounted) {
            console.error("Error loading JSON files:", error);
          }
        }
      };

      fetchCameraData();
    }

    return () => {
      isMounted = false; // Cleanup function to mark component as unmounted
    };
  }, [folderName, cameras]);

  const results = cameraData.map((data) => {
    const images: string[] = data.map((step) => step.image as string);

    return {
      images,
    };
  });

  return results;
};