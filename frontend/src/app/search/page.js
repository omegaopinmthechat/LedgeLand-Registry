"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getOwnershipHistory as getOwnershipHistoryAPI, getLandDetails as getLandDetailsAPI } from "@/api/api";

// Authenticated search page for viewing land ownership history
export default function SearchPage() {
  const { isAuthenticated, isRegistrar, logout } = useAuth();
  const router = useRouter();

  const [plotId, setPlotId] = useState("");
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);
  const [landDetails, setLandDetails] = useState(null);
  const [ownershipHistory, setOwnershipHistory] = useState([]);
  const [mounted, setMounted] = useState(false);

  // Set mounted state to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push("/login");
    }
  }, [mounted, isAuthenticated, router]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearching(true);
    setError(null);
    setLandDetails(null);
    setOwnershipHistory([]);

    try {
      if (!plotId || parseInt(plotId) <= 0) {
        throw new Error("Please enter a valid plot ID");
      }

      // Fetch land details and ownership history from backend API
      const [detailsResponse, historyResponse] = await Promise.all([
        getLandDetailsAPI(parseInt(plotId)),
        getOwnershipHistoryAPI(parseInt(plotId)),
      ]);

      // Extract data from API responses
      setLandDetails(detailsResponse.data);
      setOwnershipHistory(historyResponse.data.history || []);
    } catch (err) {
      console.error("Search error:", err);
      setError(err.response?.data?.message || err.message || "Failed to fetch ownership history");
    } finally {
      setSearching(false);
    }
  };

  const clearSearch = () => {
    setPlotId("");
    setError(null);
    setLandDetails(null);
    setOwnershipHistory([]);
  };

  // Show loading state during mount to prevent hydration mismatch
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

  // Show loading state if user is not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push(isRegistrar ? "/registrar/login" : "/login");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-50">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Land Registry Search</h1>
            <p className="text-sm text-gray-600 mt-1">Blockchain Verified Records</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push(isRegistrar ? "/registrar/dashboard" : "/dashboard")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Search by Plot ID</h2>
          <p className="text-sm text-gray-600 mb-6">
            Enter a plot ID to view its complete ownership history on the blockchain. This is a
            gas-free operation.
          </p>

          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-4">
              <input
                type="number"
                value={plotId}
                onChange={(e) => setPlotId(e.target.value)}
                placeholder="Enter Plot ID"
                required
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black"
              />
              <button
                type="submit"
                disabled={searching}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
              >
                {searching ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Searching...
                  </span>
                ) : (
                  "Search"
                )}
              </button>
              {(landDetails || error) && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
                >
                  Clear
                </button>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <p className="font-medium">Error</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            )}
          </form>
        </div>

        {/* Land Details */}
        {landDetails && (
          <div className="bg-white rounded-xl shadow-lg mb-8">
            {/* Verification Banner */}
            <div className="bg-linear-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-t-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                  />
                </svg>
                <span className="font-bold text-lg">Blockchain Verified Land Record</span>
              </div>
              <span className="text-xs bg-white bg-opacity-30 px-4 py-1.5 rounded-full font-medium">
                Sepolia Network
              </span>
            </div>
            
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Land Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">Plot ID</p>
                  <p className="text-lg font-semibold text-gray-900">{landDetails.plotId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">Location</p>
                  <p className="text-lg font-semibold text-gray-900">{landDetails.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">Current Owner Name</p>
                  <p className="text-lg font-semibold text-gray-900">{landDetails.currentOwnerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">Current Owner National ID</p>
                  <p className="text-lg font-semibold text-gray-900 font-mono">{landDetails.currentOwnerNationalId}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ownership History */}
        {ownershipHistory.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Ownership History ({ownershipHistory.length} records)
              </h3>
              <span className="text-sm text-gray-600 font-medium">Complete Chain of Custody</span>
            </div>

            <div className="space-y-4">
              {ownershipHistory.map((record, index) => (
                <div
                  key={index}
                  className={`border ${
                    index === ownershipHistory.length - 1
                      ? "border-green-300 bg-green-50"
                      : "border-gray-200 bg-gray-50"
                  } rounded-lg p-4`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          index === ownershipHistory.length - 1
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-600"
                        } font-bold`}
                      >
                        #{ownershipHistory.length - index}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{record.ownerName}</p>
                        <p className="text-xs text-gray-500">{record.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {record.verified && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full flex items-center gap-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-3 h-3"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                            />
                          </svg>
                          Verified
                        </span>
                      )}
                      {index === ownershipHistory.length - 1 && (
                        <span className="px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded-full">
                          Current Owner
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">National ID</p>
                      <p className="text-sm font-mono text-gray-900 break-all">
                        {record.nationalId}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-1">Deed Document (IPFS)</p>
                      <div className="flex items-center gap-2">
                        <code className="text-xs font-mono text-gray-700 break-all flex-1">
                          {record.deedCID}
                        </code>
                        <a
                          href={record.ipfsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition shrink-0"
                        >
                          View
                        </a>
                      </div>
                    </div>

                    {/* Blockchain Verification Section */}
                    {record.verified && (
                      <div className="mt-3 pt-3 border-t border-gray-300">
                        <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-4 h-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                            />
                          </svg>
                          Blockchain Verification
                        </p>
                        <div className="space-y-2">
                          {record.transactionHash && (
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Transaction Hash</p>
                              <div className="flex items-center gap-2">
                                <code className="text-xs font-mono text-gray-700 break-all flex-1">
                                  {record.transactionHash}
                                </code>
                                <a
                                  href={record.explorerUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition shrink-0"
                                  title="View on Etherscan"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    stroke="currentColor"
                                    className="w-4 h-4"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                                    />
                                  </svg>
                                </a>
                              </div>
                            </div>
                          )}
                          {record.blockNumber && (
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Block Number</p>
                              <div className="flex items-center gap-2">
                                <code className="text-xs font-mono text-gray-700">
                                  {record.blockNumber}
                                </code>
                                <a
                                  href={record.blockExplorerUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition"
                                  title="View block on Etherscan"
                                >
                                  View Block
                                </a>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-blue-900 mb-3">About Blockchain Verification</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 shrink-0 mt-0.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>All ownership records are immutably stored on Ethereum Sepolia blockchain</span>
            </li>
            <li className="flex items-start gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 shrink-0 mt-0.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Each record includes transaction hash and block number for independent verification</span>
            </li>
            <li className="flex items-start gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 shrink-0 mt-0.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Deed documents are stored on IPFS with permanent, tamper-proof access</span>
            </li>
            <li className="flex items-start gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 shrink-0 mt-0.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Click transaction hashes to verify records directly on Etherscan</span>
            </li>
            <li className="flex items-start gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 shrink-0 mt-0.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Searching and viewing history is completely free (no gas costs)</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
