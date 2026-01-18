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

interface PreviewSectionProps {
  formData: SignatureFormData;
  hasContent: boolean;
  onCopy: () => Promise<void>;
  copied: boolean;
}

export function PreviewSection({
  formData,
  hasContent,
  onCopy,
  copied,
}: PreviewSectionProps) {
  const [isDarkPreview, setIsDarkPreview] = useState(false);
  const [showModal, setShowModal] = useState(false);

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

          {/* Actions */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={onCopy}
              disabled={!hasContent}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-3 text-sm font-medium text-card transition-colors hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {copied ? (
                <>
                  <CheckIcon />
                  Copied!
                </>
              ) : (
                <>
                  <CopyIcon />
                  Copy Signature
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
