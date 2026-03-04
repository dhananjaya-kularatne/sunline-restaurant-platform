import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { Utensils, Loader2, Info } from 'lucide-react';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validatePassword = (pass) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^+=])[A-Za-z\d@$!%*?&#^+=]{8,}$/;
        return regex.test(pass);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!validatePassword(formData.password)) {
            setError('Password must meet the required complexity criteria (minimum 8 characters, one uppercase, one number, and one special character)');
            return;
        }

        setLoading(true);
        try {
            await authService.register(formData.name, formData.email, formData.password);
            setSuccess(true);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12 text-gray-800">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white mb-4 shadow-lg">
                        <Utensils size={32} />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
                    <p className="text-gray-500 mt-2 text-center">Join Sunline Restaurant today</p>
                </div>

                {success ? (
                    <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 text-center">
                        Registration successful! Redirecting to login...
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition-all outline-none"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                required
                                className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition-all outline-none"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                name="password"
                                required
                                className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition-all outline-none"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            <div className="mt-2 flex items-start text-xs text-blue-800 bg-[#e7f3ff] p-3 rounded-lg border border-blue-100">
                                <Info size={14} className="mr-2 mt-0.5 text-blue-500 shrink-0" />
                                <p>Password must be at least 8 characters with an uppercase letter, a number, and a special character.</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                required
                                className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition-all outline-none"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white py-3 rounded-lg font-bold flex items-center justify-center hover:opacity-90 disabled:opacity-50 transition-all shadow-md active:scale-[0.98] mt-4"
                        >
                            {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                            Register
                        </button>

                        <p className="text-center text-gray-600 mt-4">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary font-semibold hover:underline">
                                Sign In
                            </Link>
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
};

export default RegisterPage;
