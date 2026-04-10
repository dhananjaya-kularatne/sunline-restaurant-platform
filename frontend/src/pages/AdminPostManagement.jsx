import React, { useState, useEffect } from 'react';
import { Search, Trash2, Loader2 } from 'lucide-react';
import userService from '../services/userService';
import AdminSidebar from '../components/AdminSidebar';
import { getImageUrl, FOOD_PLACEHOLDER } from '../utils/imageUtils';

const AdminPostManagement = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });
    const [confirmPostId, setConfirmPostId] = useState(null);

    useEffect(() => {
        fetchPosts();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchPosts(search);
        }, 300); // Small debounce for realtime search
        return () => clearTimeout(timer);
    }, [search]);

    const fetchPosts = async (username = '') => {
        try {
            setLoading(true);
            const data = await userService.getPosts(username);
            setPosts(data);
        } catch (error) {
            console.error('Error fetching posts:', error);
            showNotification('error', 'Failed to fetch posts');
        } finally {
            setLoading(false);
        }
    };

    const showNotification = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    const handleConfirmRemove = async () => {
        await userService.removePost(confirmPostId);
        setConfirmPostId(null);
        fetchPosts(search);
    };

    const handleCancelRemove = () => {
        setConfirmPostId(null);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    return (
        <div className="flex min-h-screen bg-transparent">
            <AdminSidebar />

            <main className="flex-1 p-8">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-[#3E4958]">Social Feed Management</h1>
                        <p className="text-gray-500">Manage and moderate community food posts</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search by username..."
                                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-[#FF7F50]"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {message.text && (
                    <div className={`px-6 py-3 rounded-lg mb-6 flex items-center shadow-sm animate-fade-in ${message.type === 'success' ? 'bg-[#48BB78] text-white' : 'bg-red-500 text-white'
                        }`}>
                        {message.text}
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-[#F8F9FA] border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase">Image</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase">Username</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase">Email</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase">Date & Time</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                                        <div className="flex justify-center items-center">
                                            <Loader2 className="animate-spin mr-2" size={24} />
                                            <span>Fetching posts...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : posts.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                                        No posts found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                posts.map((post) => (
                                    <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <img
                                                src={getImageUrl(post.imageUrl) || FOOD_PLACEHOLDER}
                                                alt="Post"
                                                className="w-10 h-10 rounded-lg object-cover"
                                            />
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-gray-800">
                                            {post.author?.name || 'Unknown User'}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {post.author?.email || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {formatDate(post.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => setConfirmPostId(post.id)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
            {confirmPostId && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full mx-4">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Remove Post</h3>
                        <p className="text-gray-600 mb-6">Are you sure you want to remove this post? This action cannot be undone.</p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={handleCancelRemove}
                                className="px-5 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmRemove}
                                className="px-5 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 font-medium"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPostManagement;
