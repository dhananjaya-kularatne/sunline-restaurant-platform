import React, { useState, useEffect } from 'react';
import { Search, UserPlus, Users, LayoutDashboard, Settings, LogOut, ChevronDown, UserMinus, UserCheck, Shield, Utensils, Truck, User } from 'lucide-react';
import userService from '../services/userService';
import { useAuth } from '../context/AuthContext';

const AdminUserManagement = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const { user: currentUser } = useAuth();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async (searchTerm = '') => {
        try {
            setLoading(true);
            const data = await userService.getUsers(searchTerm);
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);
        fetchUsers(value);
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await userService.updateUserRole(userId, newRole);
            setMessage('User role updated!');
            fetchUsers(search);
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Error updating role:', error);
        }
    };

    const handleToggleStatus = async (userId, currentStatus) => {
        try {
            await userService.toggleUserStatus(userId);
            setMessage(currentStatus ? 'User deactivated!' : 'User reactivated!');
            fetchUsers(search);
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Error toggling status:', error);
        }
    };

    const getRoleBadge = (role) => {
        const roles = {
            ADMIN: 'bg-red-100 text-red-600',
            CUSTOMER: 'bg-gray-100 text-gray-600',
            KITCHEN: 'bg-blue-100 text-blue-600',
            DELIVERY: 'bg-green-100 text-green-600'
        };
        return `px-3 py-1 rounded-full text-xs font-bold ${roles[role] || roles.CUSTOMER}`;
    };

    const getInitials = (name) => {
        return name ? name.charAt(0).toUpperCase() : 'U';
    };

    const getAvatarColor = (name) => {
        const colors = ['bg-orange-100 text-orange-600', 'bg-blue-100 text-blue-600', 'bg-green-100 text-green-600', 'bg-purple-100 text-purple-600'];
        const index = name ? name.length % colors.length : 0;
        return colors[index];
    };

    return (
        <div className="flex min-h-screen bg-[#F8F9FA]">
            {/* Sidebar */}
            <aside className="w-64 bg-[#3E4958] text-white flex flex-col">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-[#FF7F50]">Sunline Admin</h2>
                </div>
                <nav className="flex-1 mt-4">
                    <div className="px-4 py-3 mx-2 rounded-lg bg-[#FF7F50] flex items-center gap-3 cursor-pointer">
                        <Users size={20} />
                        <span className="font-medium">User Management</span>
                    </div>
                    {/* Other nav items can be added here if needed */}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-[#3E4958]">User Management</h1>
                        <p className="text-gray-500">Manage platform users and their roles</p>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-72 focus:outline-none focus:ring-2 focus:ring-[#FF7F50] transition-all"
                            value={search}
                            onChange={handleSearch}
                        />
                    </div>
                </div>

                {message && (
                    <div className="bg-[#48BB78] text-white px-6 py-3 rounded-lg mb-6 flex items-center shadow-sm animate-fade-in">
                        {message}
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-[#F8F9FA] border-bottom border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500">Loading users...</td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500">No users found.</td>
                                </tr>
                            ) : (
                                users.map((u) => (
                                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${getAvatarColor(u.name)}`}>
                                                    {getInitials(u.name)}
                                                </div>
                                                <span className="font-semibold text-gray-800">{u.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{u.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={getRoleBadge(u.role)}>{u.role}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${u.active ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                                <span className={`text-sm ${u.active ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                                                    {u.active ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-3">
                                                <div className="relative group">
                                                    <select
                                                        value={u.role}
                                                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                                        className="appearance-none bg-gray-100 border border-transparent rounded-lg px-4 py-1.5 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF7F50] cursor-pointer"
                                                    >
                                                        <option value="CUSTOMER">Customer</option>
                                                        <option value="ADMIN">Admin</option>
                                                        <option value="KITCHEN">Kitchen</option>
                                                        <option value="DELIVERY">Delivery</option>
                                                    </select>
                                                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 p-0.5 text-gray-500 pointer-events-none" size={16} />
                                                </div>
                                                <button
                                                    onClick={() => handleToggleStatus(u.id, u.active)}
                                                    className={`p-2 rounded-lg transition-colors ${u.active ? 'text-red-500 hover:bg-red-50' : 'text-green-500 hover:bg-green-50'}`}
                                                    title={u.active ? 'Deactivate User' : 'Reactivate User'}
                                                >
                                                    {u.active ? <UserMinus size={18} /> : <UserCheck size={18} />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default AdminUserManagement;
