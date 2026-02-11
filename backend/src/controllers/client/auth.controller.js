import authService from "../../services/client/auth.service.js";
import HTTP_STATUS from "../../../utils/http.js";
import { ApiError } from "../../../utils/ApiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(
          new ApiError(
            HTTP_STATUS.BAD_REQUEST,
            "Email and password are required",
          ),
        );
    }

    const data = await authService.login(email, password);

    return res
      .status(HTTP_STATUS.OK)
      .json(new ApiResponse(HTTP_STATUS.OK, data, "Login successful"));
  } catch (error) {
    return res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .json(
        new ApiError(
          HTTP_STATUS.UNAUTHORIZED,
          error.message || "Invalid credentials",
        ),
      );
  }
};

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const register = async (req, res) => {
  try {
    const { email, password, confirm_password } = req.body;

    if (!email || !password || !confirm_password) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(new ApiError(HTTP_STATUS.BAD_REQUEST, "All fields are required"));
    }

    if (password !== confirm_password) {
      return res
        .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
        .json(
          new ApiError(
            HTTP_STATUS.UNPROCESSABLE_ENTITY,
            "Passwords do not match",
          ),
        );
    }

    if (!passwordRegex.test(password)) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(
          new ApiError(
            HTTP_STATUS.BAD_REQUEST,
            "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character",
          ),
        );
    }

    const data = await authService.register(email, password);

    return res
      .status(HTTP_STATUS.CREATED)
      .json(
        new ApiResponse(
          HTTP_STATUS.CREATED,
          data,
          "User registered successfully",
        ),
      );
  } catch (error) {
    return res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json(
        new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          error.message || "Registration failed",
        ),
      );
  }
};

export default {
  login,
  register,
};
