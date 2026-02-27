import { Truck, ArrowDownLeft, ArrowUpRight, MapPin, Clock, Package, Calendar } from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import DataTable from '../../components/common/DataTable';
import { mockLogistics } from '../../data/mockData';
import './Dashboard.css';
import './Logistics.css';

const statusBadge = {
    'In Transit': 'badge-info',
    'Loading': 'badge-warning',
    'Scheduled': 'badge-secondary',
    'Dispatched': 'badge-success',
    'Pending': 'badge-accent',
};

const priorityBadge = {
    'High': 'badge-danger',
    'Medium': 'badge-warning',
    'Low': 'badge-info',
};

const dispatchColumns = [
    { header: 'Shipment', accessor: '_id' },
    { header: 'Destination', accessor: 'destination' },
    { header: 'Crop', accessor: 'crop' },
    { header: 'Quantity', accessor: 'quantity', render: (row) => `${row.quantity} ${row.unit}` },
    { header: 'Date', accessor: 'date', render: (row) => new Date(row.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) },
    { header: 'Time', accessor: 'time' },
    {
        header: 'Priority',
        accessor: 'priority',
        render: (row) => (
            <span className={`badge ${priorityBadge[row.priority] || 'badge-info'}`}>{row.priority}</span>
        ),
    },
];

const Logistics = () => {
    const { incomingShipments, outgoingShipments, dispatchSchedule, stats } = mockLogistics;

    return (
        <div className="dashboard-page">
            <div className="dashboard-page-header">
                <h1>Logistics & Dispatch</h1>
                <p>Manage incoming and outgoing shipments</p>
            </div>

            {/* KPI Stats */}
            <div className="grid grid-4 kpi-grid">
                <StatCard title="Incoming" value={stats.totalInbound} icon={ArrowDownLeft} color="primary" trend="+2" />
                <StatCard title="Outgoing" value={stats.totalOutbound} icon={ArrowUpRight} color="accent" trend="+1" />
                <StatCard title="In Transit" value={stats.inTransit} icon={Truck} color="info" trend="0" />
                <StatCard title="Active Trucks" value={stats.trucksActive} icon={Truck} color="success" trend="+3" />
            </div>

            {/* Incoming & Outgoing Cards */}
            <div className="grid grid-2 logistics-shipments">
                {/* Incoming */}
                <div className="card logistics-section">
                    <div className="chart-header">
                        <div>
                            <h3>📦 Incoming Shipments</h3>
                            <p>Shipments arriving at the warehouse</p>
                        </div>
                    </div>
                    <div className="shipment-list">
                        {incomingShipments.map((s) => (
                            <div key={s._id} className="logistics-card incoming">
                                <div className="logistics-card-header">
                                    <span className="logistics-id">{s._id}</span>
                                    <span className={`badge ${statusBadge[s.status] || 'badge-info'}`}>{s.status}</span>
                                </div>
                                <div className="logistics-details">
                                    <div className="logistics-row"><MapPin size={14} /> <span>{s.origin}</span></div>
                                    <div className="logistics-row"><Package size={14} /> <span>{s.crop} · {s.variety} – {s.quantity} {s.unit}</span></div>
                                    <div className="logistics-row"><Clock size={14} /> <span>ETA: {new Date(s.eta).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span></div>
                                    <div className="logistics-row"><Truck size={14} /> <span>{s.truckId}</span></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Outgoing */}
                <div className="card logistics-section">
                    <div className="chart-header">
                        <div>
                            <h3>🚚 Outgoing Shipments</h3>
                            <p>Shipments dispatched from the warehouse</p>
                        </div>
                    </div>
                    <div className="shipment-list">
                        {outgoingShipments.map((s) => (
                            <div key={s._id} className="logistics-card outgoing">
                                <div className="logistics-card-header">
                                    <span className="logistics-id">{s._id}</span>
                                    <span className={`badge ${statusBadge[s.status] || 'badge-info'}`}>{s.status}</span>
                                </div>
                                <div className="logistics-details">
                                    <div className="logistics-row"><MapPin size={14} /> <span>{s.destination}</span></div>
                                    <div className="logistics-row"><Package size={14} /> <span>{s.crop} · {s.variety} – {s.quantity} {s.unit}</span></div>
                                    <div className="logistics-row"><Clock size={14} /> <span>Departure: {new Date(s.departure).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span></div>
                                    <div className="logistics-row"><Truck size={14} /> <span>{s.truckId}</span></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Truck Tracking Placeholder */}
            <div className="card truck-tracking-card">
                <div className="chart-header">
                    <div>
                        <h3>Truck Tracking</h3>
                        <p>Live vehicle locations</p>
                    </div>
                </div>
                <div className="map-placeholder">
                    <MapPin size={48} />
                    <p>Map integration placeholder</p>
                    <span>Connect Google Maps or Mapbox for live tracking</span>
                </div>
            </div>

            {/* Dispatch Schedule */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div className="chart-header" style={{ padding: 'var(--space-lg) var(--space-lg) 0' }}>
                    <div>
                        <h3>📅 Dispatch Schedule</h3>
                        <p>Upcoming outbound shipments</p>
                    </div>
                </div>
                <DataTable columns={dispatchColumns} data={dispatchSchedule} searchPlaceholder="Search dispatches..." />
            </div>
        </div>
    );
};

export default Logistics;
