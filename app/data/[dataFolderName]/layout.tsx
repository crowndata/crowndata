import styles from "@/styles/Layout.module.css";

export default function Layout({
  children,
  information,
  evaluation,
  animation,
}: {
  children: React.ReactNode;
  information: React.ReactNode;
  evaluation: React.ReactNode;
  animation: React.ReactNode;
}) {
  return (
    <>
      {children}
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.information}>{information}</div>
          <div className={styles.evaluation}>{evaluation}</div>
        </div>
        <div className={styles.right}>
          <div className={styles.animation}>{animation}</div>
        </div>
      </div>
    </>
  );
}
