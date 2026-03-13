import { useState, Suspense } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { Wheat, Mail, Lock, Eye, EyeOff, ArrowRight, Shield, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

function AuthBg() {
    return (
        <>
            <ambientLight intensity={0.3} />
            <pointLight position={[3, 4, 3]} intensity={1.5} color="#22c55e" />
            <Stars radius={80} depth={50} count={2500} factor={4} saturation={0} fade speed={0.7} />
        </>
    );
}

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
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
        if (result.success) navigate(role === 'warehouse' ? '/warehouse/dashboard' : '/consumer/dashboard');
    };

    return (
        <div className="auth3-page">
            {/* 3D Background */}
            <div className="auth3-canvas">
                <Canvas camera={{ position: [0, 0, 5], fov: 65 }} gl={{ alpha: true }}>
                    <Suspense fallback={null}><AuthBg /></Suspense>
                </Canvas>
            </div>

            {/* Gradient blobs */}
            <div className="auth3-blob auth3-blob-1" />
            <div className="auth3-blob auth3-blob-2" />

            {/* Card */}
            <div className="auth3-card-wrap">
                <div className="auth3-card">
                    {/* Logo */}
                    <Link to="/" className="auth3-logo">
                        <div className="auth3-logo-icon"><Wheat size={19} /></div>
                        <span>AgroVault</span>
                    </Link>

                    <div className="auth3-heading">
                        <h1>Welcome back</h1>
                        <p>Sign in to your account to continue</p>
                    </div>

                    {error && (
                        <div className="auth3-error">
                            <Shield size={15} /> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth3-form">
                        <div className={`auth3-field ${focusedField === 'email' ? 'focused' : ''}`}>
                            <label>Email address</label>
                            <div className="auth3-input-wrap">
                                <Mail size={16} className="auth3-fi" />
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                    required
                                />
                            </div>
                        </div>

                        <div className={`auth3-field ${focusedField === 'password' ? 'focused' : ''}`}>
                            <label>Password</label>
                            <div className="auth3-input-wrap">
                                <Lock size={16} className="auth3-fi" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField(null)}
                                    required
                                />
                                <button type="button" className="auth3-eye" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="auth3-submit" disabled={loading}>
                            {loading ? (
                                <><span className="auth3-spinner" />Signing in...</>
                            ) : (
                                <>Sign In <ArrowRight size={16} /></>
                            )}
                        </button>
                    </form>

                    <div className="auth3-divider"><span>or try a quick demo</span></div>

                    <div className="auth3-demo-grid">
                        <button className="auth3-demo-btn" onClick={() => handleDemo('warehouse')}>
                            <span className="auth3-demo-emoji">🏭</span>
                            <div>
                                <strong>Warehouse Manager</strong>
                                <span>Full dashboard access</span>
                            </div>
                        </button>
                        <button className="auth3-demo-btn" onClick={() => handleDemo('consumer')}>
                            <span className="auth3-demo-emoji">🌾</span>
                            <div>
                                <strong>Consumer / Farmer</strong>
                                <span>View your inventory</span>
                            </div>
                        </button>
                    </div>

                    <p className="auth3-footer">
                        Don't have an account? <Link to="/signup">Create one free</Link>
                    </p>
                </div>

                {/* Side features panel */}
                <div className="auth3-side">
                    <div className="auth3-side-inner">
                        <div className="auth3-side-badge"><Zap size={13} /> Enterprise Platform</div>
                        <h2>The smart way to manage agricultural storage</h2>
                        <div className="auth3-side-features">
                            {[
                                { icon: '📡', text: 'Real-time IoT sensor monitoring' },
                                { icon: '🤖', text: 'AI-powered spoilage prediction' },
                                { icon: '📊', text: 'Live analytics & reports' },
                                { icon: '🔔', text: 'Instant threshold alerts' },
                                { icon: '🔐', text: 'SOC 2 certified security' },
                            ].map((f, i) => (
                                <div key={i} className="auth3-side-item" style={{ animationDelay: `${i * 0.1}s` }}>
                                    <span>{f.icon}</span>
                                    <span>{f.text}</span>
                                </div>
                            ))}
                        </div>
                        <div className="auth3-side-stat">
                            <div className="auth3-ss-val">45%</div>
                            <div className="auth3-ss-label">Average reduction in post-harvest spoilage</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
