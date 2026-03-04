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
    },

    getProfile: async () => {
        const response = await api.get('/user/profile');
        return response.data;
    },

    updateProfile: async (name, bio) => {
        const response = await api.put('/user/profile', { name, bio });
        return response.data;
    },

    uploadProfilePicture: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('/user/profile/picture', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    }
};

export default authService;
