import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import authService from '../services/authService';
import { Utensils, Loader2, Key, CheckCircle, XCircle } from 'lucide-react';

const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const [tokenValid, setTokenValid] = useState(false);
    const [validating, setValidating] = useState(true);

    const navigate = useNavigate();

    const validatePassword = (pass) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^+=])[A-Za-z\d@$!%*?&#^+=]{8,}$/;
        return regex.test(pass);
    };

    useEffect(() => {
        const checkToken = async () => {
            if (!token) {
                setError('Invalid or missing reset token');
                setValidating(false);
                return;
            }

            try {
                await authService.validateToken(token);
                setTokenValid(true);
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Invalid or expired token');
                setTokenValid(false);
            } finally {
                setValidating(false);
            }
        };

        checkToken();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!validatePassword(password)) {
            setError('Password must be at least 8 chars with an uppercase letter, a number, and a special character');
            return;
        }

        setLoading(true);
        try {
            await authService.resetPassword(token, password);
            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 card-shadow">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white mb-4 shadow-lg">
                        <Utensils size={32} />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800">Reset Password</h2>
                    <p className="text-gray-500 mt-2 text-center text-sm">
                        {validating ? 'Checking your reset link...' : success ? 'Successfully Reset!' : tokenValid ? 'Enter your new secure password' : 'Issue with reset link'}
                    </p>
                </div>

                {validating ? (
                    <div className="flex flex-col items-center py-8">
                        <Loader2 className="animate-spin text-primary mb-4" size={40} />
                        <p className="text-gray-500">Please wait a moment...</p>
                    </div>
                ) : success ? (
                    <div className="bg-green-50 text-green-700 p-6 rounded-xl mb-6 text-center border border-green-100">
                        <CheckCircle className="mx-auto mb-4 text-green-600" size={48} />
                        <h3 className="font-bold text-lg mb-2">Password Updated!</h3>
                        <p>Your password has been changed successfully. Redirecting you to login...</p>
                    </div>
                ) : !tokenValid ? (
                    <div className="space-y-6">
                        <div className="bg-red-50 text-red-700 p-6 rounded-xl text-center border border-red-100">
                            <XCircle className="mx-auto mb-4 text-red-600" size={48} />
                            <h3 className="font-bold text-lg mb-2">Expired or Invalid Link</h3>
                            <p className="text-sm mb-4">{error}</p>
                        </div>
                        <button
                            onClick={() => navigate('/forgot-password')}
                            className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:opacity-90 transition-all shadow-md active:scale-[0.98]"
                        >
                            Request a new link
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none pr-10"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <Key className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                            <input
                                type="password"
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm mt-2 font-medium">{error}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white py-3 rounded-lg font-bold flex items-center justify-center hover:opacity-90 disabled:opacity-50 transition-all shadow-md active:scale-[0.98]"
                        >
                            {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                            Reset Password
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ResetPasswordPage;
