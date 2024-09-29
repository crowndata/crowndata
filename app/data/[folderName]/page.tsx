"use client";

import React from "react";
import TitleDisplay from "@/components/TitleDisplay";
import { useSessionCheck } from "@/hooks/useSessionCheck";

export default function Page({ params }: { params: { folderName: string } }) {
  const { sessionCheck } = useSessionCheck();

  if (sessionCheck) {
    return <div>Loading...</div>;
  }
  return <TitleDisplay title={`Data Name: ${params.folderName}`} />;
}
