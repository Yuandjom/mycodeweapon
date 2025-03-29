"use client";

import { Play, Pause, RotateCcw, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const Timer = ({ className }: { className?: string }) => {
  const [seconds, setSeconds] = useState<number>(0);
  const [isTiming, setIsTiming] = useState<boolean>(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isTiming) {
      intervalId = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (isTiming) clearInterval(intervalId);
    };
  }, [isTiming]);

  const startTimer = () => {
    setIsTiming(true);
  };

  const pauseTimer = () => {
    setIsTiming(false);
  };

  const resetTimer = () => {
    setSeconds(0);
    setIsTiming(false);
  };

  return (
    <div
      className={cn("flex items-center justify-between rounded-md", className)}
    >
      <span className="font-mono text-sm font-medium">
        {formatTime(seconds)}
      </span>

      <div className="flex items-center ml-2">
        <div
          className={cn(
            "h-6 w-6 cursor-pointer rounded-md flex items-center justify-center transition-colors hover:bg-background/80"
          )}
          onClick={isTiming ? pauseTimer : startTimer}
        >
          {isTiming ? <Pause size={14} /> : <Play size={14} />}
        </div>

        <div
          className="h-6 w-6 cursor-pointer rounded-md flex items-center justify-center transition-colors hover:bg-background/80"
          onClick={resetTimer}
        >
          <RotateCcw size={14} />
        </div>
      </div>
    </div>
  );
};

const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
};

export default Timer;
