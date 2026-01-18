"use client";

import { RefObject } from "react";
import { SignatureFormData } from "@/app/types/signature";
import { InputField } from "./InputField";
import { LogoUpload } from "./LogoUpload";

interface SignatureFormProps {
  formData: SignatureFormData;
  onInputChange: (field: keyof SignatureFormData, value: string) => void;
  onClearField: (field: keyof SignatureFormData) => void;
  onLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
}

export function SignatureForm({
  formData,
  onInputChange,
  onClearField,
  onLogoUpload,
  fileInputRef,
}: SignatureFormProps) {
  return (
    <section className="animate-fade-up-delay-1">
      <div className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border">
        <h2 className="mb-6 text-lg font-medium text-foreground">
          Your Details
        </h2>

        <div className="space-y-4">
          <InputField
            label="Full Name"
            value={formData.name}
            onChange={(v) => onInputChange("name", v)}
            onClear={() => onClearField("name")}
            placeholder="John Doe"
          />

          <InputField
            label="Job Title"
            value={formData.title}
            onChange={(v) => onInputChange("title", v)}
            onClear={() => onClearField("title")}
            placeholder="Product Designer"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <InputField
              label="Company"
              value={formData.company}
              onChange={(v) => onInputChange("company", v)}
              onClear={() => onClearField("company")}
              placeholder="Acme Inc."
            />
            <InputField
              label="Website"
              value={formData.website}
              onChange={(v) => onInputChange("website", v)}
              onClear={() => onClearField("website")}
              placeholder="acme.com"
            />
          </div>

          <InputField
            label="Phone"
            value={formData.phone}
            onChange={(v) => onInputChange("phone", v)}
            onClear={() => onClearField("phone")}
            placeholder="+1 (555) 123-4567"
            type="tel"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <InputField
              label="Twitter / X"
              value={formData.twitter}
              onChange={(v) => onInputChange("twitter", v)}
              onClear={() => onClearField("twitter")}
              placeholder="@username"
            />
            <InputField
              label="LinkedIn"
              value={formData.linkedin}
              onChange={(v) => onInputChange("linkedin", v)}
              onClear={() => onClearField("linkedin")}
              placeholder="username"
            />
          </div>

          <LogoUpload
            logoUrl={formData.logoUrl}
            onUpload={onLogoUpload}
            onClear={() => onClearField("logoUrl")}
            fileInputRef={fileInputRef}
          />
        </div>
      </div>
    </section>
  );
}
