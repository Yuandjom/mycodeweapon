import type { Metadata } from "next";
import SignInForm from "@/components/forms/SignInForm";

export const metadata: Metadata = {
  title: "Sign In"
}

export default function SignInPage() {
  return (
    <div className="w-full min-h-screen grid grid-cols-1">
      <SignInForm />
    </div>
  );
}


