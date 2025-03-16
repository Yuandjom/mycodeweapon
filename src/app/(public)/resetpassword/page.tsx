import type { Metadata } from "next";
import ResetPasswordForm from "@/components/forms/ResetPWForm";

export const metadata: Metadata = {
  title: "Reset Password",
};

const ResetPasswordPage = () => {
  return (
    <div className="w-full h-full flex_center">
      <ResetPasswordForm />
    </div>
  );
};

export default ResetPasswordPage;
