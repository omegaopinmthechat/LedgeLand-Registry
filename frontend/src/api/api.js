import api from "@/lib/axios";

// Handles user login with email and password
export const loginUser = async (email, password) => {
  const response = await api.post("/api/v1/auth/login", { email, password });
  return response.data;
};

// Handles user registration with email and password
export const registerUser = async (email, password, confirm_password) => {
  const response = await api.post("/api/v1/auth/register", {
    email,
    password,
    confirm_password,
  });
  return response.data;
};

// Logs out the current user
export const logoutUser = async () => {
  // Implement logout logic if backend provides an endpoint
  const response = await api.post("/api/v1/auth/logout");
  return response.data;
};
