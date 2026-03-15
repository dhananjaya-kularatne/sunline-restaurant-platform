import React, { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import api from '../services/api';

const UserReportsPage = ({ emailAddress }) => {
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchReports = async () => {
            try {
                // Determine email address to use
                // Typically you would get this from AuthContext or similar
                // But as passed from profile, we use it directly
                if (!emailAddress) {
                    setError('Unable to fetch reports: User email not found.');
                    return;
                }
                
                const response = await api.get(`/support-reports/user/${emailAddress}`);
                setReports(response.data);
            } catch (err) {
                console.error('Failed to fetch reports:', err);
                setError('Failed to load your reports. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchReports();
    }, [emailAddress]);

    const getStatusIcon = (status) => {
        switch (status?.toUpperCase()) {
            case 'RESOLVED':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'PENDING':
                return <Clock className="w-5 h-5 text-yellow-500" />;
            case 'CLOSED':
                return <XCircle className="w-5 h-5 text-gray-500" />;
            default:
                return <Clock className="w-5 h-5 text-blue-500" />;
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status?.toUpperCase()) {
            case 'RESOLVED':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'CLOSED':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return 'bg-blue-100 text-blue-800 border-blue-200';
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF7F50]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg my-4">
                {error}
            </div>
        );
    }

    if (reports.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100 my-4">
                <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Reports Found</h3>
                <p className="text-gray-500">You haven't submitted any support reports yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 my-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">My Support Reports</h2>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                {reports.map((report) => (
                    <div key={report.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-3">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(report.status)}`}>
                                    {getStatusIcon(report.status)}
                                    <span className="ml-1.5">{report.status || 'PENDING'}</span>
                                </span>
                                <span className="text-xs text-gray-500 font-medium bg-gray-50 px-2 py-1 rounded">
                                    {new Date(report.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            
                            <h4 className="text-md font-bold text-gray-900 mb-1">{report.category}</h4>
                            
                            {report.orderId && (
                                <p className="text-xs text-gray-500 mb-2 font-mono bg-gray-50 inline-block px-1.5 py-0.5 rounded border border-gray-100">
                                    Order: {report.orderId}
                                </p>
                            )}
                            
                            <p className="text-sm text-gray-600 line-clamp-2 mt-2">
                                "{report.description}"
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserReportsPage;
