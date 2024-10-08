"use client";

import { useState, useEffect } from "react";

export interface UseJointPositionDataResult {
  joints: { [key: string]: number[] };
}

export const useJointPositionData = (
  folderName: string,
): UseJointPositionDataResult => {
  const [joints, setJoints] = useState<{ [key: string]: number[] }>({});

  useEffect(() => {
    if (folderName) {
      const fetchTrajectoryData = async () => {
        try {
          const response = await fetch(
            `/data/${folderName}/trajectories/joint_positions.json`,
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
        } catch (error) {
          console.error("Error loading JSON files:", error);
        }
      };

      fetchTrajectoryData();
    }
  }, [folderName]);

  return { joints };
};
