import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Utensils, Star, Clock, MapPin } from 'lucide-react';

const HomePage = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
            <div className="max-w-4xl w-full">
                {user ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="inline-flex items-center justify-center p-4 bg-primary/10 text-primary rounded-3xl mb-8">
                            <Utensils size={48} />
                        </div>

                        <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
                            Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF7F50] to-[#ffb347]">{user.name}</span>!
                        </h1>

                        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
                            What are you craving today? Explore our latest menus and get the best flavors
                            delivered to your doorstep in minutes.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mb-12">
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="p-3 bg-orange-50 text-orange-500 rounded-2xl w-fit mb-4">
                                    <Star size={24} />
                                </div>
                                <h3 className="font-bold text-lg text-gray-800 mb-2">New Restaurants</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">Discover 15+ new places added this week in your area.</p>
                            </div>
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl w-fit mb-4">
                                    <Clock size={24} />
                                </div>
                                <h3 className="font-bold text-lg text-gray-800 mb-2">Fast Track</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">Your order will be prioritized for ultra-fast delivery.</p>
                            </div>
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="p-3 bg-red-50 text-red-500 rounded-2xl w-fit mb-4">
                                    <MapPin size={24} />
                                </div>
                                <h3 className="font-bold text-lg text-gray-800 mb-2">Live Status</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">Real-time GPS tracking for every order you place.</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="bg-primary text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                                Explore Menu
                            </button>
                            <button className="bg-white text-gray-800 px-10 py-5 rounded-2xl font-bold text-lg border border-gray-200 hover:bg-gray-50 transition-all">
                                Track Order
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="inline-flex items-center justify-center p-4 bg-primary/10 text-primary rounded-3xl mb-8">
                            <Utensils size={48} />
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 tracking-tight">
                            Delicious food, <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF7F50] to-[#ffb347]">delivered to you.</span>
                        </h1>

                        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
                            Join Sunline Restaurant today and experience the easiest way to order from your
                            favorite local restaurants. Freshness, speed, and variety.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mb-12">
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                                <Star className="text-orange-400 mb-3" />
                                <h3 className="font-bold text-lg text-gray-800 mb-1">Top Rated</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">Only the best restaurants with curated excellence.</p>
                            </div>
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                                <Clock className="text-blue-500 mb-3" />
                                <h3 className="font-bold text-lg text-gray-800 mb-1">Fast Delivery</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">Average delivery time of less than 30 minutes.</p>
                            </div>
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                                <MapPin className="text-red-500 mb-3" />
                                <h3 className="font-bold text-lg text-gray-800 mb-1">Live Tracking</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">Watch your meal travel to you in real-time.</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/register" className="bg-primary text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center">
                                Get Started
                            </Link>
                            <Link to="/login" className="bg-white text-gray-800 px-10 py-5 rounded-2xl font-bold text-lg border border-gray-200 hover:bg-gray-50 transition-all flex items-center justify-center">
                                Sign In
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;
