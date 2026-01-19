"use client";

import { useState, useRef, useCallback } from "react";
import { SignatureFormData, initialFormData } from "@/app/types/signature";
import { generateSignatureHTML, getSignatureSize, GMAIL_SIZE_LIMIT } from "@/app/utils/signature-generator";
import { compressImage } from "@/app/utils/image-compressor";

export function useSignatureForm() {
  const [formData, setFormData] = useState<SignatureFormData>(initialFormData);
  const [copied, setCopied] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
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

  const handleLogoUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsCompressing(true);
      try {
        // Compress the image before storing
        const compressedDataUrl = await compressImage(file);
        setFormData((prev) => ({ ...prev, logoUrl: compressedDataUrl }));
      } catch (error) {
        console.error("Failed to compress image:", error);
        // Fallback to original file if compression fails
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData((prev) => ({ ...prev, logoUrl: reader.result as string }));
        };
        reader.readAsDataURL(file);
      } finally {
        setIsCompressing(false);
      }
    }
  }, []);

  const handleLogoUrlChange = useCallback((url: string) => {
    setFormData((prev) => ({ ...prev, logoUrl: url }));
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
  
  // Calculate signature size for Gmail compatibility warning
  const signatureSize = getSignatureSize(formData);
  const isOverLimit = signatureSize > GMAIL_SIZE_LIMIT;

  return {
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
  };
}
