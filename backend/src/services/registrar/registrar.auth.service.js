import { supabaseAdmin } from "../../config/supabaseClient.js";
import HTTP_STATUS from "../../../utils/http.js";
import { ApiError } from "../../../utils/ApiError.js";

const login = async (username, password) => {
  console.log("[Service] Login called with username:", username);
  if (!username || !password) {
    console.log("[Service] Login validation failed: missing credentials");
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "Username and password are required",
    );
  }

  const email = username.includes("@") ? username : `${username}@registrar.com`;
  console.log("[Service] Constructed email:", email);

  console.log("[Service] Calling Supabase auth.signInWithPassword");
  const { data, error } = await supabaseAdmin.auth.signInWithPassword({
    email: email,
    password,
  });

  if (error) {
    console.log("[Service] Supabase auth error:", error.message);
    throw new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      error.message || "Invalid credentials",
    );
  }

  if (!data?.session) {
    console.log("[Service] No session returned from Supabase");
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Authentication failed");
  }

  const userRole = data.user?.user_metadata?.role;
  console.log("[Service] User role:", userRole);
  if (userRole !== "registrar") {
    console.log("[Service] Access denied: user is not a registrar");
    throw new ApiError(
      HTTP_STATUS.FORBIDDEN,
      "Access denied. Registrar role required",
    );
  }

  console.log("[Service] Login successful for user:", data.user.email);
  return {
    accessToken: data.session.access_token,
    refreshToken: data.session.refresh_token,
    user: data.user,
    role: userRole,
  };
};

const create = async (password, fullName, dateOfBirth) => {
  console.log("[Service] Create called with fullName:", fullName, "dateOfBirth:", dateOfBirth);
  if (!password || !fullName || !dateOfBirth) {
    console.log("[Service] Validation failed: missing required fields");
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "Password, full name, and date of birth are required",
    );
  }

  // Validate date format DDMMYYYY
  const dobRegex = /^\d{8}$/;
  if (!dobRegex.test(dateOfBirth)) {
    console.log("[Service] Invalid date of birth format");
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "Date of birth must be in DDMMYYYY format",
    );
  }

  console.log("[Service] Generating username from full name and DOB");
  const firstThreeLetters = fullName
    .trim()
    .substring(0, 3)
    .toLowerCase()
    .replace(/[^a-z]/g, "");

  console.log("[Service] First three letters:", firstThreeLetters);

  if (firstThreeLetters.length < 3) {
    console.log("[Service] Full name must contain at least 3 letters");
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "Full name must contain at least 3 letters",
    );
  }

  const username = `${firstThreeLetters}${dateOfBirth}`;
  const email = `${username}@registrar.com`;
  console.log("[Service] Generated username:", username, "email:", email);

  console.log("[Service] Creating user in Supabase auth");
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: email,
    password,
    email_confirm: true,
    user_metadata: {
      role: "registrar",
      full_name: fullName,
    },
  });

  if (error) {
    console.log("[Service] Supabase createUser error:", error.message);
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      error.message || "Registrar creation failed",
    );
  }

  if (!data?.user) {
    console.log("[Service] No user returned from Supabase");
    throw new ApiError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Failed to create registrar",
    );
  }

  console.log("[Service] User created in auth, ID:", data.user.id);
  console.log("[Service] Inserting into registrar table");

  const { data: registrarData, error: insertError } = await supabaseAdmin
    .from("registrar")
    .insert([
      {
        id: data.user.id,
        username: username,
        full_name: fullName,
        date_of_birth: dateOfBirth,
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (insertError) {
    console.log("[Service] Database insert error:", insertError.message);
    console.log("[Service] Rolling back: deleting user from auth");
    await supabaseAdmin.auth.admin.deleteUser(data.user.id);
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      insertError.message || "Failed to store registrar data",
    );
  }

  console.log("[Service] Registrar created successfully in database");
  return {
    message: "Registrar created successfully",
    user: {
      id: registrarData.id,
      username: registrarData.username,
      fullName: registrarData.full_name,
      createdAt: registrarData.created_at,
      role: "registrar",
    },
  };
};

export default {
  login,
  create,
};
