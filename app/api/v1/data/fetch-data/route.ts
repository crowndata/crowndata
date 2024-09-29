import { NextResponse } from "next/server";
import { bucket } from "@/utils/gcs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get("fileName");

    if (!fileName) {
      return NextResponse.json(
        { error: "fileName is required" },
        { status: 400 },
      );
    }

    const file = bucket.file(fileName);

    // Check if the file exists
    const [exists] = await file.exists();
    if (!exists) {
      return NextResponse.json(
        { error: "File does not exist" },
        { status: 404 },
      );
    }

    // Download the file
    const [contents] = await file.download();

    // Return the data in response
    return NextResponse.json({ data: contents.toString() }, { status: 200 });
  } catch (error) {
    console.error("Error fetching file from Google Cloud Storage:", error);
    return NextResponse.json({ error: "Error fetching file" }, { status: 500 });
  }
}
