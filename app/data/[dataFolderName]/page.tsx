"use client";
import React from "react";

import DataTitleDisplay from "@/components/DataTitleDisplay";

export default function Page({
  params,
}: {
  params: { dataFolderName: string };
}) {
  return (
    <DataTitleDisplay
      displayTitle={"Data Name"}
      folderName={params.dataFolderName}
    />
  );
}
