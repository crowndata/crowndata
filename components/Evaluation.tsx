import React, { useState, useEffect } from "react";
import styles from "@/styles/Information.module.css"; // Import the CSS module
import "@/styles/globals.css";

// Define the props type for the component
interface EvaluationProps {
  folderName: string;
}

interface CoverageScoreResponse {
  coverageScore: number; // Adjust this type based on the actual API response
}

const Evaluation: React.FC<EvaluationProps> = ({ folderName }) => {
  const [coverageScore, setCoverageScore] =
    useState<CoverageScoreResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoverageScore = async () => {
      try {
        const response = await fetch(
          `/api/coverageScore?arg1=${encodeURIComponent(folderName)}`,
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data: CoverageScoreResponse = await response.json();
        setCoverageScore(data);
      } catch (err) {
        // Type guard to check if err is an instance of Error
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    };

    if (folderName) {
      fetchCoverageScore();
    }
  }, [folderName]);

  // Handle errors
  if (error) {
    return <div>Error: {error}</div>;
  }

  // If data is not loaded yet, show a loading message
  if (!coverageScore) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h2 className="title">Evaluation</h2>
      <ul className={styles.list}>
        {[{ label: "Coverage Score", value: coverageScore.coverageScore }].map(
          (item, index) => (
            <li key={index} className={styles.listItem}>
              <strong className={styles.label}>{item.label}:</strong>
              <span className={styles.value}>
                {item.value === undefined ? (
                  <span>N/A</span> // Display the actual value if it's neither success nor failure
                ) : (
                  <span>{item.value}</span> // Display the actual value if it's neither success nor failure
                )}
              </span>
            </li>
          ),
        )}
      </ul>
    </div>
  );
};

export default Evaluation;
