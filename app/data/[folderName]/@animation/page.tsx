"use client";

import "@/styles/globals.css";

import React, { useEffect } from "react";

import CameraImageAnimation from "@/components/CameraImageAnimation";
import TrajectoryVisualizer from "@/components/TrajectoryVisualizer";
import { useInfoData } from "@/hooks/useInfoData";
import { useSharedState } from "@/hooks/useSharedState";

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
      <div className="trajectoryVisualizerContainer">
        <TrajectoryVisualizer
          sharedState={{ currentPoint, setCurrentPoint }}
          folderName={folderName}
        />
      </div>
      <div className="imageAnimationContainer">
        <CameraImageAnimation
          sharedState={{ currentPoint, setCurrentPoint }}
          folderName={folderName}
        />
      </div>
    </div>
  );
}
