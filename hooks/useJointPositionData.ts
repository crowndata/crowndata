"use client";

import { useEffect, useState } from "react";

import { JsonNumberData } from "@/types/dataInterface";

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
          const jsonData: JsonNumberData = await response.json();
          const transformedData: { [key: string]: number[] } = {};

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
