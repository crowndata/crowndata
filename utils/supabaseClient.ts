// lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

if (supabaseUrl && supabaseAnonKey) {
  // Proceed with logic when both the Supabase URL and anon key are available
  console.log("Supabase environment variables are set.");
  // Initialize Supabase client or perform related tasks
} else {
  console.warn("Some Supabase environment variables are missing.");

  if (!supabaseUrl) {
    console.warn("NEXT_PUBLIC_SUPABASE_URL is missing.");
  }

  if (!supabaseAnonKey) {
    console.warn("NEXT_PUBLIC_SUPABASE_ANON_KEY is missing.");
  }
}
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("supabaseUrl and supabaseAnonKey are required");
}
export const supabase = createClient(supabaseUrl!, supabaseAnonKey!);
