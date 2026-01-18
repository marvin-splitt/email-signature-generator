"use client";

import { SignatureFormData } from "@/app/types/signature";
import {
  formatUrl,
  formatTwitterUrl,
  formatLinkedInUrl,
  getTwitterHandle,
  getLinkedInDisplay,
} from "@/app/utils/signature-generator";

interface SignaturePreviewProps {
  formData: SignatureFormData;
  isDark: boolean;
}

export function SignaturePreview({ formData, isDark }: SignaturePreviewProps) {
  const { name, title, company, website, phone, twitter, linkedin, logoUrl } = formData;

  const websiteUrl = formatUrl(website);
  const twitterUrl = formatTwitterUrl(twitter);
  const linkedinUrl = formatLinkedInUrl(linkedin);
  const twitterHandle = getTwitterHandle(twitter);
  const linkedinDisplay = getLinkedInDisplay(linkedin);

  const textColor = isDark ? "#f3f4f6" : "#1f2937";
  const mutedColor = isDark ? "#9ca3af" : "#6b7280";
  const bulletColor = isDark ? "#4b5563" : "#d1d5db";

  const socialItems: React.ReactNode[] = [];
  
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
                    <span style={{ color: bulletColor }}> &bull; </span>
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
