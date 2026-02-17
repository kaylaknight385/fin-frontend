import api from './api';

export const getCashbackRewards = async () => {
  const response = await api.get('/cashback');
  return response.data;
};

export const getTotalCashback = async (period = 'all') => {
  const response = await api.get(`/cashback/total?period=${period}`);
  return response.data;
};

export const getCashbackByPlatform = async (platform) => {
  const response = await api.get(`/cashback/platform/${platform}`);
  return response.data;
};