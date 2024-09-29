import { NextRequest, NextResponse } from "next/server"; // Use NextResponse to handle the response
import { kmeans } from "ml-kmeans"; // Import ml-kmeans for clustering

// Define the types for the incoming data
interface DataRequest {
  n_cluster: number;
  data1: {
    positions: number[][];
  };
  data2: {
    positions: number[][];
  };
}

// Define the POST handler
export async function POST(req: NextRequest) {
  try {
    // Parse the JSON body
    const body: DataRequest = await req.json();

    const { n_cluster, data1, data2 } = body;

    // Basic validation
    if (!data1?.positions || !data2?.positions) {
      return NextResponse.json(
        { message: "Invalid input data" },
        { status: 400 },
      );
    }

    // Ensure n_cluster is a valid number
    if (isNaN(n_cluster) || n_cluster <= 0) {
      return NextResponse.json(
        { message: "Invalid value for n_cluster. Must be a positive integer." },
        { status: 400 },
      );
    }

    // Call the TrajectorySimilarity logic
    const ts = new TrajectorySimilarity(n_cluster);
    const { cosineSimilarityScore, calculateSimilarityScore } =
      ts.dualStateSimilarity(data1.positions, data2.positions);

    // Return similarity result
    return NextResponse.json(
      { cosineSimilarityScore, calculateSimilarityScore },
      { status: 200 },
    );
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
  seed: number;

  constructor(n_clusters: number, seed: number = 42) {
    // Default seed
    this.n_clusters = n_clusters;
    this.seed = seed;
  }

  dualStateSimilarity(trajA: number[][], trajB: number[][]) {
    const combinedData = [...trajA, ...trajB];

    // Options for kmeans clustering with a constant seed
    const options = {
      maxIterations: 1000, // Set the maximum number of iterations
      tolerance: 1e-4, // Set the tolerance for convergence
      seed: this.seed, // Constant random seed for reproducibility
    };

    function cosineSimilarity(histA: number[], histB: number[]) {
      const dotProduct = histA.reduce(
        (sum, val, idx) => sum + val * histB[idx],
        0,
      );
      const magnitudeA = Math.sqrt(
        histA.reduce((sum, val) => sum + val * val, 0),
      );
      const magnitudeB = Math.sqrt(
        histB.reduce((sum, val) => sum + val * val, 0),
      );

      return dotProduct / (magnitudeA * magnitudeB);
    }

    // Calculate Euclidean distance between two histograms
    function euclideanDistance(histA: number[], histB: number[]) {
      if (histA.length !== histB.length) {
        throw new Error("Histograms must have the same length");
      }

      let sumSquaredDiffs = 0;

      for (let i = 0; i < histA.length; i++) {
        const diff = histA[i] - histB[i];
        sumSquaredDiffs += diff * diff;
      }

      return Math.sqrt(sumSquaredDiffs);
    }

    // Normalize the distance and compute similarity
    function calculateSimilarity(histA: number[], histB: number[]) {
      const distance = euclideanDistance(histA, histB);

      // Assuming the maximum possible distance is between a vector of ones and a vector of zeros
      const maxDistance = Math.sqrt(histA.length); // Max distance when one array is all ones and the other is all zeros

      const normalizedDistance = distance / maxDistance;

      // Ensure similarity is between 0 and 1
      const similarity = Math.max(0, 1 - normalizedDistance);

      return similarity;
    }

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
      const cosineSimilarityScore = cosineSimilarity(histA, histB);
      const calculateSimilarityScore = calculateSimilarity(histA, histB);

      return {
        cosineSimilarityScore,
        calculateSimilarityScore,
      };
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
