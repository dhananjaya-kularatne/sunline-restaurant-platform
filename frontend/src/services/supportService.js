import api from './api';

const supportService = {
    getAllReports: async () => {
        const response = await api.get('/support-reports/all');
        return response.data;
    },
    deleteReport: async (id) => {
        const response = await api.delete(`/support-reports/${id}`);
        return response.data;
    },
    updateReportStatus: async (id, status) => {
        const response = await api.patch(`/support-reports/${id}/status`, { status });
        return response.data;
    }
};

export default supportService;
