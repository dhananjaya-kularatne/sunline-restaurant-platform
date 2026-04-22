import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import adminService from '../services/adminService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { DollarSign, ShoppingBag, AlertCircle } from 'lucide-react';

const AdminReportsPage = () => {
    // Default to current month and year
    const currentDate = new Date();
    const [year, setYear] = useState(currentDate.getFullYear());
    const [month, setMonth] = useState(currentDate.getMonth() + 1); // 1-12
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const generateReport = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await adminService.getSalesReport(year, month);
            setReportData(data);
        } catch (err) {
            console.error('Failed to generate report:', err);
            setError('Failed to fetch report data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Auto-generate on first load
    useEffect(() => {
        generateReport();
    }, []);

    const months = [
        { value: 1, label: 'January' }, { value: 2, label: 'February' },
        { value: 3, label: 'March' }, { value: 4, label: 'April' },
        { value: 5, label: 'May' }, { value: 6, label: 'June' },
        { value: 7, label: 'July' }, { value: 8, label: 'August' },
        { value: 9, label: 'September' }, { value: 10, label: 'October' },
        { value: 11, label: 'November' }, { value: 12, label: 'December' }
    ];

    const currentYear = new Date().getFullYear();
    const years = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1];

    const hasData = reportData && reportData.totalOrders > 0;

    return (
        <div className="flex min-h-screen bg-[#F8F9FA]">
            <AdminSidebar />
            <main className="flex-1 p-8">
                <div className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-[#3E4958]">Monthly Sales & Revenue Report</h1>
                        <p className="text-gray-500 mt-1">Analyze restaurant business performance</p>
                    </div>

                    <div className="flex gap-4 items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <select 
                            value={month} 
                            onChange={(e) => setMonth(Number(e.target.value))}
                            className="bg-gray-50 border border-gray-200 text-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-[#FF7F50]"
                        >
                            {months.map(m => (
                                <option key={m.value} value={m.value}>{m.label}</option>
                            ))}
                        </select>
                        <select 
                            value={year} 
                            onChange={(e) => setYear(Number(e.target.value))}
                            className="bg-gray-50 border border-gray-200 text-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-[#FF7F50]"
                        >
                            {years.map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                        <button 
                            onClick={generateReport}
                            disabled={loading}
                            className="bg-[#FF7F50] hover:bg-[#e66a3e] text-white px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                            {loading ? 'Generating...' : 'Generate Report'}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-8 flex items-center border border-red-100">
                        <AlertCircle className="mr-2" />
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex items-center justify-center p-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF7F50]"></div>
                    </div>
                ) : reportData && !hasData ? (
                    <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
                        <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle size={32} className="text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-700 mb-2">No Data Available</h3>
                        <p className="text-gray-500">There are no orders for the selected month.</p>
                    </div>
                ) : hasData ? (
                    <div className="space-y-8">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6">
                                <div className="bg-green-100 p-4 rounded-2xl text-green-600">
                                    <DollarSign size={32} />
                                </div>
                                <div>
                                    <h3 className="text-gray-500 font-medium uppercase tracking-wider text-sm">Total Revenue</h3>
                                    <div className="text-4xl font-bold text-gray-900 mt-1">
                                        Rs. {reportData.totalRevenue.toFixed(2)}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6">
                                <div className="bg-blue-100 p-4 rounded-2xl text-blue-600">
                                    <ShoppingBag size={32} />
                                </div>
                                <div>
                                    <h3 className="text-gray-500 font-medium uppercase tracking-wider text-sm">Total Orders</h3>
                                    <div className="text-4xl font-bold text-gray-900 mt-1">
                                        {reportData.totalOrders}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Top Selling Items Chart */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <div className="mb-6">
                                <h2 className="text-xl font-bold text-[#3E4958]">Most Sold Items</h2>
                                <p className="text-gray-500 text-sm">Top 5 popular items by quantity sold</p>
                            </div>
                            
                            <div className="h-[400px] w-full">
                                {reportData.topSellingItems && reportData.topSellingItems.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={reportData.topSellingItems}
                                            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                            <XAxis 
                                                dataKey="name" 
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: '#6B7280', fontSize: 13 }}
                                                angle={-45}
                                                textAnchor="end"
                                                dy={10}
                                            />
                                            <YAxis 
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: '#6B7280', fontSize: 13 }}
                                                allowDecimals={false}
                                            />
                                            <Tooltip 
                                                cursor={{ fill: '#F3F4F6' }}
                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            />
                                            <Bar 
                                                dataKey="quantity" 
                                                fill="#FF7F50" 
                                                radius={[6, 6, 0, 0]}
                                                name="Quantity Sold"
                                                barSize={50}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400">
                                        No item data available
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : null}
            </main>
        </div>
    );
};

export default AdminReportsPage;
