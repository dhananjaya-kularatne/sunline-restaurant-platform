import React, { useState, useEffect, useMemo } from 'react';
import menuService from '../services/menuService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart } from 'lucide-react';
import AddToCartModal from '../components/AddToCartModal';
import { FOOD_PLACEHOLDER } from '../utils/imageUtils';

const MenuPage = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const { user } = useAuth();
    const [wishlistIds, setWishlistIds] = useState(new Set());
    const [wishlistMessage, setWishlistMessage] = useState('');

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const data = await menuService.getAvailableMenuItems();
                setMenuItems(data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load menu items. Please try again later.');
                setLoading(false);
            }
        };

        fetchMenu();
    }, []);

    useEffect(() => {
        if (!user) {
            setWishlistIds(new Set());
            return;
        }
        const fetchWishlist = async () => {
            try {
                const data = await menuService.getWishlist();
                setWishlistIds(new Set(data.map(item => item.id)));
            } catch (err) {}
        };
        fetchWishlist();
    }, [user]);

    // Extract unique categories from all items
    const categories = useMemo(() => {
        const allCats = menuItems.flatMap(item => item.categories || []);
        return ['All', ...new Set(allCats)];
    }, [menuItems]);

    // Filter items based on selected category AND search query
    const filteredItems = useMemo(() => {
        return menuItems.filter(item => {
            const matchesCategory = selectedCategory === 'All' ||
                (item.categories && item.categories.includes(selectedCategory));

            const matchesSearch = searchQuery.trim() === '' ||
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (item.categories && item.categories.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase())));

            return matchesCategory && matchesSearch;
        });
    }, [menuItems, selectedCategory, searchQuery]);

    const { addToCart } = useCart();
    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddToCartClick = (item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const handleWishlistToggle = async (itemId) => {
        if (!user) {
            setWishlistMessage('Please log in to save items to your Wishlist.');
            setTimeout(() => setWishlistMessage(''), 3000);
            return;
        }
        try {
            if (wishlistIds.has(itemId)) {
                await menuService.removeFromWishlist(itemId);
                setWishlistIds(prev => { const next = new Set(prev); next.delete(itemId); return next; });
            } else {
                await menuService.addToWishlist(itemId);
                setWishlistIds(prev => new Set(prev).add(itemId));
            }
        } catch (err) {}
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-transparent">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#FF7F50]"></div>
                    <p className="mt-4 text-gray-600 font-medium animate-pulse">Loading Sri Lankan Delicacies...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-transparent p-4 text-center">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md">
                    <div className="text-red-500 text-5xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
                    <p className="text-gray-600">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 bg-[#FF7F50] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#e06b3f] transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-transparent min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <header className="text-center mb-12">
                    <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight sm:text-6xl">
                        Our <span className="text-[#FF7F50]">Premium</span> Menu
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                        Explore authentic Sri Lankan flavors, curated for every palate.
                    </p>
                </header>

                {/* Search Bar */}
                <div className="max-w-2xl mx-auto mb-8">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400 group-focus-within:text-[#FF7F50] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search dishes by name or category..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full pl-11 pr-4 py-4 border-none bg-white rounded-2xl shadow-sm focus:ring-2 focus:ring-orange-500 transition-all duration-300 placeholder-gray-400 text-gray-700 font-medium"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="mb-12 flex flex-wrap justify-center gap-3">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 shadow-sm ${selectedCategory === category
                                ? 'bg-[#FF7F50] text-white scale-105 shadow-orange-200'
                                : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-[#FF7F50]'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Results Count Summary */}
                <div className="mb-8 text-center">
                    <p className="text-gray-500 font-medium">
                        Showing {filteredItems.length} {filteredItems.length === 1 ? 'dish' : 'dishes'}
                        {searchQuery && <span> for "<span className="text-[#FF7F50]">{searchQuery}</span>"</span>}
                        {selectedCategory !== 'All' && <span> in <span className="text-[#FF7F50]">{selectedCategory}</span></span>}
                    </p>
                </div>

                {/* Items Grid */}
                <div className="grid grid-cols-1 gap-y-12 gap-x-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredItems.map((item) => (
                        <div key={item.id} className="group relative bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col h-full border border-gray-100">
                            {/* Image Container */}
                            <div className="aspect-w-16 aspect-h-9 w-full overflow-hidden relative">
                                <img
                                    src={item.imageUrl || FOOD_PLACEHOLDER}
                                    alt={item.name}
                                    className="h-64 w-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                                />
                                <button
                                    onClick={(e) => { e.preventDefault(); handleWishlistToggle(item.id); }}
                                    className="absolute top-3 left-3 p-2 rounded-full bg-white/90 backdrop-blur-md shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 z-10"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className={`h-5 w-5 transition-colors duration-200 ${wishlistIds.has(item.id) ? 'text-[#FF7F50] fill-[#FF7F50]' : 'text-gray-400 fill-none'}`}
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                    </svg>
                                </button>
                                {/* Availability Overlay */}
                                {!item.isAvailable && (
                                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                                        <span className="text-white font-semibold text-base px-5 py-2 rounded-full bg-black/50 border border-white/60">Sold Out</span>
                                    </div>
                                )}
                                {/* Price Tag */}
                                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl text-lg font-black text-[#FF7F50] shadow-lg">
                                    LKR {item.price.toFixed(0)}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-8 flex flex-col flex-grow">
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {item.categories && item.categories.map(cat => (
                                        <span
                                            key={cat}
                                            className="bg-orange-50 text-[#FF7F50] text-[10px] uppercase tracking-wider font-extrabold px-2 py-1 rounded-md border border-orange-100"
                                        >
                                            {cat}
                                        </span>
                                    ))}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#FF7F50] transition-colors">
                                    {item.name}
                                </h3>
                                <p className="text-sm text-gray-500 leading-relaxed mb-6 line-clamp-3">
                                    {item.description}
                                </p>

                                {/* Footer Action */}
                                <div className="mt-auto pt-6 border-t border-gray-50">
                                    <button
                                        disabled={!item.isAvailable}
                                        onClick={() => handleAddToCartClick(item)}
                                        className={`w-full py-3 rounded-lg font-bold flex items-center justify-center space-x-2 transition-all duration-300 shadow-sm ${item.isAvailable
                                            ? 'bg-primary text-white hover:opacity-90 active:scale-[0.98]'
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            }`}
                                    >
                                        <span>Add to Cart</span>
                                        <ShoppingCart size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredItems.length === 0 && (
                    <div className="text-center py-20 px-4">
                        <div className="bg-white inline-block p-10 rounded-3xl shadow-sm border border-gray-100 max-w-lg">
                            <div className="text-6xl mb-6">🍛</div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">No dishes found</h3>
                            <p className="text-gray-500 mb-8">We couldn't find any items matching your current filters. Try searching for something else or clearing your filters.</p>
                            <button
                                onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                                className="bg-[#FF7F50] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#e06b3f] transition-colors shadow-lg shadow-orange-200"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    </div>
                )}

                <AddToCartModal
                    item={selectedItem}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onAdd={addToCart}
                />
            </div>
            {wishlistMessage && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
                    <div className="bg-[#FF7F50] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 font-bold">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{wishlistMessage}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MenuPage;
