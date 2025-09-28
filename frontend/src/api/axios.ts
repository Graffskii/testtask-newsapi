import axios from 'axios';

// Создаем экземпляр axios с базовой конфигурацией
const apiClient = axios.create({
    baseURL: 'http://localhost:3000/api/v1',
});

/**
 * Interceptor (перехватчик) для исходящих запросов.
 */
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        console.log(token);
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;