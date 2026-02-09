import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.PROD
        ? 'https://focustodo1.onrender.com/api'
        : 'http://localhost:5000/api',
    withCredentials: true,
});

export default api;
