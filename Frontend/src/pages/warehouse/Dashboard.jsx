import { Package, Gauge, Wifi, AlertTriangle, TrendingUp, Droplets, Thermometer } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import StatCard from '../../components/common/StatCard';
import DataTable from '../../components/common/DataTable';
import { mockDashboardStats, mockSensorReadings, mockGrainDistribution, mockAlerts, mockSiloStatus } from '../../data/mockData';
import './Dashboard.css';

const alertColumns = [
    { header: 'Type', accessor: 'type' },
    { header: 'Location', accessor: 'location' },
    {
        header: 'Severity',
        accessor: 'severity',
        render: (row) => (
            <span className={`badge badge-${row.severity === 'critical' ? 'danger' : row.severity === 'warning' ? 'warning' : 'info'}`}>
                {row.severity}
            </span>
        ),
    },
    { header: 'Message', accessor: 'message' },
    {
        header: 'Time',
        accessor: 'timestamp',
        render: (row) => new Date(row.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
];

const WarehouseDashboard = () => {
    const stats = mockDashboardStats;

    return (
        <div className="dashboard-page">
            <div className="dashboard-page-header">
                <h1>Dashboard Overview</h1>
                <p>Monitor your warehouse operations in real-time</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-4 kpi-grid">
                <StatCard title="Total Stock" value={stats.totalStock.toLocaleString()} unit="tons" trend={stats.stockTrend} icon={Package} color="primary" />
                <StatCard title="Capacity Used" value={stats.capacityUsed} unit="%" trend={stats.capacityTrend} icon={Gauge} color="accent" />
                <StatCard title="Active Sensors" value={stats.activeSensors} trend={stats.sensorTrend} icon={Wifi} color="info" />
                <StatCard title="Critical Alerts" value={stats.criticalAlerts} trend={stats.alertTrend} icon={AlertTriangle} color="danger" />
            </div>

            {/* Charts Row */}
            <div className="grid grid-2 chart-row">
                {/* Temperature & Humidity Trend */}
                <div className="card chart-card">
                    <div className="chart-header">
                        <div>
                            <h3>Temperature & Humidity</h3>
                            <p>Weekly trend across silos</p>
                        </div>
                        <div className="chart-legend-inline">
                            <span className="legend-dot" style={{ background: '#155e2b' }} /> Temp
                            <span className="legend-dot" style={{ background: '#3b82f6' }} /> Humidity
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={280}>
                        <LineChart data={mockSensorReadings.temperature}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="time" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                            <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.07)' }}
                            />
                            <Line type="monotone" dataKey="siloA" name="Silo A" stroke="#155e2b" strokeWidth={2} dot={false} />
                            <Line type="monotone" dataKey="siloB" name="Silo B" stroke="#f06418" strokeWidth={2} dot={false} />
                            <Line type="monotone" dataKey="siloC" name="Silo C" stroke="#3b82f6" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Grain Distribution */}
                <div className="card chart-card">
                    <div className="chart-header">
                        <div>
                            <h3>Grain Distribution</h3>
                            <p>Current stock by type</p>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                            <Pie
                                data={mockGrainDistribution}
                                cx="50%"
                                cy="50%"
                                innerRadius={65}
                                outerRadius={100}
                                paddingAngle={3}
                                dataKey="value"
                            >
                                {mockGrainDistribution.map((entry, i) => (
                                    <Cell key={i} fill={entry.fill} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                formatter={(value) => [`${value} tons`, '']}
                            />
                            <Legend
                                verticalAlign="bottom"
                                iconType="circle"
                                iconSize={8}
                                wrapperStyle={{ fontSize: '12px' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Silo Status + Alerts */}
            <div className="grid grid-2 bottom-row">
                {/* Silo Status */}
                <div className="card">
                    <div className="chart-header">
                        <div>
                            <h3>Storage Unit Status</h3>
                            <p>Real-time facility monitoring</p>
                        </div>
                    </div>
                    <div className="silo-grid">
                        {mockSiloStatus.map((silo) => (
                            <div key={silo.id} className={`silo-card silo-${silo.status}`}>
                                <div className="silo-card-header">
                                    <span className={`status-dot ${silo.status === 'normal' ? 'green' : silo.status === 'warning' ? 'orange' : silo.status === 'critical' ? 'red' : 'blue'}`} />
                                    <span className="silo-name">{silo.name}</span>
                                </div>
                                <div className="silo-crop">{silo.crop}</div>
                                <div className="silo-metrics">
                                    <div className="silo-metric">
                                        <Thermometer size={12} />
                                        <span>{silo.temperature}°C</span>
                                    </div>
                                    <div className="silo-metric">
                                        <Droplets size={12} />
                                        <span>{silo.humidity}%</span>
                                    </div>
                                </div>
                                <div className="silo-capacity-bar">
                                    <div className="silo-capacity-fill" style={{ width: `${silo.capacity}%` }} />
                                </div>
                                <div className="silo-capacity-label">{silo.capacity}% capacity</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Alerts */}
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div className="chart-header" style={{ padding: 'var(--space-lg) var(--space-lg) 0' }}>
                        <div>
                            <h3>Recent Alerts</h3>
                            <p>Latest warehouse notifications</p>
                        </div>
                    </div>
                    <DataTable
                        columns={alertColumns}
                        data={mockAlerts}
                        searchable={false}
                    />
                </div>
            </div>
        </div>
    );
};

export default WarehouseDashboard;
