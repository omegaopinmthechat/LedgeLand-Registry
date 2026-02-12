"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Registrar dashboard page accessible only to authenticated registrars
export default function RegistrarDashboardPage() {
  const { user, isAuthenticated, isRegistrar, logout } = useAuth();
  const router = useRouter();

  // Redirects non-registrars and unauthenticated users
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/registrar/login");
    } else if (!isRegistrar) {
      // Redirect clients trying to access registrar dashboard
      router.push("/dashboard");
    }
  }, [isAuthenticated, isRegistrar, router]);

  // Shows dashboard content only if user is authenticated registrar
  if (!isAuthenticated || !isRegistrar) {
    return null;
  }

  // Handles registrar logout and redirects to registrar login page
  const handleLogout = () => {
    logout();
    router.push("/registrar/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Registrar Dashboard</h1>
              <p className="text-xs text-gray-500">Administrative Panel</p>
            </div>
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
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Welcome, {user?.user_metadata?.full_name || user?.email}
          </h2>
          <div className="space-y-2">
            <p className="text-gray-600">
              <span className="font-medium">Role:</span> Registrar
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Email:</span> {user?.email}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Manage Users
            </h3>
            <p className="text-gray-600 text-sm">
              View and manage client accounts
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-600">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              System Settings
            </h3>
            <p className="text-gray-600 text-sm">
              Configure system parameters
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-600">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Reports
            </h3>
            <p className="text-gray-600 text-sm">
              View system reports and analytics
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
