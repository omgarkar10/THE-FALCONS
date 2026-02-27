import api from './api';

const analyticsService = {
    getDashboardStats: async () => {
        const response = await api.get('/analytics/dashboard');
        return response.data;
    },

    getTrends: async (params = {}) => {
        const response = await api.get('/analytics/trends', { params });
        return response.data;
    },

    getLossAnalysis: async (params = {}) => {
        const response = await api.get('/analytics/loss', { params });
        return response.data;
    },

    getConsumerStats: async () => {
        const response = await api.get('/analytics/consumer');
        return response.data;
    },
};

export default analyticsService;
