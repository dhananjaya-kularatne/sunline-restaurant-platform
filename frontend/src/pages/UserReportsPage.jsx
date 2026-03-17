import React, { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, XCircle, FileText, PlusCircle, Trash2, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const UserReportsPage = () => {
    const { user, loading: authLoading } = useAuth();
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleteModal, setDeleteModal] = useState({ show: false, reportId: null });
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchReports = async () => {
            // Wait for auth to finish loading from localStorage
            if (authLoading) return;

            setError('');
            setIsLoading(true);

            if (!user?.email) {
                setError('Please log in to view your reports.');
                setIsLoading(false);
                return;
            }
            try {
                const response = await api.get(`/support-reports/user/${user.email}`);
                setReports(response.data);
            } catch (err) {
                console.error('Failed to fetch reports:', err);
                setError('Failed to load your reports. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchReports();
    }, [user, authLoading]);

    const handleDelete = async () => {
        if (!deleteModal.reportId) return;

        setIsDeleting(true);
        try {
            await api.delete(`/support-reports/${deleteModal.reportId}`);
            setReports(prev => prev.filter(report => report.id !== deleteModal.reportId));
            setDeleteModal({ show: false, reportId: null });
        } catch (err) {
            console.error('Failed to delete report:', err);
            alert('Failed to delete report. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toUpperCase()) {
            case 'RESOLVED': return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'PENDING':  return <Clock className="w-4 h-4 text-yellow-500" />;
            case 'CLOSED':   return <XCircle className="w-4 h-4 text-gray-500" />;
            default:         return <Clock className="w-4 h-4 text-blue-500" />;
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status?.toUpperCase()) {
            case 'RESOLVED': return 'bg-green-100 text-green-800 border-green-200';
            case 'PENDING':  return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'CLOSED':   return 'bg-gray-100 text-gray-800 border-gray-200';
            default:         return 'bg-blue-100 text-blue-800 border-blue-200';
        }
    };

    const getCategoryBadgeClass = (category) => {
        const map = {
            'Food Quality':    'bg-orange-50 text-orange-700 border-orange-200',
            'Billing Issues':  'bg-purple-50 text-purple-700 border-purple-200',
            'Service Quality': 'bg-blue-50 text-blue-700 border-blue-200',
            'Technical Issue': 'bg-red-50 text-red-700 border-red-200',
            'General Inquiry': 'bg-gray-50 text-gray-700 border-gray-200',
            'Other':           'bg-gray-50 text-gray-600 border-gray-200',
        };
        return map[category] || 'bg-gray-50 text-gray-700 border-gray-200';
    };

    return (
        <div className="min-h-screen bg-gray-50/30 px-4 py-12">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                            <FileText className="text-[#FF7F50]" size={30} />
                            My Support Reports
                        </h1>
                        <p className="text-gray-500 mt-1 text-sm">Track the status of your submitted support requests</p>
                    </div>
                    <Link
                        to="/support"
                        className="inline-flex items-center gap-2 bg-[#FF7F50] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#e06b3f] hover:-translate-y-0.5 transition-all duration-200 shadow-sm shadow-[#FF7F50]/20"
                    >
                        <PlusCircle size={16} />
                        New Report
                    </Link>
                </div>

                {/* Loading */}
                {isLoading && (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#FF7F50]"></div>
                    </div>
                )}

                {/* Error */}
                {!isLoading && error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-5 rounded-xl text-sm">
                        {error}
                    </div>
                )}

                {/* Empty state */}
                {!isLoading && !error && reports.length === 0 && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
                        <Package className="mx-auto h-14 w-14 text-gray-300 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">No Reports Yet</h3>
                        <p className="text-gray-500 text-sm">You haven't submitted any support reports yet.</p>
                    </div>
                )}

                {/* Reports grid */}
                {!isLoading && !error && reports.length > 0 && (
                    <>
                        <p className="text-sm text-gray-500 mb-4">
                            {reports.length} report{reports.length !== 1 ? 's' : ''} found
                        </p>
                        <div className="grid gap-4 md:grid-cols-2">
                            {reports.map((report) => (
                                <div
                                    key={report.id}
                                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                                >
                                    <div className="p-5">
                                        {/* Status + Date */}
                                        <div className="flex justify-between items-center mb-3">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeClass(report.status)}`}>
                                                {getStatusIcon(report.status)}
                                                {report.status || 'PENDING'}
                                            </span>
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs text-gray-400 font-medium">
                                                    {new Date(report.createdAt).toLocaleDateString('en-US', {
                                                        year: 'numeric', month: 'short', day: 'numeric'
                                                    })}
                                                </span>
                                                <button
                                                    onClick={() => setDeleteModal({ show: true, reportId: report.id })}
                                                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete Report"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Category badge */}
                                        <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-md border mb-2 ${getCategoryBadgeClass(report.category)}`}>
                                            {report.category}
                                        </span>

                                        {/* Order ID */}
                                        {report.orderId && (
                                            <p className="text-xs text-gray-400 font-mono mb-2">
                                                Order: <span className="text-gray-600 font-semibold">{report.orderId}</span>
                                            </p>
                                        )}

                                        {/* Description */}
                                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 border-t border-gray-50 pt-3">
                                            {report.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Custom Delete Modal */}
            {deleteModal.show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
                        onClick={() => !isDeleting && setDeleteModal({ show: false, reportId: null })}
                    ></div>
                    
                    {/* Modal Content */}
                    <div className="relative bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 overflow-hidden transform transition-all animate-in fade-in zoom-in duration-300">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
                                <AlertTriangle className="text-red-500" size={32} />
                            </div>
                            
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Report?</h3>
                            <p className="text-gray-500 text-sm leading-relaxed mb-8">
                                This action cannot be undone. This report will be permanently removed from your history.
                            </p>
                            
                            <div className="flex flex-col w-full gap-3">
                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="w-full bg-red-500 text-white py-3.5 rounded-2xl font-bold hover:bg-red-600 transition-colors disabled:opacity-50 shadow-lg shadow-red-500/20"
                                >
                                    {isDeleting ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Deleting...
                                        </div>
                                    ) : 'Delete Report'}
                                </button>
                                <button
                                    onClick={() => setDeleteModal({ show: false, reportId: null })}
                                    disabled={isDeleting}
                                    className="w-full bg-gray-50 text-gray-600 py-3.5 rounded-2xl font-bold hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserReportsPage;
