import { createClient } from "@supabase/supabase-js";
import { configDotenv } from "dotenv";

// Environment variable for supabase
configDotenv();

// Connection to sipabse client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_API
);

export { supabase };
