import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

//add token to request automatically 
api.interceptors.request.use(
    (config) => {
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

//handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            //token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Use navigate instead of window.location for SPA routing
            if (typeof window !== 'undefined') {
                window.location.replace('/login');
            }
        }
        return Promise.reject(error);
    }
);

export default api;