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

export const Navbar = () => {
  const router = useRouter();
  const [hovered, setHovered] = useState<number | null>(null);
  const { user, authLoading, signOut } = useAuth();
  const { toast } = useToast();

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
      <div className="flex flex-row flex-1 items-center justify-center space-x-2 lg:space-x-2 text-sm text-zinc-600 font-medium hover:text-zinc-800 transition duration-200">
        <Button
          variant="ghost"
          className="text-primary rounded-full relative px-4 py-2 hover:text-primary/80"
        >
          <Link href="/problem/new">Get Started</Link>
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <LightDarkToggle />
      </div>
    </motion.div>
  );
};
