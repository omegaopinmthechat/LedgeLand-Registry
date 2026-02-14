import React, { Suspense } from "react";
import AuthLayout from "@/components/ui/AuthLayout";
import LoginForm from "@/components/ui/LoginForm";

// Login page combining AuthLayout and LoginForm components
export default function LoginPage() {
  return (
    <AuthLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}
