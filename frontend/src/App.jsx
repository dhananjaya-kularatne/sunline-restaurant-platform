import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProfilePage from './pages/ProfilePage';
import AdminUserManagement from './pages/AdminUserManagement';
import HomePage from './pages/HomePage';
import CustomerNavbar from './components/CustomerNavbar';
import { AuthProvider } from './context/AuthContext';
import MenuPage from './pages/MenuPage';

import AdminMenuManagement from './pages/AdminMenuManagement';
import SupportPage from './pages/SupportPage';
import UserReportsPage from './pages/UserReportsPage';
import AdminSupportManagement from './pages/AdminSupportManagement';
import Footer from './components/Footer';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen bg-transparent text-gray-900 border-none outline-none">
                    <CustomerNavbar />
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/menu" element={<MenuPage />} />
                        <Route path="/support" element={<SupportPage />} />
                        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                        <Route path="/reset-password" element={<ResetPasswordPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/my-reports" element={<UserReportsPage />} />
                        <Route path="/admin/users" element={<AdminUserManagement />} />
                        <Route path="/admin/menu" element={<AdminMenuManagement />} />
                        <Route path="/admin/support" element={<AdminSupportManagement />} />
                    </Routes>
                    <Footer />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
