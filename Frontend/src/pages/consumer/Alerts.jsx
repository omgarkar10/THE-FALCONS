import { Bell, Truck, FileCheck, Package, DollarSign } from 'lucide-react';
import { mockConsumerData } from '../../data/mockData';
import '../warehouse/Dashboard.css';

const typeIcons = {
    shipment: Truck,
    quality: FileCheck,
    stock: Package,
    billing: DollarSign,
};

const typeColors = {
    shipment: 'stat-icon-info',
    quality: 'stat-icon-success',
    stock: 'stat-icon-primary',
    billing: 'stat-icon-accent',
};

const ConsumerAlerts = () => {
    const { notifications } = mockConsumerData;
    const unread = notifications.filter(n => !n.read).length;

    return (
        <div className="dashboard-page">
            <div className="dashboard-page-header">
                <h1>Notifications</h1>
                <p>{unread} unread notifications</p>
            </div>

            <div className="notification-list">
                {notifications.map((n) => {
                    const Icon = typeIcons[n.type] || Bell;
                    return (
                        <div key={n._id} className={`card notification-card ${!n.read ? 'unread' : ''}`}>
                            <div className={`stat-card-icon ${typeColors[n.type]}`}>
                                <Icon size={20} />
                            </div>
                            <div className="notification-body">
                                <p style={{ fontWeight: !n.read ? 600 : 400 }}>{n.message}</p>
                                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>
                                    {new Date(n.timestamp).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            {!n.read && <div className="notification-unread-dot" />}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ConsumerAlerts;
