import React from "react";
import styles from "@/styles/InformationShort.module.css"; // Import the CSS module
import { useInfoData } from "@/utils/useInfoData";

// Define the props type for the component
interface InformationShortProps {
  folderName: string;
}

const InformationShort: React.FC<InformationShortProps> = ({ folderName }) => {
  const infoData = useInfoData(folderName);

  // If data is not loaded yet, show a loading message
  if (!infoData) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <ul className={styles.list}>
        {[
          { label: "Start Time", value: infoData.startTime },
          { label: "Robot Embodiment", value: infoData.robotEmbodiment },
          { label: "Task Description", value: infoData.taskDescription },
          { label: "Subtask Description", value: infoData.subtaskDescription },
          { label: "Task State", value: infoData.taskState },
          { label: "Subtask State", value: infoData.subtaskState },
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
