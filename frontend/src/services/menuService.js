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
    }
};

export default menuService;
