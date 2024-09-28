'use client';

import { useState, useEffect } from "react";

export interface TrajectoryPoint {
  x: number;
  y: number;
  z: number;
  roll: number;
  pitch: number;
  yaw: number;
}

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
      const fetchTrajectoryData = async () => {
        const allData: TrajectoryPoint[][] = await Promise.all(
          joints.map(async (joint) => {
            const response = await fetch(
              `/data/${folderName}/trajectories/${joint}__trajectory.json`,
            );
            const data = await response.json();
            const formattedData = data.map((row: TrajectoryPoint) => ({
              x: typeof row.x === "string" ? parseFloat(row.x) : row.x,
              y: typeof row.y === "string" ? parseFloat(row.y) : row.y,
              z: typeof row.z === "string" ? parseFloat(row.z) : row.z,
              roll:
                typeof row.roll === "string" ? parseFloat(row.roll) : row.roll,
              pitch:
                typeof row.pitch === "string"
                  ? parseFloat(row.pitch)
                  : row.pitch,
              yaw: typeof row.yaw === "string" ? parseFloat(row.yaw) : row.yaw,
            }));
            return formattedData;
          }),
        );
        setTrajectoryData(allData);
      };

      fetchTrajectoryData().catch((error) => {
        console.error("Error loading JSON files:", error);
      });
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
