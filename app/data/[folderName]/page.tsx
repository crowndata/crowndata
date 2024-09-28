"use client";

import React from "react";
import DataTitleDisplay from "@/components/DataTitleDisplay";

export default function Page({
  params,
}: {
  params: { folderName: string };
}) {
  return (
    <DataTitleDisplay
      displayTitle={"Data Name"}
      folderName={params.folderName}
    />
  );
}
