import React from "react";
import styles from "@/styles/Information.module.css"; // Import the CSS module
import { useInfoData } from "@/utils/useInfoData";

// Define the type for the JSON data

// Define the props type for the component
interface InformationProps {
  folderName: string;
}

const Information: React.FC<InformationProps> = ({ folderName }) => {
  const infoData = useInfoData(folderName);

  // If data is not loaded yet, show a loading message
  if (!infoData) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Experiment Information</h2>
      <ul className={styles.list}>
        {[
          { label: "Data Name", value: infoData.dataName },
          { label: "Start Time", value: infoData.startTime },
          { label: "End Time", value: infoData.endTime },
          { label: "Robot Embodiment", value: infoData.robotEmbodiment },
          { label: "Robot Serial Number", value: infoData.robotSerialNumber },
          {
            label: "Video Sampling Rate",
            value: `${infoData.videoSamplingRate} FPS`,
          },
          {
            label: "Arm Sampling Rate",
            value: `${infoData.armSamplingRate} Hz`,
          },
          {
            label: "Sensor Sampling Rate",
            value: `${infoData.sensorSamplingRate} Hz`,
          },
          { label: "Operator Name", value: infoData.operatorName },
          { label: "Task Description", value: infoData.taskDescription },
          { label: "Subtask Description", value: infoData.subtaskDescription },
          { label: "Task State", value: infoData.taskState },
          { label: "Subtask State", value: infoData.subtaskState },
          { label: "Data Length", value: infoData.dataLength },
          { label: "Duration In Seconds", value: infoData.durationInSeconds },
        ].map((item, index) => (
          <li key={index} className={styles.listItem}>
            <strong className={styles.label}>{item.label}:</strong>
            <span className={styles.value}>
              {item.value === undefined ? (
                <span>N/A</span> // Display the actual value if it's neither success nor failure
              ) : typeof item.value !== "string" ? (
                <span>{item.value}</span> // Display the actual value if it's neither success nor failure
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
