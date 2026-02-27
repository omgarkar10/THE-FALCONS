import { Truck, ArrowDownLeft, ArrowUpRight, Clock, CheckCircle2, Package, Loader } from 'lucide-react';
import { mockConsumerData } from '../../data/mockData';
import '../warehouse/Dashboard.css';

const statusConfig = {
    'pending': { label: 'Pending', badge: 'badge-warning', icon: Clock },
    'processing': { label: 'Processing', badge: 'badge-info', icon: Loader },
    'in-transit': { label: 'In Transit', badge: 'badge-info', icon: Truck },
    'delivered': { label: 'Delivered', badge: 'badge-success', icon: CheckCircle2 },
};

const Shipments = () => {
    const { shipments } = mockConsumerData;
    const inbound = shipments.filter(s => s.type === 'inbound');
    const outbound = shipments.filter(s => s.type === 'outbound');

    return (
        <div className="dashboard-page">
            <div className="dashboard-page-header">
                <h1>Shipments</h1>
                <p>Track your inbound and outbound shipments</p>
            </div>

            <div className="grid grid-3 kpi-grid">
                <div className="card flex gap-md" style={{ padding: 'var(--space-md) var(--space-lg)' }}>
                    <div className="stat-card-icon stat-icon-info"><Truck size={20} /></div>
                    <div>
                        <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800 }}>{shipments.length}</div>
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>Total Shipments</div>
                    </div>
                </div>
                <div className="card flex gap-md" style={{ padding: 'var(--space-md) var(--space-lg)' }}>
                    <div className="stat-card-icon stat-icon-primary"><ArrowDownLeft size={20} /></div>
                    <div>
                        <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800 }}>{inbound.length}</div>
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>Inbound</div>
                    </div>
                </div>
                <div className="card flex gap-md" style={{ padding: 'var(--space-md) var(--space-lg)' }}>
                    <div className="stat-card-icon stat-icon-accent"><ArrowUpRight size={20} /></div>
                    <div>
                        <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800 }}>{outbound.length}</div>
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>Outbound</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-2">
                {shipments.map((s) => {
                    const sc = statusConfig[s.status];
                    return (
                        <div key={s._id} className="card shipment-card">
                            <div className="shipment-header">
                                <div className="flex gap-sm">
                                    {s.type === 'inbound' ? <ArrowDownLeft size={18} style={{ color: 'var(--color-primary)' }} /> : <ArrowUpRight size={18} style={{ color: 'var(--color-accent)' }} />}
                                    <span style={{ fontWeight: 700 }}>{s.item}</span>
                                </div>
                                <span className={`badge ${sc.badge}`}>{sc.label}</span>
                            </div>
                            <div className="shipment-details">
                                <div className="shipment-row">
                                    <span className="shipment-label">Quantity</span>
                                    <span>{s.quantity} tons</span>
                                </div>
                                <div className="shipment-row">
                                    <span className="shipment-label">From</span>
                                    <span>{s.origin}</span>
                                </div>
                                <div className="shipment-row">
                                    <span className="shipment-label">To</span>
                                    <span>{s.destination}</span>
                                </div>
                                <div className="shipment-row">
                                    <span className="shipment-label">ETA</span>
                                    <span>{new Date(s.eta).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Shipments;
