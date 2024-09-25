import React from "react";
import styles from "@/styles/DataTitleDisplay.module.css"; // Import the CSS module

type DataTitleDisplayProps = {
  displayTitle: string;
  folderName: string;
};

const DataTitleDisplay: React.FC<DataTitleDisplayProps> = ({
  displayTitle,
  folderName,
}) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        {displayTitle}: {folderName}
      </h2>
    </div>
  );
};

export default DataTitleDisplay;
