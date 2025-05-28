import axios from 'axios';
import { API_URL } from './config';

// Criando uma instância do axios com configurações padrão
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para adicionar o token de autenticação
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Erro do servidor (status code fora do range 2xx)
            console.error('Erro na resposta:', error.response.data);
            
            // Se o token expirou, podemos adicionar lógica de refresh aqui
            if (error.response.status === 401) {
                // Limpar o token e redirecionar para login
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        } else if (error.request) {
            // Erro na requisição
            console.error('Erro na requisição:', error.request);
        } else {
            // Erro na configuração da requisição
            console.error('Erro:', error.message);
        }
        return Promise.reject(error);
    }
);

export default api; 