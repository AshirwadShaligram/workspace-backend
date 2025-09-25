const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");

// Environment variable for supabase
dotenv.config();

// Connection to sipabse client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_API
);

module.exports = { supabase };
