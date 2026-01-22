// This centralizes database access so credentials and configuration live in one place.

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();


// if Supabase url or the key is not set up, there will be an error
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
