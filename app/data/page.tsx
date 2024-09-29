"use client";

import DataCardListing from "@/components/DataCardListing";
import { useSessionCheck } from "@/hooks/useSessionCheck";

export default function Page() {
  const { sessionCheck } = useSessionCheck();

  if (sessionCheck) {
    return <div>Loading...</div>;
  }
  return (
    <>
      {" "}
      <DataCardListing />
    </>
  );
}
