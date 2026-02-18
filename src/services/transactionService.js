import api from './api';

export const getTransactions = async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/transactions?${params}`);
    return response.data;
};

export const getTrasaction = async (id) => {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
};

export const createTransaction = async (transactionData) => {
    const response = await api.post('/transactions', transactionData);
    return response.data;
};

export const updateTransaction = async (id, transactionData) => {
    const response = await api.put(`/transactions/${id}`, transactionData);
    return response.data;
};

export const deleteTransaction = async (id) => {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
};

export const getTransactionStats = async () => {
    const response = await api.get('/transactions/stats');
    return response.data;
};