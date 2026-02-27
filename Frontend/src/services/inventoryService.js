import api from './api';

const inventoryService = {
    getAll: async (params = {}) => {
        const response = await api.get('/inventory', { params });
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/inventory/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/inventory', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/inventory/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/inventory/${id}`);
        return response.data;
    },

    getByCategory: async (category) => {
        const response = await api.get('/inventory', { params: { category } });
        return response.data;
    },
};

export default inventoryService;
