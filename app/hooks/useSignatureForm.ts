"use client";

import { useState, useRef, useCallback } from "react";
import { SignatureFormData, initialFormData } from "@/app/types/signature";
import { generateSignatureHTML } from "@/app/utils/signature-generator";

export function useSignatureForm() {
  const [formData, setFormData] = useState<SignatureFormData>(initialFormData);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = useCallback((field: keyof SignatureFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const clearField = useCallback((field: keyof SignatureFormData) => {
    setFormData((prev) => ({ ...prev, [field]: "" }));
    if (field === "logoUrl" && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleLogoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, logoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const getSignatureHTML = useCallback(() => {
    return generateSignatureHTML(formData);
  }, [formData]);

  const copyToClipboard = useCallback(async () => {
    const html = getSignatureHTML();
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([html], { type: "text/plain" }),
        }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers that don't support ClipboardItem
      await navigator.clipboard.writeText(html);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [getSignatureHTML]);

  const hasContent = Object.values(formData).some((v) => v);

  return {
    formData,
    handleInputChange,
    clearField,
    handleLogoUpload,
    fileInputRef,
    copyToClipboard,
    copied,
    hasContent,
  };
}
