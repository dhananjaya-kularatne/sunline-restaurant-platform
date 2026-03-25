import api from './api';

const getAllReservations = async () => {
    const response = await api.get('/reservations/all');
    return response.data;
};

const confirmReservation = async (id) => {
    const response = await api.put(`/reservations/${id}/confirm`);
    return response.data;
};

const markNoShow = async (id) => {
    const response = await api.put(`/reservations/${id}/no-show`);
    return response.data;
};

const cancelReservation = async (id) => {
    const response = await api.put(`/reservations/${id}/cancel`);
    return response.data;
};

export default {
    getAllReservations,
    confirmReservation,
    markNoShow,
    cancelReservation
};
