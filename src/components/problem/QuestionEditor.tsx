import { useToast } from "@/hooks/use-toast";
import React, { useEffect, useState } from "react";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Edit2, ImagePlus, Save, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProblemStatus } from "@/types/problem";
import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { STATUSES_STYLE } from "@/components/table/problem_column";

interface QuestionEditorProps {
  title: string;
  description: string;
  hints: string;
  status: ProblemStatus;
  setStatus: (status: ProblemStatus) => void;
}

const QuestionEditor = ({
  title,
  description,
  hints,
  status,
  setStatus,
}: QuestionEditorProps) => {
  const { toast } = useToast();

  return (
    <div className="w-full h-full flex flex-col space-y-2">
      {/* Title component */}
      <div className="space-y-2 flex justify-between items-center gap-2">
        <div className="flex_center gap-2">
          <h1 className="text-lg font-bold text-left">{title}</h1>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              className={`${
                STATUSES_STYLE.find((s) => s.value == status)?.css
              } rounded-lg`}
            >
              {(() => {
                const currentStatus = STATUSES_STYLE.find(
                  (s) => s.value === status
                );
                if (currentStatus) {
                  const StatusIcon = currentStatus.icon;
                  return (
                    <>
                      <StatusIcon
                        className={cn("h-4 w-4", currentStatus.css)}
                      />
                      <span>{status}</span>
                    </>
                  );
                }
                return <span>{status}</span>;
              })()}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[150px]">
            <DropdownMenuLabel>Set Status</DropdownMenuLabel>
            {STATUSES_STYLE.map((s, i) => {
              const Icon = s.icon;
              const cssI = s.css;
              return (
                <DropdownMenuItem
                  key={`setStatus-${i}`}
                  onClick={() => setStatus(s.value as ProblemStatus)}
                >
                  <div className="flex w-[100px] items-center">
                    <s.icon className={cn("mr-2 h-4 w-4", s.css)} />
                    <span className={cn(s.css)}>{s.label}</span>
                  </div>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default QuestionEditor;
