"use client";

import { useEffect, useState } from "react";

export interface UseJointPositionDataResult {
  joints: { [key: string]: number[] };
}

export const useJointPositionData = (
  folderName: string,
): UseJointPositionDataResult => {
  const [joints, setJoints] = useState<{ [key: string]: number[] }>({});

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    if (folderName) {
      const fetchTrajectoryData = async () => {
        try {
          const response = await fetch(
            `/data/${folderName}/trajectories/joint_positions.json`,
            { signal },
          );
          if (!response.ok) {
            throw new Error("Failed to fetch joint positions data");
          }
          const data = await response.json();
          const transformedData: { [key: string]: number[] } = {};

          data.forEach((entry: { [key: string]: number }) => {
            for (const [key, value] of Object.entries(entry)) {
              if (!transformedData[key]) {
                transformedData[key] = [];
              }
              transformedData[key].push(value);
            }
          });

          setJoints(transformedData);
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

  return { joints };
};
