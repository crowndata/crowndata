"use client";

import { useSearchParams } from "next/navigation";
import FolderDisplay from "@/components/FolderDisplay";
import { useEffect, useState } from "react";

export default function Page({
  params,
}: {
  params: { dataFolderName: string };
}) {
  return <FolderDisplay folderName={params.dataFolderName} />;
}
