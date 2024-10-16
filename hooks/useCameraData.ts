"use client";

import { useEffect, useState } from "react";

import { JsonStringData } from "@/types/dataInterface";

export interface UseCameraDataResult {
  images: { [key: string]: string[] };
}

export const useCameraData = (folderName: string): UseCameraDataResult => {
  const [images, setImages] = useState<{ [key: string]: string[] }>({});

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    if (folderName) {
      const fetchTrajectoryData = async () => {
        try {
          const response = await fetch(
            `/data/${folderName}/images/camera_images.json`,
            { signal },
          );
          if (!response.ok) {
            throw new Error("Failed to fetch joint positions data");
          }
          const jsonData: JsonStringData = await response.json();
          const transformedData: { [key: string]: string[] } = {};

          // Initialize empty arrays for each column
          jsonData.columns.forEach((column) => {
            transformedData[column] = [];
          });

          // Populate arrays with data from each row
          jsonData.data.forEach((row) => {
            row.forEach((value, index) => {
              const columnName = jsonData.columns[index];
              transformedData[columnName].push(value);
            });
          });
          setImages(transformedData);
        } catch (error: unknown) {
          if (error instanceof TypeError) {
            // Handle network or fetch-specific error
            console.error("There was a network error:", error.message);
          } else if (error instanceof Error) {
            // Handle general error
            console.error("An error occurred:", error.message);
          } else {
            console.error("An unknown error occurred");
          }
        }
      };

      fetchTrajectoryData();
    }

    return () => {
      controller.abort(); // Cleanup fetch request if component unmounts or folderName changes
    };
  }, [folderName]);

  return { images };
};
