import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard, Package, Database, BarChart3, Bell,
    Settings, LogOut, Wheat, ChevronLeft, ChevronRight,
    Truck, FileCheck, Users, Thermometer, Wifi
} from 'lucide-react';
import { useState } from 'react';
import './Sidebar.css';

const warehouseMenu = [
    { path: '/warehouse/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/warehouse/inventory', icon: Package, label: 'Inventory' },
    { path: '/warehouse/storage', icon: Database, label: 'Storage' },
    { path: '/warehouse/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/warehouse/alerts', icon: Bell, label: 'Alerts' },
    { path: '/warehouse/settings', icon: Settings, label: 'Settings' },
];

const consumerMenu = [
    { path: '/consumer/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/consumer/inventory', icon: Package, label: 'My Stock' },
    { path: '/consumer/shipments', icon: Truck, label: 'Shipments' },
    { path: '/consumer/quality', icon: FileCheck, label: 'Quality' },
    { path: '/consumer/alerts', icon: Bell, label: 'Alerts' },
];

const Sidebar = ({ role }) => {
    const [collapsed, setCollapsed] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const menu = role === 'warehouse' ? warehouseMenu : consumerMenu;

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                <div className="sidebar-brand">
                    <div className="sidebar-logo">
                        <Wheat size={20} />
                    </div>
                    {!collapsed && <span className="sidebar-title">AgroVault</span>}
                </div>
                <button className="sidebar-toggle" onClick={() => setCollapsed(!collapsed)}>
                    {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>
            </div>

            <div className="sidebar-label">
                {!collapsed && (role === 'warehouse' ? 'WAREHOUSE' : 'CONSUMER')}
            </div>

            <nav className="sidebar-nav">
                {menu.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                        title={collapsed ? item.label : undefined}
                    >
                        <item.icon size={20} />
                        {!collapsed && <span>{item.label}</span>}
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                {!collapsed && user && (
                    <div className="sidebar-user">
                        <div className="sidebar-avatar">
                            {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="sidebar-user-info">
                            <div className="sidebar-user-name">{user.name}</div>
                            <div className="sidebar-user-role">{role === 'warehouse' ? 'Manager' : 'Consumer'}</div>
                        </div>
                    </div>
                )}
                <button className="sidebar-link" onClick={handleLogout} title="Logout">
                    <LogOut size={20} />
                    {!collapsed && <span>Logout</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
