"use client";

import { useWeb3 } from "@/context/Web3Context";
import Link from "next/link";
import { useState } from "react";
import { getOwnershipHistory, getLandDetails, formatNationalId } from "@/services/blockchain";

// Public search page for viewing land ownership history
export default function SearchPage() {
  const { getReadOnlyContract, networkConfig } = useWeb3();

  const [plotId, setPlotId] = useState("");
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);
  const [landDetails, setLandDetails] = useState(null);
  const [ownershipHistory, setOwnershipHistory] = useState([]);

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

      const contract = getReadOnlyContract();
      if (!contract) {
        throw new Error("Unable to connect to blockchain");
      }

      // Fetch land details and ownership history
      const [details, history] = await Promise.all([
        getLandDetails(contract, parseInt(plotId)),
        getOwnershipHistory(contract, parseInt(plotId)),
      ]);

      setLandDetails(details);
      setOwnershipHistory(history);
    } catch (err) {
      console.error("Search error:", err);
      setError(err.message || "Failed to fetch ownership history");
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

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Land Registry Search</h1>
              <p className="text-xs text-gray-500">Public Blockchain Records</p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              Home
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Search by Plot ID</h2>
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
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Land Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Plot ID</p>
                <p className="text-base font-medium text-gray-900">{landDetails.plotId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="text-base font-medium text-gray-900">{landDetails.location}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Current Owner Name</p>
                <p className="text-base font-medium text-gray-900">{landDetails.currentOwnerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Current Owner National ID</p>
                <p className="text-base font-medium text-gray-900 font-mono">{landDetails.currentOwnerNationalId}</p>
              </div>
            </div>
          </div>
        )}

        {/* Ownership History */}
        {ownershipHistory.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Ownership History ({ownershipHistory.length} records)
              </h3>
              <span className="text-sm text-gray-500">Complete Chain of Custody</span>
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
                    {index === ownershipHistory.length - 1 && (
                      <span className="px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded-full">
                        Current Owner
                      </span>
                    )}
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
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-blue-900 mb-3">About Blockchain Records</h3>
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
              <span>All ownership records are stored immutably on the Ethereum blockchain</span>
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
              <span>Searching and viewing history is completely free (no gas costs)</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
