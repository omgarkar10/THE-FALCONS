import { useState, useMemo } from 'react';
import { Building2, MapPin, Phone, Mail, User, Database, Activity, Map as MapIcon, Search } from 'lucide-react';
import { mockWarehouseDirectory } from '../../data/mockData';
import WarehousesMap from '../../components/common/WarehousesMap';
import '../warehouse/Dashboard.css';
import '../warehouse/Logistics.css';
import './Warehouses.css'; // Add dedicated premium styling

const Warehouses = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCrop, setFilterCrop] = useState('All');

    // Derived full list of unique crops for the filter
    const allCrops = useMemo(() => {
        const crops = new Set();
        mockWarehouseDirectory.forEach(w => w.crops.forEach(c => crops.add(c)));
        return ['All', ...Array.from(crops).sort()];
    }, []);

    // Filter logic
    const filteredWarehouses = mockWarehouseDirectory.filter(w => {
        const matchesSearch = w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            w.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            w.contact.manager.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCrop = filterCrop === 'All' || w.crops.includes(filterCrop);
        return matchesSearch && matchesCrop;
    });

    const totalCapacity = mockWarehouseDirectory.reduce((acc, w) => acc + w.totalCapacity, 0);
    const totalUsed = mockWarehouseDirectory.reduce((acc, w) => acc + w.usedCapacity, 0);
    const percentage = Math.round((totalUsed / totalCapacity) * 100);
    const operationalCount = mockWarehouseDirectory.filter(w => w.status === 'operational').length;

    return (
        <div className="dashboard-page warehouses-premium-page">
            <div className="flex-between">
                <div className="dashboard-page-header">
                    <h1 className="gradient-text">Storage Availability & Logistics</h1>
                    <p>Real-time network capacity tracking and interactive warehouse directory</p>
                </div>
            </div>

            {/* Premium Overview KPI Cards */}
            <div className="grid grid-3 kpi-grid premium-kpi-grid">
                <div className="card premium-kpi-card glassmorphism">
                    <div className="kpi-icon-wrapper blue-glow">
                        <Database size={24} />
                    </div>
                    <div>
                        <div className="kpi-value">{totalCapacity.toLocaleString()} <span className="kpi-unit">Tons</span></div>
                        <div className="kpi-label">Total Network Capacity</div>
                    </div>
                </div>

                <div className="card premium-kpi-card glassmorphism">
                    <div className="kpi-icon-wrapper green-glow">
                        <Activity size={24} />
                    </div>
                    <div>
                        <div className="kpi-value">{percentage}%</div>
                        <div className="kpi-label">Network Utilization</div>
                        <div className="capacity-mini-bar">
                            <div className="capacity-mini-fill" style={{ width: `${percentage}%` }} />
                        </div>
                    </div>
                </div>

                <div className="card premium-kpi-card glassmorphism">
                    <div className="kpi-icon-wrapper purple-glow">
                        <Building2 size={24} />
                    </div>
                    <div>
                        <div className="kpi-value">{operationalCount} <span className="kpi-unit">/ {mockWarehouseDirectory.length}</span></div>
                        <div className="kpi-label">Operational Warehouses</div>
                    </div>
                </div>
            </div>

            {/* Interactive Map Section */}
            <div className="card map-card glassmorphism">
                <div className="map-card-header">
                    <h2><MapIcon size={20} /> Network Geo-Distribution</h2>
                </div>
                {/* Embedded React Leaflet Component */}
                <WarehousesMap warehouses={filteredWarehouses} />
            </div>

            {/* Interactive Directory Section Component */}
            <div className="directory-header-actions">
                <h2>Available Storage Facilities</h2>
                <div className="directory-filters">
                    <div className="search-bar premium-search">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search by name, location, or manager..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="premium-select"
                        value={filterCrop}
                        onChange={(e) => setFilterCrop(e.target.value)}
                    >
                        {allCrops.map(c => <option key={c} value={c}>{c === 'All' ? 'All Crop Types' : c}</option>)}
                    </select>
                </div>
            </div>

            <div className="warehouse-dir-grid premium-dir-grid">
                {filteredWarehouses.length === 0 ? (
                    <div className="empty-state">No warehouses match your search criteria.</div>
                ) : (
                    filteredWarehouses.map((w) => {
                        const usagePercent = Math.round((w.usedCapacity / w.totalCapacity) * 100);
                        const fillClass = usagePercent > 85 ? 'critical-glow' : usagePercent > 70 ? 'warning-glow' : 'success-glow';
                        return (
                            <div key={w._id} className={`card premium-warehouse-card ${w.status === 'maintenance' ? 'maintenance-blur' : ''}`}>
                                <div className="wdc-header">
                                    <h3>{w.name}</h3>
                                    <span className={`status-dot ${w.status === 'operational' ? 'pulse-green' : 'pulse-orange'}`} title={w.status} />
                                </div>
                                <div className="wdc-location">
                                    <MapPin size={16} className="loc-icon" /> {w.location}
                                </div>

                                {/* Advanced Interactive Capacity Bar */}
                                <div className="premium-capacity-container">
                                    <div className="premium-capacity-header">
                                        <span className="premium-capacity-label">Storage Utilized</span>
                                        <span className={`premium-capacity-value ${fillClass.split('-')[0]}`}>{usagePercent}%</span>
                                    </div>
                                    <div className="premium-capacity-bar-bg">
                                        <div className={`premium-capacity-fill ${fillClass}`} style={{ width: `${usagePercent}%` }} />
                                    </div>
                                    <div className="premium-capacity-raw">
                                        {w.usedCapacity.toLocaleString()} / {w.totalCapacity.toLocaleString()} tons
                                    </div>
                                </div>

                                <div className="premium-crops">
                                    {w.crops.map((c) => (
                                        <span key={c} className="premium-crop-tag">{c}</span>
                                    ))}
                                </div>

                                <div className="premium-contact">
                                    <div className="premium-contact-row manager-row">
                                        <div className="manager-avatar">{w.contact.manager.charAt(0)}</div>
                                        <div className="manager-info">
                                            <span className="manager-title">Site Manager</span>
                                            <span className="manager-name">{w.contact.manager}</span>
                                        </div>
                                    </div>
                                    <div className="contact-actions">
                                        <a href={`tel:${w.contact.phone}`} className="action-button call-btn"><Phone size={14} /> Call</a>
                                        <a href={`mailto:${w.contact.email}`} className="action-button email-btn"><Mail size={14} /> Email</a>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default Warehouses;
