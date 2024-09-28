"use client";

import DataCompare from "@/components/DataCompare";
import { Suspense } from "react";

const Page = () => {
  return (
    <Suspense>
      <DataCompare />
    </Suspense>
  );
};

export default Page;
