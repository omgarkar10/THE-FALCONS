import { useState } from 'react';
import { User, Bell, Thermometer, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

const Settings = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [profile, setProfile] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        organization: 'AgroVault Warehouse Pvt. Ltd.',
    });
    const [thresholds, setThresholds] = useState({
        tempMin: 15,
        tempMax: 30,
        humidityMin: 40,
        humidityMax: 75,
        co2Max: 500,
    });
    const [notifications, setNotifications] = useState({
        emailAlerts: true,
        smsAlerts: false,
        criticalOnly: false,
        dailyReport: true,
    });

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'thresholds', label: 'Thresholds', icon: Thermometer },
        { id: 'notifications', label: 'Notifications', icon: Bell },
    ];

    return (
        <div className="dashboard-page">
            <div className="dashboard-page-header">
                <h1>Settings</h1>
                <p>Manage your account and warehouse configuration</p>
            </div>

            <div className="settings-layout">
                <div className="settings-tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="settings-content card">
                    {activeTab === 'profile' && (
                        <div>
                            <h3 style={{ marginBottom: 'var(--space-lg)' }}>Profile Information</h3>
                            <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <div className="input-wrapper">
                                        <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <div className="input-wrapper">
                                        <input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Phone</label>
                                    <div className="input-wrapper">
                                        <input type="tel" placeholder="+91 xxxxxxxxxx" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Organization</label>
                                    <div className="input-wrapper">
                                        <input value={profile.organization} onChange={(e) => setProfile({ ...profile, organization: e.target.value })} />
                                    </div>
                                </div>
                                <button className="btn btn-primary"><Save size={16} /> Save Changes</button>
                            </form>
                        </div>
                    )}

                    {activeTab === 'thresholds' && (
                        <div>
                            <h3 style={{ marginBottom: 'var(--space-lg)' }}>Alert Thresholds</h3>
                            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-lg)', fontSize: 'var(--font-size-sm)' }}>
                                Configure environmental thresholds that trigger alerts when exceeded.
                            </p>
                            <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
                                <div className="grid grid-2">
                                    <div className="form-group">
                                        <label>Min Temperature (°C)</label>
                                        <div className="input-wrapper">
                                            <input type="number" value={thresholds.tempMin} onChange={(e) => setThresholds({ ...thresholds, tempMin: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Max Temperature (°C)</label>
                                        <div className="input-wrapper">
                                            <input type="number" value={thresholds.tempMax} onChange={(e) => setThresholds({ ...thresholds, tempMax: e.target.value })} />
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-2">
                                    <div className="form-group">
                                        <label>Min Humidity (%)</label>
                                        <div className="input-wrapper">
                                            <input type="number" value={thresholds.humidityMin} onChange={(e) => setThresholds({ ...thresholds, humidityMin: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Max Humidity (%)</label>
                                        <div className="input-wrapper">
                                            <input type="number" value={thresholds.humidityMax} onChange={(e) => setThresholds({ ...thresholds, humidityMax: e.target.value })} />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Max CO2 Level (ppm)</label>
                                    <div className="input-wrapper">
                                        <input type="number" value={thresholds.co2Max} onChange={(e) => setThresholds({ ...thresholds, co2Max: e.target.value })} />
                                    </div>
                                </div>
                                <button className="btn btn-primary"><Save size={16} /> Save Thresholds</button>
                            </form>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div>
                            <h3 style={{ marginBottom: 'var(--space-lg)' }}>Notification Preferences</h3>
                            <div className="notification-options">
                                {[
                                    { key: 'emailAlerts', label: 'Email Alerts', desc: 'Receive alerts via email' },
                                    { key: 'smsAlerts', label: 'SMS Alerts', desc: 'Receive alerts via SMS' },
                                    { key: 'criticalOnly', label: 'Critical Only', desc: 'Only receive critical severity alerts' },
                                    { key: 'dailyReport', label: 'Daily Report', desc: 'Receive a daily summary email' },
                                ].map((opt) => (
                                    <div key={opt.key} className="notification-option">
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>{opt.label}</div>
                                            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>{opt.desc}</div>
                                        </div>
                                        <label className="toggle">
                                            <input
                                                type="checkbox"
                                                checked={notifications[opt.key]}
                                                onChange={(e) => setNotifications({ ...notifications, [opt.key]: e.target.checked })}
                                            />
                                            <span className="toggle-slider" />
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;
