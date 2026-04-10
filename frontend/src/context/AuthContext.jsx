import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const savedUser = localStorage.getItem('user');
            const token = localStorage.getItem('token');
            
            if (savedUser && token) {
                try {
                    const parsedUser = JSON.parse(savedUser);
                    // If the session is missing email (old session), fetch it from profile
                    if (!parsedUser.email) {
                        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/user/profile`, {
                            headers: { 'Authorization': `Bearer ${token}` }
                        });
                        if (response.ok) {
                            const profileData = await response.json();
                            const fullUser = { ...parsedUser, email: profileData.email };
                            setUser(fullUser);
                            localStorage.setItem('user', JSON.stringify(fullUser));
                        } else {
                            setUser(parsedUser);
                        }
                    } else {
                        setUser(parsedUser);
                    }
                } catch (err) {
                    console.error('Auth hydration error:', err);
                }
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    const login = (userData, tokenValue) => {
        localStorage.setItem('token', tokenValue);
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(tokenValue);
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, updateUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
