"use client";

import React from "react";
import styles from "./FolderDisplay.module.css"; // Import the CSS module

type FolderProps = {
  displayTitle: string;
  folderName: string;
};

const FolderDisplay: React.FC<FolderProps> = ({ displayTitle, folderName }) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        {displayTitle}: {folderName}
      </h2>
    </div>
  );
};

export default FolderDisplay;
