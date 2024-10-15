import "@/styles/globals.css";

import { Card, CardBody, CardHeader } from "@nextui-org/card";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
// Define the props type for the component
interface EvaluationProps {
  folderName: string;
}

interface CoverageScoreResponse {
  coverageScore: number; // Adjust this type based on the actual API response
}

const Evaluation: React.FC<EvaluationProps> = ({ folderName }) => {
  const [coverageScore, setCoverageScore] =
    useState<CoverageScoreResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoverageScore = async () => {
      try {
        const response = await fetch(
          `/api/v1/evaluation/metric?arg1=${encodeURIComponent(folderName)}`,
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data: CoverageScoreResponse = await response.json();
        setCoverageScore(data);
      } catch (err) {
        // Type guard to check if err is an instance of Error
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    };

    if (folderName) {
      fetchCoverageScore();
    }
  }, [folderName]);

  // Handle errors
  if (error) {
    return <div>Error: {error}</div>;
  }

  // If data is not loaded yet, show a loading message
  if (!coverageScore) {
    return <div>Loading...</div>;
  }

  // Create rows from infoData
  const rows = [
    {
      key: "coverageScore",
      name: "Coverage Score",
      value: coverageScore.coverageScore,
    },
  ];

  // Create columns for the table
  const columns = [
    { key: "name", label: "Name" },
    { key: "value", label: "Value" },
  ];
  return (
    <Card shadow="sm" className="py-4 w-full">
      <CardHeader className="pb-0 pt-2 px-4 flex flex-col items-start">
        <h4 className="font-bold text-lg">Evaluation Metric</h4>
      </CardHeader>
      <CardBody className="overflow-visible py-2">
        <Table
          hideHeader
          isStriped
          isCompact
          isHeaderSticky
          aria-label="Evaluation Metric Table"
        >
          <TableHeader>
            {columns.map((column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            ))}
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.key}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
};

export default Evaluation;
