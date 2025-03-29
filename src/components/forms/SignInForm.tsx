"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth, AuthResult } from "@/providers/auth-provider";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AuthForm, AuthFormField } from "@/components/utils/AuthForm";
import { PasswordInput } from "../utils/PasswordInput";
import { displayErrorCode } from "@/constants/supabase";
import SignInLoading from "../loading/SignInLoading";

const SignInForm = () => {
  const { signIn, resetPassword } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [displayError, setDisplayError] = useState<string>("");

  const { toast } = useToast();

  const { user, authLoading } = useAuth();

  if (authLoading) {
    return <SignInLoading />;
  }

  if (user) {
    router.push("/problem");
  }

  const fields = [
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
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSigningIn(true);

    try {
      const formData = new FormData(e.currentTarget);
      const userData = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      };

      const result = await signIn(userData);
      if (!result.success) {
        throw new Error(displayErrorCode(result.errorCode));
      }

      toast({ title: "Signed in successfully!" });

      const redirectPage = searchParams.get("next");
      router.push(redirectPage || "/editor");
    } catch (err) {
      setDisplayError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setIsSigningIn(false);
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
          disabled={isSigningIn}
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
        disabled={isSigningIn}
      />
    );
  };

  const footer = (
    <>
      <p
        className={cn(
          "text-sm text-neutral-600 text-center mt-4 dark:text-neutral-400"
        )}
      >
        Forgot Password? <ResetPasswordDialog resetPassword={resetPassword} />
      </p>
      <p
        className={cn(
          "text-sm text-neutral-600 text-center mt-4 dark:text-neutral-400"
        )}
      >
        Don't have an account?{" "}
        <Link
          href="/signup"
          className="text-black dark:text-white hover:underline"
        >
          Sign up
        </Link>
      </p>
    </>
  );

  return (
    <AuthForm
      title="Sign In"
      fields={fields}
      isLoading={isSigningIn}
      onSubmit={handleSubmit}
      submitButtonText="Sign In"
      loadingButtonText="Signing In..."
      footer={footer}
      renderField={renderField}
      displayError={displayError}
    />
  );
};

export default SignInForm;

interface ResetPasswordDialogProps {
  resetPassword: (pw: string) => Promise<AuthResult>;
}

const ResetPasswordDialog = ({ resetPassword }: ResetPasswordDialogProps) => {
  const [isResettingPW, setIsResettingPW] = useState<boolean>(false);
  const [resetEmail, setResetEmail] = useState<string>("");
  const [resetSuccess, setResetSuccess] = useState<string>("");
  const [resetError, setResetError] = useState<string>("");

  async function handleResetPassword() {
    if (!resetEmail) return;

    setIsResettingPW(true);
    setResetSuccess("");
    setResetError("");

    const result = await resetPassword(resetEmail);

    if (!result.success) {
      setResetError("Error! Please check your credentials or try again later");
    } else {
      setResetSuccess("Password reset link sent to your email!");
    }

    setIsResettingPW(false);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="hover:underline hover:bg-transparent text-black dark:text-white"
          onClick={() => {
            setResetError("");
            setResetSuccess("");
            setResetEmail("");
          }}
        >
          Reset Password
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {resetError && (
            <p className="px-2 py-1 rounded-lg bg-destructive text-destructive-foreground text-center">
              {resetError}
            </p>
          )}
          {resetSuccess && (
            <p className="px-2 py-1 rounded-lg bg-green-500 text-green-200 text-center">
              {resetSuccess}
            </p>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              className="col-span-3"
              onChange={(e) => setResetEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  handleResetPassword();
                }
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            disabled={!resetEmail || isResettingPW}
            onClick={handleResetPassword}
          >
            {isResettingPW ? "Resetting..." : "Reset"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
