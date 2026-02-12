import AuthLayout from "@/components/ui/AuthLayout";
import SignupForm from "@/components/ui/SignupForm";

// Signup page combining AuthLayout and SignupForm components
export default function SignupPage() {
  return (
    <AuthLayout>
      <SignupForm />
    </AuthLayout>
  );
}
