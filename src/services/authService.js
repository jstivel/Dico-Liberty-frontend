import axios from 'axios';

const API_URL = 'https://auth-service-java-latest.onrender.com/api/auth/'; // Usa el puerto de tu microservicio de login

class AuthService {
    async login(username, password) {
        const response = await axios.post(API_URL + 'login', {
            username,
            password,
        });
        if (response.data.token) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    }

    logout() {
        localStorage.removeItem('user');
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    }
    async getTechnicians() {
        // Concatenamos la URL base con el endpoint específico de técnicos
        return axios.get(API_URL + 'technicians', { headers: authHeader() });
    }
    async registerUserByAdmin(userData) {
        return axios.post(API_URL + 'admin/register', userData, { headers: authHeader() });
    }

}
function authHeader() {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user && user.token) {
        return {'Authorization': 'Bearer ' + user.token};
    } else {
        return {};
    }
}

export default new AuthService();