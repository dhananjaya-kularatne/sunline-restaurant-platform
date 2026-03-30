import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const AddToCartModal = ({ item, isOpen, onClose, onAdd }) => {
    const [quantity, setQuantity] = useState(1);
    const [instructions, setInstructions] = useState('');

    if (!isOpen || !item) return null;

    const handleIncrement = () => setQuantity(prev => prev + 1);
    const handleDecrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd(item, quantity, instructions);
        setQuantity(1);
        setInstructions('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div 
                className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header with Image */}
                <div className="relative h-48 overflow-hidden">
                    <img 
                        src={item.imageUrl || 'https://via.placeholder.com/400x300?text=Delicious+Food'} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-4 left-6">
                        <h2 className="text-2xl font-bold text-white tracking-tight">{item.name}</h2>
                        <p className="text-[#FF7F50] font-bold text-lg">LKR {item.price.toFixed(0)}</p>
                    </div>
                </div>

                <div className="p-8">
                    <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                        {item.description}
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Quantity Selector */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Quantity
                            </label>
                            <div className="flex items-center space-x-6">
                                <div className="flex items-center border border-gray-300 rounded-lg p-1">
                                    <button
                                        type="button"
                                        onClick={handleDecrement}
                                        className="p-2 text-gray-500 hover:text-primary transition-all"
                                    >
                                        <Minus size={18} />
                                    </button>
                                    <span className="w-10 text-center font-bold text-gray-800">{quantity}</span>
                                    <button
                                        type="button"
                                        onClick={handleIncrement}
                                        className="p-2 text-gray-500 hover:text-primary transition-all"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>
                                <div className="text-gray-500 text-sm font-medium">
                                    Total: <span className="text-gray-900 font-bold ml-1">LKR {(item.price * quantity).toFixed(0)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Special Instructions */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Special Instructions <span className="text-gray-400 font-normal italic">(optional)</span>
                            </label>
                            <textarea
                                value={instructions}
                                onChange={(e) => setInstructions(e.target.value)}
                                placeholder="Extra spicy? No onions? Let us know!"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none resize-none min-h-[100px] placeholder-gray-400 text-gray-700"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-3 border border-gray-300 rounded-lg font-bold text-gray-600 hover:bg-gray-50 transition-all active:scale-[0.98]"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-[2] py-3 bg-primary text-white rounded-lg font-bold hover:opacity-90 transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                <span>Add to Cart</span>
                                <Plus size={18} />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddToCartModal;
