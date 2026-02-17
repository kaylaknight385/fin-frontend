import api from './api';

export const getBudget = async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/budgets?${params}`);
    return response.data;
};

export const getBudgets = async (id) => {
    const response = await api.get(`/budgets/${id}`);
    return response.data;
};

export const createBudget = async (budgetData) => {
    const response = await api.post('/budgets')
}