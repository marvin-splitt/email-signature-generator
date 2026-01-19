"use client";

import { useState } from "react";
import { SignatureFormData } from "@/app/types/signature";
import { SignaturePreview } from "./SignaturePreview";
import { ImportModal } from "./ImportModal";
import {
  SunIcon,
  MoonIcon,
  CopyIcon,
  CheckIcon,
  QuestionIcon,
} from "./Icons";
import { formatBytes } from "@/app/utils/image-compressor";
import { GMAIL_SIZE_LIMIT } from "@/app/utils/signature-generator";

interface PreviewSectionProps {
  formData: SignatureFormData;
  hasContent: boolean;
  onCopy: () => Promise<void>;
  copied: boolean;
  signatureSize: number;
  isOverLimit: boolean;
}

export function PreviewSection({
  formData,
  hasContent,
  onCopy,
  copied,
  signatureSize,
  isOverLimit,
}: PreviewSectionProps) {
  const [isDarkPreview, setIsDarkPreview] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const sizePercentage = Math.min((signatureSize / GMAIL_SIZE_LIMIT) * 100, 100);

  return (
    <>
      <section className="animate-fade-up-delay-2">
        <div className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-medium text-foreground">Preview</h2>
            <button
              onClick={() => setIsDarkPreview(!isDarkPreview)}
              className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-muted transition-colors hover:bg-border hover:text-foreground"
              aria-label="Toggle preview theme"
            >
              {isDarkPreview ? <SunIcon /> : <MoonIcon />}
              <span>{isDarkPreview ? "Light" : "Dark"}</span>
            </button>
          </div>

          {/* Signature Preview */}
          <div
            className={`min-h-[180px] rounded-xl p-6 transition-colors ${
              isDarkPreview ? "bg-gray-900" : "bg-gray-50"
            }`}
          >
            {hasContent ? (
              <SignaturePreview formData={formData} isDark={isDarkPreview} />
            ) : (
              <p
                className={`text-center text-sm ${
                  isDarkPreview ? "text-gray-500" : "text-muted"
                }`}
              >
                Start typing to see your signature preview
              </p>
            )}
          </div>

          {/* Size Indicator */}
          {hasContent && (
            <div className="mt-4">
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className={isOverLimit ? "text-red-600" : "text-muted"}>
                  Signature size: {formatBytes(signatureSize)}
                </span>
                <span className="text-muted">
                  Gmail limit: {formatBytes(GMAIL_SIZE_LIMIT)}
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
                <div
                  className={`h-full rounded-full transition-all ${
                    isOverLimit
                      ? "bg-red-500"
                      : sizePercentage > 70
                        ? "bg-amber-500"
                        : "bg-green-500"
                  }`}
                  style={{ width: `${sizePercentage}%` }}
                />
              </div>
              {isOverLimit && (
                <p className="mt-2 text-xs text-red-600">
                  Signature exceeds Gmail limit. Use an image URL instead of uploading.
                </p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={onCopy}
              disabled={!hasContent}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                isOverLimit
                  ? "bg-amber-600 text-white hover:bg-amber-700"
                  : "bg-foreground text-card hover:bg-foreground/90"
              }`}
            >
              {copied ? (
                <>
                  <CheckIcon />
                  Copied!
                </>
              ) : (
                <>
                  <CopyIcon />
                  {isOverLimit ? "Copy Anyway" : "Copy Signature"}
                </>
              )}
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-border px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              <QuestionIcon />
              How to Import?
            </button>
          </div>
        </div>
      </section>

      {/* Modal */}
      {showModal && <ImportModal onClose={() => setShowModal(false)} />}
    </>
  );
}
