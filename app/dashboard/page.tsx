"use client";

import { useSessionCheck } from "@/hooks/useSessionCheck";

export default function Page() {
  const { sessionCheck } = useSessionCheck();

  if (sessionCheck) {
    return <div>Loading...</div>;
  }

  return <div>Welcome to your dashboard!</div>;
}
