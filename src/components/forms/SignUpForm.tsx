"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { useToast } from "@/hooks/use-toast";
import { AuthForm, AuthFormField } from "@/components/utils/AuthForm";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/utils/PasswordInput";
import { displayErrorCode } from "@/constants/supabase";
import SignUpLoading from "../loading/SignUpLoading";

const SignUpForm = () => {
  const { signUp } = useAuth();
  const router = useRouter();
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [displayError, setDisplayError] = useState("");
  const { toast } = useToast();
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return <SignUpLoading />;
  }

  if (user) {
    router.push("/problem");
  }

  const fields = [
    {
      id: "username",
      label: "Username",
      type: "text",
      placeholder: "codegod",
    },
    {
      id: "email",
      label: "Email",
      type: "email",
      placeholder: "codegod@gmail.com",
    },
    {
      id: "password",
      label: "Password",
      type: "password",
      placeholder: "••••••••••••",
    },
    {
      id: "confirmPassword",
      label: "Confirm Password",
      type: "password",
      placeholder: "••••••••••••",
    },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSigningUp(true);
    setDisplayError("");

    try {
      const formData = new FormData(e.currentTarget);
      const userData = {
        username: formData.get("username") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      };

      const result = await signUp(userData);
      if (!result.success) {
        throw new Error(displayErrorCode(result.errorCode));
      }

      toast({
        title: "Account created successfully!",
        description: "Please check your email inbox for a confirmation",
      });

      if (result.data?.message?.includes("verification")) {
        toast({ title: result.data.message });
      } else {
        router.push("/problem");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setDisplayError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setIsSigningUp(false);
    }
  };

  const renderField = (field: AuthFormField) => {
    if (field.type === "password") {
      return (
        <PasswordInput
          id={field.id}
          name={field.id}
          placeholder={field.placeholder}
          required
          disabled={isSigningUp}
          parentClassName="relative"
          eyeClassName="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-transparent"
        />
      );
    }

    return (
      <Input
        id={field.id}
        name={field.id}
        type={field.type}
        placeholder={field.placeholder}
        required
        disabled={isSigningUp}
      />
    );
  };

  const footer = (
    <p
      className={cn(
        "text-sm text-neutral-600 text-center mt-4 dark:text-neutral-400"
      )}
    >
      Already have an account?{" "}
      <Link
        href="/signin"
        className="text-black dark:text-white hover:underline"
      >
        Sign in
      </Link>
    </p>
  );

  return (
    <AuthForm
      title="Sign Up for an account"
      fields={fields}
      isLoading={isSigningUp}
      onSubmit={handleSubmit}
      submitButtonText="Create account"
      loadingButtonText="Creating account..."
      footer={footer}
      renderField={renderField}
      displayError={displayError}
    />
  );
};

export default SignUpForm;
