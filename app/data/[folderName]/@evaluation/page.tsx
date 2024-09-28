"use client";

import Evaluation from "@/components/Evaluation";

export default function Page({ params }: { params: { folderName: string } }) {
  return <Evaluation folderName={params.folderName} />;
}
