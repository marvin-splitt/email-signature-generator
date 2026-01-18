"use client";

import { XIcon } from "./Icons";

interface ImportModalProps {
  onClose: () => void;
}

const instructions = [
  {
    id: "gmail",
    name: "Gmail",
    icon: "G",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    steps: [
      'Click the gear icon → See all settings',
      'Scroll to the "Signature" section',
      '"Create new" and name your signature',
      "Paste your copied signature in the editor",
      '"Save Changes" at the bottom',
    ],
  },
  {
    id: "macos",
    name: "macOS Mail",
    icon: "✉",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    steps: [
      "Open Mail → Settings → Signatures",
      "Click the + button to create a new signature",
      "Paste your copied signature in the preview area",
      '"Always match my default message font" → uncheck',
      "Close the Settings window",
    ],
  },
  {
    id: "ios",
    name: "iOS Mail",
    icon: "📱",
    iconBg: "bg-gray-100",
    iconColor: "text-gray-600",
    steps: [
      "Go to Settings → Mail → Signature",
      "Select your email account",
      "Long press in the text field → Paste",
      "Note: HTML formatting may be limited on iOS",
    ],
  },
];

export function ImportModal({ onClose }: ImportModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-card p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-foreground">
            How to Import Your Signature
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-muted transition-colors hover:bg-border hover:text-foreground"
            aria-label="Close modal"
          >
            <XIcon />
          </button>
        </div>

        <div className="space-y-6">
          {instructions.map((instruction) => (
            <div key={instruction.id}>
              <h4 className="mb-2 flex items-center gap-2 font-medium text-foreground">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${instruction.iconBg} ${instruction.iconColor}`}
                >
                  {instruction.icon}
                </span>
                {instruction.name}
              </h4>
              <ol className="ml-8 list-decimal space-y-1 text-sm text-muted">
                {instruction.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-foreground py-3 text-sm font-medium text-card transition-colors hover:bg-foreground/90"
        >
          Got it!
        </button>
      </div>
    </div>
  );
}
