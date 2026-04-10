import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, X, Check, AlertCircle } from 'lucide-react';
import menuService from '../services/menuService';
import AdminSidebar from '../components/AdminSidebar';
import { FOOD_PLACEHOLDER } from '../utils/imageUtils';

const AdminMenuManagement = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        categories: '',
        imageUrl: '',
        isAvailable: true
    });

    useEffect(() => {
        fetchMenuItems();
    }, []);

    const fetchMenuItems = async () => {
        try {
            setLoading(true);
            const data = await menuService.getAllMenuItems();
            setMenuItems(data);
        } catch (error) {
            console.error('Error fetching menu items:', error);
            showNotification('error', 'Failed to fetch menu items');
        } finally {
            setLoading(false);
        }
    };

    const showNotification = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    const handleOpenModal = (item = null) => {
        if (item) {
            setCurrentItem(item);
            setFormData({
                name: item.name,
                description: item.description,
                price: item.price,
                categories: item.categories ? item.categories.join(', ') : '',
                imageUrl: item.imageUrl,
                isAvailable: item.isAvailable
            });
        } else {
            setCurrentItem(null);
            setFormData({
                name: '',
                description: '',
                price: '',
                categories: '',
                imageUrl: '',
                isAvailable: true
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentItem(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                price: parseFloat(formData.price),
                categories: formData.categories.split(',').map(c => c.trim()).filter(c => c !== '')
            };

            if (currentItem) {
                await menuService.updateMenuItem(currentItem.id, payload);
                showNotification('success', 'Menu item updated successfully!');
            } else {
                await menuService.addMenuItem(payload);
                showNotification('success', 'Menu item added successfully!');
            }
            handleCloseModal();
            fetchMenuItems();
        } catch (error) {
            console.error('Error saving menu item:', error);
            showNotification('error', 'Failed to save menu item');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this menu item?')) {
            try {
                await menuService.deleteMenuItem(id);
                showNotification('success', 'Menu item deleted successfully!');
                fetchMenuItems();
            } catch (error) {
                console.error('Error deleting menu item:', error);
                showNotification('error', 'Failed to delete menu item');
            }
        }
    };

    const filteredItems = menuItems.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        (item.categories && item.categories.some(cat => cat.toLowerCase().includes(search.toLowerCase())))
    );

    return (
        <div className="flex min-h-screen bg-transparent">
            <AdminSidebar />

            <main className="flex-1 p-8">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-[#3E4958]">Menu Management</h1>
                        <p className="text-gray-500">Manage your restaurant menu items</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search menu..."
                                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-[#FF7F50]"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={() => handleOpenModal()}
                            className="bg-[#FF7F50] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#E66F45] transition-colors"
                        >
                            <Plus size={18} />
                            Add Item
                        </button>
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
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase">Item</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase">Category</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase">Price</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase">Status</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-500">Loading menu...</td></tr>
                            ) : filteredItems.length === 0 ? (
                                <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-500">No items found.</td></tr>
                            ) : (
                                filteredItems.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={item.imageUrl || FOOD_PLACEHOLDER}
                                                    alt={item.name}
                                                    className="w-10 h-10 rounded-lg object-cover"
                                                />
                                                <div>
                                                    <div className="font-semibold text-gray-800">{item.name}</div>
                                                    <div className="text-xs text-gray-500 truncate w-48">{item.description}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {item.categories.map(cat => (
                                                    <span key={cat} className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                                                        {cat}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-700">LKR {item.price}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${item.isAvailable ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {item.isAvailable ? 'AVAILABLE' : 'UNAVAILABLE'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpenModal(item)}
                                                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
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

                {/* Add/Edit Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-scale-in">
                            <div className="bg-[#3E4958] p-6 flex justify-between items-center">
                                <h3 className="text-xl font-bold text-white">
                                    {currentItem ? 'Edit Menu Item' : 'Add New Menu Item'}
                                </h3>
                                <button onClick={handleCloseModal} className="text-white hover:text-[#FF7F50] transition-colors">
                                    <X size={24} />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Item Name *</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF7F50] outline-none"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                                    <textarea
                                        rows="3"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF7F50] outline-none resize-none"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    ></textarea>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Price (LKR) *</label>
                                        <input
                                            required
                                            type="number"
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF7F50] outline-none"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Category (comma separated) *</label>
                                        <input
                                            required
                                            placeholder="Main, Rice, Spicy"
                                            type="text"
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF7F50] outline-none"
                                            value={formData.categories}
                                            onChange={(e) => setFormData({ ...formData, categories: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Image URL</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF7F50] outline-none"
                                        value={formData.imageUrl}
                                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="isAvailable"
                                        className="w-5 h-5 accent-[#FF7F50]"
                                        checked={formData.isAvailable}
                                        onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                                    />
                                    <label htmlFor="isAvailable" className="text-sm font-semibold text-gray-700">Available for ordering</label>
                                </div>
                                <div className="pt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 font-bold hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-[#FF7F50] text-white rounded-lg font-bold hover:bg-[#E66F45]"
                                    >
                                        {currentItem ? 'Update Item' : 'Add Item'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminMenuManagement;
