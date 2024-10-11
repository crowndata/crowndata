import "@/styles/globals.css";

import dynamic from "next/dynamic";
import Link from "next/link";

import InformationShort from "@/components/InformationShort";

// Dynamically import the VideoPlayer component, disabling SSR
const VideoPlayer = dynamic(() => import("@/components/VideoPlayer"), {
  ssr: false, // This ensures the component is rendered only on the client side
});

interface DataCardProps {
  folderName: string;
}

const DataCard: React.FC<DataCardProps> = ({ folderName }) => {
  return (
    <div className="container">
      <div className="columns">
        <div className="column">
          <Link href={`/data/${folderName}`} className="link">
            {folderName}
          </Link>
          <InformationShort folderName={folderName} />
        </div>
        <div className="column">
          <VideoPlayer
            src={`/data/${folderName}/video.mp4`}
            autoPlay={true}
            controls={true}
          />
        </div>
      </div>
    </div>
  );
};

export default DataCard;
