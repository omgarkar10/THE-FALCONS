import { useState } from 'react';
import { Bell, CheckCircle2, Filter } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import { mockAlerts } from '../../data/mockData';
import './Dashboard.css';

const severities = ['All', 'critical', 'warning', 'info'];

const columns = [
    {
        header: 'Severity',
        accessor: 'severity',
        render: (row) => (
            <span className={`badge badge-${row.severity === 'critical' ? 'danger' : row.severity === 'warning' ? 'warning' : 'info'}`}>
                {row.severity}
            </span>
        ),
    },
    { header: 'Type', accessor: 'type' },
    { header: 'Location', accessor: 'location' },
    { header: 'Message', accessor: 'message' },
    {
        header: 'Time',
        accessor: 'timestamp',
        render: (row) => new Date(row.timestamp).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
    },
    {
        header: 'Status',
        render: (row) => (
            <span className={`badge ${row.acknowledged ? 'badge-success' : 'badge-warning'}`}>
                {row.acknowledged ? 'Acknowledged' : 'Pending'}
            </span>
        ),
    },
];

const Alerts = () => {
    const [severity, setSeverity] = useState('All');

    const filtered = severity === 'All' ? mockAlerts : mockAlerts.filter(a => a.severity === severity);

    const criticalCount = mockAlerts.filter(a => a.severity === 'critical').length;
    const warningCount = mockAlerts.filter(a => a.severity === 'warning').length;
    const pendingCount = mockAlerts.filter(a => !a.acknowledged).length;

    return (
        <div className="dashboard-page">
            <div className="flex-between">
                <div className="dashboard-page-header">
                    <h1>Alerts Center</h1>
                    <p>Monitor and manage warehouse alerts</p>
                </div>
                <div className="page-actions">
                    <div className="filter-group">
                        <Filter size={16} />
                        <select className="filter-select" value={severity} onChange={(e) => setSeverity(e.target.value)}>
                            {severities.map((s) => <option key={s} value={s}>{s === 'All' ? 'All Severities' : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-3 kpi-grid">
                <div className="card flex gap-md" style={{ padding: 'var(--space-md) var(--space-lg)' }}>
                    <div className="stat-card-icon stat-icon-danger"><Bell size={20} /></div>
                    <div>
                        <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800 }}>{criticalCount}</div>
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>Critical Alerts</div>
                    </div>
                </div>
                <div className="card flex gap-md" style={{ padding: 'var(--space-md) var(--space-lg)' }}>
                    <div className="stat-card-icon stat-icon-warning"><Bell size={20} /></div>
                    <div>
                        <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800 }}>{warningCount}</div>
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>Warnings</div>
                    </div>
                </div>
                <div className="card flex gap-md" style={{ padding: 'var(--space-md) var(--space-lg)' }}>
                    <div className="stat-card-icon stat-icon-info"><CheckCircle2 size={20} /></div>
                    <div>
                        <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800 }}>{pendingCount}</div>
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>Pending Action</div>
                    </div>
                </div>
            </div>

            <DataTable columns={columns} data={filtered} searchPlaceholder="Search alerts..." />
        </div>
    );
};

export default Alerts;
