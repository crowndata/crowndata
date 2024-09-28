import { Suspense } from "react";
import styles from "@/styles/DataCompare.module.css"; // New CSS module for the page
import EvaluationDual from "@/components/EvaluationDual";
import DataCompareListing from "./DataCompareListing";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import "@/styles/globals.css";

function Loading() {
  return <div>Loading data...</div>;
}
const DataCompare: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get the query parameters and set defaults
  const initialData1 = searchParams.get("data1") || "droid_00000000";
  const initialData2 = searchParams.get("data2") || "droid_00000001";

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
  return (
    <Suspense fallback={<Loading />}>
      <div className="container">
        <h2 className="title">Data Compare</h2>
        <EvaluationDual data1={data1} data2={data2} />
        <div className={styles.columns}>
          <div className={styles.column}>
            <div className="container">
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
            </div>
          </div>
          <div className={styles.column}>
            <div className="container">
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
            </div>
          </div>
        </div>
        {/* Use Suspense to show loading while waiting for DataComponent */}
        <DataCompareListing data1={data1} data2={data2} />
      </div>
    </Suspense>
  );
};

export default DataCompare;
