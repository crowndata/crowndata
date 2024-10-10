"use client";

import { useState, useEffect, useCallback } from "react";
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

export const useTrajectoryDataDual = (
  folderName1: string,
  folderName2: string,
  joints: string[],
): {
  results1: UseTrajectoryDataResult[];
  results2: UseTrajectoryDataResult[];
} => {
  const [trajectoryData1, setTrajectoryData1] = useState<TrajectoryPoint[][]>(
    [],
  );
  const [trajectoryData2, setTrajectoryData2] = useState<TrajectoryPoint[][]>(
    [],
  );

  const fetchTrajectoryData = useCallback(
    async (folderName: string): Promise<TrajectoryPoint[][]> => {
      return await Promise.all(
        joints.map(async (joint) => {
          const response = await fetch(
            `/data/${folderName}/trajectories/${joint}__trajectory.json`,
          );
          const data = await response.json();
          return data.map((row: TrajectoryPoint) => ({
            x: typeof row.x === "string" ? parseFloat(row.x) : row.x,
            y: typeof row.y === "string" ? parseFloat(row.y) : row.y,
            z: typeof row.z === "string" ? parseFloat(row.z) : row.z,
            roll:
              typeof row.roll === "string" ? parseFloat(row.roll) : row.roll,
            pitch:
              typeof row.pitch === "string" ? parseFloat(row.pitch) : row.pitch,
            yaw: typeof row.yaw === "string" ? parseFloat(row.yaw) : row.yaw,
          }));
        }),
      );
    },
    [joints],
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        if (folderName1 && joints.length > 0) {
          const data1 = await fetchTrajectoryData(folderName1);
          setTrajectoryData1(data1);
        }

        if (folderName2 && joints.length > 0) {
          const data2 = await fetchTrajectoryData(folderName2);
          setTrajectoryData2(data2);
        }
      } catch (error) {
        console.error("Error loading JSON files:", error);
      }
    };

    loadData(); // Call the combined data fetch function
  }, [folderName1, folderName2, joints, fetchTrajectoryData]);

  const formatResults = (
    trajectoryData: TrajectoryPoint[][],
  ): UseTrajectoryDataResult[] => {
    return trajectoryData.map((data) => ({
      positions: data.map(
        (step) => [step.x, step.y, step.z] as [number, number, number],
      ),
      rotations: data.map(
        (step) => [step.roll, step.pitch, step.yaw] as [number, number, number],
      ),
    }));
  };

  const results1 = formatResults(trajectoryData1);
  const results2 = formatResults(trajectoryData2);

  return { results1, results2 };
};
