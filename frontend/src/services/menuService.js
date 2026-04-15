import api from './api';

const menuService = {
    getAllMenuItems: async () => {
        try {
            const response = await api.get('/menu/all'); // Admin endpoint to get all (including unavailable)
            return response.data;
        } catch (error) {
            console.error('Error fetching all menu items:', error);
            throw error;
        }
    },
    getAvailableMenuItems: async () => {
        try {
            const response = await api.get('/menu');
            return response.data;
        } catch (error) {
            console.error('Error fetching available menu items:', error);
            throw error;
        }
    },
    addMenuItem: async (itemData) => {
        try {
            const response = await api.post('/menu', itemData);
            return response.data;
        } catch (error) {
            console.error('Error adding menu item:', error);
            throw error;
        }
    },
    updateMenuItem: async (id, itemData) => {
        try {
            const response = await api.put(`/menu/${id}`, itemData);
            return response.data;
        } catch (error) {
            console.error('Error updating menu item:', error);
            throw error;
        }
    },
    deleteMenuItem: async (id) => {
        try {
            await api.delete(`/menu/${id}`);
        } catch (error) {
            console.error('Error deleting menu item:', error);
            throw error;
        }
    },

    getTrendingItems: async (limit = 6) => {
        try {
            const response = await api.get(`/menu/trending?limit=${limit}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching trending items:', error);
            throw error;
        }
    },

    getRecommendations: async (limit = 4) => {
        try {
            const response = await api.get(`/menu/recommendations?limit=${limit}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            throw error;
        }
    },

    getWishlist: async () => {
        const response = await api.get('/user/wishlist');
        return response.data;
    },

    addToWishlist: async (menuItemId) => {
        await api.post(`/user/wishlist/${menuItemId}`);
    },

    removeFromWishlist: async (menuItemId) => {
        await api.delete(`/user/wishlist/${menuItemId}`);
    },
};

export default menuService;
