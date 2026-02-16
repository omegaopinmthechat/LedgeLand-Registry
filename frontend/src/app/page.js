"use client";

import Link from "next/link";
import Navbar from "@/components/ui/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="w-full max-w-6xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Digital Land Registry on Blockchain
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto">
          A secure, tamper-proof, and publicly verifiable land registry powered by Ethereum (Sepolia) and IPFS. Transparent ownership tracking with immutable audit history.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link 
            href="/dashboard"
            className="px-8 py-3 bg-[#1e3a8a] text-white rounded-lg font-semibold hover:bg-[#1e40af] transition"
          >
            Verify Land Ownership
          </Link>
          <a 
            href="#how-it-works"
            className="px-8 py-3 border-2 border-[#1e3a8a] text-[#1e3a8a] rounded-lg font-semibold hover:bg-[#1e3a8a] hover:text-white transition"
          >
            Learn More
          </a>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="w-full max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-500">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 font-bold text-2xl">1</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
              Upload Deed to IPFS
            </h3>
            <p className="text-gray-600 text-center">
              The land registry uploads official deed documents to IPFS, generating a secure cryptographic CID.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-purple-500">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-purple-600 font-bold text-2xl">2</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
              Record on Ethereum (Sepolia)
            </h3>
            <p className="text-gray-600 text-center">
              Plot ID and deed CID are permanently recorded on the Ethereum blockchain.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-green-500">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 font-bold text-2xl">3</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
              Public Verification (Gas-Free)
            </h3>
            <p className="text-gray-600 text-center">
              Anyone can verify ownership history instantly without wallet login or gas fees.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
            Core Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10 text-blue-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Tamper-Proof Records
              </h3>
              <p className="text-gray-600">
                All land records are immutable and protected by blockchain cryptography.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10 text-purple-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Publicly Verifiable
              </h3>
              <p className="text-gray-600">
                Ownership history can be accessed by anyone without MetaMask or login.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10 text-green-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Real-Time Ownership Tracking
              </h3>
              <p className="text-gray-600">
                Every transfer is recorded on-chain with timestamped proof.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Login Cards Section */}
      <section className="w-full max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      </section>

      {/* Footer */}
      <footer className="w-full bg-gray-900 text-white py-8 mt-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-gray-300 mb-4">
            © 2026 LedgeLand Registry | Developed by AMAR
          </p>
          <div className="flex items-center justify-center gap-6">
            <a 
              href="https://github.com/omegaopinmthechat" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
            <a 
              href="https://www.linkedin.com/in/amarsankarmaitra/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
