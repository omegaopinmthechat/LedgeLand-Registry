"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Dashboard page accessible only to authenticated client users
export default function DashboardPage() {
  const { user, isAuthenticated, isRegistrar, logout } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Set mounted state to avoid hydration mismatch
  useEffect(() => {
    const setMounted1 = () => {
      setMounted(true);
    }
    setMounted1();
  }, []);

  // Redirects to login page if user is not authenticated or is a registrar
  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push("/login");
    } else if (mounted && isRegistrar) {
      router.push("/registrar/dashboard");
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

  // Shows dashboard content only if user is authenticated and not a registrar
  if (!isAuthenticated || isRegistrar) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  // Handles user logout and redirects to login page
  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Client Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
          >
            Logout
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Welcome, {user?.email}</h2>
          <p className="text-gray-600 text-lg">
            Access blockchain-verified land records and verify ownership history.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Search & Verify Records Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-blue-600 hover:shadow-xl transition">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-7 h-7 text-blue-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Search Records</h3>
                <p className="text-sm text-gray-600">Look up land ownership</p>
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              Search for any land plot by Plot ID and view its complete ownership history with blockchain verification.
            </p>
            <a
              href="/search"
              className="block w-full px-6 py-3 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Go to Search
            </a>
          </div>

          {/* Blockchain Verification Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-green-600 hover:shadow-xl transition">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-7 h-7 text-green-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Verified Records</h3>
                <p className="text-sm text-gray-600">Blockchain secured</p>
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              All records are immutably stored on Ethereum Sepolia blockchain with transaction hashes and IPFS documents.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-linear-to-br from-gray-50 to-gray-100 p-4 rounded-lg">
                <p className="text-xs text-gray-600 mb-1 font-medium">Network</p>
                <p className="text-base font-bold text-gray-900">Sepolia</p>
              </div>
              <div className="bg-linear-to-br from-gray-50 to-gray-100 p-4 rounded-lg">
                <p className="text-xs text-gray-600 mb-1 font-medium">Storage</p>
                <p className="text-base font-bold text-gray-900">IPFS</p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-xl p-8">
          <h3 className="text-lg font-bold text-blue-900 mb-4">How to Verify Records</h3>
          <ol className="space-y-2 text-blue-800 list-decimal list-inside">
            <li>Go to the Search page and enter a Plot ID</li>
            <li>View the ownership history with all previous owners</li>
            <li>Each record shows a blockchain verification badge</li>
            <li>Click on transaction hashes to view on Etherscan</li>
            <li>View IPFS documents by clicking the View button</li>
            <li>All data is independently verifiable on the blockchain</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
