"use client";

import React, { useEffect, useState } from "react";
import { useTrajectoryData } from "@/utils/useTrajectoryData";
import TrajectoryVisualizer from "@/components/TrajectoryVisualizer";
import ImageAnimation from "@/components/ImageAnimation";
import styles from "@/styles/Page.module.css";

export default function Page({
  params,
}: {
  params: { dataFolderName: string };
}) {
  const folderName = params.dataFolderName;
  const [currentPoint, setCurrentPoint] = useState(0);
  const { sharedState, positions, rotations, images } =
    useTrajectoryData(folderName);

  useEffect(() => {
    if (positions && positions.length > 0) {
      const interval = setInterval(() => {
        setCurrentPoint((prevPoint) => (prevPoint + 1) % positions.length);
      }, 1000); // Adjust speed (1000ms = 1 second)

      return () => clearInterval(interval); // Cleanup on component unmount
    }
  }, [positions]);

  return (
    <div className={styles.container}>
      <div className={styles.imageAnimation}>
        <ImageAnimation
          sharedState={sharedState}
          folderName={folderName}
          images={images}
        />
      </div>
      <div className={styles.trajectoryVisualizer}>
        <TrajectoryVisualizer
          sharedState={sharedState}
          positions={positions}
          rotations={rotations}
        />
      </div>
    </div>
  );
}
