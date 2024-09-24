"use client";

import React, { useState, useEffect } from "react";
import styles from "@/styles/InformationShort.module.css"; // Import the CSS module
import { InfoData } from "@/types/dataInterfaces";

// Define the props type for the component
interface InformationShortProps {
  folderName: string;
}

const InformationShort: React.FC<InformationShortProps> = ({ folderName }) => {
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
      <ul className={styles.list}>
        {[
          { label: "Start Time", value: info.startTime },
          { label: "Robot Embodiment", value: info.robotEmbodiment },
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

export default InformationShort;
