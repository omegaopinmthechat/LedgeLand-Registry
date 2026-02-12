"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginRegistrar } from "@/api/api";
import { useAuth } from "@/context/AuthContext";

// Custom hook for handling registrar login functionality
export const useRegistrarLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const router = useRouter();

  // Handles registrar login form submission and authentication
  const handleRegistrarLogin = async (username, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await loginRegistrar(username, password);
      
      if (response.success && response.data.accessToken) {
        login(response.data.user, response.data.accessToken);
        router.push("/registrar/dashboard");
        return { success: true };
      }
    } catch (err) {
      // Extract exact error message from backend
      const errorMessage = 
        err.response?.data?.message || 
        err.response?.data?.errors?.[0] || 
        err.message || 
        "Login failed. Please try again.";
      setError(errorMessage);
      console.error("Registrar login error:", err.response?.data || err.message);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { handleRegistrarLogin, loading, error, setError };
};
