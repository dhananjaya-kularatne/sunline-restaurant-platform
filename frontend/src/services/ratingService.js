import api from './api';

const ratingService = {
    submitRating: async (ratingData) => {
        const response = await api.post('/ratings', ratingData);
        return response.data;
    },

    getMenuItemRatings: async (menuItemId) => {
        const response = await api.get(`/ratings/menu-item/${menuItemId}`);
        return response.data;
    },
    getAllRatings: async () => {
        const response = await api.get('/ratings');
        return response.data;
    },

    getAverageRating: async (menuItemId) => {
        const response = await api.get(`/ratings/menu-item/${menuItemId}/average`);
        return response.data;
    },

    getRatingCount: async (menuItemId) => {
        const response = await api.get(`/ratings/menu-item/${menuItemId}/count`);
        return response.data;
    },
    getUserRatings: async () => {
        const response = await api.get('/ratings/me');
        return response.data;
    },
    deleteRating: async (ratingId) => {
        await api.delete(`/ratings/${ratingId}`);
    }
};

export default ratingService;
