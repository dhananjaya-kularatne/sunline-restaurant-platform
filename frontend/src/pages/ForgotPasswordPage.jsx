import { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/authService';
import { Utensils, Loader2, ArrowLeft, Mail } from 'lucide-react';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await authService.forgotPassword(email);
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Email not found');
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
                    <h2 className="text-3xl font-bold text-gray-800">Forgot Password</h2>
                    <p className="text-gray-500 mt-2 text-center">Enter your email to receive a reset link</p>
                </div>

                {success ? (
                    <div className="text-center">
                        <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 border border-green-100">
                            <Mail className="mx-auto mb-2 text-green-600" />
                            Reset link sent! Please check your email.
                        </div>
                        <Link to="/login" className="text-primary font-semibold hover:underline flex items-center justify-center">
                            <ArrowLeft size={16} className="mr-2" /> Back to Login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white py-3 rounded-lg font-bold flex items-center justify-center hover:opacity-90 disabled:opacity-50 transition-all shadow-md active:scale-[0.98]"
                        >
                            {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                            Send Reset Link
                        </button>

                        <Link to="/login" className="text-center text-gray-600 hover:text-primary transition-colors flex items-center justify-center">
                            <ArrowLeft size={16} className="mr-2" /> Back to Login
                        </Link>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
