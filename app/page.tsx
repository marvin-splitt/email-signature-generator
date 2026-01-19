"use client";

import { useSignatureForm } from "@/app/hooks/useSignatureForm";
import { SignatureForm, PreviewSection } from "@/app/components";

export default function Home() {
  const {
    formData,
    handleInputChange,
    clearField,
    handleLogoUpload,
    handleLogoUrlChange,
    fileInputRef,
    copyToClipboard,
    copied,
    hasContent,
    isCompressing,
    signatureSize,
    isOverLimit,
  } = useSignatureForm();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-12 text-center animate-fade-up">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Email Signature Generator
          </h1>
          <p className="mt-3 text-muted">
            Create a professional email signature in seconds
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-2">
          <SignatureForm
            formData={formData}
            onInputChange={handleInputChange}
            onClearField={clearField}
            onLogoUpload={handleLogoUpload}
            onLogoUrlChange={handleLogoUrlChange}
            fileInputRef={fileInputRef}
            isCompressing={isCompressing}
          />

          <PreviewSection
            formData={formData}
            hasContent={hasContent}
            onCopy={copyToClipboard}
            copied={copied}
            signatureSize={signatureSize}
            isOverLimit={isOverLimit}
          />
        </div>
      </div>
    </div>
  );
}
