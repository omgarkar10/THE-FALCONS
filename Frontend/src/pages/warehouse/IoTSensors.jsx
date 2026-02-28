import { useState, useEffect } from 'react';
import {
    Wifi, RefreshCcw, Settings, Battery, Signal,
    Thermometer, Droplets, Wind, Zap, Activity,
    X, Check, AlertTriangle, Info, Power, RotateCcw,
    ShieldCheck, BellRing, Gauge, History
} from 'lucide-react';
import { mockIoTSensors } from '../../data/mockData';
import './IoTSensors.css';

const ProgressBar = ({ value, type = 'success' }) => (
    <div className="progress-container">
        <div
            className={`progress-fill ${type}`}
            style={{ width: `${value}%` }}
        />
    </div>
);

const IoTSensors = () => {
    const [sensors, setSensors] = useState(mockIoTSensors);
    const [isSyncing, setIsSyncing] = useState(false);
    const [configSensor, setConfigSensor] = useState(null);
    const [refreshingId, setRefreshingId] = useState(null);
    const [activeTab, setActiveTab] = useState('general');

    // Calculate stats
    const totalDevices = sensors.length;
    const onlineDevices = sensors.filter(s => s.status === 'online').length;
    const offlineDevices = sensors.filter(s => s.status === 'offline').length;
    const avgBattery = Math.round(sensors.reduce((acc, s) => acc + s.battery, 0) / totalDevices);

    const handleSyncAll = () => {
        setIsSyncing(true);
        setTimeout(() => {
            setIsSyncing(false);
            setSensors(prev => prev.map(s => ({
                ...s,
                lastPing: 'Just now'
            })));
        }, 1500);
    };

    const handleRefresh = (id) => {
        setRefreshingId(id);
        setTimeout(() => {
            setRefreshingId(null);
            setSensors(prev => prev.map(s =>
                s.id === id ? { ...s, lastPing: 'Just now', battery: Math.min(100, s.battery + (s.status === 'offline' ? 0 : 1)) } : s
            ));
        }, 800);
    };

    const handleConfigure = (sensor) => {
        setConfigSensor({ ...sensor });
        setActiveTab('general');
    };

    const saveConfig = (e) => {
        e.preventDefault();
        setSensors(prev => prev.map(s =>
            s.id === configSensor.id ? configSensor : s
        ));
        setConfigSensor(null);
    };

    const handleAction = (action) => {
        alert(`${action} initiated for ${configSensor.name}`);
        if (action === 'Reboot') {
            setSensors(prev => prev.map(s =>
                s.id === configSensor.id ? { ...s, status: 'offline', lastPing: 'Rebooting...' } : s
            ));
            setConfigSensor(null);
            setTimeout(() => {
                setSensors(prev => prev.map(s =>
                    s.id === configSensor.id ? { ...s, status: 'online', lastPing: 'Just now' } : s
                ));
            }, 3000);
        }
    };

    const getSensorIcon = (type) => {
        switch (type) {
            case 'Temperature': return Thermometer;
            case 'Humidity': return Droplets;
            case 'Gas': return Wind;
            case 'Moisture': return Activity;
            case 'Vibration': return Zap;
            default: return Wifi;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'online': return 'success';
            case 'warning': return 'warning';
            case 'offline': return 'danger';
            default: return 'info';
        }
    };

    return (
        <div className="sensors-page">
            <div className="sensors-page-header">
                <div className="header-title">
                    <h1>IoT Sensors</h1>
                    <p>Manage and monitor connected sensor devices</p>
                </div>
                <button
                    className={`btn-sync ${isSyncing ? 'syncing' : ''}`}
                    onClick={handleSyncAll}
                    disabled={isSyncing}
                >
                    <RefreshCcw size={18} />
                    {isSyncing ? 'Syncing...' : 'Sync All'}
                </button>
            </div>

            <div className="summary-grid">
                <div className="summary-card" style={{ animationDelay: '0.1s' }}>
                    <div className="summary-label">Total Devices</div>
                    <div className="summary-value">{totalDevices}</div>
                </div>
                <div className="summary-card" style={{ animationDelay: '0.2s' }}>
                    <div className="summary-label">Online</div>
                    <div className="summary-value online">{onlineDevices}</div>
                </div>
                <div className="summary-card" style={{ animationDelay: '0.3s' }}>
                    <div className="summary-label">Offline</div>
                    <div className="summary-value offline">{offlineDevices}</div>
                </div>
                <div className="summary-card" style={{ animationDelay: '0.4s' }}>
                    <div className="summary-label">Avg Battery</div>
                    <div className="summary-value">{avgBattery}%</div>
                </div>
            </div>

            <div className="sensors-grid">
                {sensors.map((sensor, index) => {
                    const Icon = getSensorIcon(sensor.type);
                    return (
                        <div key={sensor.id} className="sensor-card" style={{ animationDelay: `${index * 0.05}s` }}>
                            <div className="sensor-card-header">
                                <div className="sensor-info-main">
                                    <div className={`sensor-icon ${sensor.status}`}>
                                        <Icon size={20} />
                                    </div>
                                    <div className="sensor-name-group">
                                        <h3>{sensor.name}</h3>
                                        <span className="sensor-id">{sensor.id} • {sensor.firmware}</span>
                                    </div>
                                </div>
                                <div className={`status-badge ${sensor.status}`}>
                                    <span className="status-dot"></span>
                                    {sensor.status}
                                </div>
                            </div>

                            <div className="sensor-details">
                                <div className="detail-item">
                                    <span className="detail-label">Location</span>
                                    <span className="detail-value">{sensor.location}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Last Ping</span>
                                    <span className="detail-value">{sensor.lastPing}</span>
                                </div>
                                <div className="detail-item full-width" style={{ gridColumn: 'span 2' }}>
                                    <div className="flex-between">
                                        <span className="detail-label">Battery Level</span>
                                        <span className="detail-value">{sensor.battery}%</span>
                                    </div>
                                    <ProgressBar value={sensor.battery} type={sensor.battery < 20 ? 'danger' : sensor.battery < 50 ? 'warning' : 'success'} />
                                </div>
                                <div className="detail-item full-width" style={{ gridColumn: 'span 2' }}>
                                    <div className="flex-between">
                                        <span className="detail-label">Signal Strength</span>
                                        <span className="detail-value">{sensor.signal}%</span>
                                    </div>
                                    <ProgressBar value={sensor.signal} type="info" />
                                </div>
                            </div>

                            <div className="sensor-actions">
                                <button
                                    className="btn-action"
                                    onClick={() => handleConfigure(sensor)}
                                >
                                    <Settings />
                                    Configure
                                </button>
                                <button
                                    className={`btn-action ${refreshingId === sensor.id ? 'syncing' : ''}`}
                                    onClick={() => handleRefresh(sensor.id)}
                                    disabled={refreshingId === sensor.id}
                                >
                                    <RefreshCcw className={refreshingId === sensor.id ? 'animate-spin' : ''} />
                                    Refresh
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {configSensor && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '600px' }}>
                        <div className="modal-header">
                            <div>
                                <h2>Configure {configSensor.name}</h2>
                                <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Device ID: {configSensor.id} • Firmware: {configSensor.firmware}</p>
                            </div>
                            <button className="btn-close" onClick={() => setConfigSensor(null)}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className="modal-tabs" style={{ display: 'flex', gap: '20px', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
                            <button
                                className={`tab-btn ${activeTab === 'general' ? 'active' : ''}`}
                                onClick={() => setActiveTab('general')}
                                style={{ background: 'none', border: 'none', fontWeight: 600, color: activeTab === 'general' ? '#155e2b' : '#64748b', cursor: 'pointer', borderBottom: activeTab === 'general' ? '2px solid #155e2b' : 'none', padding: '5px 0' }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Settings size={16} /> General</div>
                            </button>
                            <button
                                className={`tab-btn ${activeTab === 'thresholds' ? 'active' : ''}`}
                                onClick={() => setActiveTab('thresholds')}
                                style={{ background: 'none', border: 'none', fontWeight: 600, color: activeTab === 'thresholds' ? '#155e2b' : '#64748b', cursor: 'pointer', borderBottom: activeTab === 'thresholds' ? '2px solid #155e2b' : 'none', padding: '5px 0' }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Gauge size={16} /> Thresholds</div>
                            </button>
                            <button
                                className={`tab-btn ${activeTab === 'advanced' ? 'active' : ''}`}
                                onClick={() => setActiveTab('advanced')}
                                style={{ background: 'none', border: 'none', fontWeight: 600, color: activeTab === 'advanced' ? '#155e2b' : '#64748b', cursor: 'pointer', borderBottom: activeTab === 'advanced' ? '2px solid #155e2b' : 'none', padding: '5px 0' }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><ShieldCheck size={16} /> Maintenance</div>
                            </button>
                        </div>

                        <form className="config-form" onSubmit={saveConfig}>
                            {activeTab === 'general' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div className="form-group">
                                        <label>Sensor Name</label>
                                        <input
                                            type="text"
                                            value={configSensor.name}
                                            onChange={(e) => setConfigSensor({ ...configSensor, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Location</label>
                                        <input
                                            type="text"
                                            value={configSensor.location}
                                            onChange={(e) => setConfigSensor({ ...configSensor, location: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Status</label>
                                        <select
                                            value={configSensor.status}
                                            onChange={(e) => setConfigSensor({ ...configSensor, status: e.target.value })}
                                        >
                                            <option value="online">Online</option>
                                            <option value="warning">Warning</option>
                                            <option value="offline">Offline</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Ping Interval: {configSensor.pingInterval}s</label>
                                        <input
                                            type="range"
                                            min="10"
                                            max="300"
                                            step="10"
                                            value={configSensor.pingInterval}
                                            onChange={(e) => setConfigSensor({ ...configSensor, pingInterval: parseInt(e.target.value) })}
                                            style={{ width: '100%', accentColor: '#155e2b' }}
                                        />
                                        <div className="flex-between" style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                                            <span>10s (High Power)</span>
                                            <span>300s (Eco Mode)</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'thresholds' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                        <div className="form-group">
                                            <label>Min Threshold</label>
                                            <input
                                                type="number"
                                                value={configSensor.thresholds.min}
                                                onChange={(e) => setConfigSensor({
                                                    ...configSensor,
                                                    thresholds: { ...configSensor.thresholds, min: parseFloat(e.target.value) }
                                                })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Max Threshold</label>
                                            <input
                                                type="number"
                                                value={configSensor.thresholds.max}
                                                onChange={(e) => setConfigSensor({
                                                    ...configSensor,
                                                    thresholds: { ...configSensor.thresholds, max: parseFloat(e.target.value) }
                                                })}
                                            />
                                        </div>
                                    </div>
                                    <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid #3b82f6', display: 'flex', gap: '12px', alignItems: 'center' }}>
                                        <BellRing size={20} color="#3b82f6" />
                                        <span style={{ fontSize: '0.85rem', color: '#475569' }}>Alerts will be triggered automatically if readings fall outside this range.</span>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'advanced' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div style={{ padding: '16px', background: '#fff1f2', borderRadius: '8px', border: '1px solid #fecaca' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', color: '#be123c' }}>
                                            <AlertTriangle size={20} />
                                            <h4 style={{ margin: 0 }}>Critical Actions</h4>
                                        </div>
                                        <div style={{ display: 'flex', gap: '12px' }}>
                                            <button
                                                type="button"
                                                className="btn-action"
                                                style={{ background: 'white', borderColor: '#f43f5e', color: '#e11d48' }}
                                                onClick={() => handleAction('Reboot')}
                                            >
                                                <RotateCcw size={16} /> Reboot
                                            </button>
                                            <button
                                                type="button"
                                                className="btn-action"
                                                style={{ background: '#e11d48', borderColor: '#e11d48', color: 'white' }}
                                                onClick={() => handleAction('Factory Reset')}
                                            >
                                                <Power size={16} /> Reset
                                            </button>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Hardware Info</label>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.85rem' }}>
                                            <div style={{ padding: '8px', background: '#f1f5f9', borderRadius: '4px' }}><b>Model:</b> AgroSense Pro</div>
                                            <div style={{ padding: '8px', background: '#f1f5f9', borderRadius: '4px' }}><b>Firmware:</b> {configSensor.firmware}</div>
                                            <div style={{ padding: '8px', background: '#f1f5f9', borderRadius: '4px' }}><b>Uptime:</b> 14d 6h 22m</div>
                                            <div style={{ padding: '8px', background: '#f1f5f9', borderRadius: '4px' }}><b>MAC:</b> 00:1B:44:11:3A:B7</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={() => setConfigSensor(null)}>Cancel</button>
                                <button type="submit" className="btn-save">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IoTSensors;
