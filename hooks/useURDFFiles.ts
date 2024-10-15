"use client";

import { useCallback, useEffect, useState } from "react";

import { urdfFiles } from "@/utils/geometry";

// Custom hook to handle URDF file fetching and selection
export const useURDFFiles = () => {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  // Set initial key and file once when the component mounts
  useEffect(() => {
    if (urdfFiles && Object.keys(urdfFiles).length > 0) {
      const firstKey = Object.keys(urdfFiles)[0];
      setSelectedKey(firstKey);
    }
  }, []); // Empty dependency array to run only on mount

  // Handle the change in selection
  const handleSelectChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedKey = e.target.value;
      setSelectedKey(selectedKey);
    },
    [],
  );

  return {
    selectedKey,
    setSelectedKey,
    handleSelectChange,
  };
};
