import "@/styles/globals.css";

import { Card, CardBody } from "@nextui-org/card";
import dynamic from "next/dynamic";
import Link from "next/link"; // Use next/link instead of useRouter

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
    <Link href={`/data/${folderName}`}>
      <Card className="py-4 w-full">
        <CardBody className="py-2 w-full">
          <div className="flex justify-between items-start space-x-4 columns">
            <div className="column">
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
        </CardBody>
      </Card>
    </Link>
  );
};

export default DataCard;
