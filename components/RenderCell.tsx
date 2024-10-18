import "@/styles/globals.css";

import dynamic from "next/dynamic";
import React from "react";
// Dynamically import the VideoPlayer component, disabling SSR
const VideoPlayer = dynamic(() => import("@/components/VideoPlayer"), {
  ssr: false, // This ensures the component is rendered only on the client side
});
import { User } from "@nextui-org/react";

import InformationShort from "@/components/InformationShort";
import { useInfoData } from "@/hooks/useInfoData";

// Define the type for the JSON data

// Define the props type for the component
interface RenderCellProps {
  folderName: string;
  columnKeys: string[];
}

const RenderCell: React.FC<RenderCellProps> = ({ folderName, columnKeys }) => {
  const infoData = useInfoData(folderName);

  // If data is not loaded yet, show a loading message
  if (!infoData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {columnKeys.includes("dataName") && (
        <User
          classNames={{
            description: "text-default-500",
          }}
          description={infoData?.dataSource}
          name={infoData?.dataName}
          avatarProps={{
            name: `${infoData?.operatorName}`,
          }}
        >
          {infoData?.dataSource}
        </User>
      )}
      {columnKeys.includes("information") && (
        <InformationShort folderName={folderName} />
      )}
      {columnKeys.includes("video") && (
        <VideoPlayer
          src={`/data/${folderName}/video.mp4`}
          autoPlay={true}
          controls={true}
        />
      )}
    </>
  );
};

export default RenderCell;
