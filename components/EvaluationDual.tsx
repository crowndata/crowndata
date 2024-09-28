import React, { useState, useEffect, useMemo } from "react";
import { useTrajectoryData } from "@/utils/useTrajectoryData";
import styles from "@/styles/Evaluation.module.css"; // Import the CSS module
import { useSearchParams } from "next/navigation";

// Define the props type for the component

interface EvaluationDualResponse {
  similarity: number; // Adjust this type based on the actual API response
}

const EvaluationDual: React.FC = () => {
  const [scores, setScores] = useState<EvaluationDualResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();

  const data1 = searchParams.get("data1") || "default data 1";
  const data2 = searchParams.get("data2") || "default data 2";

  const joints = ["cartesian_position"];
  const trajectoryData1 = useTrajectoryData(data1, joints);
  const trajectoryData2 = useTrajectoryData(data2, joints);

  // Memoize the positions arrays to avoid unnecessary renders
  const positions1 = useMemo(
    () => trajectoryData1[0]?.positions || [],
    [trajectoryData1],
  );
  const positions2 = useMemo(
    () => trajectoryData2[0]?.positions || [],
    [trajectoryData2],
  );

  const nCluster = 5;
  const url = `/api/similarity`;

  useEffect(() => {
    if (positions1.length > 0 && positions2.length > 0) {
      const fetchScore = async () => {
        try {
          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              n_cluster: nCluster,
              data1: {
                positions: positions1,
              },
              data2: {
                positions: positions2,
              },
            }),
          });

          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }

          const data: EvaluationDualResponse = await response.json();
          setScores(data);
        } catch (err) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("An unknown error occurred");
          }
        }
      };

      fetchScore();
    }
  }, [url, nCluster, positions1, positions2]);

  if (error) {
    return <div>Error: {error}</div>;
  }

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
