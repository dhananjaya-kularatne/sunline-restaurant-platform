import api from './api';

const authService = {
    register: async (name, email, password) => {
        const response = await api.post('/auth/register', { name, email, password });
        return response.data;
    },

    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },

    forgotPassword: async (email) => {
        return await api.post('/auth/forgot-password', { email });
    },

    resetPassword: async (token, newPassword) => {
        return await api.post('/auth/reset-password', { token, newPassword });
    },

    validateToken: async (token) => {
        return await api.get(`/auth/validate-token?token=${token}`);
    }
};

export default authService;
