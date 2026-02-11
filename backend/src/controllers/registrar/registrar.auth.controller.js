import registrarAuthService from "../../services/registrar/registrar.auth.service.js";
import HTTP_STATUS from "../../../utils/http.js";
import { ApiError } from "../../../utils/ApiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import passwordRegex from "../../../utils/passwordRegex.js";

const login = async (req, res) => {
  try {
    console.log("[Registrar Login] Received request body:", req.body);
    const { username, password } = req.body;

    if (!username || !password) {
      console.log("[Registrar Login] Missing username or password");
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(
          new ApiError(
            HTTP_STATUS.BAD_REQUEST,
            "Username and password are required",
          ),
        );
    }

    console.log("[Registrar Login] Calling service with username:", username);
    const data = await registrarAuthService.login(username, password);

    console.log("[Registrar Login] Login successful");
    return res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(HTTP_STATUS.OK, data, "Registrar login successful"),
      );
  } catch (error) {
    console.log("[Registrar Login] Error:", error.message);
    const statusCode =
      error.statusCode === HTTP_STATUS.FORBIDDEN
        ? HTTP_STATUS.FORBIDDEN
        : HTTP_STATUS.UNAUTHORIZED;

    return res
      .status(statusCode)
      .json(
        new ApiError(statusCode, error.message || "Invalid credentials"),
      );
  }
};

const create = async (req, res) => {
  try {
    console.log("[Registrar Create] Received request body:", req.body);
    const { password, confirm_password, full_name } = req.body;

    console.log("[Registrar Create] Step 1: Checking required fields");
    if (!password || !confirm_password || !full_name) {
      console.log("[Registrar Create] Missing required fields");
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(
          new ApiError(HTTP_STATUS.BAD_REQUEST, "All fields are required"),
        );
    }

    console.log("[Registrar Create] Step 2: Checking password match");
    if (password !== confirm_password) {
      console.log("[Registrar Create] Passwords do not match");
      return res
        .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
        .json(
          new ApiError(
            HTTP_STATUS.UNPROCESSABLE_ENTITY,
            "Passwords do not match",
          ),
        );
    }

    console.log("[Registrar Create] Step 3: Validating password regex");
    console.log("[Registrar Create] Password regex test result:", passwordRegex.test(password));
    if (!passwordRegex.test(password)) {
      console.log("[Registrar Create] Password failed regex validation");
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(
          new ApiError(
            HTTP_STATUS.BAD_REQUEST,
            "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character",
          ),
        );
    }

    console.log("[Registrar Create] Step 4: Calling service");
    const data = await registrarAuthService.create(password, full_name);

    console.log("[Registrar Create] Registrar created successfully:", data.user.username);
    return res
      .status(HTTP_STATUS.CREATED)
      .json(
        new ApiResponse(
          HTTP_STATUS.CREATED,
          data,
          "Registrar created successfully",
        ),
      );
  } catch (error) {
    console.log("[Registrar Create] Error:", error.message);
    console.log("[Registrar Create] Error stack:", error.stack);
    return res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json(
        new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          error.message || "Registrar creation failed",
        ),
      );
  }
};

export default {
  login,
  create,
};
