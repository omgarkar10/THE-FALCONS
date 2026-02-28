import { useState, useEffect } from 'react';
import { TrendingUp, Clock, AlertTriangle, Gauge, ArrowUpRight, ArrowDownRight, LayoutPanelLeft, PieChart as PieIcon, BarChart3, LineChart as LineIcon } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import StatCard from '../../components/common/StatCard';
import { mockAnalytics } from '../../data/mockData';
import './Analytics.css';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip">
                <p className="tooltip-label">{label}</p>
                <div className="tooltip-items">
                    {payload.map((item, index) => (
                        <div key={index} className="tooltip-item">
                            <span className="dot" style={{ backgroundColor: item.color || item.payload.fill }}></span>
                            <span className="name">{item.name}:</span>
                            <span className="value">{item.value.toLocaleString()} {item.unit || ''}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};

const Analytics = () => {
    const { throughput, avgStorageDuration, lossRate, capacityUtilization, storageTrends, lossAnalysis } = mockAnalytics;
    const [chartView, setChartView] = useState('line'); // 'line', 'bar', 'pie'
    const [lossChartView, setLossChartView] = useState('area'); // 'area', 'bar', 'line'

    const cropColors = {
        wheat: '#155e2b',
        rice: '#22c55e',
        corn: '#f06418',
        soybean: '#f59e0b'
    };

    const pieData = [
        { name: 'Wheat', value: 3200, fill: cropColors.wheat },
        { name: 'Rice', value: 2400, fill: cropColors.rice },
        { name: 'Corn', value: 1800, fill: cropColors.corn },
        { name: 'Soybean', value: 1200, fill: cropColors.soybean }
    ];

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

            {/* Storage Trends & Multi-View */}
            <div className="card chart-card" style={{ marginBottom: 'var(--space-lg)' }}>
                <div className="chart-header">
                    <div>
                        <h3>{chartView === 'line' ? 'Storage Trends' : chartView === 'bar' ? 'Supply Comparison' : 'Crop Distribution'}</h3>
                        <p>{chartView === 'line' ? 'Monthly stock levels' : chartView === 'bar' ? 'Volume analysis' : 'Total warehouse share'}</p>
                    </div>
                    <div className="flex-center gap-10">
                        <div className="view-toggle-group">
                            <button
                                className={`view-btn ${chartView === 'line' ? 'active' : ''}`}
                                onClick={() => setChartView('line')}
                                title="Line View"
                            >
                                <LineIcon size={16} />
                            </button>
                            <button
                                className={`view-btn ${chartView === 'bar' ? 'active' : ''}`}
                                onClick={() => setChartView('bar')}
                                title="Bar View"
                            >
                                <BarChart3 size={16} />
                            </button>
                            <button
                                className={`view-btn ${chartView === 'pie' ? 'active' : ''}`}
                                onClick={() => setChartView('pie')}
                                title="Pie View"
                            >
                                <PieIcon size={16} />
                            </button>
                        </div>
                        <div className="chart-stat-badge">
                            <ArrowUpRight size={14} />
                            <span>Peak: 3,100T</span>
                        </div>
                    </div>
                </div>

                <ResponsiveContainer width="100%" height={350}>
                    {chartView === 'line' ? (
                        <LineChart data={storageTrends}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="month"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }}
                                dx={-10}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e2e8f0', strokeWidth: 1 }} />
                            <Legend verticalAlign="top" align="right" iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', fontWeight: 600, paddingBottom: '20px' }} />
                            <Line type="monotone" dataKey="wheat" name="Wheat" stroke={cropColors.wheat} strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0 }} />
                            <Line type="monotone" dataKey="rice" name="Rice" stroke={cropColors.rice} strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0 }} />
                            <Line type="monotone" dataKey="corn" name="Corn" stroke={cropColors.corn} strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0 }} />
                            <Line type="monotone" dataKey="soybean" name="Soybean" stroke={cropColors.soybean} strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0 }} />
                        </LineChart>
                    ) : chartView === 'bar' ? (
                        <BarChart data={storageTrends}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dx={-10} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                            <Legend verticalAlign="top" align="right" iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', fontWeight: 600, paddingBottom: '20px' }} />
                            <Bar dataKey="wheat" name="Wheat" fill={cropColors.wheat} radius={[4, 4, 0, 0]} />
                            <Bar dataKey="rice" name="Rice" fill={cropColors.rice} radius={[4, 4, 0, 0]} />
                            <Bar dataKey="corn" name="Corn" fill={cropColors.corn} radius={[4, 4, 0, 0]} />
                            <Bar dataKey="soybean" name="Soybean" fill={cropColors.soybean} radius={[4, 4, 0, 0]} />
                        </BarChart>
                    ) : (
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={80}
                                outerRadius={120}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '14px', fontWeight: 600 }} />
                        </PieChart>
                    )}
                </ResponsiveContainer>
            </div>

            {/* Loss Analysis */}
            <div className="card chart-card">
                <div className="chart-header">
                    <div>
                        <h3>Loss & Wastage Analysis</h3>
                        <p>Monthly breakdown by cause</p>
                    </div>
                    <div className="flex-center gap-10">
                        <div className="view-toggle-group">
                            <button
                                className={`view-btn ${lossChartView === 'area' ? 'active' : ''}`}
                                onClick={() => setLossChartView('area')}
                                title="Area View"
                            >
                                <LayoutPanelLeft size={16} />
                            </button>
                            <button
                                className={`view-btn ${lossChartView === 'bar' ? 'active' : ''}`}
                                onClick={() => setLossChartView('bar')}
                                title="Bar View"
                            >
                                <BarChart3 size={16} />
                            </button>
                            <button
                                className={`view-btn ${lossChartView === 'line' ? 'active' : ''}`}
                                onClick={() => setLossChartView('line')}
                                title="Line View"
                            >
                                <LineIcon size={16} />
                            </button>
                        </div>
                        <div className="chart-stat-badge secondary">
                            <ArrowDownRight size={14} />
                            <span>Trend: -12.4%</span>
                        </div>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={350}>
                    {lossChartView === 'area' ? (
                        <AreaChart data={lossAnalysis}>
                            <defs>
                                <linearGradient id="colorSpoilage" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorPest" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorHandling" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} unit=" T" dx={-10} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend verticalAlign="top" align="right" iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', fontWeight: 600, paddingBottom: '20px' }} />
                            <Area type="monotone" dataKey="spoilage" name="Spoilage" stackId="1" stroke="#ef4444" fill="url(#colorSpoilage)" />
                            <Area type="monotone" dataKey="pest" name="Pest Damage" stackId="1" stroke="#f59e0b" fill="url(#colorPest)" />
                            <Area type="monotone" dataKey="handling" name="Handling Loss" stackId="1" stroke="#3b82f6" fill="url(#colorHandling)" />
                        </AreaChart>
                    ) : lossChartView === 'bar' ? (
                        <BarChart data={lossAnalysis}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} unit=" T" dx={-10} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend verticalAlign="top" align="right" iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', fontWeight: 600, paddingBottom: '20px' }} />
                            <Bar dataKey="spoilage" name="Spoilage" fill="#ef4444" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="pest" name="Pest Damage" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="handling" name="Handling Loss" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    ) : (
                        <LineChart data={lossAnalysis}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} unit=" T" dx={-10} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend verticalAlign="top" align="right" iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', fontWeight: 600, paddingBottom: '20px' }} />
                            <Line type="monotone" dataKey="spoilage" name="Spoilage" stroke="#ef4444" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                            <Line type="monotone" dataKey="pest" name="Pest Damage" stroke="#f59e0b" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                            <Line type="monotone" dataKey="handling" name="Handling Loss" stroke="#3b82f6" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                        </LineChart>
                    )}
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Analytics;
