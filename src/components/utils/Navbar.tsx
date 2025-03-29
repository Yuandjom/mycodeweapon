"use client";

import Logo from "./Logo";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import LightDarkToggle from "@/components/utils/LightDarkToggle";
import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import { LogOut, User, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import AnimatedButton from "@/components/ui/animated-button";
import { usePathname } from "next/navigation";

export const Navbar = () => {
  const router = useRouter();
  const [hovered, setHovered] = useState<number | null>(null);
  const { user, authLoading, signOut } = useAuth();
  const { toast } = useToast();
  const pathname = usePathname();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({ title: "Signed out successfully" });
    } catch (error) {
      toast({ title: "Failed to sign out" });
      console.error("Sign out error:", error);
    }
  };

  return (
    <motion.div
      onMouseLeave={() => {
        setHovered(null);
      }}
      className="w-full flex flex-row bg-background items-center justify-between py-2 mx-auto px-4 z-[60] inset-x-0"
    >
      <Logo withText />
      {pathname === "/" && user && (
        <div className="flex flex-row flex-1 items-center justify-center space-x-2 lg:space-x-2 text-sm text-zinc-600 font-medium hover:text-zinc-800 transition duration-200">
          <Button
            variant="ghost"
            className="text-primary relative px-4 py-2 hover:text-primary/80"
          >
            <Link href="/problem/new" className="font-semibold">
              Get Started
            </Link>
          </Button>
        </div>
      )}
      <div className="flex items-center gap-2">
        <LightDarkToggle />
        {!authLoading && (
          <>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-10 h-10 bg-background hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {user.user_metadata.avatar_url ? (
                      <Image
                        src={user.user_metadata.avatar_url}
                        alt="User avatar"
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 rounded-lg shadow-xl border-2 border-border z-101"
                >
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1 p-2">
                      <p className="font-semibold leading-none">
                        {user.user_metadata.username || user.email}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => {
                      router.push("/profile/settings");
                    }}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <AnimatedButton>
                <Link href="/signin">
                  <span className="text-sm md:text-base">Sign In</span>
                </Link>
              </AnimatedButton>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};
