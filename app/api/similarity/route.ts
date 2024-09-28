import { NextResponse } from "next/server"; // Use NextResponse to handle the response
import { kmeans } from "ml-kmeans"; // Import ml-kmeans for clustering
import { distance, number } from "mathjs"; // Import mathjs for math operations
import { useTrajectoryData } from "@/utils/useTrajectoryData";

// Define the GET handler for the API route
export async function GET(req: Request) {
  try {
    // Extract query parameters
    const { searchParams } = new URL(req.url);
    const nCluster = searchParams.get("n-cluster") || "5"; // Default to 5 if n-cluster is not provided
    const data1 = searchParams.get("data1");
    const data2 = searchParams.get("data2");

    // Validate query parameters
    if (!data1 || !data2) {
      return NextResponse.json(
        { message: "Please provide data1 and data2 as query parameters" },
        { status: 400 },
      );
    }

    // Ensure n-cluster is a valid number
    const n_clusters = parseInt(nCluster, 10);
    if (isNaN(n_clusters) || n_clusters <= 0) {
      return NextResponse.json(
        { message: "Invalid value for n-cluster. Must be a positive integer." },
        { status: 400 },
      );
    }

    // Fetch the JSON files from your server or storage
    const joints = ["cartesian_position"];
    const trajectoryData1 = await useTrajectoryData(data1, joints);
    const trajectoryData2 = await useTrajectoryData(data2, joints);

    // If data fetch failed
    if (!trajectoryData1 || !trajectoryData2) {
      return NextResponse.json(
        { message: "Error fetching trajectory data." },
        { status: 500 },
      );
    }

    const positions1 = trajectoryData1[0]?.positions || [];
    const positions2 = trajectoryData2[0]?.positions || [];

    // Call the TrajectorySimilarity logic
    const ts = new TrajectorySimilarity(n_clusters);
    const { similarity } = ts.dualStateSimilarity(positions1, positions2);

    // Return similarity result
    return NextResponse.json({ similarity }, { status: 200 });
  } catch (error) {
    // Handle errors and cast `error` as `Error` type
    const err = error as Error;
    return NextResponse.json(
      {
        message: "Error processing the request",
        error: err.message,
      },
      { status: 500 },
    );
  }
}

// TrajectorySimilarity class
class TrajectorySimilarity {
  n_clusters: number;

  constructor(n_clusters: number) {
    this.n_clusters = n_clusters;
  }

  dualStateSimilarity(trajA: number[][], trajB: number[][]) {
    const combinedData = [...trajA, ...trajB];

    // Options for kmeans clustering
    const options = {
      maxIterations: 1000, // Set the maximum number of iterations
      tolerance: 1e-4, // Set the tolerance for convergence
    };

    try {
      // Perform k-means clustering with the combined data
      const kmeansModel = kmeans(combinedData, this.n_clusters, options);

      // Extract labels directly from the kmeansModel
      const labels = kmeansModel.clusters;

      // Split the labels back to the original trajectories
      const labelsA = labels.slice(0, trajA.length);
      const labelsB = labels.slice(trajA.length);

      const histA = this.calculateHistogram(labelsA, trajA.length);
      const histB = this.calculateHistogram(labelsB, trajB.length);

      // Calculate similarity as 1 minus the Euclidean distance between histograms
      const similarity = 1 - number(distance(histA, histB));

      return { similarity, combinedData, labels };
    } catch (error) {
      // Cast the error to an `Error` type to access `message`
      throw new Error(
        `Error during KMeans clustering: ${(error as Error).message}`,
      );
    }
  }

  calculateHistogram(labels: number[], totalLength: number): number[] {
    const counts = new Array(this.n_clusters).fill(0);
    labels.forEach((label) => counts[label]++);
    return counts.map((count) => count / totalLength);
  }
}
