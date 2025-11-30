// lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

// Replace these with your real values from Supabase
const supabaseUrl = "https://okkeeuwjcbcjqhmrbvjk.supabase.co"; // Correct URL from Supabase dashboard
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ra2VldXdqY2JjanFobXJidmprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwMDgwMzgsImV4cCI6MjA3OTU4NDAzOH0.4CAu-ZJ_jqsJq8BXxShiQiQxv18DplDjqgwTXs1rCHskey";

// Optional: Validate URL format
if (!supabaseUrl.startsWith("http")) {
  throw new Error(`Invalid Supabase URL: ${supabaseUrl}`);
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
