"use client";

import { useEffect, useState } from "react";

import { JsonNumberData, TrajectoryPoint } from "@/types/dataInterface";

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
              const jsonData: JsonNumberData = await response.json();

              const transformedData: TrajectoryPoint[] = jsonData.data.map(
                (row) => {
                  return {
                    x: row[jsonData.columns.indexOf("x")],
                    y: row[jsonData.columns.indexOf("y")],
                    z: row[jsonData.columns.indexOf("z")],
                    roll: row[jsonData.columns.indexOf("roll")],
                    pitch: row[jsonData.columns.indexOf("pitch")],
                    yaw: row[jsonData.columns.indexOf("yaw")],
                  };
                },
              );

              return transformedData;
            }),
          );
          setTrajectoryData(allData);
        } catch (error: unknown) {
          if (error instanceof TypeError) {
            console.error("There was a network error:", error.message);
          } else if (error instanceof Error) {
            console.error("An error occurred:", error.message);
          } else {
            console.error("An unknown error occurred");
          }
        }
      };

      fetchTrajectoryData();

      return () => {
        controller.abort();
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
