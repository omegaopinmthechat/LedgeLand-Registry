"use client";

import { useAuth } from "@/context/AuthContext";
import { useWeb3 } from "@/context/Web3Context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { uploadFileToIPFS } from "@/api/api";
import { registerLand, formatAddress, formatTxHash } from "@/services/blockchain";

// Register new land page (Registrar only)
export default function RegisterLandPage() {
  const { user, isAuthenticated, isRegistrar, logout } = useAuth();
  const { account, contract, isConnected, connectWallet, networkConfig } = useWeb3();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Form state
  const [plotId, setPlotId] = useState("");
  const [location, setLocation] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerNationalId, setOwnerNationalId] = useState("");
  const [file, setFile] = useState(null);

  // UI state
  const [uploading, setUploading] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [txHash, setTxHash] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push("/registrar/login");
    } else if (mounted && !isRegistrar) {
      router.push("/dashboard");
    }
  }, [mounted, isAuthenticated, isRegistrar, router]);

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

  const handleLogout = () => {
    logout();
    router.push("/registrar/login");
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setSuccess(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setTxHash(null);

    try {
      // Validation
      if (!plotId || !location || !ownerName || !ownerNationalId || !file) {
        setError("All fields are required");
        return;
      }

      if (!isConnected) {
        setError("Please connect your wallet first");
        return;
      }

      // Step 1: Upload file to IPFS
      setUploading(true);
      const uploadResponse = await uploadFileToIPFS(file);

      if (!uploadResponse.success || !uploadResponse.data.cid) {
        throw new Error("Failed to upload file to IPFS");
      }

      const deedCID = uploadResponse.data.cid;
      setUploading(false);

      // Step 2: Register land on blockchain
      setRegistering(true);
      const result = await registerLand(
        contract,
        parseInt(plotId),
        location,
        ownerName,
        ownerNationalId,
        deedCID
      );

      setTxHash(result.transactionHash);
      setSuccess("Land registered successfully!");

      // Reset form
      setPlotId("");
      setLocation("");
      setOwnerName("");
      setOwnerNationalId("");
      setFile(null);
      const fileInput = document.getElementById("file-input");
      if (fileInput) fileInput.value = "";

    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setUploading(false);
      setRegistering(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/registrar/dashboard")}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                  />
                </svg>
                Back
              </button>
              <div className="border-l border-gray-300 h-8"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Register New Land</h1>
                <p className="text-xs text-gray-500">Blockchain Land Registry</p>
              </div>
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Wallet Connection */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Wallet Connection</p>
              <p className="text-xs text-gray-500">
                {isConnected ? formatAddress(account) : "Not connected"}
              </p>
            </div>
            {!isConnected ? (
              <button
                onClick={connectWallet}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Connect Wallet
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600">Connected to {networkConfig.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Register New Land Parcel</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Plot ID */}
            <div>
              <label htmlFor="plotId" className="block text-sm font-medium text-gray-700 mb-2">
                Plot ID<span className="text-red-500">*</span>
              </label>
              <input
                id="plotId"
                type="number"
                value={plotId}
                onChange={(e) => setPlotId(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black"
                placeholder="Enter unique plot ID (e.g., 1001)"
              />
              <p className="mt-1 text-xs text-gray-500">Must be a unique numeric identifier</p>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location<span className="text-red-500">*</span>
              </label>
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black"
                placeholder="Enter land location (e.g., Block 5, Sector 12, City)"
              />
            </div>

            {/* Owner Name */}
            <div>
              <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700 mb-2">
                Owner Name<span className="text-red-500">*</span>
              </label>
              <input
                id="ownerName"
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black"
                placeholder="Enter owner full name"
              />
            </div>

            {/* Owner National ID */}
            <div>
              <label htmlFor="nationalId" className="block text-sm font-medium text-gray-700 mb-2">
                Owner National ID<span className="text-red-500">*</span>
              </label>
              <input
                id="nationalId"
                type="text"
                value={ownerNationalId}
                onChange={(e) => setOwnerNationalId(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black"
                placeholder="Enter owner national ID number"
              />
            </div>

            {/* File Upload */}
            <div>
              <label htmlFor="file-input" className="block text-sm font-medium text-gray-700 mb-2">
                Deed Document<span className="text-red-500">*</span>
              </label>
              <input
                id="file-input"
                type="file"
                onChange={handleFileChange}
                required
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {file && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <p className="font-medium">Error</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-4 rounded-lg space-y-2">
                <p className="font-semibold">{success}</p>
                {txHash && (
                  <div className="space-y-1">
                    <p className="text-sm">Transaction Hash:</p>
                    <a
                      href={`${networkConfig.blockExplorer}/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-mono text-blue-600 hover:text-blue-700 underline break-all"
                    >
                      {formatTxHash(txHash)}
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isConnected || uploading || registering}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
            >
              {uploading
                ? "Uploading to IPFS..."
                : registering
                ? "Registering Land..."
                : "Register Land"}
            </button>
          </form>
        </div>

        {/* Info Section */}
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-green-900 mb-3">Registration Process</h3>
          <ol className="space-y-2 text-sm text-green-800">
            <li className="flex gap-2">
              <span className="font-bold">1.</span>
              <span>Connect your MetaMask wallet (must be registrar account)</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">2.</span>
              <span>Enter unique plot ID and location details</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">3.</span>
              <span>Enter initial owner name and national ID</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">4.</span>
              <span>Upload deed document (automatically stored on IPFS)</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">5.</span>
              <span>Confirm transaction in MetaMask to record on blockchain</span>
            </li>
          </ol>
        </div>
      </main>
    </div>
  );
}
