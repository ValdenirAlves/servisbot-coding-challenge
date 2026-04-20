const API_BASE_URL = 'http://localhost:3001/api';

const handleResponse = async (response, fallbackMessage) => {
  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.message || fallbackMessage);
  }

  return response.json();
};

export const dataService = {
  async getBots() {   
    const response = await fetch(`${API_BASE_URL}/bots`);
    return handleResponse(response, 'Failed to fetch bots');
  },

  async getBotById(id) {
    const response = await fetch(`${API_BASE_URL}/bots/${id}`);
    return handleResponse(response, 'Failed to fetch bot');
  },

  async getWorkersByBotId(botId) {
    const response = await fetch(`${API_BASE_URL}/bots/${botId}/workers`);
    return handleResponse(response, 'Failed to fetch workers');
  },

  async getLogsByBotId(botId) {
    const response = await fetch(`${API_BASE_URL}/bots/${botId}/logs`);
    return handleResponse(response, 'Failed to fetch logs');
  },

  async getLogsByWorkerId(workerId, botId) {
    const response = await fetch(
      `${API_BASE_URL}/bots/${botId}/workers/${workerId}/logs`
    );
    return handleResponse(response, 'Failed to fetch worker logs');
  },
};