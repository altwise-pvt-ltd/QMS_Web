/**
 * Resolves an image URL by checking for existing prefixes and prepending the API base path if necessary.
 * 
 * @param {string} path - The image path or URL to resolve.
 * @returns {string|null} The resolved image URL or null if no path is provided.
 */
export const resolveImageUrl = (path) => {
  if (!path) return null;

  // If it's already a full URL or a data URI, return it as-is
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("data:") ||
    path.startsWith("/api/")
  ) {
    return path;
  }

  // Prepend /api/ for relative paths (Vite proxy handles this)
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `/api/${cleanPath}`;
};

export default resolveImageUrl;
