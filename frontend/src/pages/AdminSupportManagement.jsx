import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, Trash2, Calendar, User, MessageSquare, Clipboard, AlertCircle, X, ChevronDown, CheckCircle2, Clock, Eye, MoreHorizontal } from 'lucide-react';
import supportService from '../services/supportService';
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

const CustomStatusDropdown = ({ currentStatus, onUpdate, isLoading, options }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const currentOption = options.find(opt => opt.value === currentStatus) || options[0];
    const Icon = currentOption.icon;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                disabled={isLoading}
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    flex items-center justify-between gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300
                    border-2 ${currentOption.borderColor} ${currentOption.bgColor} ${currentOption.textColor}
                    shadow-sm hover:shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-wait min-w-[140px]
                `}
            >
                <div className="flex items-center gap-2">
                    <Icon size={14} className={isLoading ? 'animate-spin' : ''} />
                    <span>{currentOption.label}</span>
                </div>
            </button>

            {isOpen && (
                <div className="absolute top-full mt-2 left-0 w-full z-20 overflow-hidden bg-white/80 backdrop-blur-xl border border-gray-100 rounded-[1.5rem] shadow-2xl animate-scale-up py-2">
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => {
                                onUpdate(opt.value);
                                setIsOpen(false);
                            }}
                            className={`
                                w-full flex items-center gap-3 px-4 py-3 text-[11px] font-bold uppercase tracking-widest transition-all
                                hover:bg-gray-50/80 ${currentStatus === opt.value ? opt.textColor + ' bg-gray-50/50' : 'text-gray-400 hover:text-gray-600'}
                            `}
                        >
                            <opt.icon size={16} />
                            {opt.label}
                            {currentStatus === opt.value && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-current"></div>}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const AdminSupportManagement = () => {
    const [reports, setReports] = useState([]);
    const [filteredReports, setFilteredReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [message, setMessage] = useState('');
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, reportId: null });
    const [statusLoading, setStatusLoading] = useState(null);
    const [expandedId, setExpandedId] = useState(null);

    const categories = [
        'All',
        'General Inquiry',
        'Food Quality',
        'Service Quality',
        'Technical Issue',
        'Billing Issues',
        'Other'
    ];

    const statusOptions = [
        { 
            value: 'PENDING', 
            label: 'Pending', 
            bgColor: 'bg-amber-50', 
            textColor: 'text-amber-600', 
            borderColor: 'border-amber-100',
            icon: Clock 
        },
        { 
            value: 'IN_REVIEW', 
            label: 'In Review', 
            bgColor: 'bg-indigo-50', 
            textColor: 'text-indigo-600', 
            borderColor: 'border-indigo-100',
            icon: Eye 
        },
        { 
            value: 'RESOLVED', 
            label: 'Resolved', 
            bgColor: 'bg-emerald-50', 
            textColor: 'text-emerald-600', 
            borderColor: 'border-emerald-100',
            icon: CheckCircle2 
        }
    ];

    useEffect(() => {
        fetchReports();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [reports, categoryFilter, searchQuery]);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const data = await supportService.getAllReports();
            setReports(data || []);
        } catch (error) {
            console.error('Error fetching support reports:', error);
            setMessage('Failed to load support reports.');
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...reports];

        if (categoryFilter !== 'All') {
            filtered = filtered.filter(report => report.category === categoryFilter);
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(report => 
                report.fullName.toLowerCase().includes(query) || 
                report.emailAddress.toLowerCase().includes(query) ||
                report.description.toLowerCase().includes(query) ||
                (report.orderId && report.orderId.toLowerCase().includes(query))
            );
        }

        setFilteredReports(filtered);
    };

    const handleOpenDeleteModal = (id) => {
        setDeleteModal({ isOpen: true, reportId: id });
    };

    const handleDeleteReport = async () => {
        const id = deleteModal.reportId;
        try {
            await supportService.deleteReport(id);
            setMessage('Report permanently removed.');
            setReports(prev => prev.filter(r => r.id !== id));
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Error deleting report:', error);
            setMessage('Failed to delete report.');
        } finally {
            setDeleteModal({ isOpen: false, reportId: null });
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            setStatusLoading(id);
            await supportService.updateReportStatus(id, newStatus);
            setReports(prev => prev.map(report => 
                report.id === id ? { ...report, status: newStatus } : report
            ));
            setMessage(`Ticket updated to ${newStatus.replace('_', ' ')}`);
            setTimeout(() => setMessage(''), 5000);
        } catch (error) {
            console.error('Full error object:', error);
            const errorMsg = error.response ? `Update failed (Status ${error.response.status}).` : 'Update failed. Connection error.';
            setMessage(errorMsg);
            setTimeout(() => setMessage(''), 5000);
        } finally {
            setStatusLoading(null);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="flex min-h-screen bg-[#F8F9FA]">
            <AdminSidebar />

            <Modal 
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, reportId: null })}
                onConfirm={handleDeleteReport}
                title="Archive Ticket"
                message="Are you sure you want to remove this ticket from your dashboard? The customer will still be able to see it in their history, but it will be hidden from the admin view."
                confirmText="Archive"
                type="danger"
            />

            {/* Main Content */}
            <main className="flex-1 p-10">
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-12 gap-8">
                    <div>
                        
                        <h1 className="text-3xl font-bold text-[#3E4958]">
                            Support Management
                        </h1>
                        <p className="text-gray-500 mt-1">Review and resolve customer support requests</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
                        <div className="relative group flex-1 sm:flex-none">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search queries..."
                                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-[#FF7F50] transition-all bg-white text-gray-700"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        
                        <div className="relative flex-1 sm:flex-none">
                                                        <select
                                className="pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7F50] appearance-none bg-white text-gray-600 cursor-pointer text-sm w-full sm:w-auto transition-all"
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                        </div>
                    </div>
                </div>

                {message && (
                    <div className="fixed bottom-10 right-10 z-[100] animate-slide-in-right">
                        <div className={`
                            px-8 py-5 rounded-[2rem] flex items-center gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.15)] 
                            backdrop-blur-xl border-2
                            ${message.toLowerCase().includes('failed') 
                                ? 'bg-rose-50/90 border-rose-200 text-rose-600' 
                                : 'bg-emerald-50/90 border-emerald-200 text-emerald-600'}
                        `}>
                            <div className="p-2 bg-white rounded-xl shadow-sm">
                                {message.toLowerCase().includes('failed') ? <AlertCircle size={24} /> : <CheckCircle2 size={24} />}
                            </div>
                            <div className="flex flex-col">
                                <span className="font-black text-sm tracking-tight leading-tight">
                                    {message.toLowerCase().includes('failed') ? 'Action Failed' : 'Action Successful'}
                                </span>
                                <span className="text-[11px] font-bold opacity-70 tracking-wide uppercase">
                                    {message}
                                </span>
                            </div>
                            <button onClick={() => setMessage('')} className="ml-4 p-1 hover:bg-black/5 rounded-full transition-colors">
                                <X size={16} />
                            </button>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#F8F9FA] border-bottom border-gray-200">
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Time</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50/50">
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="px-8 py-32 text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="w-16 h-16 border-[6px] border-[#FF7F50]/10 border-t-[#FF7F50] rounded-full animate-spin mb-6"></div>
                                                <p className="text-gray-400 font-bold tracking-tight">Syncing with server...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredReports.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-8 py-32 text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mb-6">
                                                    <MessageSquare className="text-gray-200" size={48} />
                                                </div>
                                                <p className="font-extrabold text-2xl text-[#1A1C1E]">Clear Skies</p>
                                                <p className="text-gray-400 mt-2 font-medium">No pending support requests found.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredReports.map((report) => (
                                        <React.Fragment key={report.id}>
                                            <tr 
                                                onClick={() => setExpandedId(expandedId === report.id ? null : report.id)}
                                                className={`cursor-pointer transition-colors ${expandedId === report.id ? 'bg-orange-50/30' : 'hover:bg-gray-50'}`}
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-orange-50 rounded-[1.2rem] flex items-center justify-center text-[#FF7F50] font-black text-lg border border-orange-100 shadow-sm transition-transform group-hover:scale-110">
                                                            {report.fullName.charAt(0)}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-semibold text-gray-800 group-hover:text-[#FF7F50] transition-colors">
                                                                {report.fullName}
                                                            </span>
                                                            <span className="text-sm text-gray-500">{report.emailAddress}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                        report.category === 'Food Quality' ? 'bg-rose-50 text-rose-500 border-rose-100' :
                                                        report.category === 'Service Quality' ? 'bg-amber-50 text-amber-500 border-amber-100' :
                                                        report.category === 'Billing Issues' ? 'bg-emerald-50 text-emerald-500 border-emerald-100' :
                                                        report.category === 'Technical Issue' ? 'bg-sky-50 text-sky-500 border-sky-100' :
                                                        'bg-gray-100 text-gray-600'
                                                    }`}>
                                                        {report.category}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                                    <CustomStatusDropdown 
                                                        currentStatus={report.status} 
                                                        onUpdate={(newStatus) => handleStatusUpdate(report.id, newStatus)}
                                                        isLoading={statusLoading === report.id}
                                                        options={statusOptions}
                                                    />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                                                            <Calendar size={14} className="text-gray-400" />
                                                            {formatDate(report.createdAt)}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => setExpandedId(expandedId === report.id ? null : report.id)}
                                                            className={`p-2 rounded-lg transition-all ${expandedId === report.id ? 'bg-[#FF7F50] text-white rotate-180' : 'text-gray-400 hover:bg-gray-100'}`}
                                                        >
                                                            <ChevronDown size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleOpenDeleteModal(report.id)}
                                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            {expandedId === report.id && (
                                                <tr className="animate-fade-in bg-orange-50/10">
                                                    <td colSpan="5" className="px-8 py-6 border-l-4 border-[#FF7F50]">
                                                        <div className="flex flex-col gap-4 pl-4">
                                                            {report.orderId && (
                                                                <div className="inline-flex items-center gap-2 bg-white text-[#FF7F50] px-3 py-1.5 rounded-[0.8rem] text-[10px] font-black w-fit border-2 border-orange-50 shadow-sm uppercase tracking-widest">
                                                                    <Clipboard size={12} />
                                                                    Ref: {report.orderId}
                                                                </div>
                                                            )}
                                                            <div className="flex gap-4">
                                                                <div className="mt-1 text-[#FF7F50]">
                                                                    <MessageSquare size={18} />
                                                                </div>
                                                                <p className="text-gray-600 text-[15px] leading-relaxed font-semibold max-w-3xl">
                                                                    {report.description}
                                                                </p>
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
                .line-clamp-3 {
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                /* Hide scrollbar for Chrome, Safari and Opera */
                .overflow-x-auto::-webkit-scrollbar {
                    display: none;
                }
                /* Hide scrollbar for IE, Edge and Firefox */
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
            `}} />
        </div>
    );
};

export default AdminSupportManagement;
