"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser, registerUser } from "@/api/api";
import { useAuth } from "@/context/AuthContext";

// Custom hook for handling login functionality
export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const router = useRouter();

  // Handles login form submission and authentication
  const handleLogin = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await loginUser(email, password);
      
      if (response.success && response.data.accessToken) {
        login(response.data.user, response.data.accessToken);
        router.push("/dashboard");
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
      console.error("Login error:", err.response?.data || err.message);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, loading, error, setError };
};

// Custom hook for handling signup functionality
export const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Handles signup form submission and user registration
  const handleSignup = async (email, password, confirmPassword) => {
    setLoading(true);
    setError(null);

    try {
      const response = await registerUser(email, password, confirmPassword);
      
      if (response.success) {
        // Redirect to login page after successful registration
        router.push("/login?registered=true");
        return { success: true };
      }
    } catch (err) {
      // Extract exact error message from backend
      const errorMessage = 
        err.response?.data?.message || 
        err.response?.data?.errors?.[0] || 
        err.message || 
        "Registration failed. Please try again.";
      setError(errorMessage);
      console.error("Registration error:", err.response?.data || err.message);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { handleSignup, loading, error, setError };
};
