"use client";

import { useEffect, useState } from "react";

import { TrajectoryPoint } from "@/types/dataInterface";

export interface UseTrajectoryDataResult {
  positions: [number, number, number][];
  rotations: [number, number, number][];
}

export const useTrajectoryData = (
  folderName: string,
  joints: string[],
): UseTrajectoryDataResult[] => {
  const [trajectoryData, setTrajectoryData] = useState<TrajectoryPoint[][]>([]);

  useEffect(() => {
    if (folderName && joints.length > 0) {
      const controller = new AbortController();
      const fetchTrajectoryData = async () => {
        try {
          const allData: TrajectoryPoint[][] = await Promise.all(
            joints.map(async (joint) => {
              const response = await fetch(
                `/data/${folderName}/trajectories/${joint}__trajectory.json`,
                { signal: controller.signal },
              );
              if (!response.ok) throw new Error("Failed to fetch data");
              const data = await response.json();
              return data.map((row: TrajectoryPoint) => ({
                x: row.x,
                y: row.y,
                z: row.z,
                roll: row.roll,
                pitch: row.pitch,
                yaw: row.yaw,
              }));
            }),
          );
          setTrajectoryData(allData);
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

      return () => {
        controller.abort(); // Cleanup by aborting the fetch when component unmounts
      };
    }
  }, [folderName, joints]);

  const results = trajectoryData.map((data) => {
    const positions: [number, number, number][] = data.map(
      (step) => [step.x, step.y, step.z] as [number, number, number],
    );

    const rotations: [number, number, number][] = data.map(
      (step) => [step.roll, step.pitch, step.yaw] as [number, number, number],
    );

    return {
      positions,
      rotations,
    };
  });

  return results;
};
