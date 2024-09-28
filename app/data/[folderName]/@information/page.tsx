"use client";

import Information from "@/components/Information";

export default function Page({
  params,
}: {
  params: { folderName: string };
}) {
  return <Information folderName={params.folderName} />;
}
