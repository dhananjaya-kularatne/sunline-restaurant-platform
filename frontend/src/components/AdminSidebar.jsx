import React from 'react';
import { Users, Utensils, LayoutDashboard, Settings, LogOut, Image, MessageSquare, Calendar, ShoppingBag } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
    const location = useLocation();

    const navItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'User Management', path: '/admin/users', icon: Users },
        { name: 'Order Management', path: '/admin/orders', icon: ShoppingBag },
        { name: 'Menu Management', path: '/admin/menu', icon: Utensils },
        { name: 'Social Feed Management', path: '/admin/posts', icon: Image },
        { name: 'Support Management', path: '/admin/support', icon: MessageSquare },
        { name: 'Reservation Management', path: '/admin/reservations', icon: Calendar },
    ];

    return (
        <aside className="w-64 bg-[#3E4958] text-white flex flex-col">
            <div className="p-6">
                <h2 className="text-xl font-bold text-[#FF7F50]">Sunline Admin</h2>
            </div>
            <nav className="flex-1 mt-4">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`px-4 py-3 mx-2 rounded-lg flex items-center gap-3 cursor-pointer transition-colors ${isActive ? 'bg-[#FF7F50]' : 'hover:bg-white/10'
                                }`}
                        >
                            <Icon size={20} />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
};

export default AdminSidebar;
