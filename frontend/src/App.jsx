import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProfilePage from './pages/ProfilePage';
import AdminUserManagement from './pages/AdminUserManagement';
import HomePage from './pages/HomePage';
import CustomerNavbar from './components/CustomerNavbar';
import ProtectedRoute from './components/ProtectedRoute';
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
import AdminReportsPage from './pages/AdminReportsPage';
import AdminRatingsManagement from './pages/AdminRatingsManagement';
import ReservationsPage from './pages/ReservationsPage';
import MyReservationsPage from './pages/MyReservationsPage';
import CheckoutPage from './pages/CheckoutPage';
import MyOrdersPage from './pages/MyOrdersPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import AdminRatingsPage from './pages/AdminRatingsPage';
import Footer from './components/Footer';
import ChatbotWidget from './components/ChatbotWidget';

function AppContent() {
    const location = useLocation();

    const isDashboardPage = location.pathname.startsWith('/admin') ||
        location.pathname === '/kitchen' ||
        location.pathname === '/delivery';

    const bgColor = isDashboardPage ? '#F8F9FA' : '#FDF8F3';

    return (
        <div style={{ backgroundColor: bgColor }} className="min-h-screen text-gray-900 border-none outline-none transition-colors duration-500">
            <CustomerNavbar />
            <Routes>
                {/* Public */}
                <Route path="/" element={<HomePage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/menu" element={<MenuPage />} />
                <Route path="/support" element={<SupportPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/social-feed" element={<SocialFeedPage />} />
                <Route path="/user/:userId" element={<ProfilePage />} />

                {/* Authenticated */}
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="/my-reports" element={<ProtectedRoute><UserReportsPage /></ProtectedRoute>} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/my-orders" element={<ProtectedRoute><MyOrdersPage /></ProtectedRoute>} />
                <Route path="/order-success" element={<OrderSuccessPage />} />
                <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
                <Route path="/reservations" element={<MyReservationsPage />} />
                <Route path="/book-table" element={<ReservationsPage />} />
                <Route path="/create-post" element={<ProtectedRoute><CreatePostPage /></ProtectedRoute>} />
                <Route path="/kitchen" element={<ProtectedRoute><KitchenPage /></ProtectedRoute>} />
                <Route path="/delivery" element={<ProtectedRoute><DeliveryPage /></ProtectedRoute>} />

                {/* Admin only */}
                <Route path="/admin/dashboard" element={<ProtectedRoute requiredRole="ADMIN"><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/reports" element={<ProtectedRoute requiredRole="ADMIN"><AdminReportsPage /></ProtectedRoute>} />
                <Route path="/admin/users" element={<ProtectedRoute requiredRole="ADMIN"><AdminUserManagement /></ProtectedRoute>} />
                <Route path="/admin/menu" element={<ProtectedRoute requiredRole="ADMIN"><AdminMenuManagement /></ProtectedRoute>} />
                <Route path="/admin/posts" element={<ProtectedRoute requiredRole="ADMIN"><AdminPostManagement /></ProtectedRoute>} />
                <Route path="/admin/support" element={<ProtectedRoute requiredRole="ADMIN"><AdminSupportManagement /></ProtectedRoute>} />
                <Route path="/admin/reservations" element={<ProtectedRoute requiredRole="ADMIN"><AdminReservationManagement /></ProtectedRoute>} />
                <Route path="/admin/orders" element={<ProtectedRoute requiredRole="ADMIN"><AdminOrdersPage /></ProtectedRoute>} />
                <Route path="/admin/ratings-management" element={<ProtectedRoute requiredRole="ADMIN"><AdminRatingsManagement /></ProtectedRoute>} />
                <Route path="/admin/ratings" element={<ProtectedRoute requiredRole="ADMIN"><AdminRatingsPage /></ProtectedRoute>} />
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
