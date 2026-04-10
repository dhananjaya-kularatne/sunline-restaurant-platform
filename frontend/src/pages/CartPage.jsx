import React from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FOOD_PLACEHOLDER } from '../utils/imageUtils';

const CartPage = () => {
    const { cartItems, removeFromCart, updateQuantity, totalPrice, totalCount } = useCart();

    const taxRate = 0.1; // 10% tax
    const deliveryFee = totalCount > 0 ? 250 : 0;
    const taxAmount = totalPrice * taxRate;
    const finalTotal = totalPrice + taxAmount + deliveryFee;

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-6">
                <div className="bg-white p-12 rounded-2xl shadow-xl text-center max-w-lg border border-gray-100 card-shadow">
                    <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <ShoppingBag className="text-[#FF7F50]" size={40} />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
                    <p className="text-gray-500 mb-8 leading-relaxed">
                        Looks like you haven't added any delicacies yet. Explore our menu and find something delicious!
                    </p>
                    <Link
                        to="/menu"
                        className="inline-flex items-center space-x-2 bg-primary text-white px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-all shadow-md active:scale-[0.98]"
                    >
                        <ArrowLeft size={18} />
                        <span>Explore Menu</span>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-transparent min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Your Cart</h1>
                        <p className="text-gray-500 mt-1">Review your selection before checkout</p>
                    </div>
                    <Link to="/menu" className="text-primary font-bold flex items-center gap-2 hover:underline transition-all">
                        <ArrowLeft size={18} />
                        Continue Shopping
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item, index) => (
                            <div key={`${item.id}-${index}`} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-6 group hover:shadow-md transition-all duration-300">
                                {/* Item Image */}
                                <div className="w-full sm:w-28 h-28 rounded-xl overflow-hidden flex-shrink-0">
                                    <img 
                                        src={item.imageUrl || FOOD_PLACEHOLDER}
                                        alt={item.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>

                                {/* Item Content */}
                                <div className="flex-grow flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-800 group-hover:text-primary transition-colors">{item.name}</h3>
                                            <p className="text-primary font-bold mt-0.5">LKR {item.price.toFixed(0)}</p>
                                        </div>
                                        <button 
                                            onClick={() => removeFromCart(index)}
                                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                            title="Remove item"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    {item.instructions && (
                                        <div className="mt-2 flex items-start gap-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                            <MessageSquare size={14} className="text-primary mt-1 flex-shrink-0" />
                                            <p className="text-xs text-gray-500 italic leading-relaxed font-medium">"{item.instructions}"</p>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center border border-gray-300 rounded-lg p-0.5">
                                            <button
                                                onClick={() => updateQuantity(index, item.quantity - 1)}
                                                className="p-1 text-gray-400 hover:text-primary transition-all"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="w-8 text-center font-bold text-gray-700 text-sm">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(index, item.quantity + 1)}
                                                className="p-1 text-gray-400 hover:text-primary transition-all"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Subtotal</p>
                                            <p className="text-base font-bold text-gray-800">LKR {(item.price * item.quantity).toFixed(0)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 sticky top-28 card-shadow">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-4">Summary</h2>
                            
                            <div className="space-y-4">
                                <div className="flex justify-between text-gray-600 font-medium">
                                    <span>Items ({totalCount})</span>
                                    <span className="text-gray-800 font-bold">LKR {totalPrice.toFixed(0)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 font-medium">
                                    <span>Tax (10%)</span>
                                    <span className="text-gray-800 font-bold">LKR {taxAmount.toFixed(0)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 font-medium pb-1">
                                    <span>Delivery Fee</span>
                                    <span className="text-green-600 font-bold">LKR {deliveryFee.toFixed(0)}</span>
                                </div>
                                
                                <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                                    <div>
                                        <p className="text-[11px] text-gray-400 font-semibold mb-0.5">Total Amount</p>
                                        <p className="text-3xl font-bold text-gray-800">LKR {finalTotal.toFixed(0)}</p>
                                    </div>
                                </div>

                                <Link to="/checkout" className="w-full bg-primary text-white py-3.5 rounded-lg font-bold text-lg hover:opacity-90 transition-all shadow-md active:scale-[0.98] mt-6 flex items-center justify-center">
                                    Place Order
                                </Link>
                                
                                <p className="text-[10px] text-center text-gray-400 font-medium pt-4">
                                    Secure Checkout Guaranteed
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
