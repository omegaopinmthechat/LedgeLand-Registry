"use client";

import Image from "next/image";

// Reusable authentication layout with left image and right form section
const AuthLayout = ({ children, imageSrc = "/auth-image.jpg", imageAlt = "Authentication" }) => {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Solid Color */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-blue-600">
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <h2 className="text-4xl font-bold mb-4">Welcome to Our Platform</h2>
          <p className="text-xl text-center max-w-md">
            Secure authentication system built with modern technology
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
