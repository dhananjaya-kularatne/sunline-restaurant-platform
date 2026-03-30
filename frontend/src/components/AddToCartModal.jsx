import React, { useState } from 'react';
import { X, Plus, Minus, Info } from 'lucide-react';

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
                className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header with Image */}
                <div className="relative h-48 overflow-hidden">
                    <img 
                        src={item.imageUrl || 'https://via.placeholder.com/400x300?text=Delicious+Food'} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                    />
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors"
                    >
                        <X size={20} />
                    </button>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-6">
                        <h2 className="text-2xl font-bold text-white">{item.name}</h2>
                        <p className="text-orange-400 font-bold">LKR {item.price.toFixed(0)}</p>
                    </div>
                </div>

                <div className="p-8">
                    <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                        {item.description}
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Quantity Selector */}
                        <div>
                            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
                                Select Quantity
                            </label>
                            <div className="flex items-center space-x-6">
                                <div className="flex items-center border border-gray-100 bg-gray-50 rounded-2xl p-1 shadow-inner">
                                    <button
                                        type="button"
                                        onClick={handleDecrement}
                                        className="p-3 text-gray-500 hover:text-orange-600 hover:bg-white rounded-xl transition-all"
                                    >
                                        <Minus size={18} />
                                    </button>
                                    <span className="w-12 text-center font-black text-lg text-gray-800">{quantity}</span>
                                    <button
                                        type="button"
                                        onClick={handleIncrement}
                                        className="p-3 text-gray-500 hover:text-orange-600 hover:bg-white rounded-xl transition-all"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>
                                <div className="text-gray-400 text-sm font-medium">
                                    Total: <span className="text-gray-900 font-bold ml-1">LKR {(item.price * quantity).toFixed(0)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Special Instructions */}
                        <div>
                            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                                Special Instructions
                                <span className="lowercase font-normal italic tracking-normal">(optional)</span>
                            </label>
                            <textarea
                                value={instructions}
                                onChange={(e) => setInstructions(e.target.value)}
                                placeholder="Extra spicy? No onions? Let us know!"
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-700 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all resize-none min-h-[100px] placeholder-gray-400"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-4 border border-gray-100 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-all active:scale-95"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-[2] py-4 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 hover:shadow-lg hover:shadow-orange-200 transition-all active:scale-95 flex items-center justify-center gap-2"
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
