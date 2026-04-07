import api from './api';

const orderService = {
    placeOrder: async (orderData) => {
        const response = await api.post('/orders', orderData);
        return response.data;
    },

    getMyOrders: async () => {
        const response = await api.get('/orders/my-orders');
        return response.data;
    },

    cancelOrder: async (orderId) => {
        const response = await api.put(`/orders/${orderId}/cancel`);
        return response.data;
    },

    updateOrderStatus: async (orderId, status) => {
        const response = await api.patch(`/orders/${orderId}/status`, { status });
        return response.data;
    },

    getKitchenOrders: async () => {
        const response = await api.get('/orders/kitchen');
        return response.data;
    },

    getDeliveryOrders: async () => {
        const response = await api.get('/orders/delivery');
        return response.data;
    },

    getAllOrders: async () => {
        const response = await api.get('/orders/all');
        return response.data;
    }
};

export default orderService;
