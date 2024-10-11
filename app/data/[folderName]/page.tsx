"use client";

import React from "react";

import TitleDisplay from "@/components/TitleDisplay";

export default function Page({ params }: { params: { folderName: string } }) {
  return <TitleDisplay title={`Data Name: ${params.folderName}`} />;
}
