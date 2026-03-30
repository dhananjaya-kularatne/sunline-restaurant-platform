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
import { CartProvider } from './context/CartContext';
import MenuPage from './pages/MenuPage';
import CreatePostPage from './pages/CreatePostPage';
import SocialFeedPage from './pages/SocialFeedPage';
import CartPage from './pages/CartPage';

import AdminMenuManagement from './pages/AdminMenuManagement';
import AdminPostManagement from './pages/AdminPostManagement';
import SupportPage from './pages/SupportPage';
import UserReportsPage from './pages/UserReportsPage';
import AdminSupportManagement from './pages/AdminSupportManagement';
import AdminReservationManagement from './pages/AdminReservationManagement';
import ReservationsPage from './pages/ReservationsPage';
import MyReservationsPage from './pages/MyReservationsPage';
import Footer from './components/Footer';

function App() {
    return (
        <AuthProvider>
            <CartProvider>
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
                            <Route path="/user/:userId" element={<ProfilePage />} />
                            <Route path="/my-reports" element={<UserReportsPage />} />
                            <Route path="/admin/users" element={<AdminUserManagement />} />
                            <Route path="/admin/menu" element={<AdminMenuManagement />} />
                            <Route path="/admin/posts" element={<AdminPostManagement />} />
                            <Route path="/admin/support" element={<AdminSupportManagement />} />
                            <Route path="/admin/reservations" element={<AdminReservationManagement />} />
                            <Route path="/reservations" element={<MyReservationsPage />} />
                            <Route path="/book-table" element={<ReservationsPage />} />
                            <Route path="/create-post" element={<CreatePostPage />} />
                            <Route path="/social-feed" element={<SocialFeedPage />} />
                            <Route path="/cart" element={<CartPage />} />
                        </Routes>
                        <Footer />
                    </div>
                </Router>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;
