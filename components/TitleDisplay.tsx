import "@/styles/globals.css";

import { Card, CardHeader } from "@nextui-org/card";
import React from "react";

type TitleDisplayProps = {
  title: string;
};

const TitleDisplay: React.FC<TitleDisplayProps> = ({ title }) => {
  return (
    <Card
      isBlurred
      shadow="sm"
      className="py-4 flex justify-center items-center w-full"
    >
      <CardHeader className="pb-0 pt-2 px-4 flex flex-col items-center">
        <h1 className="font-bold text-lg">{title}</h1>
      </CardHeader>
    </Card>
  );
};

export default TitleDisplay;
