import { useEffect, useState } from "react";
import InformationShort from "@/components/InformationShort";
import TrajectoryVisualizer from "@/components/TrajectoryVisualizer";
import { SharedState } from "@/types/pageInterface";
import { useInfoData } from "@/hooks/useInfoData";
import "@/styles/globals.css";

interface DataCompareListingProps {
  data1: string;
  data2: string;
}

const DataCompareListing: React.FC<DataCompareListingProps> = ({
  data1,
  data2,
}) => {
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

  // This effect ensures the component is mounted before accessing the window object
  useEffect(() => {
    setIsMounted(true); // Indicate that the component is now mounted
  }, []);
  if (!isMounted) {
    return null; // Render nothing on the server
  }

  return (
    <div className="container">
      <div className="columns">
        <div className="column">
          {/* First Column */}
          <InformationShort folderName={data1} />
        </div>
        <div className="column">
          {/* Second Column */}
          <InformationShort folderName={data2} />
        </div>
      </div>
      <div className="columns">
        <div className="column">
          {/* First Column */}
          <TrajectoryVisualizer sharedState={sharedState1} folderName={data1} />
        </div>
        <div className="column">
          {/* Second Column */}
          <TrajectoryVisualizer sharedState={sharedState2} folderName={data2} />
        </div>
      </div>
    </div>
  );
};

export default DataCompareListing;
