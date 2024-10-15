"use client";

import { Suspense } from "react";

import DataCardListing from "@/components/DataCardListing";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading data...</div>}>
      <DataCardListing />
    </Suspense>
  );
}
