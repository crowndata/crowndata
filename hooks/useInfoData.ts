"use client";

import { useEffect, useState } from "react";

import { InfoData } from "@/types/dataInterface";

export const useInfoData = (folderName: string): InfoData | null => {
  const [infoData, setInfoData] = useState<InfoData | null>(null);

  useEffect(() => {
    if (folderName) {
      // Fetch the JSON file and process the data
      fetch(`/data/${folderName}/information.json`) // Corrected to "camera.json"
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          if (data && Array.isArray(data.cameras)) {
            setInfoData(data);
          } else {
            throw new Error("Invalid JSON structure");
          }
        })
        .catch((error) => {
          console.error("Error loading JSON file:", error);
        });
    }
  }, [folderName]);

  return infoData;
};
