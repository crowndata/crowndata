import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const dataDirectory = path.join(process.cwd(), "public/data");

  // Read all the folder names inside the public/data directory
  const folderNames = fs.readdirSync(dataDirectory).filter((file) => {
    return fs.statSync(path.join(dataDirectory, file)).isDirectory();
  });

  return NextResponse.json(folderNames, { status: 200 });
}
