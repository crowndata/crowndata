import { useState, useEffect } from "react";

export interface CameraName {
  cameras: string[];
}

export const useCameraName = (folderName: string): CameraName | null => {
  const [cameraName, setCameraName] = useState<CameraName | null>(null);

  useEffect(() => {
    if (folderName) {
      // Fetch the JSON file and process the data
      fetch(`/data/${folderName}/camera.json`) // Corrected to "camera.json"
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          if (data && Array.isArray(data.cameras)) {
            setCameraName(data);
          } else {
            throw new Error("Invalid JSON structure");
          }
        })
        .catch((error) => {
          console.error("Error loading JSON file:", error);
        });
    }
  }, [folderName]);

  return cameraName;
};
