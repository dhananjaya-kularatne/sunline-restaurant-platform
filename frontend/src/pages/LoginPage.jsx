import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import { Utensils, Eye, EyeOff, Loader2 } from 'lucide-react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = await authService.login(email, password);
            login({ name: data.name, role: data.role }, data.token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Invalid credentials');
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
                    <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
                    <p className="text-gray-500 mt-2 text-center">Sign in to your Sunline Restaurant account</p>
                </div>

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

                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <Link to="/forgot-password" size="sm" className="text-sm text-primary hover:underline font-medium">
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none pr-10"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm mt-2 font-medium">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-white py-3 rounded-lg font-bold flex items-center justify-center hover:opacity-90 disabled:opacity-50 transition-all shadow-md active:scale-[0.98]"
                    >
                        {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                        Sign In
                    </button>

                    <p className="text-center text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary font-semibold hover:underline">
                            Register
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
