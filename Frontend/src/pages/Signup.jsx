import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wheat, Mail, Lock, User, Eye, EyeOff, MapPin, Phone, Building2, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './AuthSteps.css'; // New multi-step layout CSS

const Signup = () => {
    // Top-Level State
    const [step, setStep] = useState(1);
    const [role, setRole] = useState('consumer');

    // Form Data State
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        phone: '',
        address: '' // specific to warehouse manager
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { signup, demoLogin } = useAuth();
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // --- Navigation Logic ---
    const nextStep = () => {
        setError('');
        // Validate Step 2 (Credentials)
        if (step === 2) {
            if (!formData.email || !formData.password || !formData.confirmPassword) {
                return setError('Please fill in all credential fields.');
            }
            if (formData.password !== formData.confirmPassword) {
                return setError('Passwords do not match.');
            }
            if (formData.password.length < 6) {
                return setError('Password must be at least 6 characters.');
            }
        }
        setStep(step + 1);
    };

    const prevStep = () => {
        setError('');
        setStep(step - 1);
    };

    // --- Submit Logic ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Final validation for Step 3 depending on role
        if (!formData.name || !formData.phone) {
            setLoading(false);
            return setError('Name and Phone are required.');
        }
        if (role === 'warehouse' && !formData.address) {
            setLoading(false);
            return setError('Warehouse Address is required.');
        }

        // Send to context API
        const result = await signup(
            formData.name,
            formData.email,
            formData.password,
            role,
            formData.phone,
            formData.address
        );

        setLoading(false);
        if (result.success) {
            // Move to Success Email Verification View
            setStep(4);
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

    // ----------------------------------------
    // RENDER STEPS
    // ----------------------------------------

    const renderStep1 = () => (
        <div className="step-container">
            <div className="auth-header">
                <h2>I am joining as a...</h2>
                <p>Select your account type to continue</p>
            </div>
            <div className="role-selector">
                <button
                    type="button"
                    className={`role-option ${role === 'warehouse' ? 'active' : ''}`}
                    onClick={() => { setRole('warehouse'); setError(''); }}
                >
                    <span className="role-emoji">🏭</span>
                    <div>
                        <div className="role-title">Warehouse Manager</div>
                        <div className="role-desc">Manage facility operations & storage</div>
                    </div>
                </button>
                <button
                    type="button"
                    className={`role-option ${role === 'consumer' ? 'active' : ''}`}
                    onClick={() => { setRole('consumer'); setError(''); }}
                >
                    <span className="role-emoji">🌾</span>
                    <div>
                        <div className="role-title">Consumer / Farmer</div>
                        <div className="role-desc">Track stored crops & quality</div>
                    </div>
                </button>
            </div>
            <div className="step-actions">
                <button type="button" className="btn btn-primary" onClick={nextStep} style={{ width: '100%' }}>
                    Continue
                </button>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="step-container">
            <div className="auth-header">
                <h2>Account Credentials</h2>
                <p>Set up your login details for {role === 'warehouse' ? 'Manager' : 'Farmer'} access.</p>
            </div>
            <div className="auth-form">
                <div className="form-group">
                    <label>Email Address</label>
                    <div className="input-wrapper">
                        <Mail size={18} />
                        <input
                            type="email"
                            name="email"
                            placeholder="hello@farmer.com"
                            value={formData.email}
                            onChange={handleInputChange}
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
                            name="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                        />
                        <button type="button" className="input-toggle" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                <div className="form-group">
                    <label>Confirm Password</label>
                    <div className="input-wrapper">
                        <Lock size={18} />
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            required
                        />
                        <button type="button" className="input-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>
            </div>
            <div className="step-actions">
                <button type="button" className="btn btn-outline" onClick={prevStep}>Back</button>
                <button type="button" className="btn btn-primary" onClick={nextStep}>Next Step</button>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <form className="step-container" onSubmit={handleSubmit}>
            <div className="auth-header">
                <h2>Personal Details</h2>
                <p>Tell us a bit about yourself</p>
            </div>
            <div className="auth-form">
                <div className="form-group">
                    <label>Full Name</label>
                    <div className="input-wrapper">
                        <User size={18} />
                        <input
                            type="text"
                            name="name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Phone Number</label>
                    <div className="input-wrapper">
                        <Phone size={18} />
                        <input
                            type="tel"
                            name="phone"
                            placeholder="+91 98765 43210"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                </div>

                {/* Conditional Warehouse Details */}
                {role === 'warehouse' && (
                    <div className="form-group">
                        <label>Warehouse Address</label>
                        <div className="input-wrapper">
                            <MapPin size={18} />
                            <input
                                type="text"
                                name="address"
                                placeholder="123 Industrial Area, City"
                                value={formData.address}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>
                )}
            </div>
            <div className="step-actions">
                <button type="button" className="btn btn-outline" onClick={prevStep} disabled={loading}>Back</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Account'}
                </button>
            </div>
        </form>
    );

    const renderStep4 = () => (
        <div className="step-container success-screen">
            <div className="success-icon">
                <CheckCircle size={40} />
            </div>
            <h2>Verify your email</h2>
            <p>We've sent a verification link to <strong>{formData.email}</strong>.<br /> Please click the link to activate your account and access the dashboard.</p>
            <div className="step-actions">
                <button
                    className="btn btn-primary"
                    onClick={() => navigate('/login')}
                    style={{ width: '100%' }}
                >
                    Back to Sign In
                </button>
            </div>
        </div>
    );

    return (
        <div className="auth-page">
            <div className="auth-card">
                {/* Header Logo visible only before Success page */}
                {step < 4 && (
                    <div className="auth-header" style={{ marginBottom: '1rem' }}>
                        <Link to="/" className="auth-logo">
                            <div className="navbar-logo"><Wheat size={20} /></div>
                            <span>AgroVault</span>
                        </Link>
                    </div>
                )}

                {error && <div className="auth-error">{error}</div>}

                {/* Step Rendering */}
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
                {step === 4 && renderStep4()}

                {/* Footer and Demos only visible on Step 1 */}
                {step === 1 && (
                    <>
                        <div className="auth-divider">
                            <span>or try a demo</span>
                        </div>
                        <div className="demo-buttons">
                            <button className="btn btn-outline" onClick={() => handleDemo('warehouse')}>
                                <Building2 size={16} /> Demo Manager
                            </button>
                            <button className="btn btn-outline" onClick={() => handleDemo('consumer')}>
                                <Wheat size={16} /> Demo Consumer
                            </button>
                        </div>
                        <p className="auth-footer">
                            Already have an account? <Link to="/login">Sign in</Link>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default Signup;
