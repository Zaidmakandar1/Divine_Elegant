// API utility functions
const getApiUrl = () => {
  return import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/api` : 'http://localhost:5000/api';
};

const getBaseUrl = () => {
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
};

// Helper function to resolve image URLs correctly
const resolveImageUrl = (url) => {
  if (!url) return url;
  
  // If it's already a full URL (http/https), return as is
  if (/^https?:\/\//i.test(url)) return url;
  
  // If it's a relative path starting with /, prepend the base URL
  if (url.startsWith('/')) {
    return `${getBaseUrl()}${url}`;
  }
  
  // If it's a relative path without /, add it
  return `${getBaseUrl()}/${url}`;
};

export { getApiUrl, getBaseUrl, resolveImageUrl };
