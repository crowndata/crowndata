// app/api/return-value/route.ts

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // Parse the JSON body of the request
  const body = await req.json();

  // Extract the "data" parameter from the request body
  const { data } = body;

  // Respond with the parameter and the value 0.42
  return NextResponse.json({
    receivedData: data,
    value: 0.42,
  });
}