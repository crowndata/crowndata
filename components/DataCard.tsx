import Link from "next/link";
import styles from "@/styles/DataCard.module.css";
import InformationShort from "@/components/InformationShort";
import "@/styles/globals.css";

import dynamic from "next/dynamic";

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
      <div className={styles.columns}>
        <div className={styles.column}>
          <Link href={`/data/${folderName}`} className={styles.link}>
            {folderName}
          </Link>
          <InformationShort folderName={folderName} />
        </div>
        <div className={styles.column}>
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
