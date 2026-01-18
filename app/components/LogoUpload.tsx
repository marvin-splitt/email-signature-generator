"use client";

import { RefObject } from "react";
import { UploadIcon, XIcon } from "./Icons";

interface LogoUploadProps {
  logoUrl: string;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
}

export function LogoUpload({
  logoUrl,
  onUpload,
  onClear,
  fileInputRef,
}: LogoUploadProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-foreground">
        Company Logo
      </label>
      <div className="relative">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onUpload}
          className="hidden"
          id="logo-upload"
        />
        <label
          htmlFor="logo-upload"
          className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-background px-4 py-3 text-sm text-muted transition-colors hover:border-accent hover:text-foreground"
        >
          {logoUrl ? (
            <span className="text-foreground">Logo uploaded &#10003;</span>
          ) : (
            <>
              <UploadIcon />
              <span>Upload logo</span>
            </>
          )}
        </label>
        {logoUrl && (
          <button
            onClick={onClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted transition-colors hover:bg-border hover:text-foreground"
            aria-label="Clear logo"
          >
            <XIcon />
          </button>
        )}
      </div>
    </div>
  );
}
