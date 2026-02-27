import { TrendingUp, Clock, AlertTriangle, Gauge } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import StatCard from '../../components/common/StatCard';
import { mockAnalytics } from '../../data/mockData';
import './Dashboard.css';

const Analytics = () => {
    const { throughput, avgStorageDuration, lossRate, capacityUtilization, storageTrends, lossAnalysis } = mockAnalytics;

    return (
        <div className="dashboard-page">
            <div className="dashboard-page-header">
                <h1>Analytics & Reports</h1>
                <p>Comprehensive warehouse performance insights</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-4 kpi-grid">
                <StatCard title="Throughput" value={throughput.value.toLocaleString()} unit={throughput.unit} trend={throughput.trend} icon={TrendingUp} color="primary" />
                <StatCard title="Avg Storage Duration" value={avgStorageDuration.value} unit={avgStorageDuration.unit} trend={avgStorageDuration.trend} icon={Clock} color="info" />
                <StatCard title="Loss Rate" value={lossRate.value} unit={lossRate.unit} trend={lossRate.trend} icon={AlertTriangle} color="warning" />
                <StatCard title="Capacity Utilization" value={capacityUtilization.value} unit={capacityUtilization.unit} trend={capacityUtilization.trend} icon={Gauge} color="accent" />
            </div>

            {/* Storage Trends */}
            <div className="card chart-card" style={{ marginBottom: 'var(--space-lg)' }}>
                <div className="chart-header">
                    <div>
                        <h3>Storage Trends by Crop</h3>
                        <p>Monthly stock levels across all crop types</p>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={storageTrends}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                        <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
                        <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
                        <Line type="monotone" dataKey="wheat" name="Wheat" stroke="#155e2b" strokeWidth={2} dot={{ r: 3 }} />
                        <Line type="monotone" dataKey="rice" name="Rice" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
                        <Line type="monotone" dataKey="corn" name="Corn" stroke="#f06418" strokeWidth={2} dot={{ r: 3 }} />
                        <Line type="monotone" dataKey="soybean" name="Soybean" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Loss Analysis */}
            <div className="card chart-card">
                <div className="chart-header">
                    <div>
                        <h3>Loss & Wastage Analysis</h3>
                        <p>Monthly breakdown by cause</p>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={lossAnalysis}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                        <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} unit=" T" />
                        <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
                        <Area type="monotone" dataKey="spoilage" name="Spoilage" stackId="1" fill="#ef4444" stroke="#ef4444" fillOpacity={0.6} />
                        <Area type="monotone" dataKey="pest" name="Pest Damage" stackId="1" fill="#f59e0b" stroke="#f59e0b" fillOpacity={0.6} />
                        <Area type="monotone" dataKey="handling" name="Handling Loss" stackId="1" fill="#3b82f6" stroke="#3b82f6" fillOpacity={0.6} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Analytics;
