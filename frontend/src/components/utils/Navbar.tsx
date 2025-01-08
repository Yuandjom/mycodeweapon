"use client";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";



export const Navbar = () => {
  const [hovered, setHovered] = useState<number | null>(null);
  const navItems = [
    {
      name: "Problems",
      link: "#",
    },
    {
      name: "Contribute",
      link: "#",
    },
  ];
  return (
    <motion.div
      onMouseLeave={() => {
        setHovered(null);
      }}
      className=
        "w-full flex flex-row bg-background items-center justify-between py-2 mx-auto px-4 z-[60] inset-x-0 border-b-8 border-black"
    >
      <Logo />
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
    </motion.div>
  );
};


const Logo = () => {
  return (
    <Link
      href="/"
      className="font-normal flex space-x-2 items-center text-sm mr-4  text-black px-2 py-1  relative z-20"
    >
      <Image
        src="/globe.svg"
        alt="logo"
        width={30}
        height={30}
      />
      <span className="font-medium text-black dark:text-white">My Code Weapon</span>
    </Link>
  );
};
