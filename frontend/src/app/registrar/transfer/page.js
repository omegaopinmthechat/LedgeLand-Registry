"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { uploadFileToIPFS, transferLandOnBlockchain } from "@/api/api";
import Navbar from "@/components/ui/Navbar";

// Transfer land ownership page (Registrar only)
export default function TransferOwnershipPage() {
  const { user, isAuthenticated, isRegistrar, logout } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Form state
  const [plotId, setPlotId] = useState("");
  const [newOwnerNationalId, setNewOwnerNationalId] = useState("");
  const [newOwnerName, setNewOwnerName] = useState("");
  const [file, setFile] = useState(null);

  // UI state
  const [uploading, setUploading] = useState(false);
  const [transferring, setTransferring] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const [explorerUrl, setExplorerUrl] = useState(null);

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
    setExplorerUrl(null);

    try {
      // Validation
      if (!plotId || !newOwnerNationalId || !newOwnerName || !file) {
        setError("All fields are required");
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

      // Step 2: Transfer ownership on blockchain via backend
      setTransferring(true);
      const result = await transferLandOnBlockchain({
        plotId: parseInt(plotId),
        newOwnerName,
        newNationalId: newOwnerNationalId,
        deedCID,
      });

      if (result.success && result.data) {
        setTxHash(result.data.transactionHash);
        setExplorerUrl(result.data.explorerUrl);
        setSuccess(result.message || "Ownership transferred successfully!");

        // Reset form
        setPlotId("");
        setNewOwnerNationalId("");
        setNewOwnerName("");
        setFile(null);
        const fileInput = document.getElementById("file-input");
        if (fileInput) fileInput.value = "";
      } else {
        throw new Error(result.message || "Failed to transfer ownership");
      }
    } catch (err) {
      console.error("Transfer error:", err);
      
      // Extract error message from different error formats
      let errorMessage = "Transfer failed. Please try again.";
      
      if (err.response?.data?.message) {
        // API error response
        errorMessage = err.response.data.message;
      } else if (err.message) {
        // Direct error message
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setUploading(false);
      setTransferring(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Transfer Ownership</h1>
            <p className="text-sm text-gray-600 mt-1">Blockchain Land Registry</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/registrar/dashboard")}
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

        {/* Transfer Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Transfer Land Ownership</h2>

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
                placeholder="Enter plot ID"
              />
            </div>

            {/* New Owner National ID */}
            <div>
              <label htmlFor="nationalId" className="block text-sm font-medium text-gray-700 mb-2">
                New Owner National ID<span className="text-red-500">*</span>
              </label>
              <input
                id="nationalId"
                type="text"
                value={newOwnerNationalId}
                onChange={(e) => setNewOwnerNationalId(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black"
                placeholder="Enter national ID number"
              />
            </div>

            {/* New Owner Name */}
            <div>
              <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700 mb-2">
                New Owner Name<span className="text-red-500">*</span>
              </label>
              <input
                id="ownerName"
                type="text"
                value={newOwnerName}
                onChange={(e) => setNewOwnerName(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black"
                placeholder="Enter owner name"
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
                {txHash && explorerUrl && (
                  <div className="space-y-1">
                    <p className="text-sm">Transaction Hash:</p>
                    <a
                      href={explorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-mono text-blue-600 hover:text-blue-700 underline break-all"
                    >
                      {txHash.slice(0, 10)}...{txHash.slice(-8)}
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={uploading || transferring}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
            >
              {uploading
                ? "Uploading to IPFS..."
                : transferring
                ? "Transferring on Blockchain..."
                : "Transfer Ownership"}
            </button>
          </form>
        </div>

        {/* Info Section */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-blue-900 mb-3">Transfer Process</h3>
          <ol className="space-y-2 text-sm text-blue-800">
            <li className="flex gap-2">
              <span className="font-bold">1.</span>
              <span>Enter the plot ID of the land to transfer</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">2.</span>
              <span>Enter new owner&apos;s national ID and name</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">3.</span>
              <span>Upload the deed document (stored on IPFS)</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">4.</span>
              <span>System automatically records transfer on blockchain</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">5.</span>
              <span>Receive confirmation with blockchain transaction link</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
