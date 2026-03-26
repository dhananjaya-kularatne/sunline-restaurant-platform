import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, User, LogOut, ChevronDown, LayoutDashboard, Utensils, Truck } from 'lucide-react';
import { useState } from 'react';

const CustomerNavbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-sm py-4 px-2 sticky top-0 z-50 bg-black">
            <div className="flex justify-between items-center w-full px-4">
                <Link to="/" className="text-2xl font-bold text-[#FF7F50]">
                    Sunline Restaurant
                </Link>

                <div className="hidden md:flex items-center space-x-8">
                    <Link to="/" className="text-gray-700 hover:text-[#FF7F50] transition-colors font-medium">Home</Link>
                    <Link to="/menu" className="text-gray-700 hover:text-[#FF7F50] transition-colors font-medium">Menu</Link>
                    <Link to="/social-feed" className="text-gray-700 hover:text-[#FF7F50] transition-colors font-medium">Social Feed</Link>



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
                        <Link to="/login" className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity">
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
