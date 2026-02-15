"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import FileUploadForm from "@/components/ui/FileUploadForm";

// Registrar upload page accessible only to authenticated registrars
export default function RegistrarUploadPage() {
  const { user, isAuthenticated, isRegistrar, logout } = useAuth();
  const router = useRouter();

  // Redirects non-registrars and unauthenticated users
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/registrar/login");
    } else if (!isRegistrar) {
      // Redirect clients trying to access registrar upload page
      router.push("/dashboard");
    }
  }, [isAuthenticated, isRegistrar, router]);

  // Shows upload page only if user is authenticated registrar
  if (!isAuthenticated || !isRegistrar) {
    return null;
  }

  // Handles registrar logout and redirects to registrar login page
  const handleLogout = () => {
    logout();
    router.push("/registrar/login");
  };

  // Navigates back to dashboard
  const handleBackToDashboard = () => {
    router.push("/registrar/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBackToDashboard}
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
                <h1 className="text-2xl font-bold text-gray-900">Upload Land Registry</h1>
                <p className="text-xs text-gray-500">Store documents on IPFS</p>
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-blue-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {user?.user_metadata?.full_name || user?.email}
              </p>
              <p className="text-xs text-gray-500">Registrar Account</p>
            </div>
          </div>
        </div>

        {/* Instructions Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-blue-600 shrink-0 mt-0.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
              />
            </svg>
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                How to Upload Land Registry Documents
              </h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <span className="font-bold mt-0.5">1.</span>
                  <span>Select or drag and drop your land registry document (PDF, DOC, DOCX, JPG, or PNG format)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold mt-0.5">2.</span>
                  <span>Click &quot;Upload to IPFS&quot; to securely store the document on the InterPlanetary File System</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold mt-0.5">3.</span>
                  <span>Save the CID (Content Identifier) and IPFS URL for permanent access to the document</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold mt-0.5">4.</span>
                  <span>Your registrar details are automatically attached to the upload for audit purposes</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Upload Form Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Upload Document</h2>
          <FileUploadForm />
        </div>

        {/* Info Section */}
        <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">About IPFS Storage</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              <span className="font-medium text-gray-900">IPFS (InterPlanetary File System)</span> is a distributed
              file storage protocol that ensures your documents are:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Permanently stored and cannot be deleted or modified</li>
              <li>Accessible from anywhere via the unique CID</li>
              <li>Tamper-proof with cryptographic verification</li>
              <li>Decentralized without relying on a single server</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
