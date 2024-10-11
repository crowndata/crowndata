import "@/styles/globals.css";

import React from "react";

import { useInfoData } from "@/hooks/useInfoData";

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
    <div className="container">
      <ul className="list">
        {[
          { label: "Data Name", value: infoData.dataName },
          { label: "Start Time", value: infoData.startTime },
          { label: "Robot Embodiment", value: infoData.robotEmbodiment },
          { label: "Task Description", value: infoData.taskDescription },
          { label: "Subtask Description", value: infoData.subtaskDescription },
          { label: "Task State", value: infoData.taskState },
          { label: "Subtask State", value: infoData.subtaskState },
          { label: "Duration In Seconds", value: infoData.durationInSeconds },
        ].map((item, index) => (
          <li key={index} className="listItem">
            <strong className="label">{item.label}:</strong>
            <span className="value">
              {item.value === undefined ? (
                <span>N/A</span> // Display the actual value if it's neither success nor failure
              ) : item.value.toLowerCase() === "success" ? (
                <span className="successSymbol">
                  {item.value.toUpperCase()}
                </span> // checkmark symbol for success
              ) : item.value.toLowerCase() === "failure" ? (
                <span className="failureSymbol">
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
