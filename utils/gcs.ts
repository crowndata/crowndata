import { Storage } from "@google-cloud/storage";
import { writeFileSync } from "fs";

// Ensure that the required environment variables are set
if (!process.env.GCP_KEY_BASE64) throw new Error("GCP_KEY_BASE64 not set");
if (!process.env.GCP_PROJECT_ID) throw new Error("GCP_PROJECT_ID not set");
if (!process.env.GCS_BUCKET_NAME) throw new Error("GCS_BUCKET_NAME not set");

// Temporary location for the key file
const keyFilename = "/tmp/gcp-key.json";

// Decode the base64 string and write it to a temporary file
writeFileSync(
  keyFilename,
  Buffer.from(process.env.GCP_KEY_BASE64, "base64").toString("utf8"),
);

// Initialize Google Cloud Storage
const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  keyFilename, // Use the temporary key file for authentication
});

// Get the bucket name from the environment variable
const bucketName = process.env.GCS_BUCKET_NAME as string;
const bucket = storage.bucket(bucketName);

// Export the storage and bucket for use in other parts of the application
export { storage, bucket };
