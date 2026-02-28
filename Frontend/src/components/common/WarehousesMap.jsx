import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Phone, Mail, User } from 'lucide-react';

// Custom Map Marker Icon (fixing default Leaflet icon issues in React)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// A component to automatically fit the map bounds to show all markers
const FitBounds = ({ warehouses }) => {
    const map = useMap();

    useEffect(() => {
        if (warehouses.length > 0) {
            const bounds = L.latLngBounds(warehouses.map((w) => w.coordinates));
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [map, warehouses]);

    return null;
};

const WarehousesMap = ({ warehouses }) => {
    if (!warehouses || warehouses.length === 0) return null;

    // Approximate Center of India for generic fallback
    const center = [20.5937, 78.9629];

    return (
        <div className="warehouse-map-container" style={{ height: '400px', width: '100%', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-md)', marginBottom: 'var(--space-xl)' }}>
            <MapContainer center={center} zoom={5} style={{ height: '100%', width: '100%', zIndex: 0 }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <FitBounds warehouses={warehouses} />
                {warehouses.map((w) => (
                    <Marker key={w._id} position={w.coordinates}>
                        <Popup className="warehouse-popup">
                            <div style={{ minWidth: '200px' }}>
                                <h3 style={{ margin: '0 0 8px 0', fontSize: '1rem', color: 'var(--color-text-primary)' }}>{w.name}</h3>
                                <p style={{ margin: '0 0 12px 0', color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>{w.location}</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <User size={12} style={{ color: 'var(--color-primary)' }} /> <strong>{w.contact.manager}</strong>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Phone size={12} style={{ color: 'var(--color-primary)' }} /> <a href={`tel:${w.contact.phone}`}>{w.contact.phone}</a>
                                    </div>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default WarehousesMap;
