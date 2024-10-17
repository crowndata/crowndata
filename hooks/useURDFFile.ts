"use client";

import { useCallback, useEffect, useState } from "react";

import {
  armURDFFiles,
  assemblyURDFFiles,
  gripperURDFFiles,
} from "@/utils/geometry";

// Custom hook to handle URDF file fetching and selection
export const useURDFFiles = () => {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  // Set initial key and file once when the component mounts
  useEffect(() => {
    if (assemblyURDFFiles && Object.keys(assemblyURDFFiles).length > 0) {
      const firstKey = Object.keys(assemblyURDFFiles)[0];
      setSelectedKey(firstKey);
      setSelectedFile(assemblyURDFFiles[firstKey]);
    } else if (armURDFFiles && Object.keys(armURDFFiles).length > 0) {
      const firstKey = Object.keys(armURDFFiles)[0];
      setSelectedKey(firstKey);
      setSelectedFile(armURDFFiles[firstKey]);
    } else if (gripperURDFFiles && Object.keys(gripperURDFFiles).length > 0) {
      const firstKey = Object.keys(gripperURDFFiles)[0];
      setSelectedKey(firstKey);
      setSelectedFile(gripperURDFFiles[firstKey]);
    }
  }, []); // Empty dependency array to run only on mount

  // Handle the change in selection
  const handleSelectChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedKey = e.target.value;

      if (
        assemblyURDFFiles &&
        Object.keys(assemblyURDFFiles).length > 0 &&
        assemblyURDFFiles[selectedKey]
      ) {
        setSelectedKey(selectedKey);
        setSelectedFile(assemblyURDFFiles[selectedKey]);
      } else if (
        armURDFFiles &&
        Object.keys(armURDFFiles).length > 0 &&
        armURDFFiles[selectedKey]
      ) {
        setSelectedKey(selectedKey);
        setSelectedFile(armURDFFiles[selectedKey]);
      } else if (
        gripperURDFFiles &&
        Object.keys(gripperURDFFiles).length > 0 &&
        gripperURDFFiles[selectedKey]
      ) {
        setSelectedKey(selectedKey);
        setSelectedFile(gripperURDFFiles[selectedKey]);
      }
    },
    [],
  );

  return {
    selectedKey,
    setSelectedKey,
    selectedFile,
    setSelectedFile,
    handleSelectChange,
  };
};
