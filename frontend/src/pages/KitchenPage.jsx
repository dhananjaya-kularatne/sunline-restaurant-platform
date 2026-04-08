import React, { useState, useEffect } from 'react';
import orderService from '../services/orderService';
import { CheckCircle2, Clock, Package, AlertCircle, Loader2, Utensils, ArrowRight, ClipboardList } from 'lucide-react';

const KitchenPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updating, setUpdating] = useState(false);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const data = await orderService.getKitchenOrders();
            setOrders(data);
        } catch (err) {
            setError('Unable to load kitchen orders.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId, status) => {
        setUpdating(true);
        try {
            await orderService.updateOrderStatus(orderId, status);
            fetchOrders();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update order status.');
        } finally {
            setUpdating(false);
        }
    };

    const incomingOrders = orders.filter(order => order.status === 'PENDING' || order.status === 'CONFIRMED');
    const preparingOrders = orders.filter(order => order.status === 'PREPARING');
    const readyOrders = orders.filter(order => order.status === 'READY');

    return (
        <div className="bg-gray-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Kitchen Dashboard</h1>
                        <p className="text-gray-500 mt-1">Manage incoming orders and update their preparation status in real time.</p>
                    </div>
                    <div className="rounded-2xl bg-white p-4 border border-gray-200 shadow-sm flex items-center gap-3">
                        <Utensils className="text-primary" size={24} />
                        <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Incoming Queue</p>
                            <p className="text-lg font-bold text-gray-900">{incomingOrders.length} placed orders</p>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-red-700 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <AlertCircle size={18} />
                            <span>{error}</span>
                        </div>
                        <button onClick={() => setError(null)} className="text-red-600 font-semibold">Dismiss</button>
                    </div>
                )}

                {loading ? (
                    <div className="flex min-h-[360px] items-center justify-center rounded-3xl bg-white border border-gray-200">
                        <Loader2 className="animate-spin text-primary" size={32} />
                    </div>
                ) : (
                    <div className="grid gap-6 xl:grid-cols-3">
                        <section className="space-y-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm uppercase tracking-[0.18em] text-gray-400 font-bold">Incoming</p>
                                    <h2 className="text-xl font-bold text-gray-900">Placed Orders</h2>
                                </div>
                                <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-primary text-xs font-bold">
                                    <Clock size={14} /> {incomingOrders.length}
                                </span>
                            </div>
                            <div className="space-y-4">
                                {incomingOrders.length === 0 ? (
                                    <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-5 text-center text-sm text-gray-500">
                                        No orders waiting to be claimed.
                                    </div>
                                ) : incomingOrders.map(order => (
                                    <div key={order.id} className="rounded-3xl border border-gray-100 p-4 shadow-sm">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Order #{order.id}</p>
                                                <p className="font-semibold text-gray-900">{order.fullName}</p>
                                                <p className="text-sm text-gray-500">{order.items.length} items • LKR {order.totalPrice.toFixed(0)}</p>
                                            </div>
                                            <button
                                                onClick={() => handleStatusChange(order.id, 'PREPARING')}
                                                disabled={updating}
                                                className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary-dark disabled:opacity-50"
                                            >
                                                Claim Order
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="space-y-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm uppercase tracking-[0.18em] text-gray-400 font-bold">Preparing</p>
                                    <h2 className="text-xl font-bold text-gray-900">In Progress</h2>
                                </div>
                                <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-orange-700 text-xs font-bold">
                                    <Package size={14} /> {preparingOrders.length}
                                </span>
                            </div>
                            <div className="space-y-4">
                                {preparingOrders.length === 0 ? (
                                    <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-5 text-center text-sm text-gray-500">
                                        No orders currently being prepared.
                                    </div>
                                ) : preparingOrders.map(order => (
                                    <div key={order.id} className="rounded-3xl border border-gray-100 p-4 shadow-sm">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Order #{order.id}</p>
                                                <p className="font-semibold text-gray-900">{order.fullName}</p>
                                                <p className="text-sm text-gray-500">{order.items.length} items • LKR {order.totalPrice.toFixed(0)}</p>
                                            </div>
                                            <button
                                                onClick={() => handleStatusChange(order.id, 'READY')}
                                                disabled={updating}
                                                className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
                                            >
                                                Mark as Done
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="space-y-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm uppercase tracking-[0.18em] text-gray-400 font-bold">Ready</p>
                                    <h2 className="text-xl font-bold text-gray-900">Done / Pickup</h2>
                                </div>
                                <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-green-700 text-xs font-bold">
                                    <CheckCircle2 size={14} /> {readyOrders.length}
                                </span>
                            </div>
                            <div className="space-y-4">
                                {readyOrders.length === 0 ? (
                                    <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-5 text-center text-sm text-gray-500">
                                        No orders ready for pickup.
                                    </div>
                                ) : readyOrders.map(order => (
                                    <div key={order.id} className="rounded-3xl border border-gray-100 p-4 shadow-sm">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Order #{order.id}</p>
                                                <p className="font-semibold text-gray-900">{order.fullName}</p>
                                                <p className="text-sm text-gray-500">{order.items.length} items • LKR {order.totalPrice.toFixed(0)}</p>
                                            </div>
                                            <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-bold text-green-700">Ready</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                )}
            </div>
        </div>
    );
};

export default KitchenPage;
