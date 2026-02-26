import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';

function App() {
    return (
        <Router>
            <div className="app">
                <Routes>
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/" element={<Navigate to="/register" replace />} />
                    {/* Mock login route for redirect after registration */}
                    <Route path="/login" element={<div className="min-h-screen flex items-center justify-center text-2xl font-bold">Login Page (Not implemented in this story)</div>} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
