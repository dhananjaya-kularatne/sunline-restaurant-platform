import React from 'react';
import { Star, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';

const AdminRatingsManagement = () => {
    return (
        <div className="flex min-h-screen bg-[#F8F9FA]">
            <AdminSidebar />

            <main className="flex-1 p-8">
                <div className="mb-10 flex items-center gap-4">
                    <Link to="/admin/dashboard" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
                        <ArrowLeft size={24} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-[#3E4958]">Ratings Management</h1>
                        <p className="text-gray-500 mt-1">Monitor and manage customer ratings and reviews</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center text-center">
                    <div className="p-6 bg-yellow-50 rounded-full text-yellow-500 mb-6">
                        <Star size={48} fill="currentColor" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Coming Soon</h2>
                    <p className="text-gray-500 max-w-md">
                        The Ratings and Reviews management system is currently under development. 
                        Soon you'll be able to view, filter, and respond to customer feedback directly from here.
                    </p>
                    <Link 
                        to="/admin/dashboard" 
                        className="mt-8 px-6 py-3 bg-[#FF7F50] text-white font-semibold rounded-xl hover:bg-[#e66a3e] transition-colors shadow-lg shadow-orange-200"
                    >
                        Back to Dashboard
                    </Link>
                </div>
            </main>
        </div>
    );
};

export default AdminRatingsManagement;
