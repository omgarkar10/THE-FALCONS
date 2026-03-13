import { useRef, useEffect, useState } from 'react';
import { Package, Truck, Star, DollarSign, ArrowUpRight, ArrowDownRight, Bell, Calendar } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import StatCard from '../../components/common/StatCard';
import { mockConsumerData } from '../../data/mockData';
import './ConsumerDashboard.css';

const ConsumerDashboard = () => {
    const { stats, stockBreakdown, notifications } = mockConsumerData;
    const unreadNotifs = notifications.filter(n => !n.read);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="dashboard-page consumer-dashboard-v2">
            <div className="dashboard-page-header">
                <div className="header-main">
                    <h1>Welcome Back 👋</h1>
                    <p>Here's an overview of your stored crops across all facilities</p>
                </div>
                <div className="dashboard-header-right">
                    <div className="header-date">
                        <Calendar size={16} />
                        <span>{currentTime.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-4 kpi-grid">
                <StatCard
                    title="My Total Stock"
                    value={stats.totalStock}
                    unit="tons"
                    trend={stats.stockTrend}
                    trendLabel="vs last month"
                    icon={Package}
                    color="primary"
                />
                <StatCard
                    title="Active Shipments"
                    value={stats.activeShipments}
                    trend={stats.shipmentTrend}
                    icon={Truck}
                    color="info"
                />
                <StatCard
                    title="Avg. Quality Score"
                    value={stats.avgQuality}
                    unit="/100"
                    trend={stats.qualityTrend}
                    icon={Star}
                    color="success"
                />
                <StatCard
                    title="Monthly Cost"
                    value={stats.monthlyCost}
                    unit="₹"
                    trend={stats.costTrend}
                    icon={DollarSign}
                    color="accent"
                />
            </div>

            <div className="grid grid-2 chart-row">
                {/* Stock Breakdown */}
                <div className="card chart-card reveal-up">
                    <div className="chart-header">
                        <div>
                            <h3>My Stock Breakdown</h3>
                            <p>Global distribution of your commodities</p>
                        </div>
                        <div className="chart-actions">
                            <div className="badge badge-info">Live View</div>
                        </div>
                    </div>
                    <div className="chart-container-wrap">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <defs>
                                    {stockBreakdown.map((entry, i) => (
                                        <linearGradient key={`grad-${i}`} id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor={entry.fill} stopOpacity={0.8} />
                                            <stop offset="100%" stopColor={entry.fill} stopOpacity={0.4} />
                                        </linearGradient>
                                    ))}
                                </defs>
                                <Pie
                                    data={stockBreakdown}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={75}
                                    outerRadius={105}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {stockBreakdown.map((entry, i) => (
                                        <Cell key={i} fill={`url(#grad-${i})`} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(10, 20, 14, 0.95)',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
                                        backdropFilter: 'blur(10px)',
                                        color: '#fff'
                                    }}
                                    itemStyle={{ color: '#d1fae5' }}
                                    formatter={(v) => [`${v} tons`, 'Value']}
                                />
                                <Legend
                                    iconType="circle"
                                    iconSize={10}
                                    layout="vertical"
                                    align="right"
                                    verticalAlign="middle"
                                    wrapperStyle={{
                                        fontSize: '13px',
                                        paddingLeft: '20px',
                                        color: '#9ca3af'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="chart-center-label">
                            <span className="label-val">{stats.totalStock}</span>
                            <span className="label-txt">Total Tons</span>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="card reveal-up" style={{ animationDelay: '0.15s' }}>
                    <div className="chart-header">
                        <div className="flex-between w-full">
                            <div>
                                <h3>Recent Alerts & Activity</h3>
                                <p>{unreadNotifs.length} new updates requiring attention</p>
                            </div>
                            <div className="header-icon-badge">
                                <Bell size={18} />
                                {unreadNotifs.length > 0 && <span className="pulse-dot" />}
                            </div>
                        </div>
                    </div>
                    <div className="activity-feed premium-feed">
                        {notifications.map((n, i) => (
                            <div key={n._id} className={`activity-item ${!n.read ? 'unread' : ''}`} style={{ animationDelay: `${i * 0.1}s` }}>
                                <div className={`activity-icon-box ${n.type}`}>
                                    {n.type === 'alert' ? <Bell size={14} /> : n.type === 'info' ? <ArrowUpRight size={14} /> : <Star size={14} />}
                                </div>
                                <div className="activity-content">
                                    <div className="activity-header-row">
                                        <span className="activity-type-label">{n.type === 'alert' ? 'Critical Alert' : 'System Update'}</span>
                                        <span className="activity-time">
                                            {new Date(n.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <p>{n.message}</p>
                                </div>
                                {!n.read && <div className="unread-indicator" />}
                            </div>
                        ))}
                    </div>
                    <button className="view-all-btn">View All History</button>
                </div>
            </div>
        </div>
    );
};

export default ConsumerDashboard;
