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

// Handles registrar login with username and password
export const loginRegistrar = async (username, password) => {
  const response = await api.post("/api/v1/registrar/login", { username, password });
  return response.data;
};

// Uploads a file to IPFS via Pinata (Registrar only)
export const uploadFileToIPFS = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  
  const response = await api.post("/api/v1/registrar/pinata/file", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Uploads JSON metadata to IPFS via Pinata (Registrar only)
export const uploadJSONToIPFS = async (metadata) => {
  const response = await api.post("/api/v1/registrar/pinata/json", metadata);
  return response.data;
};
