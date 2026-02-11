import { createClient } from "@supabase/supabase-js";
import HTTP_STATUS from "../../utils/http.js";
import { ApiError } from "../../utils/ApiError.js";

const { SUPABASE_URL, SUPABASE_PUBLISHABLE } = process.env;

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

// Create Client
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE);

export default supabase;
