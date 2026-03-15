import { useState, useMemo, useEffect } from 'react';
import { MapPin, Search, Phone, Mail, ChevronRight, Filter, Star, Info, LayoutGrid, Map as MapIcon, ExternalLink } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

import { mockWarehouseDirectory } from '../../data/mockData';
import './Warehouses.css';

const Reveal = ({ children, delay = 0 }) => {
    return (
        <div className="reveal-up" style={{ animationDelay: `${delay}s` }}>
            {children}
        </div>
    );
};

const Warehouses = () => {
    const warehouses = mockWarehouseDirectory;
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'

    const filteredWarehouses = useMemo(() => {
        return warehouses.filter(w => {
            const matchesSearch = w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                w.location.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesFilter = filterStatus === 'all' || w.status === filterStatus;
            return matchesSearch && matchesFilter;
        });
    }, [warehouses, searchQuery, filterStatus]);

    return (
        <div className="dashboard-page warehouses-premium-v2">
            <div className="dashboard-page-header">
                <div className="header-main">
                    <Reveal>
                        <h1 className="gradient-text">Facility Network</h1>
                        <p className="subtitle">Discover state-of-the-art storage facilities across our nationwide mesh</p>
                    </Reveal>
                </div>
                <div className="view-toggle card">
                    <button 
                        className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                        onClick={() => setViewMode('grid')}
                    >
                        <LayoutGrid size={16} />
                        <span>Grid</span>
                    </button>
                    <button 
                        className={`toggle-btn ${viewMode === 'map' ? 'active' : ''}`}
                        onClick={() => setViewMode('map')}
                    >
                        <MapIcon size={16} />
                        <span>Map</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-3 kpi-grid">
                <Reveal delay={0.1}>
                    <div className="card stat-mini premium">
                        <div className="stat-mini-icon blue-glow"><MapPin size={24} /></div>
                        <div className="stat-content">
                            <span className="stat-label">Network Nodes</span>
                            <h3 className="stat-val">{warehouses.length}</h3>
                        </div>
                    </div>
                </Reveal>
                <Reveal delay={0.2}>
                    <div className="card stat-mini premium">
                        <div className="stat-mini-icon green-glow"><Star size={24} fill="currentColor" /></div>
                        <div className="stat-content">
                            <span className="stat-label">Active Storage</span>
                            <h3 className="stat-val">{warehouses.filter(w => w.status === 'operational').length}</h3>
                        </div>
                    </div>
                </Reveal>
                <Reveal delay={0.3}>
                    <div className="card stat-mini premium">
                        <div className="stat-mini-icon purple-glow"><Info size={24} /></div>
                        <div className="stat-content">
                            <span className="stat-label">Total Volume</span>
                            <h3 className="stat-val">{(warehouses.reduce((acc, w) => acc + w.totalCapacity, 0) / 1000).toFixed(1)}k <span className="unit">tons</span></h3>
                        </div>
                    </div>
                </Reveal>
            </div>

            <div className="directory-controls card">
                <div className="premium-search-container">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search by name, region, or crop..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="premium-input"
                    />
                </div>
                <div className="filter-wrapper">
                    <Filter size={16} className="filter-icon" />
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="premium-select">
                        <option value="all">All Facilities</option>
                        <option value="operational">Operational Only</option>
                        <option value="maintenance">Maintenance</option>
                    </select>
                </div>
            </div>

            <div className={`warehouses-content ${viewMode}`}>
                <div className="warehouses-list-panel">
                    <div className="premium-grid">
                        {filteredWarehouses.map((w, i) => (
                            <Reveal key={w._id} delay={i * 0.08}>
                                <div className={`premium-w-card ${w.status}`}>
                                    <div className="w-card-header">
                                        <div className="w-status">
                                            <span className={`status-dot pulse-${w.status === 'operational' ? 'green' : 'orange'}`} />
                                            <span className="status-label">{w.status}</span>
                                        </div>
                                        <div className="w-id">#AV-00{w._id}</div>
                                    </div>

                                    <div className="w-main-info">
                                        <h3 className="w-name">{w.name}</h3>
                                        <div className="w-location">
                                            <MapPin size={14} />
                                            <span>{w.location}</span>
                                        </div>
                                    </div>

                                    <div className="w-stats-compact">
                                        <div className="w-stat-item">
                                            <span className="label">Units</span>
                                            <span className="val">{w.units}</span>
                                        </div>
                                        <div className="w-stat-item">
                                            <span className="label">Utilization</span>
                                            <span className="val">{((w.usedCapacity / w.totalCapacity) * 100).toFixed(0)}%</span>
                                        </div>
                                    </div>

                                    <div className="w-capacity-progress">
                                        <div className="progress-bar">
                                            <div 
                                                className="progress-fill" 
                                                style={{ width: `${(w.usedCapacity / w.totalCapacity) * 100}%` }} 
                                            />
                                        </div>
                                    </div>

                                    <div className="w-tags">
                                        {w.crops.map(c => <span key={c} className="tag">{c}</span>)}
                                    </div>

                                    <div className="w-footer">
                                        <div className="w-manager">
                                            <div className="manager-avatar">{w.contact.manager[0]}</div>
                                            <div className="manager-meta">
                                                <span className="m-label">Manager</span>
                                                <span className="m-name">{w.contact.manager}</span>
                                            </div>
                                        </div>
                                        <button className="w-action-btn">
                                            <ExternalLink size={18} />
                                        </button>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>

                <div className="warehouses-map-panel">
                    <div className="map-container-wrap card">
                        <MapContainer 
                            center={[23.5937, 78.9629]} 
                            zoom={5} 
                            scrollWheelZoom={true} 
                            style={{ height: '100%', width: '100%' }}
                        >
                            <TileLayer
                                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                                attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                            />
                            {filteredWarehouses.map(w => (
                                <Marker key={w._id} position={w.coordinates}>
                                    <Popup className="premium-popup">
                                        <div className="map-popup-content">
                                            <h4>{w.name}</h4>
                                            <p>{w.location}</p>
                                            <div className="popup-stats">
                                                <span>Capacity: {w.totalCapacity}t</span>
                                                <span>Status: {w.status}</span>
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Warehouses;
