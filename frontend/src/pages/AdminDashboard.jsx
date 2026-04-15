import React, { useState, useEffect } from 'react';
import { Users, Utensils, ArrowRight, TrendingUp, ShoppingBag, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import adminService from '../services/adminService';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ 
        totalUsers: 0, 
        totalMenuItems: 0,
        totalOrders: 0,
        pendingOrders: 0,
        confirmedOrders: 0,
        preparingOrders: 0,
        readyOrders: 0,
        outForDeliveryOrders: 0,
        deliveredOrders: 0,
        completedOrders: 0,
        cancelledOrders: 0,
        totalReservations: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await adminService.getDashboardStats();
                setStats(data);
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        {
            title: 'Total Users',
            value: stats.totalUsers,
            icon: Users,
            color: 'bg-orange-500',
            link: '/admin/users',
            buttonText: 'Manage Users',
            description: 'Registered users on the platform'
        },
        {
            title: 'Menu Items',
            value: stats.totalMenuItems,
            icon: Utensils,
            color: 'bg-blue-500',
            link: '/admin/menu',
            buttonText: 'Manage Menu',
            description: 'Items currently in the restaurant menu'
        },
        {
            title: 'Total Orders',
            value: stats.totalOrders,
            icon: ShoppingBag,
            color: 'bg-green-500',
            link: '/admin/orders',
            buttonText: 'Manage Orders',
            description: 'Customer orders across all statuses',
            breakdown: [
                { label: 'Pending', count: stats.pendingOrders, color: 'text-yellow-600' },
                { label: 'Confirmed', count: stats.confirmedOrders, color: 'text-blue-600' },
                { label: 'Preparing', count: stats.preparingOrders, color: 'text-indigo-600' },
                { label: 'Ready', count: stats.readyOrders, color: 'text-teal-600' },
                { label: 'Out for Delivery', count: stats.outForDeliveryOrders, color: 'text-purple-600' },
                { label: 'Delivered', count: stats.deliveredOrders, color: 'text-green-600' },
                { label: 'Completed', count: stats.completedOrders, color: 'text-emerald-600' },
                { label: 'Cancelled', count: stats.cancelledOrders, color: 'text-red-600' }
            ]
        },
        {
            title: 'Reservations',
            value: stats.totalReservations,
            icon: Calendar,
            color: 'bg-purple-500',
            link: '/admin/reservations',
            buttonText: 'Manage Reservations',
            description: 'Table bookings and reservations'
        }
    ];

    return (
        <div className="flex min-h-screen bg-[#F8F9FA]">
            <AdminSidebar />

            <main className="flex-1 p-8">
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-[#3E4958]">Admin Dashboard</h1>
                    <p className="text-gray-500 mt-1">Quick overview of your platform's performance</p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF7F50]"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {statCards.map((card, index) => (
                            <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md group">
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`p-3 rounded-xl ${card.color} text-white shadow-lg`}>
                                            <card.icon size={24} />
                                        </div>
                                        <div className="flex items-center text-green-500 text-sm font-medium bg-green-50 px-2 py-1 rounded-lg">
                                            <TrendingUp size={14} className="mr-1" />
                                            Active
                                        </div>
                                    </div>
                                    
                                    <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wider">{card.title}</h3>
                                    <div className="flex items-baseline gap-2 mt-1">
                                        <span className="text-4xl font-bold text-gray-900 leading-tight">{card.value}</span>
                                    </div>
                                    <p className="text-gray-400 text-sm mt-1 mb-4">{card.description}</p>
                                    
                                    {card.breakdown && (
                                        <div className="grid grid-cols-2 gap-2 mb-4 pt-4 border-t border-gray-50">
                                            {card.breakdown.map((item, idx) => (
                                                <div key={idx} className="flex justify-between items-center text-xs">
                                                    <span className="text-gray-500">{item.label}:</span>
                                                    <span className={`font-bold ${item.color}`}>{item.count}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    
                                    <div className="mt-8 pt-6 border-t border-gray-50">
                                        <Link 
                                            to={card.link}
                                            className="flex items-center justify-between w-full text-[#FF7F50] font-semibold hover:text-[#e66a3e] transition-colors group-hover:translate-x-1 duration-300"
                                        >
                                            <span>{card.buttonText}</span>
                                            <ArrowRight size={18} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
