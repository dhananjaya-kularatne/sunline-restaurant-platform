import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-100 py-6 px-6 mt-auto">
            <div className="container mx-auto flex flex-col md:flex-row justify-center md:justify-between items-center gap-4">
                <div className="text-gray-500 text-sm text-center md:text-left">
                    © {new Date().getFullYear()} Sunline Restaurant. All rights reserved.
                </div>
                
                <div className="flex items-center justify-center">
                    <Link 
                        to="/support" 
                        className="flex items-center gap-2 text-[#FF7F50] hover:text-[#e06b3f] transition-colors font-bold text-[19px] mr-4 md:mr-0"
                    >
                        <HelpCircle size={19} />
                        Customer Support
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
