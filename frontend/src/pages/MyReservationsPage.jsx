import React, { useState, useEffect } from 'react';
import { Calendar, Users, Clock, CheckCircle, ArrowRight, Lock, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const MyReservationsPage = () => {
    const { user, loading } = useAuth();
    const [reservations, setReservations] = useState([]);
    const [isLoadingReservations, setIsLoadingReservations] = useState(false);
    const [cancelModal, setCancelModal] = useState({ show: false, reservationId: null });

    useEffect(() => {
        if (user) {
            fetchReservations();
        }
    }, [user]);

    const fetchReservations = async () => {
        setIsLoadingReservations(true);
        try {
            const response = await api.get(`/reservations/my-reservations?email=${user.email}`);
            setReservations(response.data);
        } catch (error) {
            console.error('Failed to fetch reservations:', error);
        } finally {
            setIsLoadingReservations(false);
        }
    };

    const formatTime = (time) => {
        const [hour, minute] = time.split(':');
        const h = parseInt(hour);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const displayHour = h % 12 || 12;
        return `${displayHour}:${minute} ${ampm}`;
    };

    const handleCancelClick = (id) => {
        setCancelModal({ show: true, reservationId: id });
    };

    const confirmCancel = async () => {
        if (!cancelModal.reservationId) return;
        
        try {
            await api.put(`/reservations/${cancelModal.reservationId}/cancel`);
            setReservations(prev => prev.map(res => 
                res.id === cancelModal.reservationId ? { ...res, status: 'CANCELLED' } : res
            ));
            setCancelModal({ show: false, reservationId: null });
        } catch (error) {
            alert('Failed to cancel reservation. Please try again.');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'CONFIRMED': return 'bg-green-100 text-green-800 border-green-200';
            case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
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
                        Please log in to view your reservations.
                    </p>
                    <Link 
                        to="/login"
                        className="bg-[#FF7F50] text-white py-3.5 rounded-xl font-bold text-lg hover:bg-[#e06b3f] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#FF7F50]/20"
                    >
                        Log In <ArrowRight size={20} />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl w-full">
                <div className="bg-white rounded-xl shadow-lg p-8 overflow-hidden h-fit">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-1">My Reservations</h1>
                            <p className="text-gray-500">Manage your table bookings and status</p>
                        </div>
                        <Link 
                            to="/book-table"
                            className="bg-[#FF7F50] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#e06b3f] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#FF7F50]/20 w-fit"
                        >
                            <Plus size={20} /> Make a Reservation
                        </Link>
                    </div>

                    {isLoadingReservations ? (
                        <div className="flex flex-col items-center py-16">
                            <div className="w-10 h-10 border-3 border-[#FF7F50]/20 border-t-[#FF7F50] rounded-full animate-spin mb-4"></div>
                            <p className="text-gray-400">Loading your bookings...</p>
                        </div>
                    ) : reservations.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {reservations.map((res) => (
                                <div key={res.id} className="border border-gray-100 rounded-2xl p-6 hover:border-orange-200 transition-all bg-gray-50/30 hover:shadow-md">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <Calendar size={16} className="text-[#FF7F50]" />
                                                <span className="font-bold text-gray-900 text-lg">
                                                    {new Date(res.reservationDate).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm font-medium text-gray-600">
                                                <span className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-md border border-gray-100">
                                                    <Clock size={14} className="text-gray-400" /> {formatTime(res.reservationTime)}
                                                </span>
                                                <span className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-md border border-gray-100">
                                                    <Users size={14} className="text-gray-400" /> {res.guestCount} {res.guestCount === 1 ? 'Guest' : 'Guests'}
                                                </span>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${getStatusColor(res.status)}`}>
                                            {res.status}
                                        </span>
                                    </div>
                                    
                                    {res.specialRequest && (
                                        <div className="mb-5 p-3 bg-white rounded-xl border border-dashed border-gray-200 text-xs text-gray-500 italic">
                                            " {res.specialRequest} "
                                        </div>
                                    )}

                                    {res.status === 'PENDING' && (
                                        <button
                                            onClick={() => handleCancelClick(res.id)}
                                            className="w-full mt-2 py-2.5 rounded-lg border-2 border-red-50 text-red-500 text-xs font-bold hover:bg-red-50 hover:border-red-100 transition-all"
                                        >
                                            Cancel Reservation
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 px-4 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                                <Calendar className="text-gray-200" size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No reservations yet</h3>
                            <p className="text-gray-500 mb-8 max-w-xs mx-auto">
                                You haven't reserved any tables yet. Start your dining experience with us today!
                            </p>
                            <Link 
                                to="/book-table"
                                className="inline-flex items-center gap-2 text-[#FF7F50] font-bold hover:gap-3 transition-all underline underline-offset-4"
                            >
                                Make your first reservation <ArrowRight size={18} />
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Cancel Confirmation Modal */}
            {cancelModal.show && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2rem] max-w-sm w-full p-10 shadow-2xl animate-in zoom-in duration-300">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Calendar size={32} />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-3 text-center">Cancel Reservation?</h3>
                        <p className="text-gray-500 mb-10 leading-relaxed text-center font-medium">
                            Are you sure? This will release your table for other customers. This action cannot be undone.
                        </p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={confirmCancel}
                                className="w-full px-6 py-4 rounded-2xl font-bold text-white bg-red-500 hover:bg-red-600 transition-all shadow-xl shadow-red-500/30"
                            >
                                Yes, Cancel Reservation
                            </button>
                            <button
                                onClick={() => setCancelModal({ show: false, reservationId: null })}
                                className="w-full px-6 py-4 rounded-2xl font-bold text-gray-400 bg-gray-50 hover:bg-gray-100 transition-all"
                            >
                                No, Keep it
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyReservationsPage;
