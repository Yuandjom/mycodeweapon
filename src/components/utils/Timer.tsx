"use client";

import { Play, Pause, RotateCcw, AlarmClock } from "lucide-react";
import { useState, useEffect } from "react";

const Timer = () => {
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
    <div className="flex_center px-2 py-0.5 bg-secondary text-secondary-foreground rounded-md">
      <div className="flex items-center gap-2 px-2 flex-auto">
        <AlarmClock size={18} />
        <span className="font-mono text-sm font-medium">
          {formatTime(seconds)}
        </span>
      </div>

      <div className="flex items-center">
        <div
          className="h-8 w-8 hover:bg-secondary-foreground/10 cursor-pointer rounded-md flex_center"
          onClick={isTiming ? pauseTimer : startTimer}
        >
          {isTiming ? <Pause size={14} /> : <Play size={14} />}
        </div>

        <div
          className="h-8 w-8 hover:bg-secondary-foreground/10 cursor-pointer rounded-md flex_center"
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
