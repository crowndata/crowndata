import { useState, useEffect } from "react";

export interface SharedState {
  currentPoint: number;
  setCurrentPoint: React.Dispatch<React.SetStateAction<number>>;
}

export interface TrajectoryPoint {
  x: number;
  y: number;
  z: number;
  roll: number;
  pitch: number;
  yaw: number;
  image: string;
}

export interface UseTrajectoryDataResult {
  sharedState: SharedState;
  positions: [number, number, number][];
  rotations: [number, number, number][];
  images: string[];
}

export const useTrajectoryData = (
  folderName: string,
): UseTrajectoryDataResult => {
  const [trajectoryData, setTrajectoryData] = useState<TrajectoryPoint[]>([]);
  const [currentPoint, setCurrentPoint] = useState(0);

  const sharedState = { currentPoint, setCurrentPoint };

  useEffect(() => {
    if (folderName) {
      // Fetch the JSON file and process the data
      fetch(`/data/${folderName}/trajectory.json`)
        .then((response) => response.json())
        .then((data) => {
          const formattedData = data.map((row: TrajectoryPoint) => ({
            x: typeof row.x === "string" ? parseFloat(row.x) : row.x,
            y: typeof row.y === "string" ? parseFloat(row.y) : row.y,
            z: typeof row.z === "string" ? parseFloat(row.z) : row.z,
            roll:
              typeof row.roll === "string" ? parseFloat(row.roll) : row.roll,
            pitch:
              typeof row.pitch === "string" ? parseFloat(row.pitch) : row.pitch,
            yaw: typeof row.yaw === "string" ? parseFloat(row.yaw) : row.yaw,
            image: row.image,
          }));
          setTrajectoryData(formattedData);
        })
        .catch((error) => {
          console.error("Error loading JSON file:", error);
        });
    }
  }, [folderName]);

  const positions: [number, number, number][] = trajectoryData.map(
    (step) => [step.x, step.y, step.z] as [number, number, number],
  );

  const rotations: [number, number, number][] = trajectoryData.map(
    (step) => [step.roll, step.pitch, step.yaw] as [number, number, number],
  );

  const images: string[] = trajectoryData.map((step) => step.image as string);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPoint((prevPoint) => {
        if (trajectoryData.length > 0) {
          return (prevPoint + 1) % trajectoryData.length;
        }
        return prevPoint;
      });
    }, 10); // Adjust speed (1000ms = 1 second)

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [trajectoryData]);

  return {
    sharedState,
    positions,
    rotations,
    images,
  };
};
