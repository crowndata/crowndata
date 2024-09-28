import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import styles from "@/styles/DataCompare.module.css"; // New CSS module for the page
import InformationShort from "@/components/InformationShort";
import TrajectoryVisualizerShort from "@/components/TrajectoryVisualizerShort";
import EvaluationDual from "@/components/EvaluationDual";
import { SharedState } from "@/types/pageInterface";
import { useInfoData } from "@/utils/useInfoData";

function Loading() {
  return <div>Loading data...</div>;
}
const DataCompare: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get the query parameters and set defaults
  const initialData1 = searchParams.get("data1") || "default data 1";
  const initialData2 = searchParams.get("data2") || "default data 2";

  // Set up state for data1 and data2
  const [data1, setData1] = useState(initialData1);
  const [data2, setData2] = useState(initialData2);

  // Function to update the URL search params
  const updateSearchParams = (key: string, value: string) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set(key, value);

    router.replace(`?${currentParams.toString()}`);
  };

  // Handle input change for data1
  const handleData1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setData1(newValue);
    updateSearchParams("data1", newValue);
  };

  // Handle input change for data2
  const handleData2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setData2(newValue);
    updateSearchParams("data2", newValue);
  };

  const infoData1 = useInfoData(data1);
  const infoData2 = useInfoData(data2);

  const [isMounted, setIsMounted] = useState(false);

  const [currentPoint1, setCurrentPoint1] = useState<number>(1);
  const [currentPoint2, setCurrentPoint2] = useState<number>(1);
  const sharedState1: SharedState = {
    currentPoint: currentPoint1,
    setCurrentPoint: setCurrentPoint1,
  };
  const sharedState2: SharedState = {
    currentPoint: currentPoint2,
    setCurrentPoint: setCurrentPoint2,
  };

  useEffect(() => {
    const interval1 = setInterval(() => {
      setCurrentPoint1((prevPoint: number) => {
        const dataLength = infoData1?.dataLength ?? 0; // Fallback to 0 if undefined
        if (dataLength > 0) {
          return (prevPoint + 1) % dataLength; // Use `dataLength` safely
        }
        return prevPoint;
      });
    }, 10); // Adjust speed (1000ms = 1 second)

    return () => clearInterval(interval1); // Cleanup on component unmount
  }, [infoData1?.dataLength, setCurrentPoint1]); // Depend on `dataLength` and `setCurrentPoint`

  useEffect(() => {
    const interval2 = setInterval(() => {
      setCurrentPoint2((prevPoint: number) => {
        const dataLength = infoData2?.dataLength ?? 0; // Fallback to 0 if undefined
        if (dataLength > 0) {
          return (prevPoint + 1) % dataLength; // Use `dataLength` safely
        }
        return prevPoint;
      });
    }, 10); // Adjust speed (1000ms = 1 second)

    return () => clearInterval(interval2); // Cleanup on component unmount
  }, [infoData2?.dataLength, setCurrentPoint2]); // Depend on `dataLength` and `setCurrentPoint`

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const res = await fetch("/api/data");
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching folders:", error);
      }
    };

    fetchFolders();
  }, []);

  // This effect ensures the component is mounted before accessing the window object
  useEffect(() => {
    setIsMounted(true); // Indicate that the component is now mounted
  }, []);
  if (!isMounted) {
    return null; // Render nothing on the server
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Data Compare</h2>
      <Suspense fallback={<Loading />}>
        {/* Use Suspense to show loading while waiting for DataComponent */}
        <div className={styles.container}>
          <EvaluationDual data1={data1} data2={data2} />
          <div className={styles.columns}>
            <div className={styles.column}>
              <div className={styles.container}>
                {/* First Column */}
                <div className={styles.inputGroup}>
                  <label htmlFor="data1" className={styles.label}>
                    Data 1:{" "}
                  </label>
                  <input
                    id="data1"
                    type="text"
                    value={data1}
                    onChange={handleData1Change}
                    className={styles.input}
                  />
                </div>
                <InformationShort folderName={data1} />
                <TrajectoryVisualizerShort
                  sharedState={sharedState1}
                  folderName={data1}
                />
              </div>
            </div>
            <div className={styles.column}>
              <div className={styles.container}>
                {/* Second Column */}
                <div className={styles.inputGroup}>
                  <label htmlFor="data2" className={styles.label}>
                    Data 2:{" "}
                  </label>
                  <input
                    id="data2"
                    type="text"
                    value={data2}
                    onChange={handleData2Change}
                    className={styles.input}
                  />
                </div>
                <InformationShort folderName={data2} />
                <TrajectoryVisualizerShort
                  sharedState={sharedState2}
                  folderName={data2}
                />
              </div>
            </div>
          </div>
        </div>
      </Suspense>
    </div>
  );
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading data...</div>}>
      <DataCompare />
    </Suspense>
  );
}
