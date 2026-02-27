import { Link, useLocation } from 'react-router-dom';
import { Wheat, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();
    const { isAuthenticated, user } = useAuth();

    const scrollTo = (id) => {
        setMobileOpen(false);
        if (location.pathname !== '/') return;
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <nav className="navbar">
            <div className="navbar-inner container-wide">
                <Link to="/" className="navbar-brand">
                    <div className="navbar-logo">
                        <Wheat size={22} />
                    </div>
                    <span className="navbar-title">AgroVault</span>
                </Link>

                <div className={`navbar-links ${mobileOpen ? 'open' : ''}`}>
                    <button onClick={() => scrollTo('features')}>Features</button>
                    <button onClick={() => scrollTo('use-cases')}>Use Cases</button>
                    <button onClick={() => scrollTo('how-it-works')}>How It Works</button>
                    <button onClick={() => scrollTo('faq')}>FAQ</button>
                </div>

                <div className="navbar-actions">
                    {isAuthenticated ? (
                        <Link
                            to={user?.role === 'warehouse' ? '/warehouse/dashboard' : '/consumer/dashboard'}
                            className="btn btn-primary"
                        >
                            Dashboard →
                        </Link>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-ghost">Sign In</Link>
                            <Link to="/signup" className="btn btn-primary">Get Started →</Link>
                        </>
                    )}
                </div>

                <button className="navbar-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
                    {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
