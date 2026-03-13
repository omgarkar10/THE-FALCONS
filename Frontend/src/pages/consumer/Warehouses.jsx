import { useState, useMemo } from 'react';
import { MapPin, Search, Phone, Mail, ChevronRight, Filter, Star, Info } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { mockConsumerData } from '../../data/mockData';
import './Warehouses.css';

const Warehouses = () => {
    const { warehouses } = mockConsumerData;
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const filteredWarehouses = useMemo(() => {
        return warehouses.filter(w => {
            const matchesSearch = w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                w.location.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesFilter = filterStatus === 'all' || w.status === filterStatus;
            return matchesSearch && matchesFilter;
        });
    }, [warehouses, searchQuery, filterStatus]);

    return (
        <div className="dashboard-page warehouses-premium">
            <div className="dashboard-page-header">
                <div>
                    <h1>Facility Directory</h1>
                    <p>Discover and manage your storage across our network</p>
                </div>
            </div>

            <div className="grid grid-3 kpi-grid">
                <div className="card stat-mini reveal-up">
                    <div className="stat-mini-icon blue"><MapPin size={20} /></div>
                    <div>
                        <span className="stat-mini-label">Total Facilities</span>
                        <h3 className="stat-mini-val">{warehouses.length}</h3>
                    </div>
                </div>
                <div className="card stat-mini reveal-up" style={{ animationDelay: '0.1s' }}>
                    <div className="stat-mini-icon green"><Star size={20} /></div>
                    <div>
                        <span className="stat-mini-label">Active Storage</span>
                        <h3 className="stat-mini-val">{warehouses.filter(w => w.status === 'active').length}</h3>
                    </div>
                </div>
                <div className="card stat-mini reveal-up" style={{ animationDelay: '0.2s' }}>
                    <div className="stat-mini-icon orange"><Info size={20} /></div>
                    <div>
                        <span className="stat-mini-label">Maintenance</span>
                        <h3 className="stat-mini-val">{warehouses.filter(w => w.status === 'maintenance').length}</h3>
                    </div>
                </div>
            </div>

            <div className="directory-controls">
                <div className="premium-search-bar">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search by name or location..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="filter-group">
                    <Filter size={16} />
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="premium-select">
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="maintenance">Maintenance</option>
                    </select>
                </div>
            </div>

            <div className="warehouses-layout">
                <div className="warehouses-list-panel">
                    <div className="grid-list">
                        {filteredWarehouses.map((w, i) => (
                            <div key={w._id} className={`premium-w-card reveal-up ${w.status}`} style={{ animationDelay: `${i * 0.05}s` }}>
                                <div className="w-card-header">
                                    <div className="w-status-indicator">
                                        <span className={`status-dot ${w.status}`} />
                                        {w.status}
                                    </div>
                                    <div className="w-rating">
                                        <Star size={12} fill="#f59e0b" color="#f59e0b" />
                                        <span>4.8</span>
                                    </div>
                                </div>

                                <h3 className="w-name">{w.name}</h3>
                                <div className="w-location">
                                    <MapPin size={14} />
                                    <span>{w.location}</span>
                                </div>

                                <div className="w-capacity-info">
                                    <div className="w-cap-header">
                                        <span>Capacity Utilization</span>
                                        <span>{w.capacity}%</span>
                                    </div>
                                    <div className="w-cap-bar">
                                        <div className="w-cap-fill" style={{ width: `${w.capacity}%`, background: w.capacity > 90 ? '#ef4444' : w.capacity > 70 ? '#f59e0b' : '#22c55e' }} />
                                    </div>
                                </div>

                                <div className="w-crops">
                                    {w.crops.slice(0, 3).map(c => (
                                        <span key={c} className="w-crop-tag">{c}</span>
                                    ))}
                                    {w.crops.length > 3 && <span className="w-crop-tag more">+{w.crops.length - 3} more</span>}
                                </div>

                                <div className="w-footer">
                                    <div className="w-manager">
                                        <div className="w-avatar">{w.manager.name[0]}</div>
                                        <div className="w-manager-info">
                                            <span className="w-m-label">Manager</span>
                                            <span className="w-m-name">{w.manager.name}</span>
                                        </div>
                                    </div>
                                    <button className="w-details-btn">
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Map Panel */}
                <div className="warehouses-map-panel">
                    <div className="map-container-wrap card">
                        <MapContainer center={[18.5204, 73.8567]} zoom={7} scrollWheelZoom={false} style={{ height: '100%', width: '100%', borderRadius: '12px' }}>
                            <TileLayer
                                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                            />
                            {filteredWarehouses.map(w => (
                                <Marker key={w._id} position={[18.52 + Math.random() * 2, 73.85 + Math.random() * 2]}>
                                    <Popup>
                                        <div className="map-popup">
                                            <strong>{w.name}</strong><br />
                                            {w.location}
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
