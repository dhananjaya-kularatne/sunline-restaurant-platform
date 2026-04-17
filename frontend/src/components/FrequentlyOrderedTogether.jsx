import React, { useEffect, useState } from 'react';
import { Plus, ShoppingBasket } from 'lucide-react';
import { useCart } from '../context/CartContext';
import menuService from '../services/menuService';
import AddToCartModal from './AddToCartModal';
import { FOOD_PLACEHOLDER } from '../utils/imageUtils';

const FrequentlyOrderedTogether = () => {
    const { cartItems, addToCart } = useCart();
    const [suggestions, setSuggestions] = useState([]);
    const [modalItem, setModalItem] = useState(null);

    useEffect(() => {
        if (cartItems.length === 0) {
            setSuggestions([]);
            return;
        }

        const cartItemIds = [...new Set(cartItems.map(item => item.id))];

        menuService.getFrequentlyOrderedTogether(cartItemIds, 4)
            .then(data => setSuggestions(data))
            .catch(() => setSuggestions([]));
    }, [cartItems]);

    if (suggestions.length === 0) return null;

    const handleAdd = (item, quantity, instructions) => {
        addToCart(item, quantity, instructions);
        setModalItem(null);
    };

    return (
        <div className="mt-10">
            <div className="flex items-center gap-2 mb-5">
                <ShoppingBasket size={20} className="text-primary" />
                <h2 className="text-xl font-bold text-gray-800">Frequently Ordered Together</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {suggestions.map(item => (
                    <div
                        key={item.id}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-all duration-300"
                    >
                        <div className="relative h-32 overflow-hidden">
                            <img
                                src={item.imageUrl || FOOD_PLACEHOLDER}
                                alt={item.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        <div className="p-3">
                            <p className="font-bold text-gray-800 text-sm leading-tight line-clamp-1">{item.name}</p>
                            <p className="text-primary font-bold text-sm mt-0.5">LKR {item.price.toFixed(0)}</p>
                            <button
                                onClick={() => setModalItem(item)}
                                className="mt-2 w-full flex items-center justify-center gap-1 bg-primary text-white text-xs font-bold py-1.5 rounded-lg hover:opacity-90 transition-all active:scale-[0.97]"
                            >
                                <Plus size={13} />
                                Add
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <AddToCartModal
                item={modalItem}
                isOpen={!!modalItem}
                onClose={() => setModalItem(null)}
                onAdd={handleAdd}
            />
        </div>
    );
};

export default FrequentlyOrderedTogether;
