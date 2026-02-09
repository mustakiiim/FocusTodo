import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.MODE === 'production' ? '/api' : 'http://localhost:5000/api',
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized (e.g., redirect to login)
            // window.location.href = '/login'; 
            // Better to handle in AuthContext
        }
        return Promise.reject(error);
    }
);

export default api;
