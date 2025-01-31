import type { Metadata } from "next";
import SignUpForm from "@/components/forms/SignUpForm";
import { Suspense } from "react";
import SignUpLoading from "@/components/loading/SignUpLoading";

export const metadata: Metadata = {
  title: "Sign Up"
}

export default function SignUpPage() {
  return (
    <div className="w-full min-h-screen grid grid-cols-1">
      <Suspense fallback={<SignUpLoading />}>
        <SignUpForm />
      </Suspense>
    </div>
  );
}
