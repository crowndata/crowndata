import "@/styles/globals.css";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useState } from "react";

import DataCompareListing from "@/components/DataCompareListing";
import EvaluationDual from "@/components/EvaluationDual";
import TitleDisplay from "@/components/TitleDisplay";

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
        <TitleDisplay title="Data Compare" />
        <EvaluationDual data1={data1} data2={data2} />
        <div className="columns">
          <div className="column">
            <div className="container">
              {/* First Column */}
              <div className="inputGroup">
                <label htmlFor="data1" className="label">
                  Data 1:{" "}
                </label>
                <input
                  id="data1"
                  type="text"
                  value={data1}
                  onChange={handleData1Change}
                  className="input"
                />
              </div>
            </div>
          </div>
          <div className="column">
            <div className="container">
              {/* Second Column */}
              <div className="inputGroup">
                <label htmlFor="data2" className="label">
                  Data 2:{" "}
                </label>
                <input
                  id="data2"
                  type="text"
                  value={data2}
                  onChange={handleData2Change}
                  className="input"
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
