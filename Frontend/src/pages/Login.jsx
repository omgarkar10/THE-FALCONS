import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wheat, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, demoLogin } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const result = await login(email, password);
        setLoading(false);
        if (result.success) {
            navigate(result.user.role === 'warehouse' ? '/warehouse/dashboard' : '/consumer/dashboard');
        } else {
            setError(result.error);
        }
    };

    const handleDemo = (role) => {
        const result = demoLogin(role);
        if (result.success) {
            navigate(role === 'warehouse' ? '/warehouse/dashboard' : '/consumer/dashboard');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <Link to="/" className="auth-logo">
                        <div className="navbar-logo"><Wheat size={20} /></div>
                        <span>AgroVault</span>
                    </Link>
                    <h1>Welcome back</h1>
                    <p>Sign in to your account to continue</p>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Email</label>
                        <div className="input-wrapper">
                            <Mail size={18} />
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <div className="input-wrapper">
                            <Lock size={18} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button type="button" className="input-toggle" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="auth-divider">
                    <span>or try a demo</span>
                </div>

                <div className="demo-buttons">
                    <button className="btn btn-outline" onClick={() => handleDemo('warehouse')}>
                        🏭 Warehouse Manager
                    </button>
                    <button className="btn btn-outline" onClick={() => handleDemo('consumer')}>
                        🌾 Consumer / Farmer
                    </button>
                </div>

                <p className="auth-footer">
                    Don't have an account? <Link to="/signup">Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
