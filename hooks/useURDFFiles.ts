"use client";

import { useCallback, useEffect, useState } from "react";

// Custom hook to handle URDF file fetching and selection
export const useURDFFiles = () => {
  const [urdfFiles, setUrdfFiles] = useState<{ [key: string]: string }>({});
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  // Use useCallback to prevent unnecessary recreation of handleUrdfFileChange function
  const handleUrdfFileChange = useCallback(
    (selectedKey: string | null) => {
      setSelectedKey(selectedKey);
      if (selectedKey) {
        const selectedPath = urdfFiles[selectedKey];
        setSelectedFile(selectedPath || null);
      } else {
        setSelectedFile(null);
      }
    },
    [urdfFiles],
  ); // Dependency on urdfFiles to ensure the function references the latest state

  // Handle the change in selection
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedKey = e.target.value;
    handleUrdfFileChange(selectedKey);
  };

  // Fetch URDF file paths from JSON file in public directory
  useEffect(() => {
    const abortController = new AbortController();

    const fetchURDFFiles = async () => {
      try {
        const response = await fetch("/geometries/urdfFiles.json", {
          signal: abortController.signal,
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setUrdfFiles(data);
        if (data && Object.keys(data).length > 0) {
          const firstKey = Object.keys(data)[0];
          setSelectedKey(firstKey);
          setSelectedFile(data[firstKey]);
        }
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === "AbortError") {
          // Request was aborted, ignore the error
          console.log("Fetch request was aborted.");
        } else if (error instanceof TypeError) {
          console.error("Network error:", error.message);
        } else if (error instanceof Error) {
          console.error("An error occurred:", error.message);
        } else {
          console.error("An unknown error occurred");
        }
      }
    };

    fetchURDFFiles();

    // Cleanup function to abort fetch on component unmount
    return () => {
      abortController.abort();
    };
  }, []); // Empty dependency array ensures this effect runs once on mount

  return {
    urdfFiles,
    selectedKey,
    setSelectedKey,
    selectedFile,
    setSelectedFile,
    handleUrdfFileChange,
    handleSelectChange,
  };
};
