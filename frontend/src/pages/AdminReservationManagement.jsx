import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, Calendar, Users, Clock, CheckCircle2, X, ChevronDown, MoreHorizontal, AlertCircle, Mail, MessageSquare } from 'lucide-react';
import reservationService from '../services/reservationService';
import AdminSidebar from '../components/AdminSidebar';

const Modal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', type = 'danger' }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-scale-up border border-gray-100">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-black text-gray-900 tracking-tight">{title}</h3>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                            <X size={20} />
                        </button>
                    </div>
                    <div className="flex items-start gap-5 mb-8">
                        <div className={`p-4 rounded-2xl flex-shrink-0 ${type === 'danger' ? 'bg-rose-50 text-rose-500' : 'bg-orange-50 text-orange-500'}`}>
                            <AlertCircle size={28} />
                        </div>
                        <p className="text-gray-500 font-medium leading-relaxed pt-1">
                            {message}
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-4 bg-gray-50 text-gray-400 rounded-2xl font-bold hover:bg-gray-100 transition-all border border-transparent"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`flex-1 px-6 py-4 text-white rounded-2xl font-bold transition-all shadow-xl active:scale-95 ${
                                type === 'danger' ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-200' : 'bg-[#FF7F50] hover:bg-[#e06b3f] shadow-orange-100'
                            }`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AdminReservationManagement = () => {
    const [reservations, setReservations] = useState([]);
    const [filteredReservations, setFilteredReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [message, setMessage] = useState('');
    const [actionModal, setActionModal] = useState({ isOpen: false, reservationId: null, type: null });
    const [actionLoading, setActionLoading] = useState(null);
    const [expandedId, setExpandedId] = useState(null);

    const statuses = ['All', 'PENDING', 'CONFIRMED', 'CANCELLED', 'RESERVED'];

    useEffect(() => {
        fetchReservations();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [reservations, statusFilter, searchQuery]);

    const fetchReservations = async () => {
        try {
            setLoading(true);
            const data = await reservationService.getAllReservations();
            setReservations(data || []);
        } catch (error) {
            console.error('Error fetching reservations:', error);
            setMessage('Failed to load reservations.');
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...reservations];

        if (statusFilter !== 'All') {
            filtered = filtered.filter(res => res.status === statusFilter);
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(res => 
                res.customerEmail.toLowerCase().includes(query) || 
                res.reservationDate.includes(query) ||
                (res.specialRequest && res.specialRequest.toLowerCase().includes(query))
            );
        }

        setFilteredReservations(filtered);
    };

    const handleAction = async () => {
        const { reservationId, type } = actionModal;
        try {
            setActionLoading(reservationId);
            let updatedRes;
            if (type === 'CONFIRM') {
                updatedRes = await reservationService.confirmReservation(reservationId);
                setMessage('Reservation confirmed successfully.');
            } else if (type === 'RESERVED') {
                updatedRes = await reservationService.markReserved(reservationId);
                setMessage('Customer marked as Reserved.');
            }

            setReservations(prev => prev.map(res => 
                res.id === reservationId ? updatedRes : res
            ));
            
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error(`Error during ${type}:`, error);
            setMessage(`Failed to update reservation.`);
        } finally {
            setActionLoading(null);
            setActionModal({ isOpen: false, reservationId: null, type: null });
        }
    };

    const formatTime = (time) => {
        if (!time) return 'N/A';
        const [hour, minute] = time.split(':');
        const h = parseInt(hour);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const displayHour = h % 12 || 12;
        return `${displayHour}:${minute} ${ampm}`;
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'PENDING':
                return 'bg-orange-100 text-orange-600';
            case 'CONFIRMED':
                return 'bg-green-100 text-green-600';
            case 'CANCELLED':
                return 'bg-red-100 text-red-600';
            case 'RESERVED':
                return 'bg-gray-100 text-gray-600';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div className="flex min-h-screen bg-transparent">
            <AdminSidebar />

            <Modal 
                isOpen={actionModal.isOpen}
                onClose={() => setActionModal({ isOpen: false, reservationId: null, type: null })}
                onConfirm={handleAction}
                title={actionModal.type === 'CONFIRM' ? 'Confirm Reservation' : 'Mark as Reserved'}
                message={actionModal.type === 'CONFIRM' 
                    ? 'Are you sure you want to confirm this reservation? This will notify the customer (simulated).' 
                    : 'Are you sure you want to mark this reservation as Reserved?'}
                confirmText={actionModal.type === 'CONFIRM' ? 'Confirm' : 'Mark Reserved'}
                type={actionModal.type === 'CONFIRM' ? 'success' : 'warning'}
            />

            {/* Main Content */}
            <main className="flex-1 p-8">
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 gap-4">
                    <div>
                        
                        <h1 className="text-3xl font-bold text-[#3E4958]">
                            Reservation Management
                        </h1>
                        <p className="text-gray-500 mt-1">Manage table bookings and customer attendance</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
                        <div className="relative group flex-1 sm:flex-none">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search by email or date..."
                                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-[#FF7F50] transition-all bg-white text-gray-700"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        
                        <div className="relative flex-1 sm:flex-none">
                                                        <select
                                className="pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7F50] appearance-none bg-white text-gray-600 cursor-pointer text-sm w-full sm:w-auto transition-all"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                {statuses.map(status => (
                                    <option key={status} value={status}>{status.replace('_', ' ')}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                        </div>
                    </div>
                </div>

                {message && (
                    <div className={`px-6 py-3 rounded-lg mb-6 flex items-center shadow-sm animate-fade-in ${message.toLowerCase().includes('failed') ? 'bg-red-500 text-white' : 'bg-[#48BB78] text-white'}`}>
                        {message}
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#F8F9FA] border-bottom border-gray-200">
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Details</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan="4" className="px-8 py-32 text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="w-16 h-16 border-[6px] border-[#FF7F50]/10 border-t-[#FF7F50] rounded-full animate-spin mb-6"></div>
                                                <p className="text-gray-400 font-bold tracking-tight">Syncing reservations...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredReservations.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-8 py-32 text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mb-6">
                                                    <Calendar className="text-gray-200" size={48} />
                                                </div>
                                                <p className="font-extrabold text-2xl text-[#1A1C1E]">No Bookings</p>
                                                <p className="text-gray-400 mt-2 font-medium">No reservations match your criteria.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredReservations.map((res) => (
                                        <React.Fragment key={res.id}>
                                            <tr 
                                                onClick={() => setExpandedId(expandedId === res.id ? null : res.id)}
                                                className={`cursor-pointer transition-colors ${expandedId === res.id ? 'bg-orange-50/30' : 'hover:bg-gray-50'}`}
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-orange-50 rounded-[1.2rem] flex items-center justify-center text-[#FF7F50] font-black text-lg border border-orange-100 shadow-sm transition-transform group-hover:scale-110">
                                                            <Mail size={20} />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-semibold text-gray-800 group-hover:text-[#FF7F50] transition-colors">
                                                                {res.customerEmail}
                                                            </span>
                                                            <span className="text-sm text-gray-500">Customer</span>
                                                        </div>
                                                    </div>
                                                </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex items-center gap-2 text-gray-700 font-bold text-sm">
                                                        <Calendar size={14} className="text-[#FF7F50]" />
                                                        {new Date(res.reservationDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex items-center gap-1.5 text-gray-400 text-xs font-bold">
                                                            <Clock size={12} /> {formatTime(res.reservationTime)}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-gray-400 text-xs font-bold">
                                                            <Users size={12} /> {res.guestCount} {res.guestCount === 1 ? 'Guest' : 'Guests'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyles(res.status)}`}>
                                                    {res.status.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setExpandedId(expandedId === res.id ? null : res.id);
                                                        }}
                                                        className={`p-2.5 rounded-xl transition-all ${expandedId === res.id ? 'bg-[#FF7F50] text-white rotate-180' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                                                    >
                                                        <ChevronDown size={18} />
                                                    </button>
                                                    {res.status === 'PENDING' && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setActionModal({ isOpen: true, reservationId: res.id, type: 'CONFIRM' });
                                                            }}
                                                            className="px-3 py-1 bg-green-50 text-green-600 rounded-lg font-semibold text-sm hover:bg-green-100 transition-colors"
                                                        >
                                                            Confirm
                                                        </button>
                                                    )}
                                                    {(res.status === 'PENDING' || res.status === 'CONFIRMED') && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setActionModal({ isOpen: true, reservationId: res.id, type: 'RESERVED' });
                                                            }}
                                                            className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg font-semibold text-sm hover:bg-gray-200 transition-colors"
                                                        >
                                                            Reserved
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                        {expandedId === res.id && (
                                            <tr className="animate-fade-in bg-orange-50/10">
                                                <td colSpan="4" className="px-8 py-6 border-l-4 border-[#FF7F50]">
                                                    <div className="flex flex-col gap-4 pl-4">
                                                        <div className="flex gap-4">
                                                            <div className="mt-1 text-[#FF7F50]">
                                                                <MessageSquare size={18} />
                                                            </div>
                                                            <div>
                                                                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Special Request</h4>
                                                                <p className="text-gray-600 text-[15px] leading-relaxed font-semibold max-w-3xl">
                                                                    {res.specialRequest ? res.specialRequest : <span className="italic text-gray-400 font-medium">No special request provided for this reservation.</span>}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            <style dangerouslySetInnerHTML={{ __html: `
                
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes scale-up {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in {
                    animation: fade-in 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .animate-scale-up {
                    animation: scale-up 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }
                @keyframes slide-in-right {
                    from { transform: translateX(100%) scale(0.9); opacity: 0; }
                    to { transform: translateX(0) scale(1); opacity: 1; }
                }
                .animate-slide-in-right {
                    animation: slide-in-right 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .overflow-x-auto {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .overflow-x-auto::-webkit-scrollbar {
                    display: none;
                }
            `}} />
        </div>
    );
};

export default AdminReservationManagement;
