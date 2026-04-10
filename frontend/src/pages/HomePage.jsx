import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Utensils, Star, Clock, MapPin, TrendingUp, ArrowRight, ShoppingBag, CheckCircle } from 'lucide-react';
import menuService from '../services/menuService';
import { getImageUrl, FOOD_PLACEHOLDER } from '../utils/imageUtils';
import AddToCartModal from '../components/AddToCartModal';

const STATS = [
    { value: '500+', label: 'Happy Customers' },
    { value: '50+',  label: 'Menu Items' },
    { value: '30min', label: 'Avg. Delivery' },
];

const GUEST_FEATURES = [
    {
        icon: <Star size={20} />,
        color: 'text-orange-500 bg-orange-50',
        title: 'Curated Quality',
        desc: 'Every dish is prepared fresh with handpicked ingredients for the best taste.',
    },
    {
        icon: <Clock size={20} />,
        color: 'text-blue-500 bg-blue-50',
        title: 'Fast Delivery',
        desc: 'Average delivery time under 30 minutes — hot food at your door.',
    },
    {
        icon: <MapPin size={20} />,
        color: 'text-rose-500 bg-rose-50',
        title: 'Live Tracking',
        desc: 'Follow your order in real-time from kitchen to your doorstep.',
    },
];

const USER_FEATURES = [
    {
        icon: <ShoppingBag size={20} />,
        color: 'text-orange-500 bg-orange-50',
        title: 'Your Orders',
        desc: 'View your full order history and track active deliveries.',
        to: '/my-orders',
    },
    {
        icon: <Utensils size={20} />,
        color: 'text-blue-500 bg-blue-50',
        title: 'Full Menu',
        desc: 'Explore everything we have on offer and build your next order.',
        to: '/menu',
    },
    {
        icon: <CheckCircle size={20} />,
        color: 'text-emerald-500 bg-emerald-50',
        title: 'Easy Checkout',
        desc: 'Saved details and one-tap reordering for a seamless experience.',
        to: '/menu',
    },
];

const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
};

const HomePage = () => {
    const { user, loading } = useAuth();
    const { addToCart } = useCart();
    const [trendingItems, setTrendingItems] = useState([]);
    const [trendingLoading, setTrendingLoading] = useState(true);
    const [modalItem, setModalItem] = useState(null);

    useEffect(() => {
        const getAvailableFallback = () =>
            menuService.getAvailableMenuItems()
                .then(items => items.slice(0, 4))
                .catch(() => []);

        const fetchTrending = async () => {
            try {
                const trending = await menuService.getTrendingItems(4);
                const items = trending.length > 0 ? trending : await getAvailableFallback();
                setTrendingItems(items);
            } catch {
                setTrendingItems(await getAvailableFallback());
            } finally {
                setTrendingLoading(false);
            }
        };
        fetchTrending();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-[80vh]">

            {/* ── Hero ─────────────────────────────────────────────── */}
            <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">

                {user ? (
                    <>
                        {/* Greeting */}
                        <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">
                            {getGreeting()}
                        </p>
                        <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-5 tracking-tight leading-tight">
                            Welcome back,{' '}
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF7F50] to-[#ffb347]">
                                {user.name}
                            </span>
                        </h1>
                        <p className="text-lg text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed">
                            Ready to order something great? Browse our menu and have it delivered straight to you.
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-16">
                            <Link
                                to="/menu"
                                className="inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-xl font-semibold text-base shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                Browse Menu <ArrowRight size={16} />
                            </Link>
                            <Link
                                to="/my-orders"
                                className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold text-base border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
                            >
                                Track My Order
                            </Link>
                        </div>

                        {/* Feature cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                            {USER_FEATURES.map((f) => (
                                <Link
                                    key={f.title}
                                    to={f.to}
                                    className="group flex gap-4 items-start bg-white border border-gray-100 rounded-2xl p-5 hover:border-primary/30 hover:shadow-sm transition-all"
                                >
                                    <div className={`p-2.5 rounded-xl shrink-0 ${f.color}`}>{f.icon}</div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 mb-0.5 group-hover:text-primary transition-colors">{f.title}</h3>
                                        <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </>
                ) : (
                    <>
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 border border-orange-100 text-xs font-semibold px-4 py-1.5 rounded-full mb-8 tracking-wide uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                            Fresh · Fast · Delivered Daily
                        </div>

                        {/* Headline */}
                        <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 tracking-tight leading-tight">
                            Great food,{' '}
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF7F50] to-[#ffb347]">
                                delivered fast.
                            </span>
                        </h1>
                        <p className="text-lg text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed">
                            Order from Sunline Restaurant and enjoy fresh, flavourful meals brought
                            straight to your door — in under 30 minutes.
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-14">
                            <Link
                                to="/register"
                                className="inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-xl font-semibold text-base shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                Get Started Free <ArrowRight size={16} />
                            </Link>
                            <Link
                                to="/login"
                                className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold text-base border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
                            >
                                Sign In
                            </Link>
                        </div>

                        {/* Stats strip */}
                        <div className="inline-flex items-center gap-6 sm:gap-10 bg-white border border-gray-100 rounded-2xl px-8 py-4 shadow-sm mb-14">
                            {STATS.map((s, i) => (
                                <div key={s.label} className="flex items-center gap-6 sm:gap-10">
                                    <div className="text-center">
                                        <div className="text-xl font-black text-gray-900">{s.value}</div>
                                        <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
                                    </div>
                                    {i < STATS.length - 1 && (
                                        <div className="w-px h-8 bg-gray-100" />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Feature cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                            {GUEST_FEATURES.map((f) => (
                                <div
                                    key={f.title}
                                    className="flex gap-4 items-start bg-white border border-gray-100 rounded-2xl p-5"
                                >
                                    <div className={`p-2.5 rounded-xl shrink-0 ${f.color}`}>{f.icon}</div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 mb-0.5">{f.title}</h3>
                                        <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </section>

            {/* ── Trending Items ────────────────────────────────────── */}
            {(trendingLoading || trendingItems.length > 0) && (
                <section className="max-w-6xl mx-auto px-6 pb-20">

                    {/* Section header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-50 text-orange-500 rounded-xl">
                                <TrendingUp size={20} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Trending Now</h2>
                                <p className="text-xs text-gray-400">Most ordered by our customers</p>
                            </div>
                        </div>
                        <Link
                            to="/menu"
                            className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                        >
                            View full menu <ArrowRight size={14} />
                        </Link>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {trendingLoading
                            ? Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                                    <div className="aspect-[4/3] bg-gray-100" />
                                    <div className="p-4 space-y-2">
                                        <div className="h-3 bg-gray-100 rounded w-3/4" />
                                        <div className="h-3 bg-gray-100 rounded w-1/2" />
                                        <div className="h-8 bg-gray-100 rounded-lg mt-3" />
                                    </div>
                                </div>
                            ))
                            : trendingItems.map((item, index) => (
                                <div
                                    key={item.id}
                                    className="relative bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md hover:border-gray-200 transition-all group"
                                >
                                    {/* Rank badge */}
                                    <div className="absolute top-3 left-3 z-10 bg-primary text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-md">
                                        {index + 1}
                                    </div>

                                    {/* Image */}
                                    <div className="aspect-[4/3] overflow-hidden bg-gray-50">
                                        <img
                                            src={getImageUrl(item.imageUrl) || FOOD_PLACEHOLDER}
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            onError={(e) => { e.target.src = FOOD_PLACEHOLDER; }}
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="p-4">
                                        <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1 truncate">
                                            {item.name}
                                        </h3>
                                        {item.categories?.length > 0 && (
                                            <span className="inline-block text-xs text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full mb-3">
                                                {item.categories[0]}
                                            </span>
                                        )}
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-primary">
                                                Rs. {item.price.toFixed(2)}
                                            </span>
                                            <button
                                                onClick={() => setModalItem(item)}
                                                className="text-xs font-semibold bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors"
                                            >
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>

                    {/* Mobile "view all" link */}
                    <div className="mt-6 text-center sm:hidden">
                        <Link
                            to="/menu"
                            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                        >
                            View full menu <ArrowRight size={14} />
                        </Link>
                    </div>
                </section>
            )}
            <AddToCartModal
                item={modalItem}
                isOpen={!!modalItem}
                onClose={() => setModalItem(null)}
                onAdd={(item, quantity, instructions) => {
                    addToCart(item, quantity, instructions);
                    setModalItem(null);
                }}
            />
        </div>
    );
};

export default HomePage;
