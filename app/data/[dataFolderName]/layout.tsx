export default function Layout({
  children,
  information,
  trajectory,
}: {
  children: React.ReactNode;
  information: React.ReactNode;
  trajectory: React.ReactNode;
}) {
  return (
    <>
      {children}
      <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
        <div style={{ flex: 1 }}>{information}</div>
        <div style={{ flex: 1 }}>{trajectory}</div>
      </div>
    </>
  );
}
