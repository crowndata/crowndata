"use client";

import FolderDisplay from "@/components/FolderDisplay";

export default function Page({
  params,
}: {
  params: { dataFolderName: string };
}) {
  return (
    <FolderDisplay
      displayTitle={"Data Name"}
      folderName={params.dataFolderName}
    />
  );
}
