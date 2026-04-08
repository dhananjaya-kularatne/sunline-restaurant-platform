import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, XCircle, Clock, CheckCircle, Package, Truck, Info } from 'lucide-react';
import orderService from '../services/orderService';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from '../components/AdminSidebar';

const AdminOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');
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
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
            return;
        }

        try {
            await orderService.cancelOrder(orderId);
            setMessage(`Order #${orderId} cancelled successfully!`);
            fetchOrders();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Error cancelling order:', error);
            alert('Failed to cancel order. Please try again.');
        }
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
                {status}
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

                {message && (
                    <div className="bg-[#48BB78] text-white px-6 py-3 rounded-lg mb-6 flex items-center shadow-sm animate-fade-in">
                        {message}
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
                                            ${order.totalPrice?.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {formatDate(order.createdAt)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-3">
                                                <div className="group relative">
                                                    <button 
                                                        className="p-2 text-gray-400 hover:text-[#FF7F50] transition-colors"
                                                        title="View Details"
                                                        onClick={() => alert(`Address: ${order.address}\n\nItems: ${order.items.map(i => `${i.quantity}x ${i.menuItemName}`).join(', ')}`)}
                                                    >
                                                        <Info size={18} />
                                                    </button>
                                                </div>
                                                {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                                                    <button
                                                        onClick={() => handleCancelOrder(order.id)}
                                                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Cancel Order"
                                                    >
                                                        <XCircle size={18} />
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
        </div>
    );
};

export default AdminOrdersPage;
