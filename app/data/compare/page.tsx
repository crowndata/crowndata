"use client";

import { Suspense } from "react";

import DataCompare from "@/components/DataCompare";
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
