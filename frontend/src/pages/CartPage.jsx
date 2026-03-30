import React from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const CartPage = () => {
    const { cartItems, removeFromCart, updateQuantity, totalPrice, totalCount } = useCart();

    const taxRate = 0.1; // 10% tax
    const deliveryFee = totalCount > 0 ? 250 : 0;
    const taxAmount = totalPrice * taxRate;
    const finalTotal = totalPrice + taxAmount + deliveryFee;

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
                <div className="bg-white p-12 rounded-[3rem] shadow-xl text-center max-w-lg border border-gray-100">
                    <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                        <ShoppingBag className="text-orange-600" size={48} />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 mb-4">Your cart is empty</h2>
                    <p className="text-gray-500 mb-10 leading-relaxed">
                        Looks like you haven't added any delicacies yet. Explore our menu and find something delicious!
                    </p>
                    <Link
                        to="/menu"
                        className="inline-flex items-center space-x-3 bg-orange-600 text-white px-10 py-5 rounded-2xl font-bold hover:bg-orange-700 hover:shadow-2xl hover:shadow-orange-200 transition-all active:scale-95"
                    >
                        <ArrowLeft size={20} />
                        <span>Explore Menu</span>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Your <span className="text-orange-600">Cart</span></h1>
                        <p className="text-gray-500 font-medium mt-1">Review your selection before checkout</p>
                    </div>
                    <Link to="/menu" className="text-orange-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
                        <ArrowLeft size={20} />
                        Continue Shopping
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-6">
                        {cartItems.map((item, index) => (
                            <div key={`${item.id}-${index}`} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-6 group hover:shadow-md transition-all duration-300">
                                {/* Item Image */}
                                <div className="w-full sm:w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0">
                                    <img 
                                        src={item.imageUrl || 'https://via.placeholder.com/400x300?text=Food'} 
                                        alt={item.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>

                                {/* Item Content */}
                                <div className="flex-grow flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">{item.name}</h3>
                                            <p className="text-orange-600 font-black mt-1">LKR {item.price.toFixed(0)}</p>
                                        </div>
                                        <button 
                                            onClick={() => removeFromCart(index)}
                                            className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                            title="Remove item"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>

                                    {item.instructions && (
                                        <div className="mt-3 flex items-start gap-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                            <MessageSquare size={14} className="text-orange-400 mt-1 flex-shrink-0" />
                                            <p className="text-xs text-gray-500 italic leading-relaxed font-medium">"{item.instructions}"</p>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between mt-6">
                                        <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
                                            <button
                                                onClick={() => updateQuantity(index, item.quantity - 1)}
                                                className="p-1.5 text-gray-500 hover:text-orange-600 hover:bg-white rounded-lg transition-all"
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span className="w-10 text-center font-bold text-gray-800">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(index, item.quantity + 1)}
                                                className="p-1.5 text-gray-500 hover:text-orange-600 hover:bg-white rounded-lg transition-all"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-400 uppercase font-black tracking-widest mb-1">Subtotal</p>
                                            <p className="text-lg font-black text-gray-900">LKR {(item.price * item.quantity).toFixed(0)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 sticky top-28">
                            <h2 className="text-2xl font-black text-gray-900 mb-8 border-b border-gray-50 pb-4">Summary</h2>
                            
                            <div className="space-y-5">
                                <div className="flex justify-between text-gray-500 font-medium">
                                    <span>Items ({totalCount})</span>
                                    <span className="text-gray-900 font-bold">LKR {totalPrice.toFixed(0)}</span>
                                </div>
                                <div className="flex justify-between text-gray-500 font-medium">
                                    <span>Tax (10%)</span>
                                    <span className="text-gray-900 font-bold">LKR {taxAmount.toFixed(0)}</span>
                                </div>
                                <div className="flex justify-between text-gray-500 font-medium pb-2">
                                    <span>Delivery Fee</span>
                                    <span className="text-green-600 font-bold">LKR {deliveryFee.toFixed(0)}</span>
                                </div>
                                
                                <div className="pt-6 border-t border-gray-100 flex justify-between items-end">
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-black tracking-[0.2em] mb-1">Total Amount</p>
                                        <p className="text-4xl font-black text-gray-900">LKR {finalTotal.toFixed(0)}</p>
                                    </div>
                                </div>

                                <button className="w-full bg-orange-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-orange-700 hover:shadow-2xl hover:shadow-orange-200 transition-all active:scale-95 mt-8 shadow-lg shadow-orange-100">
                                    Place Order
                                </button>
                                
                                <p className="text-[10px] text-center text-gray-400 uppercase font-bold tracking-widest pt-4">
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
