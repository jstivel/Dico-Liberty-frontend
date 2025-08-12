import axios from 'axios';
import AuthService from './authService';

const api = axios.create({
    baseURL: 'http://localhost:8081/api', // La base URL de tu microservicio de proyectos
});

api.interceptors.request.use(
    (config) => {
        const user = AuthService.getCurrentUser();
        if (user && user.token) {
            config.headers['Authorization'] = 'Bearer ' + user.token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;