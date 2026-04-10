import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import orderService from '../services/orderService';
import { ShoppingBag, Clock, Package, CheckCircle, XCircle, ChevronDown, MapPin, Phone, AlertCircle, AlertTriangle, X } from 'lucide-react';

const MyOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [confirmModal, setConfirmModal] = useState({ show: false, orderId: null });
    const [errorBanner, setErrorBanner] = useState(null);
    const location = useLocation();

    useEffect(() => {
        if (location.state?.message) {
            setSuccessMessage(location.state.message);
            window.history.replaceState({}, document.title);
            setTimeout(() => setSuccessMessage(null), 5000);
        }
        fetchOrders();
    }, [location]);

    const fetchOrders = async () => {
        try {
            const data = await orderService.getMyOrders();
            setOrders(data);
        } catch (err) {
            setError('Failed to fetch your orders. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const promptCancelOrder = (orderId) => {
        setConfirmModal({ show: true, orderId });
    };

    const handleCancelOrder = async () => {
        const orderId = confirmModal.orderId;
        setConfirmModal({ show: false, orderId: null });

        try {
            await orderService.cancelOrder(orderId);
            setSuccessMessage('Order cancelled successfully.');
            fetchOrders();
            setTimeout(() => setSuccessMessage(null), 5000);
        } catch (err) {
            setErrorBanner(err.response?.data?.message || 'Failed to cancel order. Please try again.');
            setTimeout(() => setErrorBanner(null), 5000);
        }
    };

    const getStatusConfig = (status) => {
        const configs = {
            'PENDING': { color: 'text-amber-600 bg-amber-50 border-amber-100', icon: <Clock size={16} />, label: 'Pending' },
            'CONFIRMED': { color: 'text-blue-600 bg-blue-50 border-blue-100', icon: <CheckCircle size={16} />, label: 'Confirmed' },
            'PREPARING': { color: 'text-orange-600 bg-orange-50 border-orange-100', icon: <Package size={16} />, label: 'Preparing' },
            'OUT_FOR_DELIVERY': { color: 'text-purple-600 bg-purple-50 border-purple-100', icon: <ShoppingBag size={16} />, label: 'Out for Delivery' },
            'DELIVERED': { color: 'text-teal-600 bg-teal-50 border-teal-100', icon: <CheckCircle size={16} />, label: 'Delivered' },
            'COMPLETED': { color: 'text-green-600 bg-green-50 border-green-100', icon: <CheckCircle size={16} />, label: 'Completed' },
            'CANCELLED': { color: 'text-gray-500 bg-gray-100 border-gray-200', icon: <XCircle size={16} />, label: 'Cancelled' }
        };
        return configs[status] || configs['PENDING'];
    };

    const toggleExpand = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    if (loading) {
        return (
        <div className="bg-transparent min-h-screen py-10 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    <p className="mt-4 text-gray-500 font-medium">Fetching your orders...</p>
                </div>
            </div>
        );
    }

    return (
        <>
        <div className="bg-transparent min-h-screen py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Orders</h1>
                        <p className="text-gray-500 mt-1">Track and manage your delicious requests</p>
                    </div>
                    <div className="relative">
                        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-primary">
                            <ShoppingBag size={24} />
                        </div>
                        {orders.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-md">
                                {orders.length}
                            </span>
                        )}
                    </div>
                </div>

                {successMessage && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-100 text-green-700 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <CheckCircle size={20} />
                            <p className="font-semibold">{successMessage}</p>
                        </div>
                        <button onClick={() => setSuccessMessage(null)} className="text-green-500 hover:text-green-700 transition-colors">
                            <X size={18} />
                        </button>
                    </div>
                )}

                {errorBanner && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <AlertTriangle size={20} />
                            <p className="font-semibold">{errorBanner}</p>
                        </div>
                        <button onClick={() => setErrorBanner(null)} className="text-red-400 hover:text-red-600 transition-colors">
                            <X size={18} />
                        </button>
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl flex items-center space-x-3">
                        <AlertCircle size={20} />
                        <p className="font-bold">{error}</p>
                    </div>
                )}

                <div className="space-y-2.5">
                    {orders.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <ShoppingBag className="text-gray-300" size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">No orders yet</h3>
                            <p className="text-gray-500 mt-2">Hungry? Place your first order today!</p>
                            <button 
                                onClick={() => window.location.href = '/menu'}
                                className="mt-8 px-10 py-3 bg-primary text-white rounded-lg font-bold shadow-md hover:opacity-90 active:scale-[0.98] transition-all"
                            >
                                Explore Menu
                            </button>
                        </div>
                    ) : (
                        orders.map((order) => {
                            const isExpanded = expandedOrder === order.id;
                            const config = getStatusConfig(order.status);
                            
                            return (
                                <div key={order.id} className={`bg-white rounded-2xl shadow-sm border ${isExpanded ? 'border-primary/20 ring-1 ring-primary/5' : 'border-gray-100'} overflow-hidden transition-all duration-300`}>
                                    <div 
                                        onClick={() => toggleExpand(order.id)}
                                        className="p-4 sm:p-5 cursor-pointer flex flex-wrap items-center justify-between gap-4"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="text-left">
                                                <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest leading-none mb-1">Order ID</p>
                                                <h3 className="text-lg font-bold text-gray-900 leading-none">#{order.id.toString().padStart(5, '0')}</h3>
                                            </div>
                                            <div className="h-8 w-px bg-gray-100" />
                                            <div>
                                                <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest leading-none mb-1">Date</p>
                                                <p className="text-sm font-bold text-gray-700 leading-none">{new Date(order.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-6">
                                            <div className="text-right hidden sm:block">
                                                <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest leading-none mb-1">Amount</p>
                                                <p className="text-lg font-black text-primary leading-none">LKR {order.totalPrice.toFixed(0)}</p>
                                            </div>
                                            <div className={`px-4 py-1.5 rounded-full border text-xs font-bold flex items-center space-x-2 ${config.color}`}>
                                                {config.icon}
                                                <span>{config.label}</span>
                                            </div>
                                            <div className={`text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                                                <ChevronDown size={20} />
                                            </div>
                                        </div>
                                    </div>

                                    {isExpanded && (
                                        <div className="px-6 pb-6 pt-2 border-t border-gray-50 flex flex-col gap-6 animate-in slide-in-from-top-2 duration-300">
                                            {/* Order Details */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50/50 p-6 rounded-2xl">
                                                <div className="space-y-4">
                                                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Delivery Details</h4>
                                                    <div className="flex items-start space-x-3 text-sm">
                                                        <MapPin size={16} className="text-primary flex-shrink-0 mt-0.5" />
                                                        <p className="text-gray-700 font-medium leading-relaxed">{order.address}</p>
                                                    </div>
                                                    <div className="flex items-center space-x-3 text-sm">
                                                        <Phone size={16} className="text-primary" />
                                                        <p className="text-gray-700 font-bold">{order.phone}</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Order Items</h4>
                                                    <div className="space-y-3">
                                                        {order.items.map((item, idx) => (
                                                            <div key={idx} className="flex justify-between items-center text-sm">
                                                                <div className="flex items-center space-x-2">
                                                                    <span className="w-5 h-5 bg-white border border-gray-200 rounded flex items-center justify-center text-[10px] font-bold text-primary">{item.quantity}x</span>
                                                                    <span className="text-gray-700 font-medium">{item.menuItemName}</span>
                                                                </div>
                                                                <span className="font-bold text-gray-900">LKR {item.price * item.quantity}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="pt-2 border-t border-gray-100 flex justify-between items-center font-black text-primary">
                                                        <span className="text-xs uppercase tracking-widest">Total Paid</span>
                                                        <span className="text-lg">LKR {order.totalPrice.toFixed(0)}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex flex-wrap items-center justify-between gap-4">
                                                <p className="text-[10px] text-gray-400 font-medium italic">
                                                    Payment Method: Cash on Delivery
                                                </p>
                                                {order.status === 'PENDING' && (
                                                    <button
                                                        onClick={() => promptCancelOrder(order.id)}
                                                        className="px-6 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-bold hover:bg-red-50 hover:border-red-400 transition-all active:scale-[0.98] shadow-sm"
                                                    >
                                                        Cancel Order
                                                    </button>
                                                )}
                                                {order.status === 'CANCELLED' && (
                                                    <div className="flex items-center space-x-2 text-gray-400 text-xs font-bold">
                                                        <AlertCircle size={16} />
                                                        <span>Order was cancelled and cannot be reinstated</span>
                                                    </div>
                                                )}
                                                {['CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'COMPLETED'].includes(order.status) && (
                                                    <div className="flex items-center space-x-2 text-green-600 text-xs font-bold">
                                                        <CheckCircle size={16} />
                                                        <span>Order is being processed and cannot be cancelled</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>

        {/* ── Confirm Cancel Modal ── */}
        {confirmModal.show && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                    <div className="px-6 pt-6 pb-2 flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                            <AlertTriangle size={20} className="text-red-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Cancel this order?</h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Are you sure you want to cancel order #{confirmModal.orderId}? This action cannot be undone.
                            </p>
                        </div>
                    </div>
                    <div className="px-6 py-5 flex justify-end gap-3 border-t border-gray-100 mt-4">
                        <button
                            onClick={() => setConfirmModal({ show: false, orderId: null })}
                            className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Keep Order
                        </button>
                        <button
                            onClick={handleCancelOrder}
                            className="px-5 py-2.5 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors shadow-sm"
                        >
                            Yes, Cancel Order
                        </button>
                    </div>
                </div>
            </div>
        )}
    </>
    );
};

export default MyOrdersPage;
