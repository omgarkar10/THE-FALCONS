import { useState, Suspense } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { Wheat, Mail, Lock, User, Eye, EyeOff, MapPin, Phone, Building2, CheckCircle, ArrowRight, ArrowLeft, Shield } from 'lucide-react';
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

const STEP_LABELS = ['Your Role', 'Credentials', 'Profile'];

const Signup = () => {
    const [step, setStep] = useState(1);
    const [role, setRole] = useState('consumer');
    const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '', name: '', phone: '', address: '' });
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    const { signup, demoLogin } = useAuth();
    const navigate = useNavigate();

    const handle = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const nextStep = () => {
        setError('');
        if (step === 2) {
            if (!formData.email || !formData.password || !formData.confirmPassword) return setError('Please fill in all fields.');
            if (formData.password !== formData.confirmPassword) return setError('Passwords do not match.');
            if (formData.password.length < 6) return setError('Password must be at least 6 characters.');
        }
        setStep(s => s + 1);
    };
    const prevStep = () => { setError(''); setStep(s => s - 1); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!formData.name || !formData.phone) return setError('Name and Phone are required.');
        if (role === 'warehouse' && !formData.address) return setError('Warehouse address is required.');
        setLoading(true);
        const result = await signup(formData.name, formData.email, formData.password, role, formData.phone, formData.address);
        setLoading(false);
        if (result.success) setStep(4);
        else setError(result.error);
    };

    const handleDemo = (r) => {
        const result = demoLogin(r);
        if (result.success) navigate(r === 'warehouse' ? '/warehouse/dashboard' : '/consumer/dashboard');
    };

    const fieldProps = (name) => ({
        className: `auth3-field${focusedField === name ? ' focused' : ''}`,
    });
    const inputProps = (name) => ({
        name, value: formData[name], onChange: handle,
        onFocus: () => setFocusedField(name),
        onBlur: () => setFocusedField(null),
    });

    return (
        <div className="auth3-page">
            <div className="auth3-canvas">
                <Canvas camera={{ position: [0, 0, 5], fov: 65 }} gl={{ alpha: true }}>
                    <Suspense fallback={null}><AuthBg /></Suspense>
                </Canvas>
            </div>
            <div className="auth3-blob auth3-blob-1" />
            <div className="auth3-blob auth3-blob-2" />

            <div className="auth3-card-wrap">
                <div className="auth3-card">
                    {step < 4 && (
                        <Link to="/" className="auth3-logo">
                            <div className="auth3-logo-icon"><Wheat size={19} /></div>
                            <span>AgroVault</span>
                        </Link>
                    )}

                    {/* Step progress dots */}
                    {step < 4 && (
                        <div className="auth3-step-dots">
                            {STEP_LABELS.map((_, i) => (
                                <div key={i} className={`auth3-step-dot ${i + 1 < step ? 'done' : i + 1 === step ? 'active' : ''}`} />
                            ))}
                        </div>
                    )}

                    {error && <div className="auth3-error"><Shield size={15} />{error}</div>}

                    {/* ── STEP 1: Role ── */}
                    {step === 1 && (
                        <div>
                            <div className="auth3-heading">
                                <h1>I'm joining as a...</h1>
                                <p>Select your account type to get started</p>
                            </div>
                            <div className="auth3-role-grid" style={{ marginBottom: '20px' }}>
                                {[
                                    { val: 'warehouse', emoji: '🏭', title: 'Warehouse Manager', desc: 'Manage facility operations & storage' },
                                    { val: 'consumer', emoji: '🌾', title: 'Consumer / Farmer', desc: 'Track stored crops & quality data' },
                                ].map(r => (
                                    <button key={r.val} type="button"
                                        className={`auth3-role-btn${role === r.val ? ' active' : ''}`}
                                        onClick={() => { setRole(r.val); setError(''); }}>
                                        <span className="auth3-role-emoji">{r.emoji}</span>
                                        <div className="auth3-role-title">{r.title}</div>
                                        <div className="auth3-role-desc">{r.desc}</div>
                                    </button>
                                ))}
                            </div>
                            <button className="auth3-submit" onClick={nextStep}>Continue <ArrowRight size={16} /></button>
                            <div className="auth3-divider"><span>or try a demo</span></div>
                            <div className="auth3-demo-grid">
                                <button className="auth3-demo-btn" onClick={() => handleDemo('warehouse')}>
                                    <span className="auth3-demo-emoji">🏭</span>
                                    <div><strong>Demo Manager</strong><span>Instant access</span></div>
                                </button>
                                <button className="auth3-demo-btn" onClick={() => handleDemo('consumer')}>
                                    <span className="auth3-demo-emoji">🌾</span>
                                    <div><strong>Demo Farmer</strong><span>Instant access</span></div>
                                </button>
                            </div>
                            <p className="auth3-footer">Already have an account? <Link to="/login">Sign in</Link></p>
                        </div>
                    )}

                    {/* ── STEP 2: Credentials ── */}
                    {step === 2 && (
                        <div>
                            <div className="auth3-heading">
                                <h1>Account credentials</h1>
                                <p>Secure your {role === 'warehouse' ? 'manager' : 'farmer'} account</p>
                            </div>
                            <div className="auth3-form">
                                <div {...fieldProps('email')}>
                                    <label>Email address</label>
                                    <div className="auth3-input-wrap">
                                        <Mail size={16} className="auth3-fi" />
                                        <input type="email" placeholder="you@example.com" {...inputProps('email')} required />
                                    </div>
                                </div>
                                <div {...fieldProps('password')}>
                                    <label>Password</label>
                                    <div className="auth3-input-wrap">
                                        <Lock size={16} className="auth3-fi" />
                                        <input type={showPass ? 'text' : 'password'} placeholder="Min. 6 characters" {...inputProps('password')} required />
                                        <button type="button" className="auth3-eye" onClick={() => setShowPass(!showPass)}>
                                            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>
                                <div {...fieldProps('confirmPassword')}>
                                    <label>Confirm password</label>
                                    <div className="auth3-input-wrap">
                                        <Lock size={16} className="auth3-fi" />
                                        <input type={showConfirm ? 'text' : 'password'} placeholder="Repeat password" {...inputProps('confirmPassword')} required />
                                        <button type="button" className="auth3-eye" onClick={() => setShowConfirm(!showConfirm)}>
                                            {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="auth3-step-nav" style={{ marginTop: '20px' }}>
                                <button className="auth3-back-btn" onClick={prevStep}><ArrowLeft size={15} /> Back</button>
                                <button className="auth3-submit" style={{ flex: 1 }} onClick={nextStep}>Next Step <ArrowRight size={16} /></button>
                            </div>
                        </div>
                    )}

                    {/* ── STEP 3: Profile ── */}
                    {step === 3 && (
                        <form onSubmit={handleSubmit}>
                            <div className="auth3-heading">
                                <h1>Your profile</h1>
                                <p>Almost there — tell us about yourself</p>
                            </div>
                            <div className="auth3-form">
                                <div {...fieldProps('name')}>
                                    <label>Full name</label>
                                    <div className="auth3-input-wrap">
                                        <User size={16} className="auth3-fi" />
                                        <input type="text" placeholder="Rajesh Kumar" {...inputProps('name')} required />
                                    </div>
                                </div>
                                <div {...fieldProps('phone')}>
                                    <label>Phone number</label>
                                    <div className="auth3-input-wrap">
                                        <Phone size={16} className="auth3-fi" />
                                        <input type="tel" placeholder="+91 98765 43210" {...inputProps('phone')} required />
                                    </div>
                                </div>
                                {role === 'warehouse' && (
                                    <div {...fieldProps('address')}>
                                        <label>Warehouse address</label>
                                        <div className="auth3-input-wrap">
                                            <MapPin size={16} className="auth3-fi" />
                                            <input type="text" placeholder="123 Industrial Area, Pune" {...inputProps('address')} required />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="auth3-step-nav" style={{ marginTop: '20px' }}>
                                <button type="button" className="auth3-back-btn" onClick={prevStep} disabled={loading}><ArrowLeft size={15} /> Back</button>
                                <button type="submit" className="auth3-submit" style={{ flex: 1 }} disabled={loading}>
                                    {loading ? <><span className="auth3-spinner" />Creating...</> : <>Create Account <ArrowRight size={16} /></>}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* ── STEP 4: Success ── */}
                    {step === 4 && (
                        <div style={{ textAlign: 'center', padding: '20px 0' }}>
                            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#22c55e' }}>
                                <CheckCircle size={30} />
                            </div>
                            <h1 style={{ fontFamily: 'Space Grotesk', fontSize: '22px', fontWeight: 800, color: '#f0fdf4', marginBottom: 8 }}>Check your email</h1>
                            <p style={{ fontSize: 14, color: '#9ca3af', lineHeight: 1.7, marginBottom: 28 }}>
                                We've sent a verification link to <strong style={{ color: '#d1fae5' }}>{formData.email}</strong>.<br />Click the link to activate your account.
                            </p>
                            <button className="auth3-submit" onClick={() => navigate('/login')}>Go to Sign In <ArrowRight size={16} /></button>
                        </div>
                    )}
                </div>

                {/* Side Panel */}
                <div className="auth3-side">
                    <div className="auth3-side-inner">
                        <div className="auth3-side-badge" style={{ marginBottom: 16 }}>
                            {step < 4 ? `Step ${step} of 3` : '✓ Account Created'}
                        </div>
                        <h2>
                            {step === 1 && 'Choose how you want to use AgroVault'}
                            {step === 2 && 'Your data is always protected'}
                            {step === 3 && "We're almost ready to launch"}
                            {step === 4 && 'Welcome to AgroVault!'}
                        </h2>
                        <div className="auth3-side-features">
                            {step === 1 && [
                                { icon: '🏭', text: 'Warehouse Managers get full operational dashboards' },
                                { icon: '🌾', text: 'Farmers get a consumer portal with stock visibility' },
                                { icon: '🔄', text: 'You can try both roles with demo login' },
                            ].map((f, i) => (
                                <div key={i} className="auth3-side-item" style={{ animationDelay: `${i * 0.1}s` }}>
                                    <span>{f.icon}</span><span>{f.text}</span>
                                </div>
                            ))}
                            {step === 2 && [
                                { icon: '🔐', text: 'AES-256 encryption for all passwords' },
                                { icon: '🛡️', text: 'SOC 2 Type II certified infrastructure' },
                                { icon: '🔑', text: 'Secure JWT-based session management' },
                            ].map((f, i) => (
                                <div key={i} className="auth3-side-item" style={{ animationDelay: `${i * 0.1}s` }}>
                                    <span>{f.icon}</span><span>{f.text}</span>
                                </div>
                            ))}
                            {step === 3 && [
                                { icon: '📊', text: 'Your dashboard will be ready instantly' },
                                { icon: '📡', text: 'Connect sensors right after onboarding' },
                                { icon: '🤖', text: 'AI will start learning your patterns from day 1' },
                            ].map((f, i) => (
                                <div key={i} className="auth3-side-item" style={{ animationDelay: `${i * 0.1}s` }}>
                                    <span>{f.icon}</span><span>{f.text}</span>
                                </div>
                            ))}
                            {step === 4 && [
                                { icon: '✉️', text: 'Verification email sent to your inbox' },
                                { icon: '🚀', text: 'Your dashboard is ready after verification' },
                                { icon: '💬', text: '24/7 support team available to help' },
                            ].map((f, i) => (
                                <div key={i} className="auth3-side-item" style={{ animationDelay: `${i * 0.1}s` }}>
                                    <span>{f.icon}</span><span>{f.text}</span>
                                </div>
                            ))}
                        </div>
                        <div className="auth3-side-stat">
                            <div className="auth3-ss-val">30</div>
                            <div className="auth3-ss-label">Day free trial — full Pro access, no credit card</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
