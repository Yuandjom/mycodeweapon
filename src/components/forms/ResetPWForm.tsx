"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/utils/PasswordInput";
import Logo from "@/components/utils/Logo";

const ResetPasswordForm = () => {
  const [resetError, setResetError] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  const router = useRouter();
  const supabase = createClient();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsResetting(true);
    setResetError("");

    try {
      const formData = new FormData(e.currentTarget);
      const password1 = formData.get("newPassword1") as string;
      const password2 = formData.get("newPassword2") as string;

      if (password1 !== password2) {
        setResetError("Passwords do not match!");
        return;
      }

      const { data, error } = await supabase.auth.updateUser({
        password: password1,
      });

      if (error) throw error;
      toast({ title: "Settings Saved" });

      router.push("/signin");
    } catch (error) {
      setResetError("Error in resetting password, please try again later!");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <div>
        <div className="flex">
          <Logo withText logoSize={40} />
        </div>
        <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-black dark:text-white">
          Reset Password
        </h2>
      </div>

      <div className="mt-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          {resetError && (
            <p className="px-2 py-1 rounded-lg bg-destructive text-destructive-foreground text-center">
              {resetError}
            </p>
          )}

          <div className="space-y-2">
            <Label htmlFor="newPassword1" className="font-semibold text-md">
              New Password
            </Label>
            <PasswordInput
              id="newPassword1"
              name="newPassword1"
              disabled={isResetting}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword2" className="font-semibold text-md">
              Confirm Password
            </Label>
            <PasswordInput
              id="newPassword2"
              name="newPassword2"
              disabled={isResetting}
              required
            />
          </div>

          <div className="w-full flex_col_center gap-1">
            <Button
              type="submit"
              className="px-4 py-2 rounded-xl w-[300px]"
              disabled={isResetting}
            >
              {isResetting ? "Resetting password..." : "Reset Password"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
