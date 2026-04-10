import React from 'react';
import { Link } from 'react-router-dom';
import {
    UtensilsCrossed,
    MapPin,
    Phone,
    Mail,
    Clock,
    HelpCircle,
    Facebook,
    Instagram,
    Twitter,
    ChevronRight,
} from 'lucide-react';

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="bg-[#1e293b] text-gray-300 mt-auto">
            {/* Orange top accent */}
            <div className="h-1 bg-gradient-to-r from-[#FF7F50] via-[#ffb347] to-[#FF7F50]" />

            {/* Main footer content */}
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

                    {/* Brand column */}
                    <div className="lg:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-4 group">
                            <div className="bg-[#FF7F50] text-white p-1.5 rounded-lg">
                                <UtensilsCrossed size={18} />
                            </div>
                            <span className="text-lg font-bold text-white tracking-tight">
                                Sunline <span className="text-[#FF7F50]">Restaurant</span>
                            </span>
                        </Link>
                        <p className="text-sm text-gray-400 leading-relaxed mb-5">
                            Bringing you the finest dining experience with freshly crafted dishes, warm hospitality, and flavors that keep you coming back.
                        </p>
                        {/* Social icons */}
                        <div className="flex items-center gap-3">
                            {[
                                { Icon: Facebook, href: '#' },
                                { Icon: Instagram, href: '#' },
                                { Icon: Twitter, href: '#' },
                            ].map(({ Icon, href }, i) => (
                                <a
                                    key={i}
                                    href={href}
                                    className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 hover:border-[#FF7F50] hover:text-[#FF7F50] transition-colors"
                                >
                                    <Icon size={15} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
                            Quick Links
                        </h4>
                        <ul className="space-y-2.5">
                            {[
                                { to: '/', label: 'Home' },
                                { to: '/menu', label: 'Our Menu' },
                                { to: '/reservations', label: 'Reservations' },
                                { to: '/social-feed', label: 'Social Feed' },
                                { to: '/my-orders', label: 'My Orders' },
                            ].map(({ to, label }) => (
                                <li key={to}>
                                    <Link
                                        to={to}
                                        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#FF7F50] transition-colors group"
                                    >
                                        <ChevronRight size={14} className="text-[#FF7F50] opacity-0 group-hover:opacity-100 -ml-1 transition-opacity" />
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
                            Contact Us
                        </h4>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3 text-sm text-gray-400">
                                <MapPin size={15} className="text-[#FF7F50] mt-0.5 shrink-0" />
                                <span>123 Sunline Avenue,<br />Colombo 03, Sri Lanka</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-gray-400">
                                <Phone size={15} className="text-[#FF7F50] shrink-0" />
                                <a href="tel:+94112345678" className="hover:text-[#FF7F50] transition-colors">
                                    +94 11 234 5678
                                </a>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-gray-400">
                                <Mail size={15} className="text-[#FF7F50] shrink-0" />
                                <a href="mailto:hello@sunline.lk" className="hover:text-[#FF7F50] transition-colors">
                                    hello@sunline.lk
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Hours + Support */}
                    <div>
                        <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
                            Opening Hours
                        </h4>
                        <ul className="space-y-2 text-sm text-gray-400 mb-6">
                            <li className="flex items-center gap-2">
                                <Clock size={14} className="text-[#FF7F50] shrink-0" />
                                <span>Mon – Fri: 11 AM – 10 PM</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Clock size={14} className="text-[#FF7F50] shrink-0" />
                                <span>Sat – Sun: 10 AM – 11 PM</span>
                            </li>
                        </ul>
                        <Link
                            to="/support"
                            className="inline-flex items-center gap-2 bg-[#FF7F50] hover:bg-[#e06b3f] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
                        >
                            <HelpCircle size={15} />
                            Customer Support
                        </Link>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-gray-700/60">
                <div className="container mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-500">
                    <span>© {year} Sunline Restaurant. All rights reserved.</span>
                    <div className="flex items-center gap-4">
                        <Link to="/support" className="hover:text-[#FF7F50] transition-colors">Privacy Policy</Link>
                        <Link to="/support" className="hover:text-[#FF7F50] transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
