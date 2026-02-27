import { Thermometer, Droplets, Wind, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { mockSiloStatus, mockSensorReadings } from '../../data/mockData';
import './Dashboard.css';

const Storage = () => {
    return (
        <div className="dashboard-page">
            <div className="dashboard-page-header">
                <h1>Storage Monitoring</h1>
                <p>Real-time environmental tracking per storage unit</p>
            </div>

            {/* Environment Cards */}
            <div className="grid grid-4 kpi-grid">
                {mockSiloStatus.slice(0, 4).map((silo) => (
                    <div key={silo.id} className={`card silo-detail-card silo-${silo.status}`}>
                        <div className="silo-card-header">
                            <span className={`status-dot ${silo.status === 'normal' ? 'green' : silo.status === 'warning' ? 'orange' : silo.status === 'critical' ? 'red' : 'blue'}`} />
                            <span className="silo-name">{silo.name}</span>
                            <span className={`badge badge-${silo.status === 'normal' ? 'success' : silo.status === 'warning' ? 'warning' : silo.status === 'critical' ? 'danger' : 'info'}`} style={{ marginLeft: 'auto' }}>
                                {silo.status}
                            </span>
                        </div>
                        <div className="silo-crop" style={{ marginBottom: 'var(--space-md)' }}>{silo.crop}</div>
                        <div className="storage-env-grid">
                            <div className="env-item">
                                <Thermometer size={16} className="env-icon temp" />
                                <div>
                                    <div className="env-value">{silo.temperature}°C</div>
                                    <div className="env-label">Temperature</div>
                                </div>
                            </div>
                            <div className="env-item">
                                <Droplets size={16} className="env-icon humid" />
                                <div>
                                    <div className="env-value">{silo.humidity}%</div>
                                    <div className="env-label">Humidity</div>
                                </div>
                            </div>
                            <div className="env-item">
                                <Wind size={16} className="env-icon co2" />
                                <div>
                                    <div className="env-value">{silo.co2}</div>
                                    <div className="env-label">CO2 (ppm)</div>
                                </div>
                            </div>
                        </div>
                        <div className="silo-capacity-bar" style={{ marginTop: 'var(--space-md)' }}>
                            <div className="silo-capacity-fill" style={{ width: `${silo.capacity}%` }} />
                        </div>
                        <div className="silo-capacity-label">{silo.capacity}% capacity used</div>
                    </div>
                ))}
            </div>

            {/* All Units */}
            <div className="card chart-card">
                <div className="chart-header">
                    <div>
                        <h3>All Storage Units</h3>
                        <p>Capacity utilization overview</p>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={mockSiloStatus}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                        <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} unit="%" />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                            formatter={(value) => [`${value}%`, 'Capacity']}
                        />
                        <Bar dataKey="capacity" fill="#155e2b" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Detailed Grid */}
            <div className="grid grid-2" style={{ marginTop: 'var(--space-lg)' }}>
                {mockSiloStatus.slice(4).map((silo) => (
                    <div key={silo.id} className={`card silo-detail-card silo-${silo.status}`}>
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
                                <Thermometer size={16} className="env-icon temp" />
                                <div>
                                    <div className="env-value">{silo.temperature}°C</div>
                                    <div className="env-label">Temperature</div>
                                </div>
                            </div>
                            <div className="env-item">
                                <Droplets size={16} className="env-icon humid" />
                                <div>
                                    <div className="env-value">{silo.humidity}%</div>
                                    <div className="env-label">Humidity</div>
                                </div>
                            </div>
                            <div className="env-item">
                                <Wind size={16} className="env-icon co2" />
                                <div>
                                    <div className="env-value">{silo.co2}</div>
                                    <div className="env-label">CO2 (ppm)</div>
                                </div>
                            </div>
                        </div>
                        <div className="silo-capacity-bar" style={{ marginTop: 'var(--space-md)' }}>
                            <div className="silo-capacity-fill" style={{ width: `${silo.capacity}%` }} />
                        </div>
                        <div className="silo-capacity-label">{silo.capacity}% capacity used</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Storage;
