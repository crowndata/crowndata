"use client";

import { useCallback, useEffect, useState } from "react";

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
              if (!response.ok) throw new Error('Failed to fetch data');
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

export const useTrajectoryDataDual = (
  folderName1: string,
  folderName2: string,
  joints: string[],
): {
  results1: UseTrajectoryDataResult[];
  results2: UseTrajectoryDataResult[];
} => {
  const [trajectoryData1, setTrajectoryData1] = useState<TrajectoryPoint[][]>([]);
  const [trajectoryData2, setTrajectoryData2] = useState<TrajectoryPoint[][]>([]);

  const fetchTrajectoryData = useCallback(
    async (folderName: string, signal: AbortSignal): Promise<TrajectoryPoint[][]> => {
      return await Promise.all(
        joints.map(async (joint) => {
          const response = await fetch(
            `/data/${folderName}/trajectories/${joint}__trajectory.json`,
            { signal }
          );
          if (!response.ok) throw new Error('Failed to fetch data');
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
    },
    [joints],
  );

  useEffect(() => {
    const controller = new AbortController();
    const loadData = async () => {
      try {
        if (folderName1 && joints.length > 0) {
          const data1 = await fetchTrajectoryData(folderName1, controller.signal);
          setTrajectoryData1(data1);
        }

        if (folderName2 && joints.length > 0) {
          const data2 = await fetchTrajectoryData(folderName2, controller.signal);
          setTrajectoryData2(data2);
        }
      } catch (error:any) {
        if (error.name !== "AbortError") {
          console.error("Error loading JSON files:", error);
        }
      }
    };

    loadData();

    return () => {
      controller.abort(); // Cleanup on unmount
    };
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