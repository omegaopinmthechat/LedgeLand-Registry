import { supabaseAdmin } from "../config/supabaseClient.js";
import HTTP_STATUS from "../../utils/http.js";
import { ApiError } from "../../utils/ApiError.js";

/**
 * Middleware to verify registrar authentication
 * Checks for valid JWT token and registrar role
 */
const verifyRegistrar = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json(
          new ApiError(
            HTTP_STATUS.UNAUTHORIZED,
            "Access token is required. Please provide a Bearer token",
          ),
        );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify the JWT token with Supabase
    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json(
          new ApiError(
            HTTP_STATUS.UNAUTHORIZED,
            "Invalid or expired token. Please login again",
          ),
        );
    }

    // Check if user has registrar role
    const userRole = user.user_metadata?.role;
    if (userRole !== "registrar") {
      return res
        .status(HTTP_STATUS.FORBIDDEN)
        .json(
          new ApiError(
            HTTP_STATUS.FORBIDDEN,
            "Access denied. Registrar role required",
          ),
        );
    }

    // Attach user info to request object for use in controllers
    req.user = user;
    req.userRole = userRole;

    next();
  } catch (error) {
    console.error("Registrar auth middleware error:", error.message, error);
    return res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json(
        new ApiError(
          HTTP_STATUS.INTERNAL_SERVER_ERROR,
          "Authentication verification failed",
        ),
      );
  }
};

export default verifyRegistrar;
