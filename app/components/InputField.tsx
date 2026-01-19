"use client";

import { XIcon } from "./Icons";

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder: string;
  type?: string;
}

export function InputField({
  label,
  value,
  onChange,
  onClear,
  placeholder,
  type = "text",
}: InputFieldProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border-0 bg-background px-4 py-3 text-sm text-foreground ring-1 ring-border placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent"
        />
        {value && (
          <button
            onClick={onClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted transition-colors hover:bg-border hover:text-foreground"
            aria-label={`Clear ${label}`}
          >
            <XIcon />
          </button>
        )}
      </div>
    </div>
  );
}
