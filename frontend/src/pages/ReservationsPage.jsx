import React, { useState, useEffect } from 'react';
import { Calendar, Users, Clock, MessageSquare, CheckCircle, ArrowRight, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const ReservationsPage = () => {
    const { user, loading } = useAuth();
    const [formData, setFormData] = useState({
        reservationDate: '',
        reservationTime: '',
        guestCount: '2',
        specialRequest: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [serverError, setServerError] = useState('');

    const timeSlots = [
        "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", 
        "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"
    ];

    const formatTime = (time) => {
        const [hour, minute] = time.split(':');
        const h = parseInt(hour);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const displayHour = h % 12 || 12;
        return `${displayHour}:${minute} ${ampm}`;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (!formData.reservationDate) {
            newErrors.reservationDate = 'Date is required';
        } else {
            const selectedDate = new Date(formData.reservationDate);
            if (selectedDate < today) {
                newErrors.reservationDate = 'Date cannot be in the past';
            }
        }

        if (!formData.reservationTime) newErrors.reservationTime = 'Time is required';
        
        if (!formData.guestCount || parseInt(formData.guestCount) <= 0) {
            newErrors.guestCount = 'Guest count is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const payload = {
                ...formData,
                customerEmail: user.email,
                guestCount: parseInt(formData.guestCount)
            };
            await api.post('/reservations', payload);
            setSubmitSuccess(true);
            setFormData({
                reservationDate: '',
                reservationTime: '',
                guestCount: '2',
                specialRequest: ''
            });
        } catch (error) {
            setServerError(error.message || 'Failed to book table. Please try again.');
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
                <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center mt-10 border border-gray-100">
                    <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lock className="text-[#FF7F50]" size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">Login Required</h2>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        Please log in to your account to reserve a table.
                    </p>
                    <div className="space-y-3">
                        <Link 
                            to="/login"
                            className="bg-[#FF7F50] text-white py-3.5 rounded-xl font-bold text-lg hover:bg-[#e06b3f] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#FF7F50]/20"
                        >
                            Log In <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (submitSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center mt-10">
                    <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Your reservation is pending</h2>
                    <p className="text-gray-600 mb-6">
                        Look out for a confirmation shortly.
                    </p>
                    <button
                        onClick={() => setSubmitSuccess(false)}
                        className="w-full bg-[#FF7F50] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#e06b3f] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF7F50]"
                    >
                        Book Another Table
                    </button>
                    <Link
                        to="/"
                        className="w-full block text-center border border-[#FF7F50] text-[#FF7F50] py-3 px-4 rounded-lg font-medium hover:bg-orange-50 transition-colors mt-3"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8 mt-4">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Reserve a Table</h1>
                    <p className="text-gray-500">Simple and fast restaurant reservations</p>
                </div>

                {serverError && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                        <p className="text-red-700">{serverError}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Date Input */}
                        <div className="space-y-1">
                            <label htmlFor="reservationDate" className="block text-sm font-medium text-gray-700 mb-1">
                                Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                id="reservationDate"
                                name="reservationDate"
                                value={formData.reservationDate}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-[#FF7F50] focus:border-[#FF7F50] outline-none transition-all ${
                                    errors.reservationDate ? 'border-red-500 bg-red-50' : 'border-gray-200'
                                }`}
                            />
                            {errors.reservationDate && <p className="mt-1 text-xs text-red-500">{errors.reservationDate}</p>}
                        </div>

                        {/* Time Select (Simple Dropdown instead of clunky picker) */}
                        <div className="space-y-1">
                            <label htmlFor="reservationTime" className="block text-sm font-medium text-gray-700 mb-1">
                                Preferred Time <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="reservationTime"
                                name="reservationTime"
                                value={formData.reservationTime}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-[#FF7F50] focus:border-[#FF7F50] outline-none transition-all bg-white appearance-none ${
                                    errors.reservationTime ? 'border-red-500 bg-red-50' : 'border-gray-200'
                                }`}
                            >
                                <option value="">Select Time</option>
                                {timeSlots.map(slot => (
                                    <option key={slot} value={slot}>{formatTime(slot)}</option>
                                ))}
                            </select>
                            {errors.reservationTime && <p className="mt-1 text-xs text-red-500">{errors.reservationTime}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Guest Count */}
                        <div className="space-y-1">
                            <label htmlFor="guestCount" className="block text-sm font-medium text-gray-700 mb-1">
                                Guests <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                id="guestCount"
                                name="guestCount"
                                min="1"
                                value={formData.guestCount}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-[#FF7F50] focus:border-[#FF7F50] outline-none transition-all ${
                                    errors.guestCount ? 'border-red-500 bg-red-50' : 'border-gray-200'
                                }`}
                            />
                            {errors.guestCount && <p className="mt-1 text-xs text-red-500">{errors.guestCount}</p>}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="specialRequest" className="block text-sm font-medium text-gray-700 mb-1">
                            Special Requests
                        </label>
                        <textarea
                            id="specialRequest"
                            name="specialRequest"
                            rows="4"
                            placeholder="Birthday decoration?"
                            value={formData.specialRequest}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-[#FF7F50] focus:border-[#FF7F50] outline-none transition-all resize-y"
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full bg-[#FF7F50] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#e06b3f] transition-all duration-200 flex justify-center items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF7F50] ${
                            isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                    >
                        {isSubmitting ? 'Confirming...' : 'Reserve'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ReservationsPage;
