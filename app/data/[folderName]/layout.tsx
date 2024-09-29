import "@/styles/globals.css";
import layoutStyles from "@/styles/Layout.module.css";

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
    <div className="container">
      {children}
      <div className={layoutStyles.container}>
        <div className={layoutStyles.left}>
          <div className={layoutStyles.information}>{information}</div>
          <div className={layoutStyles.evaluation}>{evaluation}</div>
        </div>
        <div className={layoutStyles.right}>
          <div className={layoutStyles.animation}>{animation}</div>
        </div>
      </div>
    </div>
  );
}
