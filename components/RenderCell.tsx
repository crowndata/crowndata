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
  columnKey: string;
}

const RenderCell: React.FC<RenderCellProps> = ({ folderName, columnKey }) => {
  const infoData = useInfoData(folderName);

  // If data is not loaded yet, show a loading message
  if (!infoData) {
    return <div>Loading...</div>;
  }

  switch (columnKey) {
    case "dataName":
      return (
        <User
          classNames={{
            description: "text-default-500",
          }}
          description={infoData?.dataSource}
          name={infoData?.dataName}
        >
          {infoData?.dataSource}
        </User>
      );
    case "information":
      return <InformationShort folderName={folderName} />;
    case "video":
      return (
        <VideoPlayer
          src={`/data/${folderName}/video.mp4`}
          autoPlay={true}
          controls={true}
        />
      );
    case "content":
      return (
        <>
          <User
            classNames={{
              description: "text-default-500",
            }}
            description={infoData?.dataSource}
            name={infoData?.dataName}
          >
            {infoData?.dataSource}
          </User>
          <InformationShort folderName={folderName} />
          <VideoPlayer
            src={`/data/${folderName}/video.mp4`}
            autoPlay={true}
            controls={true}
          />
        </>
      );
    default:
      return <div>No Data</div>;
  }
};

export default RenderCell;
