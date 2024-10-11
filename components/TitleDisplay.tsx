import "@/styles/globals.css";

import React from "react";

type TitleDisplayProps = {
  title: string;
};

const TitleDisplay: React.FC<TitleDisplayProps> = ({ title }) => {
  return <h1 className="title">{title}</h1>;
};

export default TitleDisplay;
