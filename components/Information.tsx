"use client";

import React, { useState, useEffect } from "react";
import styles from "./Information.module.css"; // Import the CSS module

// Define the type for the JSON data
interface InfoData {
  dataFolderName: string;
  timestamp?: string;
  startTime?: string;
  endTime?: string;
  robotSeriesNumber?: string;
  videoSamplingRate?: number;
  armSamplingRate?: number;
  graspSamplingRate?: number;
  operatorName?: string;
  taskName?: string;
}

// Define the props type for the component
interface InformationProps {
  folderName: string;
}

const Information: React.FC<InformationProps> = ({ folderName }) => {
  const [info, setInfo] = useState<InfoData | null>(null); // State for holding the fetched data
  const [error, setError] = useState<string | null>(null); // State for handling errors

  // Fetch the JSON data based on the provided file name
  useEffect(() => {
    if (folderName) {
      fetch(`/${folderName}/information.json`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data: InfoData) => setInfo(data))
        .catch((error) => setError(error.message));
    }
  }, [folderName]);

  // Handle errors
  if (error) {
    return <div>Error: {error}</div>;
  }

  // If data is not loaded yet, show a loading message
  if (!info) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Experiment Information</h2>
      <ul className={styles.list}>
        {[
          { label: "Data Folder Name", value: info.dataFolderName },
          { label: "Timestamp", value: info.timestamp },
          { label: "Start Time", value: info.startTime },
          { label: "End Time", value: info.endTime },
          { label: "Robot Series Number", value: info.robotSeriesNumber },
          {
            label: "Video Sampling Rate",
            value: `${info.videoSamplingRate} FPS`,
          },
          { label: "Arm Sampling Rate", value: `${info.armSamplingRate} Hz` },
          {
            label: "Grasp Sampling Rate",
            value: `${info.graspSamplingRate} Hz`,
          },
          { label: "Operator Name", value: info.operatorName },
          { label: "Task Name", value: info.taskName },
        ].map((item, index) => (
          <li key={index} className={styles.listItem}>
            <strong className={styles.label}>{item.label}:</strong>
            <span className={styles.value}>{item.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Information;
