"use client";

import Evaluation from "@/components/Evaluation";

export default function Page({
  params,
}: {
  params: { dataFolderName: string };
}) {
  return <Evaluation folderName={params.dataFolderName} />;
}
