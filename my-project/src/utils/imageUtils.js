import { host } from '../redux/api';

/**
 * Ensures an image path is a full URL.
 * If it's a relative path (e.g., starting with /uploads), it prefixes it with the backend host.
 * @param {string} path - The image path or URL
 * @returns {string} - The full image URL
 */
export const getFullImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/600x600?text=No+Image";
    if (path.startsWith('http')) return path;

    // Remove leading slash if host has trailing slash or vice versa to avoid double slashes
    const baseUrl = host.endsWith('/') ? host.slice(0, -1) : host;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    return `${baseUrl}${cleanPath}`;
};
