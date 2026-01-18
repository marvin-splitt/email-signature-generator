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
 * Generates pure HTML signature with inline styles for email compatibility
 */
export function generateSignatureHTML(formData: SignatureFormData): string {
  const { name, title, company, website, phone, twitter, linkedin, logoUrl } = formData;

  const websiteUrl = formatUrl(website);
  const twitterUrl = formatTwitterUrl(twitter);
  const linkedinUrl = formatLinkedInUrl(linkedin);

  const socialLinks: string[] = [];
  
  if (phone) {
    socialLinks.push(
      `<a href="tel:${phone.replace(/\s/g, "")}" style="color: #6b7280; text-decoration: none;">${phone}</a>`
    );
  }
  
  if (twitter) {
    socialLinks.push(
      `<a href="${twitterUrl}" style="color: #6b7280; text-decoration: none;">${getTwitterHandle(twitter)}</a>`
    );
  }
  
  if (linkedin) {
    socialLinks.push(
      `<a href="${linkedinUrl}" style="color: #6b7280; text-decoration: none;">LinkedIn: ${getLinkedInDisplay(linkedin)}</a>`
    );
  }

  const logoRow = logoUrl
    ? website
      ? `<tr>
      <td style="padding-bottom: 12px;">
        <a href="${websiteUrl}" target="_blank" rel="noopener noreferrer">
          <img src="${logoUrl}" alt="${company || "Company"} logo" style="max-width: 120px; max-height: 48px; display: block;" />
        </a>
      </td>
    </tr>`
      : `<tr>
      <td style="padding-bottom: 12px;">
        <img src="${logoUrl}" alt="${company || "Company"} logo" style="max-width: 120px; max-height: 48px; display: block;" />
      </td>
    </tr>`
    : "";

  const nameRow = name
    ? `<tr>
      <td style="font-weight: 700; color: #1f2937; font-size: 15px;">${name}</td>
    </tr>`
    : "";

  const titleCompanyRow =
    title || company
      ? `<tr>
      <td style="color: #6b7280; padding-top: 2px;">
        ${title}${title && company ? " · " : ""}${company}
      </td>
    </tr>`
      : "";

  const socialRow =
    socialLinks.length > 0
      ? `<tr>
      <td style="padding-top: 8px;">
        ${socialLinks.join(' <span style="color: #d1d5db;">•</span> ')}
      </td>
    </tr>`
      : "";

  return `<table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.5;">
  <tbody>
    ${logoRow}
    ${nameRow}
    ${titleCompanyRow}
    ${socialRow}
  </tbody>
</table>`;
}
