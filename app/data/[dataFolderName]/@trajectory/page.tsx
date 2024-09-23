"use client";

import TrajectoryVisualizer from "@/components/TrajectoryVisualizer";

export default function Page({
  params,
}: {
  params: { dataFolderName: string };
}) {
  return <TrajectoryVisualizer folderName={params.dataFolderName} />;
}
