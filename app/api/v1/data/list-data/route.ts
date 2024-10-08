import { File } from "@google-cloud/storage";
import { NextResponse } from "next/server";
import { bucket } from "@/utils/gcs";

// Explicitly mark the route as dynamic
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    // Extract optional `prefix` query parameter to list folders within a specific directory
    const { searchParams } = new URL(request.url);
    const prefix = searchParams.get("prefix") || ""; // Root if no prefix is provided

    // List files and folders in the bucket with a delimiter to separate folders
    const [files] = await bucket.getFiles({
      prefix,
      delimiter: "/", // Use '/' to group files by folder
      maxResults: 100, // Get only the first 100 objects for performance
    });

    // Filter out files that aren't directories (folders) and directly use timeCreated from getFiles()
    const foldersWithMetadata = files
      .filter((file) => file.name.endsWith("/")) // Only folders (objects ending with '/')
      .map((file: File) => ({
        name: file.name,
        timeCreated: file.metadata?.timeCreated || null, // Directly use timeCreated from metadata
      }));

    // Sort folders by creation time (most recent first)
    const sortedFolders = foldersWithMetadata.sort((a, b) => {
      const dateA = a.timeCreated ? Date.parse(a.timeCreated) : 0;
      const dateB = b.timeCreated ? Date.parse(b.timeCreated) : 0;
      return dateB - dateA;
    });

    // Return the sorted list (limited to the first 100 folders)
    return NextResponse.json({ folders: sortedFolders }, { status: 200 });
  } catch (error) {
    console.error("Error listing folders in Google Cloud Storage:", error);
    return NextResponse.json(
      { error: "Error listing folders" },
      { status: 500 },
    );
  }
}
