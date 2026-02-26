import api from './api';

const authService = {
    register: async (name, email, password) => {
        return await api.post('/auth/register', { name, email, password });
    },
};

export default authService;
