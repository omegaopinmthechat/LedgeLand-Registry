"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 to-blue-50">
      <main className="flex min-h-screen w-full max-w-6xl flex-col items-center justify-center py-16 px-6">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🏛️ Land Registry
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Blockchain-Powered Land Ownership System
          </p>
          <p className="text-base text-gray-500">
            Secure, Transparent, and Immutable Land Records on Ethereum
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mb-12">
          <Link
            href="/login"
            className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-orange-500 hover:shadow-xl transition text-center"
          >
            <div className="flex flex-col items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-12 h-12 text-orange-500 mb-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Client Login
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Access your account and land records
              </p>
              <span className="text-orange-500 font-medium">Sign In →</span>
            </div>
          </Link>

          <Link
            href="/registrar/login"
            className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-purple-600 hover:shadow-xl transition text-center"
          >
            <div className="flex flex-col items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-12 h-12 text-purple-600 mb-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Registrar Login
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Manage land registry and blockchain operations
              </p>
              <span className="text-purple-600 font-medium">
                Admin Access →
              </span>
            </div>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold text-lg">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Secure Storage
              </h3>
              <p className="text-sm text-gray-600">
                Documents stored on IPFS for permanent, decentralized access
              </p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-orange-600 font-bold text-lg">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Blockchain Records
              </h3>
              <p className="text-sm text-gray-600">
                Ownership recorded on Ethereum for immutable history
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 font-bold text-lg">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Secure Verification
              </h3>
              <p className="text-sm text-gray-600">
                Authenticated users can verify ownership and full transaction history
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
