import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import orderService from '../services/orderService';
import { ShoppingBag, ArrowLeft, CreditCard, Truck, Phone, User, Mail, MapPin } from 'lucide-react';

const CheckoutPage = () => {
    const { cartItems, totalPrice, totalCount, clearCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: ''
    });

    const taxRate = 0.1;
    const deliveryFee = 250;
    const taxAmount = totalPrice * taxRate;
    const finalTotal = totalPrice + taxAmount + deliveryFee;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!formData.fullName || !formData.email || !formData.phone || !formData.address) {
            setError("Please fill out all the delivery information fields.");
            setLoading(false);
            return;
        }

        if (cartItems.length === 0) {
            setError("Your cart is empty. Cannot place an order.");
            setLoading(false);
            return;
        }

        try {
            const orderRequest = {
                ...formData,
                totalPrice: finalTotal,
                items: cartItems.map(item => ({
                    menuItemId: item.id,
                    quantity: item.quantity,
                    price: item.price,
                    specialInstructions: item.instructions || ''
                }))
            };

            const savedOrder = await orderService.placeOrder(orderRequest);
            clearCart();
            navigate('/order-success', { state: { order: savedOrder } });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        navigate('/cart');
        return null;
    }

    return (
        <div className="bg-transparent min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center mb-10">
                    <button 
                        onClick={() => navigate('/cart')}
                        className="p-2 bg-white rounded-full shadow-sm text-gray-500 hover:text-primary transition-all mr-4"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Checkout</h1>
                        <p className="text-gray-500 mt-1">Complete your order with delivery details</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Delivery Form */}
                    <div className="lg:col-span-7">
                        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10 border border-gray-100">
                            <div className="flex items-center space-x-3 mb-8">
                                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                                    <Truck className="text-primary" size={24} />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Delivery Information</h2>
                            </div>

                            {error && (
                                <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                    <p className="text-sm font-medium">{error}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="flex items-center text-sm font-bold text-gray-700 mb-2 ml-1">
                                            <User size={14} className="mr-2 text-primary" />
                                            Full Name
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            placeholder="John Doe"
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="flex items-center text-sm font-bold text-gray-700 mb-2 ml-1">
                                            <Mail size={14} className="mr-2 text-primary" />
                                            Email Address
                                        </label>
                                        <input
                                            required
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="john@example.com"
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="flex items-center text-sm font-bold text-gray-700 mb-2 ml-1">
                                        <Phone size={14} className="mr-2 text-primary" />
                                        Phone Number
                                    </label>
                                    <input
                                        required
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="077 123 4567"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center text-sm font-bold text-gray-700 mb-2 ml-1">
                                        <MapPin size={14} className="mr-2 text-primary" />
                                        Delivery Address
                                    </label>
                                    <textarea
                                        required
                                        name="address"
                                        rows="4"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="Enter your full street address, apartment, city..."
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none resize-none"
                                    />
                                </div>

                                <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center text-gray-500 text-sm italic">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                                        Payment is Cash on Delivery
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className={`px-10 py-3 bg-primary text-white rounded-lg font-bold text-lg shadow-md hover:opacity-90 active:scale-[0.98] transition-all flex items-center space-x-3 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {loading ? (
                                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <span>Place Order</span>
                                                <CreditCard size={20} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-5">
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 sticky top-28">
                            <div className="p-8 border-b border-gray-50 bg-gray-50/50">
                                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                                    <ShoppingBag size={20} className="mr-2 text-primary" />
                                    Order Summary
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">{totalCount} items in your bag</p>
                            </div>

                            <div className="p-8 max-h-[400px] overflow-y-auto space-y-4">
                                {cartItems.map((item, index) => (
                                    <div key={index} className="flex space-x-4 items-center">
                                        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-grow">
                                            <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{item.name}</h4>
                                            <p className="text-xs text-gray-500">Qty: {item.quantity} × LKR {item.price}</p>
                                        </div>
                                        <div className="text-sm font-bold text-gray-900">
                                            LKR {item.price * item.quantity}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-8 bg-gray-50/50 border-t border-gray-50 space-y-3">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-bold">LKR {totalPrice.toFixed(0)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Tax (10%)</span>
                                    <span className="font-bold">LKR {taxAmount.toFixed(0)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Delivery Fee</span>
                                    <span className="font-bold text-green-600">LKR {deliveryFee.toFixed(0)}</span>
                                </div>
                                <div className="pt-4 border-t border-gray-200 flex justify-between items-end">
                                    <span className="text-base font-bold text-gray-900">Total Amount</span>
                                    <span className="text-2xl font-black text-primary">LKR {finalTotal.toFixed(0)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
