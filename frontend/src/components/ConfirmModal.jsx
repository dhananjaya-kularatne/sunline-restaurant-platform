import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title = "Are you sure?", 
    message = "This action cannot be undone.",
    confirmText = "Delete",
    cancelText = "Cancel",
    type = "danger" // danger, warning, info
}) => {
    if (!isOpen) return null;

    const colors = {
        danger: {
            bg: "bg-red-50",
            icon: "text-red-500",
            button: "bg-red-500 hover:bg-red-600 shadow-red-100",
        },
        warning: {
            bg: "bg-orange-50",
            icon: "text-orange-500",
            button: "bg-[#FF7F50] hover:bg-[#e06b3f] shadow-orange-100",
        },
        info: {
            bg: "bg-blue-50",
            icon: "text-blue-500",
            button: "bg-blue-500 hover:bg-blue-600 shadow-blue-100",
        }
    };

    const currentStyle = colors[type] || colors.danger;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-in fade-in zoom-in duration-300">
                <div className="p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className={`p-3 rounded-2xl ${currentStyle.bg}`}>
                            <AlertTriangle className={currentStyle.icon} size={24} />
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <X className="text-gray-400" size={20} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="mb-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
                        <p className="text-gray-500 leading-relaxed">{message}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 px-4 rounded-2xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all duration-200"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className={`flex-1 py-3 px-4 rounded-2xl font-bold text-white shadow-lg transition-all duration-300 active:scale-95 ${currentStyle.button}`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
