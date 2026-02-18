import api from './api';

export const chatWithAI = async (message) => {
  const response = await api.post('/chat', { message });
  return response.data;
};

export const getConversationHistory = async () => {
  const response = await api.get('/history');
  return response.data;
};