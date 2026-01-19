/**
 * Image compression utility for email signatures
 * Compresses and resizes images to reduce signature size for Gmail compatibility
 */

const MAX_WIDTH = 200;
const MAX_HEIGHT = 80;
const JPEG_QUALITY = 0.7;
const PNG_QUALITY = 0.8;

/**
 * Compresses an image file and returns a smaller base64 data URL
 */
export async function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      reject(new Error("Could not get canvas context"));
      return;
    }

    img.onload = () => {
      // Calculate new dimensions maintaining aspect ratio
      let { width, height } = img;
      
      if (width > MAX_WIDTH) {
        height = (height * MAX_WIDTH) / width;
        width = MAX_WIDTH;
      }
      
      if (height > MAX_HEIGHT) {
        width = (width * MAX_HEIGHT) / height;
        height = MAX_HEIGHT;
      }

      canvas.width = width;
      canvas.height = height;

      // Check if image has transparency (PNG/GIF)
      const hasTransparency = file.type === "image/png" || file.type === "image/gif";

      if (!hasTransparency) {
        // Fill white background for JPEG
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, width, height);
      }

      // Draw resized image
      ctx.drawImage(img, 0, 0, width, height);

      // Export as appropriate format
      let dataUrl: string;
      if (hasTransparency) {
        // Keep PNG for transparency but compress
        dataUrl = canvas.toDataURL("image/png", PNG_QUALITY);
      } else {
        // Use JPEG for better compression
        dataUrl = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
      }

      resolve(dataUrl);
    };

    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };

    // Load the image from file
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Validates if a URL is a valid image URL
 */
export function isValidImageUrl(url: string): boolean {
  if (!url) return false;
  
  // Check for common image extensions or data URLs
  const imagePattern = /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i;
  const dataUrlPattern = /^data:image\//i;
  const httpPattern = /^https?:\/\//i;
  
  return dataUrlPattern.test(url) || (httpPattern.test(url) && (imagePattern.test(url) || url.includes("logo") || url.includes("image")));
}

/**
 * Estimates the size of a base64 data URL in bytes
 */
export function getBase64Size(dataUrl: string): number {
  if (!dataUrl) return 0;
  
  // Remove the data URL prefix to get just the base64 content
  const base64 = dataUrl.split(",")[1] || dataUrl;
  
  // Base64 encodes 3 bytes into 4 characters
  // Account for padding
  const padding = (base64.match(/=/g) || []).length;
  return Math.floor((base64.length * 3) / 4) - padding;
}

/**
 * Formats bytes into a human-readable string
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  
  const k = 1024;
  const sizes = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Checks if a data URL is a base64 encoded image
 */
export function isBase64Image(url: string): boolean {
  return url.startsWith("data:image/");
}
