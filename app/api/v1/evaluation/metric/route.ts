// app/api/coverageScore/route.ts

import { NextResponse } from "next/server";

export async function GET(req: Request) {
  // Extract the URL from the request object
  const { searchParams } = new URL(req.url);

  // Get the 'arg1' parameter from the query string
  const folderName = searchParams.get("arg1");

  if (!folderName) {
    return NextResponse.json(
      { error: "Missing folderName parameter" },
      { status: 400 },
    );
  }

  // Respond with the folder name and a sample score
  return NextResponse.json(
    {
      folderName,
      coverageScore: 0.42,
    },
    { status: 200 },
  );
}
