"use client";

import { Suspense } from "react";

import DataCardTable from "@/components/DataCardTable";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading data...</div>}>
      <DataCardTable />
    </Suspense>
  );
}
