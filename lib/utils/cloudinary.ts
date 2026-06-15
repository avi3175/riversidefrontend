/**
 * Extract Cloudinary public_id from URL
 * Example URL: https://res.cloudinary.com/dkcnwjvn0/image/upload/v1234567890/sample.jpg
 * Returns: sample
 */
export const extractPublicIdFromUrl = (url: string): string | null => {
  if (!url || !url.includes('cloudinary.com')) return null;
  
  try {
    // Split by '/upload/'
    const parts = url.split('/upload/');
    if (parts.length < 2) return null;
    
    // Get the part after '/upload/'
    let publicIdWithVersion = parts[1];
    
    // Remove version number (v1234567890/) if present
    if (publicIdWithVersion.startsWith('v')) {
      const versionParts = publicIdWithVersion.split('/');
      versionParts.shift(); // Remove the version part
      publicIdWithVersion = versionParts.join('/');
    }
    
    // Remove file extension (last dot and everything after)
    const lastDotIndex = publicIdWithVersion.lastIndexOf('.');
    if (lastDotIndex !== -1) {
      publicIdWithVersion = publicIdWithVersion.substring(0, lastDotIndex);
    }
    
    return publicIdWithVersion;
  } catch (error) {
    console.error('Failed to extract public_id:', error);
    return null;
  }
};