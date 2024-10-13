"use client";

import { useEffect, useState } from "react";

// Custom hook to handle URDF file fetching and selection
export const useURDFFiles = () => {
  const [urdfFiles, setUrdfFiles] = useState<{ [key: string]: string }>({});
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const handleUrdfFileChange = (selectedKey: string | null) => {
    setSelectedKey(selectedKey);
    if (selectedKey) {
      // Find the corresponding file path for the selected key
      const selectedPath = urdfFiles[selectedKey]; // Access the value of the selected key directly
      setSelectedFile(selectedPath || null); // Set the file path or null if not found
    } else {
      setSelectedFile(null); // If no key is selected, set to null
    }
  };

  // Handle the change in selection
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedKey = e.target.value;
    handleUrdfFileChange(selectedKey);
  };

  // Fetch URDF file paths from JSON file in public directory
  useEffect(() => {
    const fetchURDFFiles = async () => {
      try {
        const response = await fetch("/geometries/urdfFiles.json");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setUrdfFiles(data);
        if (data && Object.keys(data).length > 0) {
          setSelectedKey(Object.keys(data)[0] as string);
          setSelectedFile(Object.values(data)[0] as string); // Set the first URDF file as default
        }
      } catch (error) {
        console.error("Failed to fetch URDF files:", error);
      }
    };

    fetchURDFFiles();
  }, []);

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
