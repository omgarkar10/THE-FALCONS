import { Package, Truck, Star, DollarSign } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import StatCard from '../../components/common/StatCard';
import { mockConsumerData } from '../../data/mockData';
import '../warehouse/Dashboard.css';

const ConsumerDashboard = () => {
    const { stats, stockBreakdown, notifications } = mockConsumerData;
    const unreadNotifs = notifications.filter(n => !n.read);

    return (
        <div className="dashboard-page">
            <div className="dashboard-page-header">
                <h1>Welcome Back 👋</h1>
                <p>Here's an overview of your stored crops</p>
            </div>

            <div className="grid grid-4 kpi-grid">
                <StatCard title="My Total Stock" value={stats.totalStock} unit="tons" trend={stats.stockTrend} icon={Package} color="primary" />
                <StatCard title="Active Shipments" value={stats.activeShipments} trend={stats.shipmentTrend} icon={Truck} color="info" />
                <StatCard title="Avg. Quality Score" value={stats.avgQuality} unit="/100" trend={stats.qualityTrend} icon={Star} color="success" />
                <StatCard title="Monthly Cost" value={`₹${stats.monthlyCost}`} trend={stats.costTrend} icon={DollarSign} color="accent" />
            </div>

            <div className="grid grid-2 chart-row">
                {/* Stock Breakdown */}
                <div className="card chart-card">
                    <div className="chart-header">
                        <div>
                            <h3>My Stock Breakdown</h3>
                            <p>Distribution of your stored crops</p>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                            <Pie data={stockBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={95} paddingAngle={3} dataKey="value">
                                {stockBreakdown.map((entry, i) => (
                                    <Cell key={i} fill={entry.fill} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} formatter={(v) => [`${v} tons`, '']} />
                            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Recent Activity */}
                <div className="card">
                    <div className="chart-header">
                        <div>
                            <h3>Recent Notifications</h3>
                            <p>{unreadNotifs.length} unread</p>
                        </div>
                    </div>
                    <div className="activity-feed">
                        {notifications.map((n) => (
                            <div key={n._id} className={`activity-item ${!n.read ? 'unread' : ''}`}>
                                <div className={`activity-dot ${n.type}`} />
                                <div className="activity-content">
                                    <p>{n.message}</p>
                                    <span className="activity-time">
                                        {new Date(n.timestamp).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConsumerDashboard;
