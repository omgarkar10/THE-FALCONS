import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = authService.getCurrentUser();
        if (savedUser) {
            setUser(savedUser);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const data = await authService.login(email, password);
            setUser(data.user);
            return { success: true, user: data.user };
        } catch (error) {
            return { success: false, error: error.response?.data?.message || 'Login failed' };
        }
    };

    const signup = async (name, email, password, role, phone, address) => {
        try {
            const data = await authService.signup(name, email, password, role, phone, address);
            setUser(data.user);
            return { success: true, user: data.user };
        } catch (error) {
            const msg =
                error.response?.data?.message ||
                error.message ||
                'Signup failed. Please try again.';
            return { success: false, error: msg };
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    // Demo login for development (bypasses backend)
    const demoLogin = (role) => {
        const demoUser = {
            _id: 'demo-user',
            name: role === 'warehouse' ? 'Admin Manager' : 'Niket Farmer',
            email: role === 'warehouse' ? 'admin@agrovault.io' : 'niket@farm.io',
            role: role,
        };
        localStorage.setItem('user', JSON.stringify(demoUser));
        localStorage.setItem('token', 'demo-token');
        setUser(demoUser);
        return { success: true, user: demoUser };
    };

    const value = {
        user,
        loading,
        login,
        signup,
        logout,
        demoLogin,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
