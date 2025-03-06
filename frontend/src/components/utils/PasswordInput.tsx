"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
  id: string;
  name: string;
  placeholder?: string;
  value?: string;
  required?: boolean;
  disabled?: boolean;
  parentClassName?: string;
  inputClassName?: string;
  eyeClassName?: string;
  handleUpdate?: (val: string) => void;
}

export const PasswordInput = ({
  id,
  name,
  placeholder,
  required = false,
  disabled = false,
  parentClassName,
  inputClassName,
  eyeClassName,
  handleUpdate,
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={parentClassName}>
      <Input
        id={id}
        name={name}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder || ""}
        required={required}
        disabled={disabled}
        className={inputClassName}
        onChange={(e) => {
          if (!handleUpdate) return;
          handleUpdate(e.target.value);
        }}
      />
      <div
        className={`${eyeClassName} cursor-pointer`}
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? (
          <Eye className="h-4 w-4 text-muted-foreground" />
        ) : (
          <EyeOff className="h-4 w-4 text-muted-foreground" />
        )}
      </div>
    </div>
  );
};
