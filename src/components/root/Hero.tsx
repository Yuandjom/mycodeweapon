"use client";
import { motion } from "motion/react";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function Hero() {
  return (
    <div className="relative w-full overflow-hidden bg-background">
      <div className="relative flex flex-col items-center justify-center overflow-hidden px-8 pb-4 md:px-8">
        <div className="relative mt-20 flex flex-col items-center justify-center">
          <h1 className="mb-8 relative mx-auto mt-4 max-w-6xl text-center text-3xl font-bold tracking-tight text-zinc-700 md:text-4xl lg:text-7xl dark:text-white">
            Ace your coding interviews with{" "}
            <p className="relative z-10 bg-gradient-to-b from-teal-600 to-green-600 bg-clip-text text-transparent pb-3">
              AI-powered problem solving
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="inline-block h-14 w-14 stroke-green-500 stroke-[1px]"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <motion.path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <motion.path
                    initial={{ pathLength: 0, fill: "#a5b4fc", opacity: 0 }}
                    animate={{ pathLength: 1, fill: "#a5b4fc", opacity: 1 }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "linear",
                      repeatDelay: 0.5,
                    }}
                    d="M13 3l0 7l6 0l-8 11l0 -7l-6 0l8 -11"
                  />
                </svg>
              </span>
            </p>{" "}
          </h1>
          <h2 className="font-regular relative mx-auto mb-8 mt-8 max-w-xl text-center text-base tracking-wide text-zinc-500 antialiased md:text-xl dark:text-zinc-200">
            BetterLeetcode enhances your learning experience with contextual AI
            assistance, helping you understand, solve, and master programming
            challenges faster.
          </h2>
        </div>
        <div className="group relative z-10 mb-10">
          <button className="bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6  text-white inline-block">
            <span className="absolute inset-0 overflow-hidden rounded-full">
              <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </span>
            <div className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-0.5 px-4 ring-1 ring-white/10 ">
              <Link href="/editor" className="text-xl py-1.5 px-2">
                Start Solving
              </Link>
              <svg
                fill="none"
                height="16"
                viewBox="0 0 24 24"
                width="16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.75 8.75L14.25 12L10.75 15.25"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
            <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
          </button>
        </div>
      </div>
    </div>
  );
}
