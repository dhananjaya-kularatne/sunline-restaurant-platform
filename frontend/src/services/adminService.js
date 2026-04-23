import api from './api';

const adminService = {
    getDashboardStats: async () => {
        const response = await api.get('/admin/dashboard/stats');
        return response.data;
    },
    getSalesReport: async (year, month) => {
        const response = await api.get(`/admin/reports/sales?year=${year}&month=${month}`);
        return response.data;
    }
};

export default adminService;
