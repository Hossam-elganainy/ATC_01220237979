// API URLs
export const API_BASE_URL = 'https://api.taheleya.sa';

// API Endpoints
export const API_ENDPOINTS = {
    // Auth
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    
    // Events
    EVENTS: `${API_BASE_URL}/events`,
    EVENT_DETAILS: (id) => `${API_BASE_URL}/events/${id}`,
    
    // Reservations
    RESERVATIONS: `${API_BASE_URL}/reservations`,
    RESERVATION_DETAILS: (id) => `${API_BASE_URL}/reservations/${id}`,
    
    // Reports
    REPORTS: `${API_BASE_URL}/reports`,
    
    // User Information
    USER_PROFILE: `${API_BASE_URL}/user/profile`,
    UPDATE_PROFILE: `${API_BASE_URL}/user/profile/update`,
};

// Other Constants
export const APP_CONFIG = {
    APP_NAME: 'تأهيلية',
    PAGINATION_LIMIT: 10,
    DEFAULT_LANGUAGE: 'ar',
    SUPPORTED_LANGUAGES: ['ar', 'en'],
};

// Helper function to construct API URLs
export const getApiUrl = (endpoint) => {
    return `${API_BASE_URL}${endpoint}`;
};

// Axios default config
export const AXIOS_CONFIG = {
    baseURL: API_BASE_URL,
    timeout: 15000, // 15 seconds
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
}; 