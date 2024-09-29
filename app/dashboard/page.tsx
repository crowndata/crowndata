"use client";

import TitleDisplay from "@/components/TitleDisplay";
import { useSessionCheck } from "@/hooks/useSessionCheck";

export default function Page() {
  const { sessionCheck } = useSessionCheck();

  if (sessionCheck) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <TitleDisplay title="Dashboard" />
      <div>Welcome to your dashboard!</div>
    </div>
  );
}
