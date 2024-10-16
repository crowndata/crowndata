import "@/styles/globals.css";

import { Card, CardBody } from "@nextui-org/card";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import Link from "next/link";
import React from "react";

import { useInfoData } from "@/hooks/useInfoData";

// Define the props type for the component
interface InformationShortProps {
  folderName: string;
}

const InformationShort: React.FC<InformationShortProps> = ({ folderName }) => {
  const infoData = useInfoData(folderName);

  // If data is not loaded yet, show a loading message
  if (!infoData) {
    return <div>Loading...</div>;
  }

  // Create rows from infoData
  const rows = [
    { key: "startTime", name: "Start Time", value: infoData.startTime },
    {
      key: "robotEmbodiment",
      name: "Robot Embodiment",
      value: infoData.robotEmbodiment,
    },
    {
      key: "taskDescription",
      name: "Task Description",
      value: infoData.taskDescription,
    },
    { key: "taskState", name: "Task State", value: infoData.taskState },
    {
      key: "durationInSeconds",
      name: "Duration In Seconds",
      value: infoData.durationInSeconds,
    },
  ];

  // Create columns for the table
  const columns = [
    { key: "name", label: "Name" },
    { key: "value", label: "Value" },
  ];

  return (
    <Link href={`/data/${folderName}`}>
      <Card shadow="sm" className="py-4 w-full">
        <CardBody className="overflow-visible py-2">
          <Table
            hideHeader
            isStriped
            isCompact
            isHeaderSticky
            aria-label="Experiment Information Table"
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
                  <TableCell>
                    {row.value === undefined ? (
                      "N/A"
                    ) : row.name === "Data Source" ? (
                      typeof row.value === "string" ? (
                        <Link href={row.value}>{row.value}</Link>
                      ) : (
                        row.value // Handle the case when it's a number
                      )
                    ) : typeof row.value !== "string" ? (
                      row.value // Display the actual value if it's neither success nor failure
                    ) : row.value.toLowerCase() === "success" ? (
                      <div className="successSymbol">
                        {row.value.toUpperCase()}
                      </div> // checkmark symbol for success
                    ) : row.value.toLowerCase() === "failure" ? (
                      <div className="failureSymbol">
                        {row.value.toUpperCase()}
                      </div> // cross symbol for failure
                    ) : (
                      row.value // Display the actual value if it's neither success nor failure
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </Link>
  );
};

export default InformationShort;
