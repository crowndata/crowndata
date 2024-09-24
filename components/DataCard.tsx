import Link from "next/link";
import styles from "@/styles/DataCard.module.css";

interface DataCardProps {
  folderName: string;
}

const DataCard: React.FC<DataCardProps> = ({ folderName }) => {
  return (
    <div className={styles.card}>
      <Link href={`/data/${folderName}`} className={styles.link}>
        {folderName}
      </Link>
    </div>
  );
};

export default DataCard;
