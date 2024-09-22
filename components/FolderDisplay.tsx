"use client";

import React from "react";
import styles from './FolderDisplay.module.css'; // Import the CSS module

type FolderProps = {
  folderName: string;
};

const FolderDisplay: React.FC<FolderProps> = ({ folderName }) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Data Folder Name: {folderName}</h2>
    </div>
  );
};

export default FolderDisplay;