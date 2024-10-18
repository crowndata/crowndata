"use client";

import { Suspense } from "react";

import RerunPage from "@/components/RerunPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading data...</div>}>
      <RerunPage />
    </Suspense>
  );
}
