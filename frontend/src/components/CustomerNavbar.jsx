import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Menu, User, LogOut, ChevronDown, LayoutDashboard, Utensils, Truck, FileText, ShoppingCart, ShoppingBag } from 'lucide-react';
import { useState } from 'react';

const CustomerNavbar = () => {
    const { user, logout } = useAuth();
    const { totalCount } = useCart();
    const navigate = useNavigate();
    const location = useLocation();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-sm py-4 px-2 sticky top-0 z-50">
            <div className="flex justify-between items-center w-full px-4">
                <Link to="/" className="text-2xl font-bold text-[#FF7F50]">
                    Sunline Restaurant
                </Link>

                <div className="hidden md:flex items-center space-x-8">
                    <Link to="/" className="text-gray-700 hover:text-[#FF7F50] transition-colors font-medium">Home</Link>
                    <Link to="/menu" className="text-gray-700 hover:text-[#FF7F50] transition-colors font-medium">Menu</Link>
                    <Link to="/social-feed" className="text-gray-700 hover:text-[#FF7F50] transition-colors font-medium">Social Feed</Link>
                    <Link to="/reservations" className="text-gray-700 hover:text-[#FF7F50] transition-colors font-medium">Reservations</Link>
                    
                    <Link to="/cart" className="relative p-2 text-gray-700 hover:text-primary transition-colors mr-2">
                        <ShoppingCart size={24} />
                        {totalCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md animate-in zoom-in duration-300">
                                {totalCount}
                            </span>
                        )}
                    </Link>

                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center space-x-2 text-gray-700 hover:text-[#FF7F50] focus:outline-none font-medium"
                            >
                                <span>{user.name}</span>
                                <ChevronDown size={20} />
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-[200]">
                                    <Link
                                        to="/profile"
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        <User size={16} className="mr-2" /> Profile
                                    </Link>
                                    <Link
                                        to="/my-orders"
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100 pb-3"
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        <ShoppingBag size={16} className="mr-2" /> My Orders
                                    </Link>
                                    {user.role === 'CUSTOMER' && (
                                        <>
                                            <Link
                                                to="/my-reports"
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                onClick={() => setDropdownOpen(false)}
                                            >
                                                <FileText size={16} className="mr-2" /> My Reports
                                            </Link>
                                        </>
                                    )}
                                    {user.role === 'ADMIN' && (
                                        <Link
                                            to="/admin/users"
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            <LayoutDashboard size={16} className="mr-2" /> Admin
                                        </Link>
                                    )}
                                    {user.role === 'KITCHEN' && (
                                        <Link
                                            to="/kitchen"
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            <Utensils size={16} className="mr-2" /> Kitchen
                                        </Link>
                                    )}
                                    {user.role === 'DELIVERY' && (
                                        <Link
                                            to="/delivery"
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            <Truck size={16} className="mr-2" /> Delivery
                                        </Link>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                                    >
                                        <LogOut size={16} className="mr-2" /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/login" className="bg-[#FF7F50] text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity">
                            Login
                        </Link>
                    )}
                </div>

                <button className="md:hidden text-secondary">
                    <Menu size={24} />
                </button>
            </div>
        </nav>
    );
};

export default CustomerNavbar;
