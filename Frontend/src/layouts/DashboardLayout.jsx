import { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Menu, X, Wheat } from 'lucide-react';
import Sidebar from '../components/common/Sidebar';
import Chatbot from '../components/common/Chatbot';
import './DashboardLayout.css';

const DashboardLayout = ({ role }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (!mobile) setMobileOpen(false);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        if (isMobile) {
            setMobileOpen(!mobileOpen);
        } else {
            setCollapsed(!collapsed);
        }
    };

    return (
        <div className={`dashboard-layout ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
            {/* Mobile Header */}
            <header className="dashboard-mobile-header">
                <button className="mobile-menu-toggle" onClick={() => setMobileOpen(true)}>
                    <Menu size={24} />
                </button>
                <Link to="/" className="mobile-brand">
                    <Wheat size={20} className="mobile-logo-icon" />
                    <span>AgroVault</span>
                </Link>
                <div style={{ width: 24 }}></div> {/* Spacer */}
            </header>

            {isMobile && mobileOpen && (
                <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />
            )}

            <Sidebar 
                role={role} 
                collapsed={collapsed && !isMobile} 
                setCollapsed={setCollapsed} 
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
            />
            
            <main className="dashboard-main">
                <Outlet />
            </main>
            <Chatbot />
        </div>
    );
};

export default DashboardLayout;

