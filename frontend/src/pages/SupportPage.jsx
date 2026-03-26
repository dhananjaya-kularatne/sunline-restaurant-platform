import React, { useState, useEffect } from 'react';
import { HelpCircle, CheckCircle, Lock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const SupportPage = () => {
    const { user, loading } = useAuth();
    const [formData, setFormData] = useState({
        fullName: user?.name || '',
        emailAddress: user?.email || '',
        category: '',
        orderId: '',
        description: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [serverError, setServerError] = useState('');

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                fullName: user.name || '',
                emailAddress: user.email || ''
            }));
        }
    }, [user]);

    const categories = [
        'Select a category',
        'General Inquiry',
        'Food Quality',
        'Service Quality',
        'Technical Issue',
        'Billing Issues',
        'Other'
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
        
        if (!formData.emailAddress.trim()) {
            newErrors.emailAddress = 'Email Address is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress)) {
            newErrors.emailAddress = 'Invalid email format';
        }

        if (!formData.category || formData.category === 'Select a category') {
            newErrors.category = 'Category is required';
        }

        if (['Food Quality', 'Service Quality', 'Billing Issues'].includes(formData.category)) {
            if (!formData.orderId || !formData.orderId.trim()) {
                newErrors.orderId = 'Order ID is required for this category';
            }
        }

        if (!formData.description.trim()) newErrors.description = 'Description is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');
        setSubmitSuccess(false);

        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            await api.post('/support-reports', formData);
            setSubmitSuccess(true);
            setFormData({
                fullName: user?.name || '',
                emailAddress: user?.email || '',
                category: '',
                orderId: '',
                description: ''
            });
        } catch (error) {
            setServerError(error.message || 'Failed to submit report. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-12">
                <div className="w-12 h-12 border-4 border-[#FF7F50]/20 border-t-[#FF7F50] rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 font-medium">Checking authentication...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center mt-10 border border-gray-100">
                    <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lock className="text-[#FF7F50]" size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 tracking-tight">Login Required</h2>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        Please log in to your account to submit a support report. This helps us track your issue and respond more effectively.
                    </p>
                    <div className="space-y-3">
                        <Link 
                            to="/login"
                            className="bg-[#FF7F50] text-white py-3.5 rounded-xl font-bold text-lg hover:bg-[#e06b3f] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#FF7F50]/20"
                        >
                            Log In <ArrowRight size={20} />
                        </Link>
                        <Link 
                            to="/register"
                            className="block w-full text-center border border-gray-100 text-gray-600 py-3.5 rounded-xl font-bold hover:bg-gray-50 transition-all"
                        >
                            Create Account
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (submitSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center mt-10 border border-gray-100">
                    <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Report Submitted Successfully</h2>
                    <p className="text-gray-600 mb-6">
                        Thank you for reaching out. Our support team will review your report and get back to you shortly.
                    </p>
                    <button
                        onClick={() => setSubmitSuccess(false)}
                        className="w-full bg-[#FF7F50] text-white py-3 px-4 rounded-lg font-bold hover:bg-[#e06b3f] transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF7F50] shadow-md active:scale-[0.98]"
                    >
                        Submit Another Report
                    </button>
                    <Link
                        to="/my-reports"
                        className="w-full block text-center border border-[#FF7F50] text-[#FF7F50] py-3 px-4 rounded-lg font-bold hover:bg-orange-50 transition-all mt-3"
                    >
                        View My Reports
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 mt-4 border border-gray-100">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center p-3 sm:p-4 bg-[#FF7F50] rounded-full text-white mb-4 shadow-sm">
                        <HelpCircle size={24} className="sm:w-8 sm:h-8" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Support Center</h1>
                    <p className="text-gray-500">Let us know how we can help you today</p>
                </div>

                {serverError && (
                    <p className="mb-6 text-red-500 text-sm font-medium">{serverError}</p>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                placeholder="John Doe"
                                value={formData.fullName}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-[#FF7F50] focus:border-[#FF7F50] outline-none transition-all ${
                                    errors.fullName ? 'border-red-500 bg-red-50' : 'border-gray-200'
                                }`}
                            />
                            {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
                        </div>

                        <div>
                            <label htmlFor="emailAddress" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                id="emailAddress"
                                name="emailAddress"
                                placeholder="john@example.com"
                                value={formData.emailAddress}
                                onChange={handleChange}
                                readOnly={!!user?.email}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-[#FF7F50] focus:border-[#FF7F50] outline-none transition-all ${
                                    errors.emailAddress ? 'border-red-500 bg-red-50' : 'border-gray-200'
                                } ${user?.email ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                            />
                            {errors.emailAddress && <p className="mt-1 text-xs text-red-500">{errors.emailAddress}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                                Category <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-[#FF7F50] focus:border-[#FF7F50] outline-none transition-all bg-white appearance-none ${
                                    errors.category ? 'border-red-500 bg-red-50' : 'border-gray-200'
                                }`}
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat === 'Select a category' ? '' : cat} disabled={cat === 'Select a category'}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                            {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category}</p>}
                        </div>

                        {['Food Quality', 'Service Quality', 'Billing Issues'].includes(formData.category) && (
                            <div>
                                <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 mb-1">
                                    Order ID <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="orderId"
                                    name="orderId"
                                    placeholder="e.g. ORD-123456"
                                    value={formData.orderId}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-[#FF7F50] focus:border-[#FF7F50] outline-none transition-all ${
                                        errors.orderId ? 'border-red-500 bg-red-50' : 'border-gray-200'
                                    }`}
                                />
                                {errors.orderId && <p className="mt-1 text-xs text-red-500">{errors.orderId}</p>}
                            </div>
                        )}
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows="4"
                            value={formData.description}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-[#FF7F50] focus:border-[#FF7F50] outline-none transition-all resize-y ${
                                errors.description ? 'border-red-500 bg-red-50' : 'border-gray-200'
                            }`}
                        ></textarea>
                        {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full bg-[#FF7F50] text-white py-3 px-4 rounded-lg font-bold hover:bg-[#e06b3f] transition-all shadow-md active:scale-[0.98] flex justify-center items-center ${
                            isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Report'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SupportPage;
