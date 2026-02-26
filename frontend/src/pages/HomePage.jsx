import { useAuth } from '../context/AuthContext';
import { Utensils, Star, Clock, MapPin } from 'lucide-react';

const HomePage = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
            <div className="max-w-3xl w-full">
                <div className="inline-flex items-center justify-center p-3 bg-primary/10 text-primary rounded-2xl mb-6">
                    <Utensils size={40} />
                </div>

                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
                    Welcome back, <span className="text-primary">{user?.name || 'Guest'}</span>!
                </h1>

                <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                    Ready for a delicious meal? Sunline Restaurant brings the best flavors
                    of the city right to your doorstep.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <Star className="text-orange-400 mb-3" />
                        <h3 className="font-bold text-gray-800 mb-1">Top Rated</h3>
                        <p className="text-sm text-gray-500">Only the best restaurants with curated menus.</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <Clock className="text-blue-500 mb-3" />
                        <h3 className="font-bold text-gray-800 mb-1">Fast Delivery</h3>
                        <p className="text-sm text-gray-500">Average delivery time of less than 30 minutes.</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <MapPin className="text-red-500 mb-3" />
                        <h3 className="font-bold text-gray-800 mb-1">Live Tracking</h3>
                        <p className="text-sm text-gray-500">Track your order in real-time on our map.</p>
                    </div>
                </div>

                <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="bg-primary text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:opacity-90 transition-all">
                        Order Now
                    </button>
                    <button className="bg-white text-gray-800 px-8 py-4 rounded-xl font-bold border border-gray-200 hover:bg-gray-50 transition-all">
                        View Menu
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
