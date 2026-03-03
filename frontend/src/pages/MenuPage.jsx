import React, { useState, useEffect } from 'react';
import menuService from '../services/menuService';

const MenuPage = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const data = await menuService.getAllMenuItems();
                setMenuItems(data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load menu items. Please try again later.');
                setLoading(false);
            }
        };

        fetchMenu();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500 font-semibold">
                {error}
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <header className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                        Our <span className="text-orange-600">Sri Lankan</span> Menu
                    </h1>
                    <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
                        Authentic flavors from the heart of the Indian Ocean
                    </p>
                </header>

                <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                    {menuItems.map((item) => (
                        <div key={item.id} className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100">
                            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200 xl:aspect-w-7 xl:aspect-h-8">
                                <img
                                    src={item.imageUrl || 'https://via.placeholder.com/300?text=No+Image'}
                                    alt={item.name}
                                    className="h-64 w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-orange-600 shadow-sm">
                                    LKR {item.price.toFixed(0)}
                                </div>
                                <div className="absolute top-4 left-4 bg-orange-600/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-white shadow-sm">
                                    {item.category}
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                                    {item.name}
                                </h3>
                                <p className="mt-2 text-sm text-gray-500 line-clamp-2 leading-relaxed">
                                    {item.description}
                                </p>
                                <button className="mt-6 w-full bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors duration-300 flex items-center justify-center space-x-2">
                                    <span>Add to Cart</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 100-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MenuPage;
