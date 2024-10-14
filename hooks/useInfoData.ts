"use client";

import { useEffect, useState } from "react";

import { InfoData } from "@/types/dataInterface";

export const useInfoData = (folderName: string): InfoData | null => {
  const [infoData, setInfoData] = useState<InfoData | null>(null);

  useEffect(() => {
    let isMounted = true; // Track if the component is still mounted

    if (folderName) {
      fetch(`/data/${folderName}/information.json`) // Corrected to "camera.json"
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          if (isMounted && data && Array.isArray(data.cameras)) {
            setInfoData(data);
          } else {
            throw new Error("Invalid JSON structure");
          }
        })
        .catch((error) => {
          if (isMounted) {
            console.error("Error loading JSON file:", error);
          }
        });
    }

    return () => {
      isMounted = false; // Cleanup function to set the flag to false
    };
  }, [folderName]);

  return infoData;
};