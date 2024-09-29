"use client";

import DataCompare from "@/components/DataCompare";
import { Suspense } from "react";
import { useSessionCheck } from "@/hooks/useSessionCheck";

export default function Page() {
  const { sessionCheck } = useSessionCheck();

  if (sessionCheck) {
    return <div>Loading...</div>;
  }
  return (
    <Suspense>
      <DataCompare />
    </Suspense>
  );
}
