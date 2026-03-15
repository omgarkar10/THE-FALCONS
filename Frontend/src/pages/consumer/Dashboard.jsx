import { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Stars } from '@react-three/drei';
import { Package, Truck, Star, DollarSign, ArrowUpRight, ArrowDownRight, Bell, Calendar, Wheat, Shield, TrendingUp, MapPin, Eye, BarChart3, Leaf, RefreshCw } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import StatCard from '../../components/common/StatCard';
import { mockConsumerData } from '../../data/mockData';
import './ConsumerDashboard.css';

/* ─── 3D Scene ────────────────────────────────────────── */
function FarmerOrb() {
    const ref = useRef();
    useFrame(({ clock }) => {
        ref.current.rotation.x = Math.sin(clock.elapsedTime * 0.5) * 0.3;
        ref.current.rotation.y = clock.elapsedTime * 0.3;
    });
    return (
        <mesh ref={ref}>
            <torusKnotGeometry args={[0.7, 0.25, 80, 16]} />
            <MeshDistortMaterial color="#4ade80" wireframe distort={0.15} speed={1.5} transparent opacity={0.35} />
        </mesh>
    );
}

function FarmerScene() {
    return (
        <>
            <ambientLight intensity={0.3} />
            <pointLight position={[2, 3, 3]} intensity={1.5} color="#22c55e" />
            <pointLight position={[-2, -1, 2]} intensity={0.5} color="#3b82f6" />
            <Float speed={1.5} floatIntensity={0.6}><FarmerOrb /></Float>
        </>
    );
}

/* ─── Scroll Reveal ───────────────────────────────────── */
function useReveal(threshold = 0.12) {
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
    const [ref, visible] = useReveal();
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

/* ─── Animated Counter ────────────────────────────────── */
function AnimCounter({ value, suffix = '' }) {
    const [count, setCount] = useState(0);
    const [ref, visible] = useReveal();
    const started = useRef(false);
    useEffect(() => {
        if (!visible || started.current) return;
        started.current = true;
        const num = parseFloat(value);
        if (isNaN(num)) return;
        const start = performance.now();
        const tick = (now) => {
            const p = Math.min((now - start) / 1200, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            setCount(Math.floor(ease * num));
            if (p < 1) requestAnimationFrame(tick);
            else setCount(num);
        };
        requestAnimationFrame(tick);
    }, [visible, value]);
    return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ─── Quick Action Card ───────────────────────────────── */
function QuickAction({ icon: Icon, title, desc, color, delay }) {
    const [hovered, setHovered] = useState(false);
    return (
        <Reveal delay={delay}>
            <div
                className={`cd-quick-action ${hovered ? 'hovered' : ''}`}
                style={{ '--qa-color': color }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                <div className="cd-qa-icon"><Icon size={20} /></div>
                <div className="cd-qa-text">
                    <h4>{title}</h4>
                    <p>{desc}</p>
                </div>
                <ArrowUpRight size={16} className="cd-qa-arrow" />
            </div>
        </Reveal>
    );
}

/* ─── Storage Health Card ─────────────────────────────── */
const storageHealthData = [
    { zone: 'Cold A', health: 96, status: 'good', temp: '4.2°C' },
    { zone: 'Grain B', health: 82, status: 'good', temp: '22°C' },
    { zone: 'Dry C', health: 67, status: 'warn', temp: '28°C' },
    { zone: 'Silo D', health: 94, status: 'good', temp: '19°C' },
];

/* ─── Weekly trend mock ───────────────────────────────── */
const weeklyTrend = [
    { day: 'Mon', stock: 820, quality: 92 },
    { day: 'Tue', stock: 835, quality: 91 },
    { day: 'Wed', stock: 810, quality: 94 },
    { day: 'Thu', stock: 845, quality: 93 },
    { day: 'Fri', stock: 860, quality: 95 },
    { day: 'Sat', stock: 855, quality: 94 },
    { day: 'Sun', stock: 870, quality: 96 },
];

/* ─── Main Component ──────────────────────────────────── */
const ConsumerDashboard = () => {
    const { stats, stockBreakdown, notifications } = mockConsumerData;
    const unreadNotifs = notifications.filter(n => !n.read);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="dashboard-page consumer-dashboard-v3">

            {/* ── Hero Header with 3D ── */}
            <div className="cd-hero">
                <div className="cd-hero-3d">
                    <Canvas camera={{ position: [0, 0, 3], fov: 50 }} gl={{ alpha: true }}>
                        <Suspense fallback={null}><FarmerScene /></Suspense>
                    </Canvas>
                </div>
                <div className="cd-hero-content">
                    <div className="cd-hero-badge">
                        <Leaf size={12} />
                        <span className="cd-hero-live-dot" />
                        Farmer Dashboard
                    </div>
                    <h1>Welcome Back 👋</h1>
                    <p>Here's an overview of your stored crops across all facilities</p>
                </div>
                <div className="cd-hero-right">
                    <div className="cd-hero-time">
                        <Calendar size={14} />
                        <span>{currentTime.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                        <span className="cd-time-separator">·</span>
                        <span>{currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    {unreadNotifs.length > 0 && (
                        <div className="cd-hero-notif">
                            <Bell size={14} />
                            <span>{unreadNotifs.length} new alerts</span>
                        </div>
                    )}
                </div>
            </div>

            {/* ── KPI Cards ── */}
            <div className="grid grid-4 kpi-grid">
                <Reveal delay={0}><StatCard title="My Total Stock" value={stats.totalStock} unit="tons" trend={stats.stockTrend} trendLabel="vs last month" icon={Package} color="primary" /></Reveal>
                <Reveal delay={0.08}><StatCard title="Active Shipments" value={stats.activeShipments} trend={stats.shipmentTrend} icon={Truck} color="info" /></Reveal>
                <Reveal delay={0.16}><StatCard title="Avg. Quality Score" value={stats.avgQuality} unit="/100" trend={stats.qualityTrend} icon={Star} color="success" /></Reveal>
                <Reveal delay={0.24}><StatCard title="Monthly Cost" value={stats.monthlyCost} unit="₹" trend={stats.costTrend} icon={DollarSign} color="accent" /></Reveal>
            </div>

            {/* ── Quick Actions ── */}
            <Reveal>
                <div className="cd-section-label">Quick Actions</div>
            </Reveal>
            <div className="cd-quick-actions-grid">
                <QuickAction icon={Eye} title="View Storage" desc="Check your crop locations" color="#22c55e" delay={0} />
                <QuickAction icon={Truck} title="Track Shipment" desc="Real-time delivery status" color="#3b82f6" delay={0.06} />
                <QuickAction icon={BarChart3} title="Quality Report" desc="Latest batch results" color="#f59e0b" delay={0.12} />
                <QuickAction icon={Bell} title="Manage Alerts" desc="Configure notifications" color="#a78bfa" delay={0.18} />
            </div>

            {/* ── Charts Row ── */}
            <div className="grid grid-2 chart-row">
                {/* Stock Breakdown */}
                <Reveal delay={0.1}>
                    <div className="card chart-card">
                        <div className="chart-header">
                            <div>
                                <h3>My Stock Breakdown</h3>
                                <p>Distribution of your commodities</p>
                            </div>
                            <div className="cd-badge-live"><span className="cd-badge-dot" /> Live</div>
                        </div>
                        <div className="chart-container-wrap">
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <defs>
                                        {stockBreakdown.map((entry, i) => (
                                            <linearGradient key={`cg-${i}`} id={`cg-${i}`} x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor={entry.fill} stopOpacity={0.9} />
                                                <stop offset="100%" stopColor={entry.fill} stopOpacity={0.4} />
                                            </linearGradient>
                                        ))}
                                    </defs>
                                    <Pie data={stockBreakdown} cx="50%" cy="50%" innerRadius={75} outerRadius={105} paddingAngle={5} dataKey="value" stroke="none">
                                        {stockBreakdown.map((entry, i) => (
                                            <Cell key={i} fill={`url(#cg-${i})`} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ background: 'rgba(10,20,14,0.95)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', color: '#fff', backdropFilter: 'blur(10px)' }}
                                        itemStyle={{ color: '#d1fae5' }}
                                        formatter={(v) => [`${v} tons`, 'Value']}
                                    />
                                    <Legend iconType="circle" iconSize={10} layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ fontSize: '13px', color: '#9ca3af' }} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="chart-center-label">
                                <span className="label-val"><AnimCounter value={stats.totalStock} /></span>
                                <span className="label-txt">Total Tons</span>
                            </div>
                        </div>
                    </div>
                </Reveal>

                {/* Weekly Trend */}
                <Reveal delay={0.15}>
                    <div className="card chart-card">
                        <div className="chart-header">
                            <div>
                                <h3>Weekly Stock & Quality</h3>
                                <p>7-day performance overview</p>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={weeklyTrend}>
                                <defs>
                                    <linearGradient id="cgStock" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                                        <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="cgQuality" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} />
                                <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} />
                                <Tooltip contentStyle={{ background: 'rgba(10,20,14,0.95)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} itemStyle={{ color: '#d1fae5' }} />
                                <Area type="monotone" dataKey="stock" name="Stock (tons)" stroke="#22c55e" strokeWidth={2} fill="url(#cgStock)" />
                                <Area type="monotone" dataKey="quality" name="Quality (%)" stroke="#3b82f6" strokeWidth={2} fill="url(#cgQuality)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Reveal>
            </div>

            {/* ── Storage Health + Activity ── */}
            <div className="grid grid-2 bottom-row">
                {/* Storage Health */}
                <Reveal delay={0.05}>
                    <div className="card" style={{ padding: 24 }}>
                        <div className="chart-header">
                            <div>
                                <h3>Storage Health</h3>
                                <p>Condition of your allocated zones</p>
                            </div>
                            <div className="cd-refresh-btn"><RefreshCw size={14} /></div>
                        </div>
                        <div className="cd-health-grid">
                            {storageHealthData.map((zone, i) => (
                                <Reveal key={zone.zone} delay={i * 0.06}>
                                    <div className={`cd-health-card cd-health-${zone.status}`}>
                                        <div className="cd-hc-header">
                                            <span className={`status-dot ${zone.status === 'good' ? 'green' : 'orange'}`} />
                                            <span className="cd-hc-name">{zone.zone}</span>
                                            <span className="cd-hc-temp">{zone.temp}</span>
                                        </div>
                                        <div className="cd-hc-bar">
                                            <div className="cd-hc-bar-fill" style={{ width: `${zone.health}%` }} />
                                        </div>
                                        <div className="cd-hc-label">{zone.health}% optimal</div>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </Reveal>

                {/* Activity Feed */}
                <Reveal delay={0.1}>
                    <div className="card" style={{ padding: 24 }}>
                        <div className="chart-header">
                            <div>
                                <h3>Recent Alerts & Activity</h3>
                                <p>{unreadNotifs.length} new updates</p>
                            </div>
                            <div className="cd-notif-badge">
                                <Bell size={16} />
                                {unreadNotifs.length > 0 && <span className="cd-notif-count">{unreadNotifs.length}</span>}
                            </div>
                        </div>
                        <div className="cd-activity-feed">
                            {notifications.map((n, i) => (
                                <Reveal key={n._id} delay={i * 0.05}>
                                    <div className={`cd-activity-item ${!n.read ? 'unread' : ''}`}>
                                        <div className={`cd-ai-icon ${n.type}`}>
                                            {n.type === 'alert' ? <Bell size={14} /> : n.type === 'info' ? <ArrowUpRight size={14} /> : <Star size={14} />}
                                        </div>
                                        <div className="cd-ai-content">
                                            <div className="cd-ai-top">
                                                <span className="cd-ai-type">{n.type === 'alert' ? 'Critical Alert' : 'System Update'}</span>
                                                <span className="cd-ai-time">{new Date(n.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                            <p>{n.message}</p>
                                        </div>
                                        {!n.read && <div className="cd-ai-unread" />}
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                        <button className="cd-view-all-btn">View All History</button>
                    </div>
                </Reveal>
            </div>
        </div>
    );
};

export default ConsumerDashboard;
