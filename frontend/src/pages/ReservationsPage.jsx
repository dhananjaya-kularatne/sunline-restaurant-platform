import React, { useState } from 'react';
import { Calendar, Users, Clock, CheckCircle, ArrowRight, Lock } from 'lucide-react';
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
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-10 text-center mt-10 border border-orange-100 animate-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="h-12 w-12 text-green-500" />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 mb-2">Your reservation is pending</h2>
                    <p className="text-gray-500 mb-8 font-medium">
                        Look out for a confirmation shortly.
                    </p>
                    <div className="space-y-3 w-full max-w-sm mx-auto">
                        <button
                            onClick={() => setSubmitSuccess(false)}
                            className="w-full bg-[#FF7F50] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#e06b3f] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#FF7F50]/20"
                        >
                            Book Another Table
                        </button>
                        <Link
                            to="/"
                            className="w-full border-2 border-[#FF7F50] text-[#FF7F50] py-4 rounded-xl font-bold text-lg hover:bg-orange-50 transition-all flex items-center justify-center gap-2"
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl w-full">
                <div className="bg-white rounded-[2rem] shadow-2xl p-10 mt-4 border border-gray-100 flex flex-col items-center">
                    <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-6">
                        <Calendar className="text-[#FF7F50]" size={40} />
                    </div>
                    
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Reserve a Table</h1>
                        <p className="text-gray-500 font-medium">Quick and easy reservations in seconds</p>
                    </div>

                    {serverError && (
                        <div className="w-full mb-8 bg-red-50 border-l-4 border-red-500 p-4 rounded-xl animate-in slide-in-from-left duration-300">
                            <p className="text-red-700 font-medium">{serverError}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="w-full space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Date Input */}
                            <div className="space-y-2">
                                <label htmlFor="reservationDate" className="block text-sm font-bold text-gray-700 ml-1">
                                    Reservation Date
                                </label>
                                <input
                                    type="date"
                                    id="reservationDate"
                                    name="reservationDate"
                                    value={formData.reservationDate}
                                    onChange={handleChange}
                                    className={`w-full px-5 py-4 bg-gray-50 border-2 rounded-2xl focus:ring-4 focus:ring-orange-100 focus:border-[#FF7F50] outline-none transition-all font-medium ${
                                        errors.reservationDate ? 'border-red-500 bg-red-50' : 'border-transparent'
                                    }`}
                                />
                                {errors.reservationDate && <p className="mt-1 text-xs text-red-500 font-bold ml-1">{errors.reservationDate}</p>}
                            </div>

                            {/* Time Select */}
                            <div className="space-y-2">
                                <label htmlFor="reservationTime" className="block text-sm font-bold text-gray-700 ml-1">
                                    Preferred Time
                                </label>
                                <div className="relative">
                                    <select
                                        id="reservationTime"
                                        name="reservationTime"
                                        value={formData.reservationTime}
                                        onChange={handleChange}
                                        className={`w-full px-5 py-4 bg-gray-50 border-2 rounded-2xl focus:ring-4 focus:ring-orange-100 focus:border-[#FF7F50] outline-none transition-all appearance-none font-medium cursor-pointer ${
                                            errors.reservationTime ? 'border-red-500 bg-red-50' : 'border-transparent'
                                        }`}
                                    >
                                        <option value="">Select a slot</option>
                                        {timeSlots.map(slot => (
                                            <option key={slot} value={slot}>{formatTime(slot)}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                        <Clock size={20} />
                                    </div>
                                </div>
                                {errors.reservationTime && <p className="mt-1 text-xs text-red-500 font-bold ml-1">{errors.reservationTime}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-8">
                            {/* Guest Count */}
                            <div className="space-y-2">
                                <label htmlFor="guestCount" className="block text-sm font-bold text-gray-700 ml-1">
                                    Number of Guests
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        id="guestCount"
                                        name="guestCount"
                                        min="1"
                                        value={formData.guestCount}
                                        onChange={handleChange}
                                        className={`w-full px-5 py-4 bg-gray-50 border-2 rounded-2xl focus:ring-4 focus:ring-orange-100 focus:border-[#FF7F50] outline-none transition-all font-medium ${
                                            errors.guestCount ? 'border-red-500 bg-red-50' : 'border-transparent'
                                        }`}
                                    />
                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                        <Users size={20} />
                                    </div>
                                </div>
                                {errors.guestCount && <p className="mt-1 text-xs text-red-500 font-bold ml-1">{errors.guestCount}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="specialRequest" className="block text-sm font-bold text-gray-700 ml-1">
                                Special Requests (Optional)
                            </label>
                            <textarea
                                id="specialRequest"
                                name="specialRequest"
                                rows="3"
                                placeholder="Any dietary requirements or special occasions?"
                                value={formData.specialRequest}
                                onChange={handleChange}
                                className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:ring-4 focus:ring-orange-100 focus:border-[#FF7F50] outline-none transition-all resize-none font-medium"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`group w-full bg-[#FF7F50] text-white py-5 px-4 rounded-2xl font-black text-xl hover:bg-[#e06b3f] transition-all duration-300 flex justify-center items-center gap-3 shadow-xl shadow-[#FF7F50]/30 active:scale-[0.98] ${
                                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                            }`}
                        >
                            {isSubmitting ? (
                                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>Reserve a Table <ArrowRight className="group-hover:translate-x-1 transition-transform" /></>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ReservationsPage;
