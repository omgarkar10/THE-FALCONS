import { useEffect, useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import { Package, Gauge, Wifi, AlertTriangle, TrendingUp, Droplets, Thermometer, Activity, Shield, RefreshCw, Zap, BarChart3 } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area } from 'recharts';
import StatCard from '../../components/common/StatCard';
import DataTable from '../../components/common/DataTable';
import { mockDashboardStats, mockSensorReadings, mockGrainDistribution, mockAlerts, mockSiloStatus } from '../../data/mockData';
import './Dashboard.css';

/* ─── 3D Mini Scene for Dashboard Header ──────────────── */
function DashboardOrb() {
    const ref = useRef();
    useFrame(({ clock }) => {
        ref.current.rotation.x = clock.elapsedTime * 0.3;
        ref.current.rotation.y = clock.elapsedTime * 0.4;
    });
    return (
        <mesh ref={ref}>
            <icosahedronGeometry args={[1, 1]} />
            <MeshDistortMaterial color="#22c55e" wireframe distort={0.3} speed={2} transparent opacity={0.4} />
        </mesh>
    );
}

function MiniScene() {
    return (
        <>
            <ambientLight intensity={0.4} />
            <pointLight position={[3, 3, 3]} intensity={1.5} color="#22c55e" />
            <Float speed={2} floatIntensity={0.8}>
                <DashboardOrb />
            </Float>
        </>
    );
}

/* ─── Scroll Reveal Hook ──────────────────────────────── */
function useReveal(threshold = 0.15) {
    const ref = useRef();
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
        }, { threshold });
        obs.observe(el);
        return () => obs.disconnect();
    }, [threshold]);
    return [ref, visible];
}

function Reveal({ children, delay = 0, direction = 'up', className = '' }) {
    const [ref, visible] = useReveal(0.1);
    const t = { up: 'translateY(40px)', left: 'translateX(-40px)', right: 'translateX(40px)', scale: 'scale(0.92)' };
    return (
        <div ref={ref} className={className} style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0) scale(1)' : t[direction],
            transition: `opacity 0.7s ease ${delay}s, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
        }}>
            {children}
        </div>
    );
}

/* ─── Custom Dark Tooltip ─────────────────────────────── */
function DarkTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="dark-tooltip">
            <div className="dark-tooltip-label">{label}</div>
            {payload.map((p, i) => (
                <div key={i} className="dark-tooltip-row">
                    <span className="dark-tooltip-dot" style={{ background: p.color }} />
                    <span className="dark-tooltip-name">{p.name}</span>
                    <span className="dark-tooltip-val">{p.value}</span>
                </div>
            ))}
        </div>
    );
}

/* ─── Alert Columns ───────────────────────────────────── */
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

/* ─── Main Component ──────────────────────────────────── */
const WarehouseDashboard = () => {
    const stats = mockDashboardStats;
    const [liveTime, setLiveTime] = useState(new Date());

    useEffect(() => {
        const t = setInterval(() => setLiveTime(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    return (
        <div className="dashboard-page wh-dash-v3">
            {/* ── Hero Header with 3D ── */}
            <div className="wh-dash-hero">
                <div className="wh-dash-hero-3d">
                    <Canvas camera={{ position: [0, 0, 3.5], fov: 50 }} gl={{ alpha: true }}>
                        <Suspense fallback={null}><MiniScene /></Suspense>
                    </Canvas>
                </div>
                <div className="wh-dash-hero-content">
                    <div className="wh-dash-badge">
                        <Activity size={12} />
                        <span className="wh-dash-live-dot" />
                        Live Dashboard
                    </div>
                    <h1>Warehouse Command Center</h1>
                    <p>Real-time monitoring · {liveTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
                </div>
                <div className="wh-dash-hero-stats">
                    <div className="wh-dash-mini-stat">
                        <Shield size={14} />
                        <span>System Health: <strong>98.7%</strong></span>
                    </div>
                    <div className="wh-dash-mini-stat">
                        <Zap size={14} />
                        <span>Uptime: <strong>99.9%</strong></span>
                    </div>
                </div>
            </div>

            {/* ── KPI Cards ── */}
            <div className="grid grid-4 kpi-grid">
                <Reveal delay={0}><StatCard title="Total Stock" value={stats.totalStock.toLocaleString()} unit="tons" trend={stats.stockTrend} icon={Package} color="primary" /></Reveal>
                <Reveal delay={0.08}><StatCard title="Capacity Used" value={stats.capacityUsed} unit="%" trend={stats.capacityTrend} icon={Gauge} color="accent" /></Reveal>
                <Reveal delay={0.16}><StatCard title="Active Sensors" value={stats.activeSensors} trend={stats.sensorTrend} icon={Wifi} color="info" /></Reveal>
                <Reveal delay={0.24}><StatCard title="Critical Alerts" value={stats.criticalAlerts} trend={stats.alertTrend} icon={AlertTriangle} color="danger" /></Reveal>
            </div>

            {/* ── Charts Row ── */}
            <div className="grid grid-2 chart-row">
                <Reveal delay={0.1}>
                    <div className="card chart-card">
                        <div className="chart-header">
                            <div>
                                <h3>Temperature & Humidity</h3>
                                <p>Weekly trend across silos</p>
                            </div>
                            <div className="chart-legend-inline">
                                <span className="legend-dot" style={{ background: '#22c55e' }} /> Temp
                                <span className="legend-dot" style={{ background: '#3b82f6' }} /> Humidity
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={280}>
                            <AreaChart data={mockSensorReadings.temperature}>
                                <defs>
                                    <linearGradient id="gradA" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                                        <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="gradB" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} />
                                <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} />
                                <Tooltip content={<DarkTooltip />} />
                                <Area type="monotone" dataKey="siloA" name="Silo A" stroke="#22c55e" strokeWidth={2} fill="url(#gradA)" />
                                <Area type="monotone" dataKey="siloB" name="Silo B" stroke="#f59e0b" strokeWidth={2} fill="transparent" />
                                <Area type="monotone" dataKey="siloC" name="Silo C" stroke="#3b82f6" strokeWidth={2} fill="url(#gradB)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Reveal>

                <Reveal delay={0.15}>
                    <div className="card chart-card">
                        <div className="chart-header">
                            <div>
                                <h3>Grain Distribution</h3>
                                <p>Current stock by type</p>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie data={mockGrainDistribution} cx="50%" cy="50%" innerRadius={65} outerRadius={100} paddingAngle={3} dataKey="value" stroke="none">
                                    {mockGrainDistribution.map((entry, i) => (
                                        <Cell key={i} fill={entry.fill} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ background: 'rgba(10,20,14,0.95)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', color: '#fff', backdropFilter: 'blur(10px)' }}
                                    itemStyle={{ color: '#d1fae5' }}
                                    formatter={(value) => [`${value} tons`, '']}
                                />
                                <Legend verticalAlign="bottom" iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', color: '#9ca3af' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Reveal>
            </div>

            {/* ── Silo Status + Alerts ── */}
            <div className="grid grid-2 bottom-row">
                <Reveal delay={0.05}>
                    <div className="card" style={{ padding: '24px' }}>
                        <div className="chart-header">
                            <div>
                                <h3>Storage Unit Status</h3>
                                <p>Real-time facility monitoring</p>
                            </div>
                            <div className="wh-refresh-btn">
                                <RefreshCw size={14} />
                            </div>
                        </div>
                        <div className="silo-grid">
                            {mockSiloStatus.map((silo, idx) => (
                                <Reveal key={silo.id} delay={idx * 0.06}>
                                    <div className={`silo-card silo-${silo.status}`}>
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
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </Reveal>

                <Reveal delay={0.1}>
                    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                        <div className="chart-header" style={{ padding: '24px 24px 0' }}>
                            <div>
                                <h3>Recent Alerts</h3>
                                <p>Latest warehouse notifications</p>
                            </div>
                        </div>
                        <DataTable columns={alertColumns} data={mockAlerts} searchable={false} />
                    </div>
                </Reveal>
            </div>
        </div>
    );
};

export default WarehouseDashboard;
