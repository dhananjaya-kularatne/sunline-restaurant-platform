import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import HomePage from './pages/HomePage';
import CustomerNavbar from './components/CustomerNavbar';
import { AuthProvider, useAuth } from './context/AuthContext';

const AppContent = () => {
    const { token } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 border-none outline-none">
            <CustomerNavbar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/register" element={token ? <Navigate to="/" replace /> : <RegisterPage />} />
                <Route path="/login" element={token ? <Navigate to="/" replace /> : <LoginPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </div>
    );
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <AppContent />
            </Router>
        </AuthProvider>
    );
}

export default App;
