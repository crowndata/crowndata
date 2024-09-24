"use client";

import React, { useState, useEffect } from "react";
import styles from "@/styles/Information.module.css"; // Import the CSS module

// Define the type for the JSON data
interface InfoData {
  dataFolderName: string;
  timestamp?: string;
  startTime?: string;
  endTime?: string;
  robotEmbodiment?: string;
  robotSerialNumber?: string;
  videoSamplingRate?: number;
  armSamplingRate?: number;
  sensorSamplingRate?: number;
  operatorName?: string;
  taskDescription?: string;
  subtaskDescription?: string;
  taskState?: string;
  subtaskState?: string;
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
      fetch(`/data/${folderName}/information.json`)
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
          { label: "Start Time", value: info.startTime },
          { label: "End Time", value: info.endTime },
          { label: "Robot Embodiment", value: info.robotEmbodiment },
          { label: "Robot Serial Number", value: info.robotSerialNumber },
          {
            label: "Video Sampling Rate",
            value: `${info.videoSamplingRate} FPS`,
          },
          { label: "Arm Sampling Rate", value: `${info.armSamplingRate} Hz` },
          {
            label: "Sensor Sampling Rate",
            value: `${info.sensorSamplingRate} Hz`,
          },
          { label: "Operator Name", value: info.operatorName },
          { label: "Task Description", value: info.taskDescription },
          { label: "Subtask Description", value: info.subtaskDescription },
          { label: "Task State", value: info.taskState },
          { label: "Subtask State", value: info.subtaskState },
        ].map((item, index) => (
          <li key={index} className={styles.listItem}>
            <strong className={styles.label}>{item.label}:</strong>
            <span className={styles.value}>
              {item.value === undefined ? (
                <span>N/A</span> // Display the actual value if it's neither success nor failure
              ) : item.value.toLowerCase() === "success" ? (
                <span className={styles.successSymbol}>
                  {item.value.toUpperCase()}
                </span> // checkmark symbol for success
              ) : item.value.toLowerCase() === "failure" ? (
                <span className={styles.failureSymbol}>
                  {item.value.toUpperCase()}
                </span> // cross symbol for failure
              ) : (
                <span>{item.value}</span> // Display the actual value if it's neither success nor failure
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Information;
