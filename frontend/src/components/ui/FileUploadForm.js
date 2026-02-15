"use client";

import { useState, useRef } from "react";
import { uploadFileToIPFS } from "@/api/api";

// File upload form component for registrars to upload land registry documents
const FileUploadForm = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Handles file selection from input
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setUploadResult(null);
    }
  };

  // Handles drag enter event
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handles file drop event
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError(null);
      setUploadResult(null);
    }
  };

  // Opens file browser when clicking the drop zone
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // Handles file upload to IPFS
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    setUploading(true);
    setError(null);
    setUploadResult(null);

    try {
      const response = await uploadFileToIPFS(file);

      if (response.success) {
        setUploadResult(response.data);
        setFile(null);
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0] ||
        err.message ||
        "Upload failed. Please try again.";
      setError(errorMessage);
      console.error("File upload error:", err.response?.data || err.message);
    } finally {
      setUploading(false);
    }
  };

  // Formats file size for display
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  // Copies text to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleUpload} className="space-y-6">
        {/* File Drop Zone */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${
            dragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 bg-white hover:border-gray-400"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />

          <div className="space-y-4">
            <div className="flex justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-16 h-16 text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
            </div>

            {file ? (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-base font-medium text-gray-900">
                  Drop your land registry file here, or click to browse
                </p>
                <p className="text-sm text-gray-500">
                  Supports PDF, DOC, DOCX, JPG, PNG (Max 100MB)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Upload Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={!file || uploading}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
          >
            {uploading ? (
              <span className="flex items-center justify-center gap-2">
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
                Uploading to IPFS...
              </span>
            ) : (
              "Upload to IPFS"
            )}
          </button>

          {file && !uploading && (
            <button
              type="button"
              onClick={() => {
                setFile(null);
                setError(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
            >
              Clear
            </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="font-medium">Upload Failed</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {uploadResult && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-4 rounded-lg space-y-3">
            <div className="flex items-start gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-green-600 shrink-0 mt-0.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="flex-1">
                <p className="font-semibold">File uploaded successfully!</p>
                <p className="text-sm mt-1">Your file is now stored on IPFS</p>
              </div>
            </div>

            <div className="space-y-2 mt-3">
              <div className="bg-white rounded p-3 border border-green-300">
                <p className="text-xs font-medium text-gray-600 mb-1">CID (Content Identifier)</p>
                <div className="flex items-center gap-2">
                  <code className="text-sm font-mono text-gray-900 break-all flex-1">
                    {uploadResult.cid}
                  </code>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(uploadResult.cid)}
                    className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition shrink-0"
                  >
                    Copy
                  </button>
                </div>
              </div>

              {uploadResult.ipfsUrl && (
                <div className="bg-white rounded p-3 border border-green-300">
                  <p className="text-xs font-medium text-gray-600 mb-1">IPFS Gateway URL</p>
                  <div className="flex items-center gap-2">
                    <a
                      href={uploadResult.ipfsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-700 underline break-all flex-1"
                    >
                      {uploadResult.ipfsUrl}
                    </a>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(uploadResult.ipfsUrl)}
                      className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition shrink-0"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              )}

              {uploadResult.pinSize && (
                <p className="text-sm">
                  <span className="font-medium">Size:</span> {formatFileSize(parseInt(uploadResult.pinSize))}
                </p>
              )}
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default FileUploadForm;
