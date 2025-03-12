"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff } from "lucide-react";
import { ProblemState } from "@/types/problem";
import { cn } from "@/lib/utils";

import { CheckCircle, Circle, Timer } from "lucide-react";
import { SimpleResponse } from "@/types/global";
import { useToast } from "@/hooks/use-toast";

export const STATUSES_STYLE = [
  {
    value: "To Do",
    label: "Todo",
    icon: Circle,
    css: "!text-blue-700 dark:!text-blue-300",
  },
  {
    value: "In Progress",
    label: "In Progress",
    icon: Timer,
    css: "!text-yellow-700 dark:!text-yellow-300",
  },
  {
    value: "Completed",
    label: "Completed",
    icon: CheckCircle,
    css: "!text-emerald-700 dark:!text-emerald-300",
  },
];

export const COLUMN_SIZES = {
  select: "w-12",
  title: "w-[60%]",
  status: "w-32",
  actions: "w-20",
};

export const getProblemColumns = (
  deleteRow: (problemData: ProblemState) => Promise<SimpleResponse>
): ColumnDef<ProblemState>[] => {
  const { toast } = useToast();

  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          onClick={(e) => e.stopPropagation()}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
      cell: ({ row }) => {
        const problemTitle = row.getValue("title") as string;
        return (
          <p
            onClick={() => {
              window.open(
                `/problem/${problemTitle.replace(/ /g, "-").toLowerCase()}`,
                "_blank"
              );
            }}
            className="capitalize font-bold hover:underline hover:text-blue-500 cursor-pointer"
          >
            {row.getValue("title")}
          </p>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => <p>Status</p>,
      cell: ({ row }) => {
        const status = STATUSES_STYLE.find(
          (status) => status.value == row.getValue("status")
        );

        if (!status) {
          return null;
        }

        return (
          <div className="flex w-[100px] items-center">
            {status.icon && (
              <status.icon
                className={`${status.css} mr-2 h-4 w-4 text-muted-foreground`}
              />
            )}
            <span className={status.css}>{status.label}</span>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const problem = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(problem.title)}
              >
                Copy title
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {/* <DropdownMenuItem
              onClick={() => {
                alert("change status");
              }}
            >
              TODO: Mark as [enum status]
            </DropdownMenuItem> */}
              <DropdownMenuItem
                className="bg-destructive focus:bg-destructive/80 text-destructive-foreground cursor-pointer"
                onClick={() => {
                  deleteRow(problem).then((response) => {
                    if (response.success) {
                      toast({
                        title: "Success!",
                        description: response.message,
                      });
                    } else {
                      toast({
                        title: "Something went wrong...",
                        description: response.message,
                        variant: "destructive",
                      });
                    }
                  });
                }}
              >
                Delete Problem
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            <span>{title}</span>
            {column.getIsSorted() === "desc" ? (
              <ArrowDown />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUp />
            ) : (
              <ChevronsUpDown />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <ArrowUp className="h-3.5 w-3.5 text-muted-foreground/70" />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <ArrowDown className="h-3.5 w-3.5 text-muted-foreground/70" />
            Desc
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
            <EyeOff className="h-3.5 w-3.5 text-muted-foreground/70" />
            Hide
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
