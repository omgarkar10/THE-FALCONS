import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wheat, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('consumer');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup, demoLogin } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const result = await signup(name, email, password, role);
        setLoading(false);
        if (result.success) {
            navigate(result.user.role === 'warehouse' ? '/warehouse/dashboard' : '/consumer/dashboard');
        } else {
            setError(result.error);
        }
    };

    const handleDemo = (demoRole) => {
        const result = demoLogin(demoRole);
        if (result.success) {
            navigate(demoRole === 'warehouse' ? '/warehouse/dashboard' : '/consumer/dashboard');
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
                    <h1>Create your account</h1>
                    <p>Start managing your warehouse today</p>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Full Name</label>
                        <div className="input-wrapper">
                            <User size={18} />
                            <input
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

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
                                minLength={6}
                            />
                            <button type="button" className="input-toggle" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>I am a...</label>
                        <div className="role-selector">
                            <button
                                type="button"
                                className={`role-option ${role === 'warehouse' ? 'active' : ''}`}
                                onClick={() => setRole('warehouse')}
                            >
                                <span className="role-emoji">🏭</span>
                                <div>
                                    <div className="role-title">Warehouse Manager</div>
                                    <div className="role-desc">Manage facility operations</div>
                                </div>
                            </button>
                            <button
                                type="button"
                                className={`role-option ${role === 'consumer' ? 'active' : ''}`}
                                onClick={() => setRole('consumer')}
                            >
                                <span className="role-emoji">🌾</span>
                                <div>
                                    <div className="role-title">Consumer / Farmer</div>
                                    <div className="role-desc">Track my stored crops</div>
                                </div>
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <div className="auth-divider">
                    <span>or try a demo</span>
                </div>

                <div className="demo-buttons">
                    <button className="btn btn-outline" onClick={() => handleDemo('warehouse')}>
                        🏭 Demo Manager
                    </button>
                    <button className="btn btn-outline" onClick={() => handleDemo('consumer')}>
                        🌾 Demo Consumer
                    </button>
                </div>

                <p className="auth-footer">
                    Already have an account? <Link to="/login">Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
