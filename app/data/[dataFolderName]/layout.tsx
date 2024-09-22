import styles from "./Layout.module.css";

export default function Layout({
  children,
  information,
  evaluation,
  trajectory,
}: {
  children: React.ReactNode;
  information: React.ReactNode;
  evaluation: React.ReactNode;
  trajectory: React.ReactNode;
}) {
  return (
    <>
      {children}
      <div className={styles.container}>
        <div className={styles.information}>{information}</div>
        <div className={styles.evaluation}>{evaluation}</div>
        <div className={styles.trajectory}>{trajectory}</div>
      </div>
    </>
  );
}
