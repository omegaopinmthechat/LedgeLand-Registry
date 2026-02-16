"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="w-full bg-[#1e3a8a] text-white relative mb-8">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg
          viewBox="0 0 1200 80"
          preserveAspectRatio="none"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="mountainGradient" x1="0%" x2="100%" y1="0%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.04" />
            </linearGradient>
          </defs>
          <path 
            d="M0,60 C150,20 250,70 360,30 C480,0 600,60 720,40 C840,20 960,50 1080,25 L1200,60 L1200,80 L0,80 Z" 
            fill="url(#mountainGradient)" 
          />
          <path 
            d="M0,70 L120,30 L240,65 L360,35 L480,70 L600,25 L720,60 L840,40 L960,65 L1080,45 L1200,70" 
            stroke="rgba(255,255,255,0.15)" 
            strokeWidth="2" 
            fill="none" 
          />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className="w-8 h-8" fill="currentColor">
            <path d="M302.7 69.1C313.2 62.3 326.8 62.3 337.3 69.1L561.3 213.1C573.2 220.8 578.7 235.4 574.7 249C570.7 262.6 558.2 272 544 272L512 272L512 480L563.2 518.4C571.3 524.4 576 533.9 576 544C576 561.7 561.7 576 544 576L96 576C78.3 576 64 561.7 64 544C64 533.9 68.7 524.4 76.8 518.4L128 480L128 480L128 272L96 272C81.8 272 69.3 262.6 65.3 249C61.3 235.4 66.8 220.7 78.7 213.1L302.7 69.1zM400 272L400 480L464 480L464 272L400 272zM288 480L352 480L352 272L288 272L288 480zM176 272L176 480L240 480L240 272L176 272z"/>
          </svg>
          <span className="text-xl font-bold">LedgeLand</span>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/login" className="px-4 py-2 bg-white text-[#1e3a8a] rounded-md text-sm font-medium hover:bg-gray-100">
            Client Login
          </Link>
          <Link href="/registrar/login" className="px-4 py-2 border border-white rounded-md text-sm font-medium hover:bg-white/10">
            Registrar Login
          </Link>
        </div>
      </div>
    </header>
  );
}
