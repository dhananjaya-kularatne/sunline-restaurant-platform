import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import menuService from '../services/menuService';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import AddToCartModal from '../components/AddToCartModal';
import { Loader2 } from 'lucide-react';

const WishlistPage = () => {
    const { user } = useAuth();
    const { addToCart } = useCart();
    const [wishlistItems, setWishlistItems] = useState([]);
    const [wishlistIds, setWishlistIds] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const data = await menuService.getWishlist();
                setWishlistItems(data);
                setWishlistIds(new Set(data.map(item => item.id)));
            } catch (err) {}
            finally { setLoading(false); }
        };
        fetchWishlist();
    }, []);

    const handleRemove = async (itemId) => {
        try {
            await menuService.removeFromWishlist(itemId);
            setWishlistItems(prev => prev.filter(item => item.id !== itemId));
            setWishlistIds(prev => { const next = new Set(prev); next.delete(itemId); return next; });
        } catch (err) {}
    };

    const handleAddToCartClick = (item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-transparent">
                <Loader2 className="h-12 w-12 animate-spin text-orange-600" />
            </div>
        );
    }

    return (
        <div className="bg-transparent min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <header className="text-center mb-12">
                    <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight sm:text-6xl">
                        My <span className="text-orange-600">Wishlist</span>
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                        Your saved favourites, all in one place.
                    </p>
                </header>

                {wishlistItems.length === 0 ? (
                    <div className="text-center py-20 px-4">
                        <div className="bg-white inline-block p-10 rounded-3xl shadow-sm border border-gray-100 max-w-lg">
                            <div className="text-6xl mb-6">🔖</div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">Your wishlist is empty</h3>
                            <p className="text-gray-500 mb-8">Browse our menu and save your favourite dishes here.</p>
                            <Link
                                to="/menu"
                                className="bg-orange-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-orange-700 transition-colors shadow-lg shadow-orange-200"
                            >
                                Browse Menu
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-y-12 gap-x-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {wishlistItems.map((item) => (
                            <div key={item.id} className="group relative bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col h-full border border-gray-100">
                                <div className="aspect-w-16 aspect-h-9 w-full overflow-hidden relative">
                                    <img
                                        src={item.imageUrl || 'https://via.placeholder.com/400x300?text=Delicious+Food'}
                                        alt={item.name}
                                        className="h-64 w-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <button
                                        onClick={() => handleRemove(item.id)}
                                        className="absolute top-3 left-3 p-2 rounded-full bg-white/90 backdrop-blur-md shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 z-10"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 text-orange-500 fill-orange-500"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                        </svg>
                                    </button>
                                    {!item.isAvailable && (
                                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                                            <span className="text-white font-bold text-xl uppercase tracking-widest px-4 py-2 border-2 border-white">Sold Out</span>
                                        </div>
                                    )}
                                    <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl text-lg font-black text-orange-600 shadow-lg">
                                        LKR {item.price.toFixed(0)}
                                    </div>
                                </div>
                                <div className="p-8 flex flex-col flex-grow">
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {item.categories && item.categories.map(cat => (
                                            <span
                                                key={cat}
                                                className="bg-orange-50 text-orange-600 text-[10px] uppercase tracking-wider font-extrabold px-2 py-1 rounded-md border border-orange-100"
                                            >
                                                {cat}
                                            </span>
                                        ))}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                                        {item.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 leading-relaxed mb-6 line-clamp-3">
                                        {item.description}
                                    </p>
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
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <AddToCartModal
                item={selectedItem}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={addToCart}
            />
        </div>
    );
};

export default WishlistPage;
