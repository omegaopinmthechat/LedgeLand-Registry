import React, { Suspense } from "react";
import AuthLayout from "@/components/ui/AuthLayout";
import RegistrarLoginForm from "@/components/ui/RegistrarLoginForm";

// Registrar login page
export default function RegistrarLoginPage() {
  return (
    <AuthLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <RegistrarLoginForm />
      </Suspense>
    </AuthLayout>
  );
}
