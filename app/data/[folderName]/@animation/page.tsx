"use client";

import React, { useEffect } from "react";
import TrajectoryVisualizer from "@/components/TrajectoryVisualizer";
import CameraImageAnimation from "@/components/CameraImageAnimation";
import { useSharedState } from "@/hooks/useSharedState";
import { useInfoData } from "@/hooks/useInfoData";
import "@/styles/globals.css";

export default function Page({ params }: { params: { folderName: string } }) {
  const folderName = params.folderName;

  // Destructure the returned state values from the useSharedState hook
  const { currentPoint, setCurrentPoint } = useSharedState();
  const infoData = useInfoData(folderName);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPoint((prevPoint: number) => {
        const dataLength = infoData?.dataLength ?? 0; // Fallback to 0 if undefined
        if (dataLength > 0) {
          return (prevPoint + 1) % dataLength; // Use `dataLength` safely
        }
        return prevPoint;
      });
    }, 20); // Adjust speed (1000ms = 1 second)

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [infoData?.dataLength, setCurrentPoint]); // Depend on `dataLength` and `setCurrentPoint`

  return (
    <div className="container">
      <div className="imageAnimationContainer">
        <CameraImageAnimation
          sharedState={{ currentPoint, setCurrentPoint }}
          folderName={folderName}
        />
      </div>
      <div className="trajectoryVisualizerContainer">
        <TrajectoryVisualizer
          sharedState={{ currentPoint, setCurrentPoint }}
          folderName={folderName}
        />
      </div>
    </div>
  );
}
