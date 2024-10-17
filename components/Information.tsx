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
import Link from "next/link";
import React from "react";

import { useInfoData } from "@/hooks/useInfoData";

// Define the type for the JSON data

// Define the props type for the component
interface InformationProps {
  folderName: string;
}

const Information: React.FC<InformationProps> = ({ folderName }) => {
  const infoData = useInfoData(folderName);

  // If data is not loaded yet, show a loading message
  if (!infoData) {
    return <div>Loading...</div>;
  }

  // Create rows from infoData
  const rows = [
    { key: "dataName", name: "Data Name", value: infoData.dataName },
    { key: "startTime", name: "Start Time", value: infoData.startTime },
    { key: "endTime", name: "End Time", value: infoData.endTime },
    {
      key: "robotEmbodiment",
      name: "Robot Embodiment",
      value: infoData.robotEmbodiment,
    },
    {
      key: "robotSerialNumber",
      name: "Robot Serial Number",
      value: infoData.robotSerialNumber,
    },
    {
      key: "videoSamplingRate",
      name: "Video Sampling Rate",
      value: `${infoData.videoSamplingRate} FPS`,
    },
    {
      key: "armSamplingRate",
      name: "Arm Sampling Rate",
      value: `${infoData.armSamplingRate} Hz`,
    },
    {
      key: "sensorSamplingRate",
      name: "Sensor Sampling Rate",
      value: `${infoData.sensorSamplingRate} Hz`,
    },
    {
      key: "operatorName",
      name: "Operator Name",
      value: infoData.operatorName,
    },
    {
      key: "taskDescription",
      name: "Task Description",
      value: infoData.taskDescription,
    },
    {
      key: "subtaskDescription",
      name: "Subtask Description",
      value: infoData.subtaskDescription,
    },
    { key: "taskState", name: "Task State", value: infoData.taskState },
    {
      key: "subtaskState",
      name: "Subtask State",
      value: infoData.subtaskState,
    },
    { key: "dataLength", name: "Data Length", value: infoData.dataLength },
    {
      key: "durationInSeconds",
      name: "Duration In Seconds",
      value: infoData.durationInSeconds,
    },
    { key: "dataSource", name: "Data Source", value: infoData.dataSource },
  ];

  // Create columns for the table
  const columns = [
    { key: "name", label: "Name" },
    { key: "value", label: "Value" },
  ];

  return (
    <Link href={`/data/${folderName}`}>
      <Card shadow="sm" className="py-4 w-full">
        <CardHeader className="pb-0 pt-2 px-4 flex flex-col items-start">
          <h4 className="font-bold text-lg">Experiment Information</h4>
        </CardHeader>
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
                  <TableCell className="w-1/3">{row.name}</TableCell>
                  <TableCell className="w-2/3">
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

export default Information;
