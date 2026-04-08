import api from './api';

export const sendChatMessage = async (message, sessionId, userEmail) => {
    const response = await api.post('/chatbot/message', {
        message,
        sessionId: sessionId || undefined,
        userEmail: userEmail || undefined,
    });
    return response.data;
};

export const clearChatSession = async (sessionId) => {
    if (!sessionId) return;
    await api.delete(`/chatbot/session/${sessionId}`);
};
