import api from './api';

const menuService = {
    getAllMenuItems: async () => {
        try {
            const response = await api.get('/menu');
            return response.data;
        } catch (error) {
            console.error('Error fetching menu items:', error);
            throw error;
        }
    }
};

export default menuService;
