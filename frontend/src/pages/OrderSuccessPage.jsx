import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { CheckCircle, ShoppingBag, ArrowRight, Utensils } from 'lucide-react';

const OrderSuccessPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const orderData = location.state?.order;

    return (
        <div className="bg-transparent min-h-[80vh] flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 animate-in zoom-in duration-500">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <CheckCircle className="text-white" size={32} />
                </div>
                
                <h1 className="text-3xl font-black text-gray-900 mb-2">Order Placed!</h1>
                <p className="text-gray-500 mb-8 font-medium">
                    Your delicious meal is being processed. 
                    {orderData && <span className="block mt-1 font-bold text-primary">Order ID: #{orderData.id.toString().padStart(5, '0')}</span>}
                </p>

                <div className="space-y-4">
                    <button 
                        onClick={() => navigate('/my-orders')}
                        className="w-full bg-primary text-white py-3 rounded-lg font-bold flex items-center justify-center hover:opacity-90 transition-all shadow-md active:scale-[0.98] space-x-2"
                    >
                        <span>Track Your Order</span>
                        <ShoppingBag size={20} />
                    </button>
                    
                    <button 
                        onClick={() => navigate('/menu')}
                        className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-bold flex items-center justify-center hover:bg-gray-50 transition-all active:scale-[0.98] space-x-2"
                    >
                        <span>Place Another Order</span>
                        <Utensils size={20} />
                    </button>
                </div>

                <div className="mt-10 pt-8 border-t border-gray-50 flex items-center justify-center text-gray-400 text-sm font-medium">
                    <p>Estimated delivery: 30-45 mins</p>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccessPage;
