"use client";

import {
  Card,
  CardSkeletonBody,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/root/bentoboxitems/BentoCard";
import Image from "next/image";
import AiCard from "@/components/root/bentoboxitems/AiCard";
import CompareCard from "@/components/root/bentoboxitems/CompareCard";
import { useTheme } from "next-themes";

export default function BentoBox() {
  const { theme } = useTheme();

  return (
    <div className="w-full max-w-7xl mx-auto my-20 px-4 md:px-8">
      <h2 className="font-sans text-bold text-3xl md:text-4xl lg:text-5xl text-center w-fit mx-auto font-bold tracking-tight text-neutral-8000 dark:text-neutral-100 text-neutral-800">
        Features That Will Make Your Life Easier
      </h2>
      {/* <p className="text-xl md:text-3xl lg:text-4xl font-semibold text-neutral-600 text-center mx-auto mt-4 dark:text-neutral-400">
        with powerful tools for learning & testing all in one platform.
      </p> */}

      <div className="mt-20 grid cols-1 md:grid-cols-5 gap-4 md:auto-rows-[25rem]">
        <Card className="flex flex-col justify-between row-span-2 md:col-span-3">
          <CardContent className="h-40">
            <CardTitle>Challenge Tracker</CardTitle>
            <CardDescription>
              Keep tabs on your solved problems and pending challenges
            </CardDescription>
          </CardContent>
          <CardSkeletonBody className="relative flex py-8 px-2 gap-10 h-full w-full">
            <div className="w-full p-5 mx-auto shadow-2xl group h-full">
              <div className="flex flex-1 w-full h-full flex-col space-y-2  ">
                <Image
                  src={`/problemsTable_${theme === "dark" ? "dark" : "light"}.png`}
                  alt="table"
                  width={800}
                  height={800}
                  className="h-full w-full aspect-square object-cover object-left-top rounded-sm"
                />
              </div>
            </div>

            <div className="absolute bottom-0 z-40 inset-x-0 h-60 bg-gradient-to-t from-white dark:from-neutral-900 via-white dark:via-neutral-900 to-transparent w-full pointer-events-none" />
            <div className="absolute top-0 z-40 inset-x-0 h-60 bg-gradient-to-b from-white dark:from-neutral-900 via-transparent to-transparent w-full pointer-events-none" />
          </CardSkeletonBody>
        </Card>

        <Card className="flex flex-col justify-between md:col-span-2">
          <CardContent className="h-40">
            <CardTitle>Code Synthesis</CardTitle>
            <CardDescription>
              Get intelligent coding guidance to accelerate your learning
              journey
            </CardDescription>
          </CardContent>
          <CardSkeletonBody>
            <CompareCard theme={theme} />
          </CardSkeletonBody>
        </Card>

        {/* <Card className="flex flex-col justify-between md:col-span-2">
          <CardContent className="h-40">
            <CardTitle>Hosting over the edge</CardTitle>
            <CardDescription>
              With our edge network, we host your website by going into each
              city by ourselves.
            </CardDescription>
          </CardContent>
          <CardSkeletonBody>
            <SkeletonTwo />
          </CardSkeletonBody>
        </Card> */}

        <Card className="flex flex-col justify-between row-span-2 md:col-span-2">
          <CardContent className="h-40">
            <CardTitle>Go From Questions To Hired</CardTitle>
            <CardDescription>
              24/7 guidance from advanced algorithmic questions to time/space
              complexity analysis
            </CardDescription>
          </CardContent>
          <CardSkeletonBody>
            <div className="w-full p-1 rounded-lg bg-neutral-100 border border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700 mx-2 md:mx-4">
              <Image
                src={`/chatDemo_${theme === "dark" ? "dark" : "light"}.png`}
                alt="Dashboard"
                width={500}
                height={800}
                className="w-full object-cover rounded-lg "
              />
            </div>
          </CardSkeletonBody>
        </Card>

        <AiCard className="flex p-4 md:p-6 flex-col justify-between md:col-span-3" />
      </div>
    </div>
  );
}
