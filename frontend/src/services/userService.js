import api from './api';

const userService = {
    getPosts: async (username = '') => {
        const response = await api.get('/admin/posts', { params: { username } });
        return response.data;
    },

    removePost: async (postId) => {
        await api.delete(`/admin/posts/${postId}`);
    },

    getUsers: async (search = '') => {
        const response = await api.get('/admin/users', {
            params: { search }
        });
        return response.data;
    },

    updateUserRole: async (userId, role) => {
        const response = await api.put(`/admin/users/${userId}/role`, { role });
        return response.data;
    },

    toggleUserStatus: async (userId) => {
        const response = await api.put(`/admin/users/${userId}/status`);
        return response.data;
    }
};

export default userService;
