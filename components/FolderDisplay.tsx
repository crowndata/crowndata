"use client";

import React from "react";

type FolderProps = {
  folderName: string;
};

const FolderDisplay: React.FC<FolderProps> = ({ folderName }) => {
  return (
    <div style={{ margin: "20px 0" }}>
      <h2>Data Folder Name: {folderName}</h2>
    </div>
  );
};

export default FolderDisplay;
