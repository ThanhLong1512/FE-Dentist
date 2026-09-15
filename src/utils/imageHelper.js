import { API_ROOT } from "./constants";

export const PLACEHOLDER_SERVICE_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect fill='%23f1f5f9' width='400' height='300'/%3E%3Ctext fill='%2394a3b8' font-family='sans-serif' font-size='18' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ED%E1%BB%8Bch v%E1%BB%A5%3C/text%3E%3C/svg%3E";

export const DEFAULT_AVATAR_IMG = "/images/resource/avatar-1.jpg";

/**
 * Normalizes an image URL from backend/local storage.
 *
 * @param {string|Object} imageSource - URL string or object like { url: "..." }
 * @param {string} [fallback=PLACEHOLDER_SERVICE_IMG]
 * @returns {string} Fully qualified or local image URL
 */
export const getImageUrl = (imageSource, fallback = PLACEHOLDER_SERVICE_IMG) => {
  const url = typeof imageSource === "object" ? imageSource?.url : imageSource;

  if (!url || typeof url !== "string" || !url.trim()) {
    return fallback;
  }

  const trimmed = url.trim();


  // Already an absolute URL or data URI
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:")
  ) {
    return trimmed;
  }

  const base = (API_ROOT || "http://localhost:8080").replace(/\/+$/, "");

  // Relative upload URL
  if (trimmed.startsWith("/uploads/") || trimmed.startsWith("uploads/")) {
    const cleanUploadPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
    return `${base}${cleanUploadPath}`;
  }

  // Static FE images like /images/...
  if (trimmed.startsWith("/")) {
    return trimmed;
  }

  return `${base}/${trimmed}`;
};

/**
 * Safe onError handler for <img> tags to avoid broken icons and infinite loops.
 *
 * @param {Event} event
 * @param {string} [fallback=PLACEHOLDER_SERVICE_IMG]
 */
export const handleImageError = (event, fallback = PLACEHOLDER_SERVICE_IMG) => {
  if (event?.currentTarget) {
    event.currentTarget.onerror = null;
    event.currentTarget.src = fallback;
  }
};
