import React from "react";
import "@/styles/globals.css";

type TitleDisplayProps = {
  title: string;
};

const TitleDisplay: React.FC<TitleDisplayProps> = ({ title }) => {
  return <h2 className="title">{title}</h2>;
};

export default TitleDisplay;
