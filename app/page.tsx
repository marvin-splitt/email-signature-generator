"use client";

import { useState, useRef, useCallback } from "react";

interface FormData {
  name: string;
  title: string;
  company: string;
  website: string;
  phone: string;
  twitter: string;
  linkedin: string;
  logoUrl: string;
}

const initialFormData: FormData = {
  name: "",
  title: "",
  company: "",
  website: "",
  phone: "",
  twitter: "",
  linkedin: "",
  logoUrl: "",
};

export default function Home() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isDarkPreview, setIsDarkPreview] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const clearField = (field: keyof FormData) => {
    setFormData((prev) => ({ ...prev, [field]: "" }));
    if (field === "logoUrl" && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, logoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const generateSignatureHTML = useCallback(() => {
    const { name, title, company, website, phone, twitter, linkedin, logoUrl } = formData;
    
    const websiteUrl = website.startsWith("http") ? website : `https://${website}`;
    const twitterUrl = twitter.startsWith("http") 
      ? twitter 
      : twitter.startsWith("@") 
        ? `https://x.com/${twitter.slice(1)}` 
        : `https://x.com/${twitter}`;
    const linkedinUrl = linkedin.startsWith("http") 
      ? linkedin 
      : `https://linkedin.com/in/${linkedin}`;

    const socialLinks = [];
    if (phone) {
      socialLinks.push(`<a href="tel:${phone.replace(/\s/g, '')}" style="color: #6b7280; text-decoration: none;">${phone}</a>`);
    }
    if (twitter) {
      const twitterHandle = twitter.startsWith("@") ? twitter : `@${twitter.replace(/https?:\/\/(x|twitter)\.com\//i, '')}`;
      socialLinks.push(`<a href="${twitterUrl}" style="color: #6b7280; text-decoration: none;">${twitterHandle}</a>`);
    }
    if (linkedin) {
      const linkedinDisplay = linkedin.startsWith("http") 
        ? linkedin.replace(/https?:\/\/(www\.)?linkedin\.com\/in\//i, '') 
        : linkedin;
      socialLinks.push(`<a href="${linkedinUrl}" style="color: #6b7280; text-decoration: none;">LinkedIn: ${linkedinDisplay}</a>`);
    }

    return `<table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.5;">
  <tbody>
    ${logoUrl && website ? `<tr>
      <td style="padding-bottom: 12px;">
        <a href="${websiteUrl}" target="_blank" rel="noopener noreferrer">
          <img src="${logoUrl}" alt="${company || 'Company'} logo" style="max-width: 120px; max-height: 48px; display: block;" />
        </a>
      </td>
    </tr>` : logoUrl ? `<tr>
      <td style="padding-bottom: 12px;">
        <img src="${logoUrl}" alt="${company || 'Company'} logo" style="max-width: 120px; max-height: 48px; display: block;" />
      </td>
    </tr>` : ''}
    ${name ? `<tr>
      <td style="font-weight: 700; color: #1f2937; font-size: 15px;">${name}</td>
    </tr>` : ''}
    ${title || company ? `<tr>
      <td style="color: #6b7280; padding-top: 2px;">
        ${title}${title && company ? ' · ' : ''}${company}
      </td>
    </tr>` : ''}
    ${socialLinks.length > 0 ? `<tr>
      <td style="padding-top: 8px;">
        ${socialLinks.join(' <span style="color: #d1d5db;">•</span> ')}
      </td>
    </tr>` : ''}
  </tbody>
</table>`;
  }, [formData]);

  const copyToClipboard = async () => {
    const html = generateSignatureHTML();
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
  };

  const hasContent = Object.values(formData).some((v) => v);

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
          {/* Form Section */}
          <section className="animate-fade-up-delay-1">
            <div className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border">
              <h2 className="mb-6 text-lg font-medium text-foreground">
                Your Details
              </h2>

              <div className="space-y-4">
                <InputField
                  label="Full Name"
                  value={formData.name}
                  onChange={(v) => handleInputChange("name", v)}
                  onClear={() => clearField("name")}
                  placeholder="John Doe"
                />

                <InputField
                  label="Job Title"
                  value={formData.title}
                  onChange={(v) => handleInputChange("title", v)}
                  onClear={() => clearField("title")}
                  placeholder="Product Designer"
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <InputField
                    label="Company"
                    value={formData.company}
                    onChange={(v) => handleInputChange("company", v)}
                    onClear={() => clearField("company")}
                    placeholder="Acme Inc."
                  />
                  <InputField
                    label="Website"
                    value={formData.website}
                    onChange={(v) => handleInputChange("website", v)}
                    onClear={() => clearField("website")}
                    placeholder="acme.com"
                  />
                </div>

                <InputField
                  label="Phone"
                  value={formData.phone}
                  onChange={(v) => handleInputChange("phone", v)}
                  onClear={() => clearField("phone")}
                  placeholder="+1 (555) 123-4567"
                  type="tel"
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <InputField
                    label="Twitter / X"
                    value={formData.twitter}
                    onChange={(v) => handleInputChange("twitter", v)}
                    onClear={() => clearField("twitter")}
                    placeholder="@username"
                  />
                  <InputField
                    label="LinkedIn"
                    value={formData.linkedin}
                    onChange={(v) => handleInputChange("linkedin", v)}
                    onClear={() => clearField("linkedin")}
                    placeholder="username"
                  />
                </div>

                {/* Logo Upload */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Company Logo
                  </label>
                  <div className="relative">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      id="logo-upload"
                    />
                    <label
                      htmlFor="logo-upload"
                      className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-background px-4 py-3 text-sm text-muted transition-colors hover:border-accent hover:text-foreground"
                    >
                      {formData.logoUrl ? (
                        <span className="text-foreground">Logo uploaded ✓</span>
                      ) : (
                        <>
                          <UploadIcon />
                          <span>Upload logo</span>
                        </>
                      )}
                    </label>
                    {formData.logoUrl && (
                      <button
                        onClick={() => clearField("logoUrl")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted transition-colors hover:bg-border hover:text-foreground"
                        aria-label="Clear logo"
                      >
                        <XIcon />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Preview Section */}
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
                  onClick={copyToClipboard}
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
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <ImportModal onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}

// Input Field Component
function InputField({
  label,
  value,
  onChange,
  onClear,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder: string;
  type?: string;
}) {
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

// Signature Preview Component
function SignaturePreview({
  formData,
  isDark,
}: {
  formData: FormData;
  isDark: boolean;
}) {
  const { name, title, company, website, phone, twitter, linkedin, logoUrl } = formData;
  
  const websiteUrl = website.startsWith("http") ? website : `https://${website}`;
  const twitterUrl = twitter.startsWith("http") 
    ? twitter 
    : twitter.startsWith("@") 
      ? `https://x.com/${twitter.slice(1)}` 
      : `https://x.com/${twitter}`;
  const linkedinUrl = linkedin.startsWith("http") 
    ? linkedin 
    : `https://linkedin.com/in/${linkedin}`;

  const twitterHandle = twitter.startsWith("@") 
    ? twitter 
    : twitter 
      ? `@${twitter.replace(/https?:\/\/(x|twitter)\.com\//i, '')}` 
      : '';
  
  const linkedinDisplay = linkedin.startsWith("http") 
    ? linkedin.replace(/https?:\/\/(www\.)?linkedin\.com\/in\//i, '') 
    : linkedin;

  const textColor = isDark ? "#f3f4f6" : "#1f2937";
  const mutedColor = isDark ? "#9ca3af" : "#6b7280";
  const bulletColor = isDark ? "#4b5563" : "#d1d5db";

  const socialItems = [];
  if (phone) {
    socialItems.push(
      <a
        key="phone"
        href={`tel:${phone.replace(/\s/g, "")}`}
        style={{ color: mutedColor, textDecoration: "none" }}
      >
        {phone}
      </a>
    );
  }
  if (twitter) {
    socialItems.push(
      <a
        key="twitter"
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: mutedColor, textDecoration: "none" }}
      >
        {twitterHandle}
      </a>
    );
  }
  if (linkedin) {
    socialItems.push(
      <a
        key="linkedin"
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: mutedColor, textDecoration: "none" }}
      >
        LinkedIn: {linkedinDisplay}
      </a>
    );
  }

  return (
    <table
      cellPadding={0}
      cellSpacing={0}
      style={{ fontFamily: "Arial, sans-serif", fontSize: "14px", lineHeight: 1.5 }}
    >
      <tbody>
        {logoUrl && (
          <tr>
            <td style={{ paddingBottom: "12px" }}>
              {website ? (
                <a href={websiteUrl} target="_blank" rel="noopener noreferrer">
                  <img
                    src={logoUrl}
                    alt={`${company || "Company"} logo`}
                    style={{ maxWidth: "120px", maxHeight: "48px", display: "block" }}
                  />
                </a>
              ) : (
                <img
                  src={logoUrl}
                  alt={`${company || "Company"} logo`}
                  style={{ maxWidth: "120px", maxHeight: "48px", display: "block" }}
                />
              )}
            </td>
          </tr>
        )}
        {name && (
          <tr>
            <td style={{ fontWeight: 700, color: textColor, fontSize: "15px" }}>
              {name}
            </td>
          </tr>
        )}
        {(title || company) && (
          <tr>
            <td style={{ color: mutedColor, paddingTop: "2px" }}>
              {title}
              {title && company && " · "}
              {company}
            </td>
          </tr>
        )}
        {socialItems.length > 0 && (
          <tr>
            <td style={{ paddingTop: "8px" }}>
              {socialItems.map((item, index) => (
                <span key={index}>
                  {item}
                  {index < socialItems.length - 1 && (
                    <span style={{ color: bulletColor }}> • </span>
                  )}
                </span>
              ))}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

// Import Modal Component
function ImportModal({ onClose }: { onClose: () => void }) {
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
          {/* Gmail */}
          <div>
            <h4 className="mb-2 flex items-center gap-2 font-medium text-foreground">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-xs text-red-600">
                G
              </span>
              Gmail
            </h4>
            <ol className="ml-8 list-decimal space-y-1 text-sm text-muted">
              <li>Click the gear icon → See all settings</li>
              <li>Scroll to the &quot;Signature&quot; section</li>
              <li>Click &quot;Create new&quot; and name your signature</li>
              <li>Paste your copied signature in the editor</li>
              <li>Click &quot;Save Changes&quot; at the bottom</li>
            </ol>
          </div>

          {/* macOS Mail */}
          <div>
            <h4 className="mb-2 flex items-center gap-2 font-medium text-foreground">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs text-blue-600">
                ✉
              </span>
              macOS Mail
            </h4>
            <ol className="ml-8 list-decimal space-y-1 text-sm text-muted">
              <li>Open Mail → Settings → Signatures</li>
              <li>Click the + button to create a new signature</li>
              <li>Paste your copied signature in the preview area</li>
              <li>Uncheck &quot;Always match my default message font&quot;</li>
              <li>Close the Settings window</li>
            </ol>
          </div>

          {/* iOS Mail */}
          <div>
            <h4 className="mb-2 flex items-center gap-2 font-medium text-foreground">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs text-gray-600">
                📱
              </span>
              iOS Mail
            </h4>
            <ol className="ml-8 list-decimal space-y-1 text-sm text-muted">
              <li>Go to Settings → Mail → Signature</li>
              <li>Select your email account</li>
              <li>Long press in the text field → Paste</li>
              <li>Note: HTML formatting may be limited on iOS</li>
            </ol>
          </div>
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

// Icons
function XIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function QuestionIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </svg>
  );
}
