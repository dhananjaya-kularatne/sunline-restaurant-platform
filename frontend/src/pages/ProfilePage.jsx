import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import { User, Camera, Loader2, CheckCircle, Mail, Type, FileText } from 'lucide-react';

const ProfilePage = () => {
    const { user, updateUser } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        bio: '',
        profilePicture: '',
    });
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await authService.getProfile();
                setFormData({
                    name: data.name || '',
                    email: data.email || '',
                    bio: data.bio || '',
                    profilePicture: data.profilePicture || '',
                });
            } catch (err) {
                setMessage({ text: 'Failed to load profile details', type: 'error' });
            }
        };
        fetchProfile();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: '', type: '' });

        try {
            const data = await authService.updateProfile(formData.name, formData.bio);
            updateUser({ ...user, name: data.name });
            setMessage({ text: 'Profile updated successfully!', type: 'success' });
        } catch (err) {
            setMessage({ text: err.response?.data?.message || err.message || 'Update failed', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        setMessage({ text: '', type: '' });
        try {
            const filePath = await authService.uploadProfilePicture(file);
            setFormData({ ...formData, profilePicture: filePath });
            setMessage({ text: 'Profile picture updated!', type: 'success' });
        } catch (err) {
            setMessage({ text: 'Failed to upload picture', type: 'error' });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/30 flex flex-col items-center justify-center px-4 py-12">
            <div className="max-w-5xl w-full mb-8">
                <h1 className="text-4xl font-bold text-[#1e293b] tracking-tight">My Profile</h1>
            </div>

            <div className="max-w-5xl w-full bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
                {/* Left Section */}
                <div className="w-full md:w-[38%] bg-[#F8FAFC]/50 p-12 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-100">
                    <div className="relative">
                        <div className="w-64 h-64 rounded-full overflow-hidden bg-white flex items-center justify-center shadow-lg border-4 border-white mb-6">
                            {formData.profilePicture ? (
                                <img
                                    src={`http://localhost:8080/uploads/${formData.profilePicture}`}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${formData.name}&background=6366f1&color=fff&size=256` }}
                                />
                            ) : (
                                <div className="bg-gray-100 w-full h-full flex items-center justify-center">
                                    <User size={100} className="text-gray-300" />
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => fileInputRef.current.click()}
                            disabled={uploading}
                            className="absolute bottom-6 right-2 w-16 h-16 bg-[#E67E51] text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 z-10 border-4 border-white"
                        >
                            {uploading ? <Loader2 size={24} className="animate-spin" /> : <Camera size={28} />}
                        </button>

                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept=".jpg,.jpeg,.png"
                        />
                    </div>
                    <p className="text-gray-400 text-sm font-medium text-center max-w-[200px] leading-relaxed mt-4">
                        Click the camera icon to update your profile photo
                    </p>
                </div>

                {/* Right Section */}
                <div className="w-full md:w-[62%] p-12 flex flex-col">
                    <form onSubmit={handleUpdate} className="flex-grow flex flex-col gap-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-[#1e293b]">Full Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-6 py-4 rounded-xl bg-[#F0F7FF] border-none focus:ring-2 focus:ring-blue-100 transition-all outline-none font-medium text-[#1e293b] placeholder:text-gray-400"
                                    placeholder="Enter your name"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-[#1e293b]">Email (Read Only)</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    readOnly
                                    className="w-full px-6 py-4 rounded-xl bg-[#F0F7FF] border-none text-gray-500 font-medium cursor-not-allowed outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-[#1e293b]">Bio</label>
                            <textarea
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                className="w-full px-6 py-4 rounded-xl bg-[#F0F7FF] border-none focus:ring-2 focus:ring-blue-100 transition-all outline-none font-medium text-[#1e293b] placeholder:text-gray-400 min-h-[180px] resize-none"
                                placeholder="Tell us about yourself"
                            />
                        </div>

                        <div className="mt-auto pt-6 flex flex-col gap-6">
                            {message.text && (
                                <div className={`p-4 rounded-xl flex items-center ${message.type === 'success' ? 'bg-[#F0FDF4] text-[#166534]' : 'bg-red-50 text-red-700'}`}>
                                    {message.type === 'success' && <CheckCircle size={20} className="mr-3" />}
                                    <span className="text-sm font-semibold">{message.text}</span>
                                </div>
                            )}

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={loading || uploading}
                                    className="px-12 py-4 bg-[#E67E51] text-white rounded-2xl font-bold text-lg shadow-lg shadow-[#E67E51]/20 hover:opacity-90 hover:-translate-y-0.5 active:scale-[0.98] transition-all disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none"
                                >
                                    {loading ? <Loader2 size={24} className="animate-spin" /> : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
