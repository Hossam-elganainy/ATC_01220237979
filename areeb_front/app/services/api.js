import axios from 'axios';
import { AXIOS_CONFIG, API_ENDPOINTS } from '../config/constants';

// Create axios instance with default config
const api = axios.create(AXIOS_CONFIG);

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // Get token from localStorage or wherever you store it
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// API methods
export const apiService = {
    // Auth
    login: (data) => api.post(API_ENDPOINTS.LOGIN, data),
    register: (data) => api.post(API_ENDPOINTS.REGISTER, data),

    // Events
    getEvents: () => api.get(API_ENDPOINTS.EVENTS),
    getEventById: (id) => api.get(API_ENDPOINTS.EVENT_DETAILS(id)),
    createEvent: (data) => api.post(API_ENDPOINTS.EVENTS, data),
    updateEvent: (id, data) => api.put(API_ENDPOINTS.EVENT_DETAILS(id), data),
    deleteEvent: (id) => api.delete(API_ENDPOINTS.EVENT_DETAILS(id)),

    // Reservations
    getReservations: () => api.get(API_ENDPOINTS.RESERVATIONS),
    getReservationById: (id) => api.get(API_ENDPOINTS.RESERVATION_DETAILS(id)),
    createReservation: (data) => api.post(API_ENDPOINTS.RESERVATIONS, data),
    updateReservation: (id, data) => api.put(API_ENDPOINTS.RESERVATION_DETAILS(id), data),
    deleteReservation: (id) => api.delete(API_ENDPOINTS.RESERVATION_DETAILS(id)),

    // Reports
    getReports: () => api.get(API_ENDPOINTS.REPORTS),

    // User Profile
    getUserProfile: () => api.get(API_ENDPOINTS.USER_PROFILE),
    updateUserProfile: (data) => api.put(API_ENDPOINTS.UPDATE_PROFILE, data),
};

export default apiService; 