import api from './api';

export const getBudget = async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/budgets?${params}`);
    return response.data;
};

export const getBudgets = async () => {
    const response = await api.get('/budgets');
    return response.data;
};

export const createBudget = async (budgetData) => {
    const response = await api.post('/budgets', budgetData);
    return response.data;
};

export const updateBudget = async (id, budgetData) => {
    const response = await api.put(`/budgets/${id}`, budgetData);
    return response.data;
};

export const deleteBudget = async (id) => {
    const response = await api.delete(`/budgets/${id}`);
    return response.data;
};