"use client"

import { useRouter } from "next/navigation"
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

const ResetPasswordPage = () => {

    const [newPassword1, setNewPassword1] = useState<string>("");
    const [showPassword1, setShowPassword1] = useState<boolean>(false);
    const [newPassword2, setNewPassword2] = useState<string>("");
    const [showPassword2, setShowPassword2] = useState<boolean>(false);
    const [resetError, setResetError] = useState<string>("");
    const [isResetting, setIsResetting] = useState<boolean>(false);

    const router = useRouter();
    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsResetting(true);

        try {
            if (newPassword1 !== newPassword2) {
                setResetError("Passwords do not match!")
                return
            }

            const { data, error } = await supabase.auth.updateUser({
                password: newPassword1
            })

            if (error) throw error;

            toast.success("Password updated!")
            router.push("/signin")
        } catch (error) {
            setResetError("Error in resetting password, please try again later!")
        } finally {
            setIsResetting(false);
        }

    }


    return (
        <div className="w-full h-full flex_center">

            <form
                onSubmit={handleSubmit}
                className="w-full max-w-lg flex_col_center gap-6"
            >

                {resetError && <p className="px-2 py-1 rounded-lg bg-destructive text-destructive-foreground">
                    {resetError}
                </p>}
                <div className="flex_col_center sm:grid sm:grid-cols-[150px_1fr] items-center gap-4">
                    <Label htmlFor="newPassword1">New Password</Label>
                    <div className="relative">
                        <Input
                            id="newPassword1"
                            type={showPassword1 ? "text" : "password"}
                            value={newPassword1}
                            onChange={(e) => setNewPassword1(e.target.value)}
                            disabled={isResetting}
                            required
                            className="pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword1(!showPassword1)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                            {showPassword1 ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                </div>

                <div className="flex_col_center sm:grid sm:grid-cols-[150px_1fr] items-center gap-4">
                    <Label htmlFor="newPassword2">Confirm Password</Label>
                    <div className="relative">
                        <Input
                            id="newPassword2"
                            type={showPassword2 ? "text" : "password"}
                            value={newPassword2}
                            onChange={(e) => setNewPassword2(e.target.value)}
                            disabled={isResetting}
                            required
                            className="pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword2(!showPassword2)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                            {showPassword2 ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                </div>

                <Button disabled={isResetting || !newPassword1 || !newPassword2} type="submit">
                    {isResetting ? "Resetting password..." : "Reset Password"}
                </Button>

            </form>

        </div>
    )

}

export default ResetPasswordPage