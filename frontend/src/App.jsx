import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
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
import WishlistPage from './pages/WishlistPage';
import KitchenPage from './pages/KitchenPage';
import DeliveryPage from './pages/DeliveryPage';

import AdminMenuManagement from './pages/AdminMenuManagement';
import AdminPostManagement from './pages/AdminPostManagement';
import SupportPage from './pages/SupportPage';
import UserReportsPage from './pages/UserReportsPage';
import AdminSupportManagement from './pages/AdminSupportManagement';
import AdminReservationManagement from './pages/AdminReservationManagement';
import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminDashboard from './pages/AdminDashboard';
import ReservationsPage from './pages/ReservationsPage';
import MyReservationsPage from './pages/MyReservationsPage';
import CheckoutPage from './pages/CheckoutPage';
import MyOrdersPage from './pages/MyOrdersPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import Footer from './components/Footer';
import ChatbotWidget from './components/ChatbotWidget';

function AppContent() {
    const location = useLocation();
    
    // Check if the current route is a dashboard-style page
    const isDashboardPage = location.pathname.startsWith('/admin') ||
                            location.pathname === '/kitchen' ||
                            location.pathname === '/delivery';

    // Different background colors as discussed
    const bgColor = isDashboardPage ? '#F8F9FA' : '#FDF8F3';

    return (
        <div style={{ backgroundColor: bgColor }} className="min-h-screen text-gray-900 border-none outline-none transition-colors duration-500">
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
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminUserManagement />} />
                <Route path="/admin/menu" element={<AdminMenuManagement />} />
                <Route path="/admin/posts" element={<AdminPostManagement />} />
                <Route path="/admin/support" element={<AdminSupportManagement />} />
                <Route path="/admin/reservations" element={<AdminReservationManagement />} />
                <Route path="/admin/orders" element={<AdminOrdersPage />} />
                <Route path="/reservations" element={<MyReservationsPage />} />
                <Route path="/book-table" element={<ReservationsPage />} />
                <Route path="/create-post" element={<CreatePostPage />} />
                <Route path="/social-feed" element={<SocialFeedPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/my-orders" element={<MyOrdersPage />} />
                <Route path="/order-success" element={<OrderSuccessPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/kitchen" element={<KitchenPage />} />
                <Route path="/delivery" element={<DeliveryPage />} />
            </Routes>
            <Footer />
            <ChatbotWidget />
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <Router>
                    <AppContent />
                </Router>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;
