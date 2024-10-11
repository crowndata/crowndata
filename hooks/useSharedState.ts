"use client";

import { useState } from "react";

import { SharedState } from "@/types/pageInterface";

export const useSharedState = (): SharedState => {
  const [currentPoint, setCurrentPoint] = useState(0);

  return {
    currentPoint,
    setCurrentPoint,
  };
};
