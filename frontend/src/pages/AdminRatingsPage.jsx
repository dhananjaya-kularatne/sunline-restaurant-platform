import React, { useState, useEffect, useMemo } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import ratingService from '../services/ratingService';
import menuService from '../services/menuService';
import StarRating from '../components/StarRating';
import ConfirmModal from '../components/ConfirmModal';
import { Search, Star, Trash2, LayoutDashboard, RefreshCcw, Filter } from 'lucide-react';

const AdminRatingsPage = () => {
    const [ratings, setRatings] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [ratingToDelete, setRatingToDelete] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [ratingsData, menuData] = await Promise.all([
                ratingService.getAllRatings(),
                menuService.getAllMenuItems()
            ]);
            setRatings(ratingsData);
            setMenuItems(menuData);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch ratings data.');
            setLoading(false);
        }
    };

    // Filter ratings by Dish Name
    const filteredRatings = useMemo(() => {
        return ratings
            .filter(rating => {
                const menuItem = menuItems.find(item => item.id === rating.menuItemId);
                const itemName = menuItem ? menuItem.name.toLowerCase() : '';
                return itemName.includes(searchQuery.toLowerCase());
            })
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }, [ratings, menuItems, searchQuery]);

    const stats = useMemo(() => {
        if (ratings.length === 0) return { avg: 0, total: 0, top: 'N/A' };
        const avg = ratings.reduce((acc, r) => acc + r.stars, 0) / ratings.length;
        
        // Find top rated dish (by average)
        const dishAverages = menuItems
            .filter(item => item.ratingCount > 0)
            .sort((a, b) => b.averageRating - a.averageRating);
        
        return {
            avg: avg.toFixed(1),
            total: ratings.length,
            top: dishAverages.length > 0 ? dishAverages[0].name : 'N/A'
        };
    }, [ratings, menuItems]);

    const handleDeleteClick = (ratingId) => {
        setRatingToDelete(ratingId);
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteRating = async () => {
        if (!ratingToDelete) return;
        try {
            await ratingService.deleteRating(ratingToDelete);
            setRatings(prev => prev.filter(r => r.id !== ratingToDelete));
            // Success message could be added here
        } catch (err) {
            alert('Failed to delete rating');
        } finally {
            setRatingToDelete(null);
        }
    };

    const getDishName = (id) => {
        const item = menuItems.find(i => i.id === id);
        return item ? item.name : 'Unknown Dish';
    };

    const getInitials = (name) => {
        return name ? name.charAt(0).toUpperCase() : 'U';
    };

    const getAvatarColor = (name) => {
        const colors = ['bg-orange-100 text-orange-600', 'bg-blue-100 text-blue-600', 'bg-green-100 text-green-600', 'bg-purple-100 text-purple-600'];
        const index = name ? name.length % colors.length : 0;
        return colors[index];
    };

    if (loading) {
        return (
            <div className="flex min-h-screen">
                <AdminSidebar />
                <div className="flex-1 flex items-center justify-center bg-gray-50">
                    <div className="flex flex-col items-center">
                        <RefreshCcw className="animate-spin text-[#FF7F50] mb-4" size={48} />
                        <p className="text-gray-500 font-medium">Fetching Feedbacks...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-transparent">
            <AdminSidebar />
            
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-[#3E4958]">Ratings Management</h1>
                        <p className="text-gray-500">Monitor food quality and manage customer feedback.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input 
                                type="text"
                                placeholder="Search by dish..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-[#FF7F50] transition-all"
                            />
                        </div>
                        <button 
                            onClick={fetchData}
                            className="p-2.5 bg-white border border-gray-200 rounded-lg text-gray-400 hover:text-[#FF7F50] hover:bg-orange-50 transition-all shadow-sm"
                            title="Refresh Data"
                        >
                            <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg flex items-center justify-between shadow-sm animate-fade-in">
                        <div className="flex items-center space-x-3">
                            <RefreshCcw size={18} />
                            <span className="font-medium">{error}</span>
                        </div>
                    </div>
                )}

                {/* Ratings Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-[#F8F9FA] border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Menu Item</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider text-center">Rating</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredRatings.length > 0 ? (
                                filteredRatings.map((rating) => (
                                    <tr key={rating.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${getAvatarColor(rating.userName)}`}>
                                                    {getInitials(rating.userName)}
                                                </div>
                                                <span className="font-semibold text-gray-800">{rating.userName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                {menuItems.find(i => i.id === rating.menuItemId)?.imageUrl && (
                                                    <img 
                                                        src={menuItems.find(i => i.id === rating.menuItemId).imageUrl} 
                                                        alt="" 
                                                        className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                                                    />
                                                )}
                                                <span className="font-medium text-gray-600 bg-gray-50 px-3 py-1 rounded-lg text-sm truncate max-w-[150px]">
                                                    {getDishName(rating.menuItemId)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center">
                                                <StarRating rating={rating.stars} size={16} />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                                            {new Date(rating.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => handleDeleteClick(rating.id)}
                                                className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all active:scale-90"
                                                title="Remove rating"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-20 text-center text-gray-400">
                                        <div className="flex flex-col items-center">
                                            <Star size={32} className="text-gray-200 mb-4" />
                                            <p className="font-medium">No ratings found matching your search.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>

            <ConfirmModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDeleteRating}
                title="Moderate Rating?"
                message="As an admin, you are removing this customer's feedback. This action is permanent and will affect the dish's average rating."
                confirmText="Remove Rating"
                type="danger"
            />
        </div>
    );
};

export default AdminRatingsPage;
