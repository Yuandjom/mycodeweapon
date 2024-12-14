"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"


export type comboBoxSelection = {
    value: string,
    label: string,
}

export function Combobox({keyword, selections, onSelectChange} : {keyword: string, selections: comboBoxSelection[], onSelectChange: (value: string) => void;}) {
  const [open, setOpen] = React.useState(false)
  const [label, setLabel] = React.useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {label
            ? selections.find((s) => s.label === label)?.label
            : `Select ${keyword}...`}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={`Search ${keyword}...`}/>
          <CommandList>
            <CommandEmpty>No language found.</CommandEmpty>
            <CommandGroup>
              {selections.map((s) => (
                <CommandItem
                  key={s.value}
                  value={s.value}
                  onSelect={(currentValue) => {
                    onSelectChange(s.value);
                    setLabel(currentValue === label ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {s.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      label === s.label ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
