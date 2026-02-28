import { Thermometer, Droplets, Wind, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { mockSiloStatus, mockSensorReadings } from '../../data/mockData';
import './Storage.css';
import './Dashboard.css';

const Storage = () => {
    return (
        <div className="dashboard-page overflow-hidden">
            <div className="dashboard-page-header">
                <h1>Storage Monitoring</h1>
                <p>Real-time environmental tracking per storage unit</p>
            </div>

            {/* Silo Slidebar (Horizontal Scroll) */}
            <div className="silo-scroll-container">
                {mockSiloStatus.map((silo, index) => (
                    <div
                        key={silo.id}
                        className={`silo-slide-card silo-${silo.status}`}
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <div className="silo-card-header">
                            <span className={`status-dot ${silo.status === 'normal' ? 'green' : silo.status === 'warning' ? 'orange' : silo.status === 'critical' ? 'red' : 'blue'}`} />
                            <span className="silo-name">{silo.name}</span>
                            <span className={`badge badge-${silo.status === 'normal' ? 'success' : silo.status === 'warning' ? 'warning' : silo.status === 'critical' ? 'danger' : 'info'}`} style={{ marginLeft: 'auto' }}>
                                {silo.status}
                            </span>
                        </div>
                        <div className="silo-crop">{silo.crop}</div>

                        <div className="storage-env-grid">
                            <div className="env-item">
                                <Thermometer size={14} className="env-icon temp" />
                                <div className="env-value">{silo.temperature}°C</div>
                                <div className="env-label">Temp</div>
                            </div>
                            <div className="env-item">
                                <Droplets size={14} className="env-icon humid" />
                                <div className="env-value">{silo.humidity}%</div>
                                <div className="env-label">Humid</div>
                            </div>
                            <div className="env-item">
                                <Wind size={14} className="env-icon co2" />
                                <div className="env-value">{silo.co2}</div>
                                <div className="env-label">CO2</div>
                            </div>
                        </div>

                        <div className="silo-capacity-bar">
                            <div className="silo-capacity-fill" style={{ width: `${silo.capacity}%` }} />
                        </div>
                        <div className="silo-capacity-label">{silo.capacity}% capacity used</div>
                    </div>
                ))}
            </div>

            {/* All Units Chart */}
            <div className="card chart-card" style={{ marginTop: 'var(--space-xl)' }}>
                <div className="chart-header">
                    <div>
                        <h3>Capacity Overview</h3>
                        <p>Total utilization across all {mockSiloStatus.length} units</p>
                    </div>
                    <div className="chart-stat-badge">
                        <TrendingUp size={14} />
                        <span>Overall: 68%</span>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={mockSiloStatus} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} unit="%" dx={-10} />
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', padding: '12px' }}
                            cursor={{ fill: '#f8fafc' }}
                        />
                        <Bar dataKey="capacity" fill="#155e2b" radius={[6, 6, 0, 0]} barSize={40} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Storage;
