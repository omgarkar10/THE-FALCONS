import api from './api';

const sensorService = {
    getReadings: async (params = {}) => {
        const response = await api.get('/sensors/readings', { params });
        return response.data;
    },

    getAlerts: async (params = {}) => {
        const response = await api.get('/sensors/alerts', { params });
        return response.data;
    },

    getSiloStatus: async () => {
        const response = await api.get('/sensors/silos');
        return response.data;
    },

    acknowledgeAlert: async (alertId) => {
        const response = await api.put(`/sensors/alerts/${alertId}/acknowledge`);
        return response.data;
    },
};

export default sensorService;
