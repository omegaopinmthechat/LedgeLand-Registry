"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Registrar dashboard page accessible only to authenticated registrars
export default function RegistrarDashboardPage() {
  const { user, isAuthenticated, isRegistrar, logout } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const getDisplayUsername = (user) => {
    if (!user) return "";
    // Prefer explicit full name only if email is not registrar type
    if (user?.email && user.email.endsWith("@registrar.com")) {
      return user.email.split("@")[0];
    }
    return user?.user_metadata?.full_name || user?.email || "";
  };

  // Set mounted state to avoid hydration mismatch
  useEffect(() => {
    const setMounted1 = () => {
      setMounted(true);
    }
    setMounted1()
  }, []);

  // Redirects non-registrars and unauthenticated users
  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push("/registrar/login");
    } else if (mounted && !isRegistrar) {
      // Redirect clients trying to access registrar dashboard
      router.push("/dashboard");
    }
  }, [mounted, isAuthenticated, isRegistrar, router]);

  // Shows loading state during mount to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Shows dashboard content only if user is authenticated registrar
  if (!isAuthenticated || !isRegistrar) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  // Handles registrar logout and redirects to registrar login page
  const handleLogout = () => {
    logout();
    router.push("/registrar/login");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Registrar Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">Administrative Panel</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
          >
            Logout
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            Welcome, {getDisplayUsername(user)}
          </h2>
          <div className="space-y-2">
            <p className="text-gray-700 text-lg">
              <span className="font-semibold">Role:</span> Registrar
            </p>
            <p className="text-gray-700 text-lg">
              <span className="font-semibold">Username:</span> {getDisplayUsername(user)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <button
            onClick={() => router.push("/registrar/register")}
            className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-green-600 hover:shadow-xl transition text-left"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Register New Land
                </h3>
                <p className="text-gray-600">
                  Register new land parcel on blockchain
                </p>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8 text-green-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </div>
          </button>

          <button
            onClick={() => router.push("/registrar/transfer")}
            className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-blue-600 hover:shadow-xl transition text-left"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Transfer Ownership
                </h3>
                <p className="text-gray-600">
                  Transfer land ownership on blockchain
                </p>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8 text-blue-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
                />
              </svg>
            </div>
          </button>

          <button
            onClick={() => router.push("/search")}
            className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-purple-600 hover:shadow-xl transition text-left"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Search Records
                </h3>
                <p className="text-gray-600">
                  View land ownership history
                </p>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8 text-purple-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
