import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Menu, User, LogOut, ChevronDown, LayoutDashboard, Utensils, Truck, FileText, ShoppingCart, ShoppingBag, UtensilsCrossed } from 'lucide-react';
import { useState } from 'react';

const NAV_LINKS = [
    { to: '/', label: 'Home' },
    { to: '/menu', label: 'Menu' },
    { to: '/social-feed', label: 'Social Feed' },
    { to: '/reservations', label: 'Reservations' },
];

const CustomerNavbar = () => {
    const { user, logout } = useAuth();
    const { totalCount, clearCart } = useCart();
    const navigate = useNavigate();
    const location = useLocation();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = () => {
        clearCart();
        logout();
        navigate('/login');
    };

    const isActive = (path) =>
        path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

    return (
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
            {/* Orange accent bar at top */}
            <div className="h-0.5 bg-gradient-to-r from-[#FF7F50] via-[#ff9a6c] to-[#FF7F50]" />

            <div className="flex justify-between items-center w-full px-6 py-3.5">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="bg-[#FF7F50] text-white p-1.5 rounded-lg group-hover:bg-[#e06b3f] transition-colors">
                        <UtensilsCrossed size={18} />
                    </div>
                    <span className="text-xl font-bold text-[#1e293b] tracking-tight">
                        Sunline <span className="text-[#FF7F50]">Restaurant</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center space-x-1">
                    {NAV_LINKS.map(({ to, label }) => (
                        <Link
                            key={to}
                            to={to}
                            className={`relative px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                isActive(to)
                                    ? 'text-[#FF7F50]'
                                    : 'text-gray-600 hover:text-[#FF7F50] hover:bg-orange-50'
                            }`}
                        >
                            {label}
                            {isActive(to) && (
                                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-0.5 rounded-full bg-[#FF7F50]" />
                            )}
                        </Link>
                    ))}
                </div>

                {/* Right side */}
                <div className="hidden md:flex items-center gap-2">
                    {/* Cart */}
                    <Link
                        to="/cart"
                        className={`relative p-2 rounded-md transition-colors ${
                            isActive('/cart')
                                ? 'text-[#FF7F50] bg-orange-50'
                                : 'text-gray-600 hover:text-[#FF7F50] hover:bg-orange-50'
                        }`}
                    >
                        <ShoppingCart size={22} />
                        {totalCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 bg-[#FF7F50] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md animate-in zoom-in duration-300">
                                {totalCount}
                            </span>
                        )}
                    </Link>

                    {/* User */}
                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-gray-200 hover:border-[#FF7F50] text-gray-700 hover:text-[#FF7F50] transition-all text-sm font-medium"
                            >
                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#FF7F50] to-[#e06b3f] flex items-center justify-center text-white text-xs font-bold">
                                    {user.name?.charAt(0).toUpperCase()}
                                </div>
                                <span>{user.name}</span>
                                <ChevronDown
                                    size={16}
                                    className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                                />
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-[200] animate-in fade-in slide-in-from-top-2 duration-150">
                                    <div className="px-4 py-2 border-b border-gray-100 mb-1">
                                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Signed in as</p>
                                        <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
                                    </div>
                                    <Link
                                        to="/profile"
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#FF7F50] transition-colors"
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        <User size={15} className="mr-2.5" /> Profile
                                    </Link>
                                    <Link
                                        to="/my-orders"
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#FF7F50] transition-colors"
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        <ShoppingBag size={15} className="mr-2.5" /> My Orders
                                    </Link>
                                    {user.role === 'CUSTOMER' && (
                                        <Link
                                            to="/my-reports"
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#FF7F50] transition-colors"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            <FileText size={15} className="mr-2.5" /> My Reports
                                        </Link>
                                    )}
                                    {user.role === 'ADMIN' && (
                                        <Link
                                            to="/admin/dashboard"
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            <LayoutDashboard size={16} className="mr-2" /> Admin
                                        </Link>
                                    )}
                                    {user.role === 'KITCHEN' && (
                                        <Link
                                            to="/kitchen"
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#FF7F50] transition-colors border-b border-gray-100"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            <Utensils size={15} className="mr-2.5" /> Kitchen
                                        </Link>
                                    )}
                                    {user.role === 'DELIVERY' && (
                                        <Link
                                            to="/delivery"
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#FF7F50] transition-colors border-b border-gray-100"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            <Truck size={15} className="mr-2.5" /> Delivery
                                        </Link>
                                    )}
                                    <div className="mt-1 pt-1 border-t border-gray-100">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                                        >
                                            <LogOut size={15} className="mr-2.5" /> Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="bg-[#FF7F50] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#e06b3f] transition-colors shadow-sm"
                        >
                            Sign In
                        </Link>
                    )}
                </div>

                {/* Mobile menu button */}
                <button className="md:hidden p-2 text-gray-600 hover:text-[#FF7F50] hover:bg-orange-50 rounded-md transition-colors">
                    <Menu size={22} />
                </button>
            </div>
        </nav>
    );
};

export default CustomerNavbar;
