"use client";

import { cn } from "@/lib/utils";
import Logo from "./Logo";
import { motion, AnimatePresence } from "framer-motion";
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
import { Button } from "../ui/button";
import { useAuth } from "@/providers/auth-provider";
import { LogOut, User, Settings } from "lucide-react";
import { toast } from "sonner";

export const Navbar = () => {
  const [hovered, setHovered] = useState<number | null>(null);
  const { user, authLoading, signOut } = useAuth();
  const navItems = [
    {
      name: "Problems",
      link: "#",
    },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Failed to sign out");
      console.error("Sign out error:", error);
    }
  };

  return (
    <motion.div
      onMouseLeave={() => {
        setHovered(null);
      }}
      className=
        "w-full flex flex-row bg-background items-center justify-between py-2 mx-auto px-4 z-[60] inset-x-0"
    >
      <Logo withText/>
      <div className="flex flex-row flex-1 items-center justify-center space-x-2 lg:space-x-2 text-sm text-zinc-600 font-medium hover:text-zinc-800 transition duration-200">
        {navItems.map((navItem: any, idx: number) => (
          <Link
            onMouseEnter={() => setHovered(idx)}
            className="text-neutral-600 dark:text-neutral-300 relative px-4 py-2"
            key={`link=${idx}`}
            href={navItem.link}
          >
            {hovered === idx && (
              <motion.div
                layoutId="hovered"
                className="w-full h-full absolute inset-0 bg-gray-100 dark:bg-neutral-800 rounded-full"
              />
            )}
            <span className="relative z-20">{navItem.name}</span>
          </Link>
        ))}
      </div>
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
                    className="rounded-full w-9 h-9"
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
                <DropdownMenuContent align="end" className="w-56 rounded-lg shadow-xl border-2 border-border z-101">
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
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="default" 
                size="sm"
                asChild
              >
                <Link href="/signin">
                  Sign in
                </Link>
              </Button>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

