"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Logo from "@/components/utils/Logo"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { toast } from "sonner";

export default function SignUpPage() {
  return (
    <div className="w-full min-h-screen grid grid-cols-1">
      <Form />
    </div>
  );
}

function Form() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string>("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSigningUp(true);
    setError("");

    try {
      const formData = new FormData(e.currentTarget);
      const userData = {
        username: formData.get('username') as string,
        email: formData.get('email') as string,
        password: formData.get('password') as string
      };

      const result = await signUp(userData);
      if (!result.success) {
        throw new Error(result.error?.message || "Failed to create account");
      }

      toast.success("Account created successfully!");

      // If email verification is required
      if (result.data?.message?.includes("verification")) {
        toast.info(result.data.message);
      } else {
        router.push("/problem");
      }

    } catch (err) {
      console.error("Signup error:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      toast.error(err instanceof Error ? err.message : "Failed to create account");
    } finally {
      setIsSigningUp(false);
    }

  }

  const [isSigningUp, setIsSigningUp] = useState<boolean>(false);

  return (
    <div className="bg-background">
      <div className="flex items-center w-full justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          <div>
            <div className="flex">
              <Logo withText logoSize={40} />
            </div>
            <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-black dark:text-white">
              Sign Up for an account
            </h2>
          </div>

          <div className="mt-10">
            <div>
              <form onSubmit={onSubmit} className="space-y-6">

                <div className="space-y-2">
                  <Label htmlFor="username" className="font-semibold text-md">
                    Username
                  </Label>
                  <Input
                    id="username"
                    name="username"
                    placeholder="codegod"
                    type="text"
                    required
                    disabled={isSigningUp}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="font-semibold text-md">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    placeholder="codegod@gmail.com"
                    type="email"
                    required
                    disabled={isSigningUp}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username" className="font-semibold text-md">
                    Password
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    placeholder="••••••••••••"
                    type="password"
                    required
                    disabled={isSigningUp}
                  />
                </div>

                <div className="w-full flex_col_center gap-1">
                  <Button
                    type="submit"
                    className="px-4 py-2 rounded-xl w-[300px]"
                    disabled={isSigningUp}
                  >
                    {isSigningUp ? "Creating account..." : "Create account"}
                  </Button>
                  <p className={cn("text-sm text-neutral-600 text-center mt-4 dark:text-neutral-400")}>
                    Already have an account?{" "}
                    <Link href="/signin" className="text-black dark:text-white hover:underline">
                      Sign in
                    </Link>
                  </p>
                </div>
              </form>
            </div>

            {/* <div className="mt-10">
              <p className="text-neutral-600 dark:text-neutral-400 text-sm text-center mt-8">
                By clicking on sign up, you agree to our{" "}
                <Link href="/terms-of-service" className="text-neutral-500 dark:text-neutral-300">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacypolicy" className="text-neutral-500 dark:text-neutral-300">
                  Privacy Policy
                </Link>
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

