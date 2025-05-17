// API Base URL
export const API_BASE_URL = 'https://areeb.cowdly.com';

// API Endpoints
export const API_ROUTES = {
    // Events
    EVENTS: '/en/api/events/',
    EVENT_DETAILS: (id) => `/en/api/events/${id}/`,
    
    // Reservations
    RESERVATIONS: '/en/api/reservations',
    CANCEL_RESERVATION: (id) => `/en/api/reservations/${id}/cancel`,
    
    // Auth
    LOGIN: '/en/api/users/login',
    REGISTER: '/en/api/users/register',
    USER_PROFILE: '/en/api/users/user_profile',
    PASSWORD_RESET: '/en/api/users/password_reset',
    
    // Reports
    REPORTS: '/en/api/reports',
    RATINGS: '/en/api/ratings',
    
    // Branches
    BRANCHES: '/en/api/branches',
    
    // Payments
    CARD_PAYMENT: '/en/api/payments/request-card-payment'
};

// Helper function to construct full API URLs
export const getApiUrl = (endpoint) => {
    return `${API_BASE_URL}${endpoint}`;
};

// Default headers for API requests
export const DEFAULT_HEADERS = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Cross-Origin-Opener-Policy': 'same-origin'
};

// Helper function to get auth headers
export const getAuthHeaders = (token) => ({
    ...DEFAULT_HEADERS,
    'Authorization': `Token ${token}`
}); 