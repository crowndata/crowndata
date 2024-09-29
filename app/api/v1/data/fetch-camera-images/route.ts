import { NextResponse } from "next/server";
import { bucket } from "@/utils/gcs"; // Adjust the path as needed

// Helper function to escape any special characters for camera patterns if needed
function escapeRegex(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Retrieve `folderName` and `camera` parameters from the query string
    const folderName = searchParams.get("folderName");
    const camera = searchParams.get("camera");

    if (!folderName || !camera) {
      return NextResponse.json(
        { error: "folderName and camera are required" },
        { status: 400 },
      );
    }

    // Define the prefix for searching the GCS bucket
    const prefix = `${folderName}/images/${escapeRegex(camera)}`;

    // Fetch files matching the folder and camera pattern
    const [files] = await bucket.getFiles({ prefix });

    // Filter .webp files that match the `${camera}*.webp` pattern
    const webpImages = files
      .filter((file) => file.name.endsWith(".webp"))
      .map((file) => ({
        name: file.name,
        publicUrl: `https://storage.googleapis.com/${bucket.name}/${file.name}`,
      }));

    // Return the list of filtered .webp images
    return NextResponse.json({ images: webpImages }, { status: 200 });
  } catch (error) {
    console.error("Error fetching images:", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 },
    );
  }
}
