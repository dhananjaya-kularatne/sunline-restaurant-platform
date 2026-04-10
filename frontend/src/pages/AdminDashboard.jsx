import React, { useState, useEffect } from 'react';
import { Users, Utensils, ArrowRight, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import adminService from '../services/adminService';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ totalUsers: 0, totalMenuItems: 0 });
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
                                    <p className="text-gray-400 text-sm mt-1">{card.description}</p>
                                    
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
