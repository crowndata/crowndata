import { Storage } from "@google-cloud/storage";
import { writeFileSync } from "fs";

const gcpKeyBase64 = process.env.GCP_KEY_BASE64 ?? "";
const gcpProjectId = process.env.GCP_PROJECT_ID ?? undefined;
const gcsBucketName = process.env.GCS_BUCKET_NAME ?? undefined;

if (gcpKeyBase64 != "" && gcpKeyBase64 && gcpProjectId && gcsBucketName) {
  // Proceed with logic if all necessary environment variables are available
  console.log("GCP environment variables are set.");
  // Example: Initialize GCP services, configure Google Cloud Storage, etc.
} else {
  // Handle cases where some or all environment variables are missing
  console.warn("Some or all GCP environment variables are missing.");

  // Optional: Proceed with fallback logic or skip certain features
  if (!gcpKeyBase64) {
    console.warn("GCP_KEY_BASE64 is missing.");
  }
  if (!gcpProjectId) {
    console.warn("GCP_PROJECT_ID is missing.");
  }
  if (!gcsBucketName) {
    console.warn("GCS_BUCKET_NAME is missing.");
  }
}
// Temporary location for the key file
const keyFilename = "/tmp/gcp-key.json";

// Decode the base64 string and write it to a temporary file
writeFileSync(
  keyFilename,
  Buffer.from(gcpKeyBase64, "base64").toString("utf8"),
);

// Initialize Google Cloud Storage
const storage = new Storage({
  projectId: gcpProjectId,
  keyFilename, // Use the temporary key file for authentication
});

// Get the bucket name from the environment variable
const bucketName = gcsBucketName as string;
const bucket = storage.bucket(bucketName);

// Export the storage and bucket for use in other parts of the application
export { storage, bucket };
