import { Building2, MapPin, Phone, Mail, User, Database } from 'lucide-react';
import { mockWarehouseDirectory } from '../../data/mockData';
import '../warehouse/Dashboard.css';
import '../warehouse/Logistics.css';

const Warehouses = () => {
    const totalCapacity = mockWarehouseDirectory.reduce((acc, w) => acc + w.totalCapacity, 0);
    const totalUsed = mockWarehouseDirectory.reduce((acc, w) => acc + w.usedCapacity, 0);
    const percentage = Math.round((totalUsed / totalCapacity) * 100);

    return (
        <div className="dashboard-page">
            <div className="dashboard-page-header">
                <h1>Warehouse Directory</h1>
                <p>View warehouse capacities and contact information</p>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-3 kpi-grid">
                <div className="card flex gap-md" style={{ padding: 'var(--space-md) var(--space-lg)' }}>
                    <div className="stat-card-icon stat-icon-primary"><Building2 size={20} /></div>
                    <div>
                        <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800 }}>{mockWarehouseDirectory.length}</div>
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>Total Warehouses</div>
                    </div>
                </div>
                <div className="card flex gap-md" style={{ padding: 'var(--space-md) var(--space-lg)' }}>
                    <div className="stat-card-icon stat-icon-accent"><Database size={20} /></div>
                    <div>
                        <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800 }}>{totalCapacity.toLocaleString()} T</div>
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>Total Network Capacity</div>
                    </div>
                </div>
                <div className="card flex gap-md" style={{ padding: 'var(--space-md) var(--space-lg)' }}>
                    <div className="stat-card-icon stat-icon-info"><Database size={20} /></div>
                    <div>
                        <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800 }}>{percentage}%</div>
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>Network Utilization</div>
                    </div>
                </div>
            </div>

            {/* Warehouse Cards */}
            <div className="warehouse-dir-grid">
                {mockWarehouseDirectory.map((w) => {
                    const usagePercent = Math.round((w.usedCapacity / w.totalCapacity) * 100);
                    const fillClass = usagePercent > 85 ? 'critical' : usagePercent > 70 ? 'high' : '';
                    return (
                        <div key={w._id} className={`card warehouse-dir-card ${w.status === 'maintenance' ? 'maintenance' : ''}`}>
                            <div className="wdc-header">
                                <h3>{w.name}</h3>
                                <span className={`badge ${w.status === 'operational' ? 'badge-success' : 'badge-warning'}`}>
                                    {w.status}
                                </span>
                            </div>
                            <div className="wdc-location">
                                <MapPin size={14} /> {w.location}
                            </div>

                            {/* Capacity Bar */}
                            <div className="wdc-capacity">
                                <div className="wdc-capacity-header">
                                    <span className="wdc-capacity-label">{w.usedCapacity.toLocaleString()} / {w.totalCapacity.toLocaleString()} tons</span>
                                    <span className="wdc-capacity-value">{usagePercent}%</span>
                                </div>
                                <div className="wdc-capacity-bar">
                                    <div className={`wdc-capacity-fill ${fillClass}`} style={{ width: `${usagePercent}%` }} />
                                </div>
                            </div>

                            {/* Crops */}
                            <div className="wdc-crops">
                                {w.crops.map((c) => (
                                    <span key={c} className="wdc-crop-tag">{c}</span>
                                ))}
                            </div>

                            {/* Contact Details */}
                            <div className="wdc-contact">
                                <div className="wdc-contact-row">
                                    <User size={14} />
                                    <span>Manager: <strong>{w.contact.manager}</strong></span>
                                </div>
                                <div className="wdc-contact-row">
                                    <Phone size={14} />
                                    <a href={`tel:${w.contact.phone}`}>{w.contact.phone}</a>
                                </div>
                                <div className="wdc-contact-row">
                                    <Mail size={14} />
                                    <a href={`mailto:${w.contact.email}`}>{w.contact.email}</a>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Warehouses;
