import React, { useState, useEffect } from "react";
import styles from "@/styles/Evaluation.module.css"; // Import the CSS module

// Define the props type for the component
interface EvaluationDualProps {
  data1: string;
  data2: string;
}

interface EvaluationDualResponse {
  similarity: number; // Adjust this type based on the actual API response
}

const EvaluationDual: React.FC<EvaluationDualProps> = ({ data1, data2 }) => {
  const [scores, setScores] = useState<EvaluationDualResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const url = `/api/similarity?data1=${encodeURIComponent(data1)}&data2=${encodeURIComponent(data2)}`;

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data: EvaluationDualResponse = await response.json();
        setScores(data);
      } catch (err) {
        // Type guard to check if err is an instance of Error
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    };

    if (data1 && data2) {
      fetchScore();
    }
  }, [data1, data2]);

  // Handle errors
  if (error) {
    return <div>Error: {error}</div>;
  }

  // If data is not loaded yet, show a loading message
  if (!scores) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Evaluation</h2>
      <ul className={styles.list}>
        {[{ label: "Similarity", value: scores.similarity }].map(
          (item, index) => (
            <li key={index} className={styles.listItem}>
              <strong className={styles.label}>{item.label}:</strong>
              <span className={styles.value}>{item.value}</span>
            </li>
          ),
        )}
      </ul>
    </div>
  );
};

export default EvaluationDual;
