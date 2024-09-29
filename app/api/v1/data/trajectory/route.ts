import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { TrajectoryPoint } from "@/types/dataInterface";

export async function GET(
  request: Request,
  { params }: { params: { folderName: string } },
) {
  try {
    const folderName = params.folderName;
    const jointsQuery = new URL(request.url).searchParams.get("joints");
    const joints = jointsQuery ? jointsQuery.split(",") : [];

    if (!folderName || joints.length === 0) {
      return NextResponse.json(
        { error: "Folder name or joints are missing." },
        { status: 400 },
      );
    }

    // Fetch trajectory data for each joint
    const allData = await Promise.all(
      joints.map(async (joint) => {
        const filePath = path.join(
          process.cwd(),
          "public",
          "data",
          folderName,
          `trajectories/${joint}__trajectory.json`,
        );
        const fileData = await fs.readFile(filePath, "utf-8");
        const data: TrajectoryPoint[] = JSON.parse(fileData);

        // Parse and format data
        return data.map((row) => ({
          x: typeof row.x === "string" ? parseFloat(row.x) : row.x,
          y: typeof row.y === "string" ? parseFloat(row.y) : row.y,
          z: typeof row.z === "string" ? parseFloat(row.z) : row.z,
          roll: typeof row.roll === "string" ? parseFloat(row.roll) : row.roll,
          pitch:
            typeof row.pitch === "string" ? parseFloat(row.pitch) : row.pitch,
          yaw: typeof row.yaw === "string" ? parseFloat(row.yaw) : row.yaw,
        }));
      }),
    );

    const response = NextResponse.json({ data: allData });

    // Set cache control header (e.g., cache for 10 minutes)
    response.headers.set(
      "Cache-Control",
      "public, max-age=600, stale-while-revalidate=59",
    );

    return response;
  } catch (error) {
    console.error("Error fetching trajectory data:", error);
    return NextResponse.json(
      { error: "Error fetching trajectory data" },
      { status: 500 },
    );
  }
}
