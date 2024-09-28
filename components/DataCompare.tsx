import { Suspense } from "react";
import styles from "@/styles/DataCompare.module.css"; // New CSS module for the page
import EvaluationDual from "@/components/EvaluationDual";
import DataCompareListing from "./DataCompareListing";

function Loading() {
  return <div>Loading data...</div>;
}
const DataCompare: React.FC = () => {
  return (
    <Suspense fallback={<Loading />}>
      <div className={styles.container}>
        <h2 className={styles.title}>Data Compare</h2>
        <EvaluationDual />
        {/* Use Suspense to show loading while waiting for DataComponent */}
        <DataCompareListing />
      </div>
    </Suspense>
  );
};

export default DataCompare;
