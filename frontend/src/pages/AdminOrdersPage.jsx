import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, XCircle, Clock, CheckCircle, Package, Truck, Info, AlertTriangle, MapPin, X } from 'lucide-react';
import orderService from '../services/orderService';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from '../components/AdminSidebar';

const AdminOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [confirmModal, setConfirmModal] = useState({ show: false, orderId: null });
    const [detailModal, setDetailModal] = useState({ show: false, order: null });
    const { user: currentUser } = useAuth();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const data = await orderService.getAllOrders();
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setErrorMessage('Failed to load orders. Please try again.');
            setTimeout(() => setErrorMessage(''), 4000);
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
            setMessage(`Order #${orderId} has been cancelled successfully.`);
            fetchOrders();
            setTimeout(() => setMessage(''), 4000);
        } catch (error) {
            console.error('Error cancelling order:', error);
            setErrorMessage('Failed to cancel order. Please try again.');
            setTimeout(() => setErrorMessage(''), 4000);
        }
    };

    const statusLabels = {
        PENDING: 'Pending',
        CONFIRMED: 'Confirmed',
        PREPARING: 'Preparing',
        READY: 'Ready for Pickup',
        OUT_FOR_DELIVERY: 'Out for Delivery',
        DELIVERED: 'Delivered',
        CANCELLED: 'Cancelled'
    };

    const getStatusBadge = (status) => {
        const statuses = {
            PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            CONFIRMED: 'bg-blue-100 text-blue-700 border-blue-200',
            PREPARING: 'bg-orange-100 text-orange-700 border-orange-200',
            READY: 'bg-purple-100 text-purple-700 border-purple-200',
            OUT_FOR_DELIVERY: 'bg-indigo-100 text-indigo-700 border-indigo-200',
            DELIVERED: 'bg-green-100 text-green-700 border-green-200',
            CANCELLED: 'bg-red-100 text-red-700 border-red-200'
        };

        const statusIcons = {
            PENDING: <Clock size={14} className="mr-1" />,
            CONFIRMED: <CheckCircle size={14} className="mr-1" />,
            PREPARING: <Package size={14} className="mr-1" />,
            READY: <Package size={14} className="mr-1" />,
            OUT_FOR_DELIVERY: <Truck size={14} className="mr-1" />,
            DELIVERED: <CheckCircle size={14} className="mr-1" />,
            CANCELLED: <XCircle size={14} className="mr-1" />
        };

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center w-fit ${statuses[status] || statuses.PENDING}`}>
                {statusIcons[status]}
                {statusLabels[status] || status}
            </span>
        );
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.fullName?.toLowerCase().includes(search.toLowerCase()) ||
            order.id.toString().includes(search) ||
            order.email?.toLowerCase().includes(search.toLowerCase());

        const matchesStatus = filterStatus === 'ALL' || order.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="flex min-h-screen bg-[#F8F9FA]">
            <AdminSidebar />

            {/* Main Content */}
            <main className="flex-1 p-8">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-[#3E4958]">Order Management</h1>
                        <p className="text-gray-500">Oversee and manage all restaurant orders</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search by name, email or ID..."
                                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-72 focus:outline-none focus:ring-2 focus:ring-[#FF7F50] transition-all"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <select
                            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7F50]"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="ALL">All Statuses</option>
                            <option value="PENDING">Pending</option>
                            <option value="CONFIRMED">Confirmed</option>
                            <option value="PREPARING">Preparing</option>
                            <option value="READY">Ready</option>
                            <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                    </div>
                </div>

                {/* Success Banner */}
                {message && (
                    <div className="mb-6 px-5 py-3.5 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-2">
                            <CheckCircle size={18} />
                            <span className="font-semibold text-sm">{message}</span>
                        </div>
                        <button onClick={() => setMessage('')} className="text-green-500 hover:text-green-700 transition-colors">
                            <X size={18} />
                        </button>
                    </div>
                )}

                {/* Error Banner */}
                {errorMessage && (
                    <div className="mb-6 px-5 py-3.5 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-2">
                            <AlertTriangle size={18} />
                            <span className="font-semibold text-sm">{errorMessage}</span>
                        </div>
                        <button onClick={() => setErrorMessage('')} className="text-red-400 hover:text-red-600 transition-colors">
                            <X size={18} />
                        </button>
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-[#F8F9FA] border-bottom border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Total</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center text-gray-500">Loading orders...</td>
                                </tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center text-gray-500">No orders found.</td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-[#FF7F50]">#{order.id}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-gray-800">{order.fullName}</span>
                                                <span className="text-xs text-gray-500">{order.email}</span>
                                                <span className="text-xs text-gray-500">{order.phone}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(order.status)}
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-gray-700">
                                            LKR {order.totalPrice?.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {formatDate(order.createdAt)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                {/* Info Button */}
                                                <button
                                                    className="p-2 text-gray-400 hover:text-[#FF7F50] transition-colors rounded-lg hover:bg-orange-50"
                                                    title="View Details"
                                                    onClick={() => setDetailModal({ show: true, order })}
                                                >
                                                    <Info size={18} />
                                                </button>
                                                {/* Cancel Button */}
                                                {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                                                    <button
                                                        onClick={() => promptCancelOrder(order.id)}
                                                        className="px-3 py-1.5 text-xs font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 hover:border-red-300 transition-all"
                                                    >
                                                        Cancel Order
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </main>

            {/* ── Confirm Cancel Modal ── */}
            {confirmModal.show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                        <div className="px-6 pt-6 pb-2 flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                                <AlertTriangle size={20} className="text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-[#3E4958]">Cancel Order #{confirmModal.orderId}?</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    Are you sure you want to cancel this order? This action cannot be undone.
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

            {/* ── Order Detail Modal ── */}
            {detailModal.show && detailModal.order && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <div>
                                <h3 className="text-lg font-bold text-[#3E4958]">Order #{detailModal.order.id} Details</h3>
                                <p className="text-xs text-gray-500 mt-0.5">{detailModal.order.fullName} · {detailModal.order.email}</p>
                            </div>
                            <button
                                onClick={() => setDetailModal({ show: false, order: null })}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        {/* Body */}
                        <div className="px-6 py-5 space-y-5">
                            {/* Address */}
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                                    <MapPin size={16} className="text-[#FF7F50]" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Delivery Address</p>
                                    <p className="text-sm font-medium text-gray-700">{detailModal.order.address}</p>
                                </div>
                            </div>
                            {/* Items */}
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Order Items</p>
                                <div className="space-y-2">
                                    {detailModal.order.items?.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2.5">
                                            <div className="flex items-center gap-3">
                                                <span className="w-6 h-6 bg-white border border-gray-200 rounded text-[10px] font-bold text-[#FF7F50] flex items-center justify-center">
                                                    {item.quantity}x
                                                </span>
                                                <span className="text-sm font-medium text-gray-700">{item.menuItemName}</span>
                                            </div>
                                            <span className="text-sm font-bold text-gray-800">LKR {(item.price * item.quantity).toFixed(0)}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Paid</span>
                                    <span className="text-base font-black text-[#FF7F50]">LKR {detailModal.order.totalPrice?.toFixed(0)}</span>
                                </div>
                            </div>
                        </div>
                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
                            <button
                                onClick={() => setDetailModal({ show: false, order: null })}
                                className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrdersPage;
