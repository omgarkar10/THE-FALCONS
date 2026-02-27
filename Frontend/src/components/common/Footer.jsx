import { Link } from 'react-router-dom';
import { Wheat, Mail, Phone, MapPin } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container-wide">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <div className="flex gap-sm">
                            <div className="navbar-logo">
                                <Wheat size={20} />
                            </div>
                            <span style={{ fontWeight: 800, fontSize: '1.25rem' }}>AgroVault</span>
                        </div>
                        <p className="footer-desc">
                            The all-in-one platform for monitoring grain storage, tracking crop inventory, and optimizing your agricultural supply chain.
                        </p>
                        <div className="footer-contact">
                            <div className="flex gap-sm"><Mail size={16} /> contact@agrovault.io</div>
                            <div className="flex gap-sm"><Phone size={16} /> +91 1800-AGRO-VAULT</div>
                            <div className="flex gap-sm"><MapPin size={16} /> Pune, Maharashtra, India</div>
                        </div>
                    </div>

                    <div className="footer-col">
                        <h4>Product</h4>
                        <Link to="/">Features</Link>
                        <Link to="/">Pricing</Link>
                        <Link to="/">Use Cases</Link>
                        <Link to="/">Integrations</Link>
                    </div>

                    <div className="footer-col">
                        <h4>Company</h4>
                        <Link to="/">About Us</Link>
                        <Link to="/">Careers</Link>
                        <Link to="/">Blog</Link>
                        <Link to="/">Press</Link>
                    </div>

                    <div className="footer-col">
                        <h4>Support</h4>
                        <Link to="/">Help Center</Link>
                        <Link to="/">Documentation</Link>
                        <Link to="/">API Reference</Link>
                        <Link to="/">Status</Link>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© 2026 AgroVault. All rights reserved.</p>
                    <div className="footer-bottom-links">
                        <Link to="/">Privacy Policy</Link>
                        <Link to="/">Terms of Service</Link>
                        <Link to="/">Cookie Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
