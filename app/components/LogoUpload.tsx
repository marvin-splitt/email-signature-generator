"use client";

import { useState, RefObject } from "react";
import { UploadIcon, XIcon, LinkIcon } from "./Icons";
import { getBase64Size, formatBytes, isBase64Image } from "@/app/utils/image-compressor";

interface LogoUploadProps {
  logoUrl: string;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUrlChange: (url: string) => void;
  onClear: () => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
}

export function LogoUpload({
  logoUrl,
  onUpload,
  onUrlChange,
  onClear,
  fileInputRef,
}: LogoUploadProps) {
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [urlInput, setUrlInput] = useState("");

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onUrlChange(urlInput.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleUrlSubmit();
    }
  };

  const switchMode = (newMode: "upload" | "url") => {
    setMode(newMode);
    if (logoUrl) {
      onClear();
    }
    setUrlInput("");
  };

  // Calculate size if it's a base64 image
  const imageSize = isBase64Image(logoUrl) ? getBase64Size(logoUrl) : 0;
  const sizeWarning = imageSize > 5000;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="block text-sm font-medium text-foreground">
          Company Logo
        </label>
        <div className="flex gap-1 text-xs">
          <button
            type="button"
            onClick={() => switchMode("upload")}
            className={`rounded px-2 py-1 transition-colors ${
              mode === "upload"
                ? "bg-foreground text-card"
                : "text-muted hover:text-foreground"
            }`}
          >
            Upload
          </button>
          <button
            type="button"
            onClick={() => switchMode("url")}
            className={`rounded px-2 py-1 transition-colors ${
              mode === "url"
                ? "bg-foreground text-card"
                : "text-muted hover:text-foreground"
            }`}
          >
            URL
          </button>
        </div>
      </div>

      {mode === "upload" ? (
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
            {logoUrl && isBase64Image(logoUrl) ? (
              <div className="flex items-center gap-2">
                <span className="text-foreground">Logo uploaded</span>
                <span className={`text-xs ${sizeWarning ? "text-amber-600" : "text-muted"}`}>
                  ({formatBytes(imageSize)})
                </span>
              </div>
            ) : (
              <>
                <UploadIcon />
                <span>Upload logo (auto-compressed)</span>
              </>
            )}
          </label>
          {logoUrl && (
            <button
              type="button"
              onClick={onClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted transition-colors hover:bg-border hover:text-foreground"
              aria-label="Clear logo"
            >
              <XIcon />
            </button>
          )}
        </div>
      ) : (
        <div className="relative">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="url"
                value={logoUrl && !isBase64Image(logoUrl) ? logoUrl : urlInput}
                onChange={(e) => {
                  setUrlInput(e.target.value);
                  if (logoUrl && !isBase64Image(logoUrl)) {
                    onUrlChange(e.target.value);
                  }
                }}
                onBlur={handleUrlSubmit}
                onKeyDown={handleKeyDown}
                placeholder="https://example.com/logo.png"
                className="w-full rounded-xl border-0 bg-background px-4 py-3 pr-10 text-sm text-foreground ring-1 ring-border placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent"
              />
              {(logoUrl || urlInput) && (
                <button
                  type="button"
                  onClick={() => {
                    setUrlInput("");
                    onClear();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted transition-colors hover:bg-border hover:text-foreground"
                  aria-label="Clear URL"
                >
                  <XIcon />
                </button>
              )}
            </div>
          </div>
          <p className="mt-1.5 text-xs text-muted">
            <LinkIcon size={12} className="mr-1 inline" />
            Use an externally hosted image URL for smaller signatures
          </p>
        </div>
      )}

      {sizeWarning && isBase64Image(logoUrl) && (
        <p className="mt-2 text-xs text-amber-600">
          Large image may cause issues in Gmail. Consider using a URL instead.
        </p>
      )}
    </div>
  );
}
