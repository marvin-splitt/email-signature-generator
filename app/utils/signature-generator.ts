import { SignatureFormData } from "@/app/types/signature";

/**
 * Formats a URL to ensure it has a protocol
 */
export function formatUrl(url: string): string {
  if (!url) return "";
  return url.startsWith("http") ? url : `https://${url}`;
}

/**
 * Formats a Twitter/X URL from various input formats
 */
export function formatTwitterUrl(twitter: string): string {
  if (!twitter) return "";
  if (twitter.startsWith("http")) return twitter;
  const handle = twitter.startsWith("@") ? twitter.slice(1) : twitter;
  return `https://x.com/${handle}`;
}

/**
 * Formats a LinkedIn URL from various input formats
 */
export function formatLinkedInUrl(linkedin: string): string {
  if (!linkedin) return "";
  if (linkedin.startsWith("http")) return linkedin;
  return `https://linkedin.com/in/${linkedin}`;
}

/**
 * Extracts the Twitter handle from various input formats
 */
export function getTwitterHandle(twitter: string): string {
  if (!twitter) return "";
  if (twitter.startsWith("@")) return twitter;
  return `@${twitter.replace(/https?:\/\/(x|twitter)\.com\//i, "")}`;
}

/**
 * Extracts the LinkedIn username from various input formats
 */
export function getLinkedInDisplay(linkedin: string): string {
  if (!linkedin) return "";
  return linkedin.replace(/https?:\/\/(www\.)?linkedin\.com\/in\//i, "");
}

/**
 * Generates compact HTML signature with inline styles for email compatibility
 * Optimized to reduce size while maintaining appearance
 */
export function generateSignatureHTML(formData: SignatureFormData): string {
  const { name, title, company, website, phone, twitter, linkedin, logoUrl } = formData;

  const websiteUrl = formatUrl(website);
  const twitterUrl = formatTwitterUrl(twitter);
  const linkedinUrl = formatLinkedInUrl(linkedin);

  // Build social links with minimal HTML
  const socialParts: string[] = [];
  
  if (phone) {
    socialParts.push(`<a href="tel:${phone.replace(/\s/g, "")}" style="color:#6b7280;text-decoration:none">${phone}</a>`);
  }
  
  if (twitter) {
    socialParts.push(`<a href="${twitterUrl}" style="color:#6b7280;text-decoration:none">${getTwitterHandle(twitter)}</a>`);
  }
  
  if (linkedin) {
    socialParts.push(`<a href="${linkedinUrl}" style="color:#6b7280;text-decoration:none">${getLinkedInDisplay(linkedin)}</a>`);
  }

  // Build rows array - only include non-empty rows
  const rows: string[] = [];

  // Logo row
  if (logoUrl) {
    const imgTag = `<img src="${logoUrl}" alt="${company || "Logo"}" style="max-width:120px;max-height:48px;display:block">`;
    if (website) {
      rows.push(`<tr><td style="padding-bottom:12px"><a href="${websiteUrl}" target="_blank">${imgTag}</a></td></tr>`);
    } else {
      rows.push(`<tr><td style="padding-bottom:12px">${imgTag}</td></tr>`);
    }
  }

  // Name row
  if (name) {
    rows.push(`<tr><td style="font-weight:700;color:#1f2937;font-size:15px">${name}</td></tr>`);
  }

  // Title/Company row
  if (title || company) {
    const content = title && company ? `${title} · ${company}` : title || company;
    rows.push(`<tr><td style="color:#6b7280;padding-top:2px">${content}</td></tr>`);
  }

  // Social row
  if (socialParts.length > 0) {
    rows.push(`<tr><td style="padding-top:8px">${socialParts.join(' <span style="color:#d1d5db">•</span> ')}</td></tr>`);
  }

  // Generate minimal table HTML
  return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,sans-serif;font-size:14px;line-height:1.5"><tbody>${rows.join("")}</tbody></table>`;
}

/**
 * Calculates the size of the generated signature HTML in bytes
 */
export function getSignatureSize(formData: SignatureFormData): number {
  const html = generateSignatureHTML(formData);
  return new Blob([html]).size;
}

/**
 * Gmail's approximate signature size limit in bytes
 */
export const GMAIL_SIZE_LIMIT = 10000;
