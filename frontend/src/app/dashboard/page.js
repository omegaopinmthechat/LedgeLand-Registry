"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Dashboard page accessible only to authenticated client users
export default function DashboardPage() {
  const { user, isAuthenticated, isRegistrar, logout } = useAuth();
  const router = useRouter();

  // Redirects to login page if user is not authenticated or is a registrar
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else if (isRegistrar) {
      router.push("/registrar/dashboard");
    }
  }, [isAuthenticated, isRegistrar, router]);

  // Shows dashboard content only if user is authenticated and not a registrar
  if (!isAuthenticated || isRegistrar) {
    return null;
  }

  // Handles user logout and redirects to login page
  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Welcome, {user?.email}</h2>
          <p className="text-gray-600">
            You have successfully logged in to your dashboard.
          </p>
        </div>
      </main>
    </div>
  );
}
