const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

/**
 * Resolves any image URL returned by the backend to a fully-qualified URL.
 * Handles both /uploads/filename and absolute URL forms.
 */
export const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    if (url.startsWith('/uploads/')) return `${BASE_URL}${url}`;
    return `${BASE_URL}/uploads/${url}`;
};

/**
 * Fallback placeholder — a neutral grey rectangle, no external request.
 */
export const FOOD_PLACEHOLDER =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 3'%3E%3Crect width='4' height='3' fill='%23f1f5f9'/%3E%3C/svg%3E";

/**
 * Returns a UI-avatar URL as a user avatar fallback.
 */
export const getAvatarFallback = (name) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name || '?')}&background=FF7F50&color=fff&size=64`;
