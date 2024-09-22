"use client";

import Information from "@/components/Information";

export default function Page({
  params,
}: {
  params: { dataFolderName: string };
}) {
  return <Information folderName={params.dataFolderName} />;
}
