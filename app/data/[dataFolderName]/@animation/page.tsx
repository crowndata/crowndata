"use client";

import React from "react";
import { useTrajectoryData } from "@/utils/useTrajectoryData";
import TrajectoryVisualizer from "@/components/TrajectoryVisualizer";
import CameraImageAnimation from "@/components/CameraImageAnimation";
import styles from "@/styles/Page.module.css";

export default function Page({
  params,
}: {
  params: { dataFolderName: string };
}) {
  const folderName = params.dataFolderName;
  const { sharedState, positions, rotations, images } =
    useTrajectoryData(folderName);

  return (
    <div className={styles.container}>
      <div className={styles.imageAnimation}>
        <CameraImageAnimation
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
