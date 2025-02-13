import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Logo from "@/components/utils/Logo";

const SignUpLoading = () => {
  return (
    <div className="bg-background">
      <div className="flex items-center w-full justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          <div>
            <div className="flex">
              <Logo withText logoSize={40} />
            </div>
            <div className="mt-8">
              <Skeleton className="h-8 w-64" />
            </div>
          </div>

          <div className="mt-10 space-y-6">
            {/* Username field */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Email field */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Confirm Password field */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="w-full flex_col_center gap-1">
              <Skeleton className="h-10 w-[300px] rounded-xl" />
              <Skeleton className="h-5 w-48 mt-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpLoading;
