import { NextResponse } from "next/server";
import { exec } from "child_process";

export async function GET(request: Request) {
  // Extract query parameters from the URL
  const { searchParams } = new URL(request.url);
  const arg1 = searchParams.get("arg1");

  if (!arg1) {
    return NextResponse.json({ error: "Missing arguments" }, { status: 400 });
  }

  // Sanitize input to prevent command injection
  const sanitizedArg = arg1.replace(/[^a-zA-Z0-9_\-]/g, "");

  // Use a Promise to handle async exec
  return new Promise((resolve) => {
    // Define the path to the Python script
    const scriptPath = "python_lib/coverage_score.py";

    // Execute the Python script with the sanitized argument
    exec(`python3 ${scriptPath} ${sanitizedArg}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing Python script: ${error.message}`);
        // Resolve with a JSON response for error
        resolve(
          NextResponse.json(
            { error: "Error executing Python script", details: error.message },
            { status: 500 },
          ),
        );
        return;
      }

      if (stderr) {
        console.error(`Python script stderr: ${stderr}`);
        // Resolve with a JSON response for stderr
        resolve(
          NextResponse.json(
            { error: "Python script error", details: stderr },
            { status: 500 },
          ),
        );
        return;
      }

      // If successful, return the stdout output
      resolve(NextResponse.json({ result: stdout.trim() }, { status: 200 }));
    });
  });
}
