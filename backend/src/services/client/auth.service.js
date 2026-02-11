import supabase from "../../config/supabaseClient.js";
import HTTP_STATUS from "../../../utils/http.js";
import { ApiError } from "../../../utils/ApiError.js";

const login = async (email, password) => {
  if (!email || !password) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "Email and password are required",
    );
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      error.message || "Invalid credentials",
    );
  }

  if (!data?.session) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Authentication failed");
  }

  return {
    accessToken: data.session.access_token,
    refreshToken: data.session.refresh_token,
    user: data.user,
  };
};

const register = async (email, password) => {
  if (!email || !password) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "Email and password are required",
    );
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      error.message || "Registration failed",
    );
  }

  return {
    message: "User registered successfully",
    user: data.user,
  };
};

export default {
  login,
  register,
};
