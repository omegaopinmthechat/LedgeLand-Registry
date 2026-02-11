import { createClient } from "@supabase/supabase-js";
import HTTP_STATUS from "../../utils/http.js";
import { ApiError } from "../../utils/ApiError.js";

const { SUPABASE_URL, SUPABASE_PUBLISHABLE, SUPABASE_SECRET } = process.env;

//Validate Environment Variables
if (!SUPABASE_URL) {
  throw new ApiError(
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    "SUPABASE_URL is not defined in environment variables",
  );
}
if (!SUPABASE_PUBLISHABLE) {
  throw new ApiError(
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    "SUPABASE_ANON_KEY is not defined in environment variables",
  );
}
if (!SUPABASE_SECRET) {
  throw new ApiError(
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    "SUPABASE_SECRET is not defined in environment variables",
  );
}

// Create Client for regular operations
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE, {
  db: {
    schema: "ledgeland",
  },
});

// Create Admin Client with service role key for admin operations
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SECRET, {
  db: {
    schema: "ledgeland",
  },
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export default supabase;
export { supabaseAdmin };
