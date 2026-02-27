import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Truck, MapPin, Package, Clock } from 'lucide-react';
import './TruckMap.css';

// Fix for default marker icons in Leaflet with React
// using a custom divIcon for a more premium look
const createCustomIcon = (status) => {
    let color = '#3b82f6'; // info (default)
    if (status === 'In Transit' || status === 'Dispatched') color = '#22c55e'; // success
    if (status === 'Loading') color = '#f59e0b'; // warning

    return L.divIcon({
        className: 'custom-truck-icon',
        html: `
            <div style="background-color: ${color}; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border: 2px solid white;">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-truck"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11h11l4-4h3a2 2 0 0 1 2 2v4h-2"/><path d="M15 18H9"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>
            </div>
            <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid ${color}; margin: 0 auto; margin-top: -2px;"></div>
        `,
        iconSize: [32, 40],
        iconAnchor: [16, 40],
        popupAnchor: [0, -40]
    });
};

const TruckMap = ({ trucks = [] }) => {
    const defaultCenter = [28.6139, 77.2090]; // New Delhi as default center
    const defaultZoom = 5;

    // Filter trucks that have valid coordinates
    const mapTrucks = trucks.filter(t => t.location && t.location.lat && t.location.lng);

    if (mapTrucks.length === 0) {
        return (
            <div className="map-placeholder">
                <MapPin size={48} />
                <p>No active location data available</p>
                <span>Trucks will appear here when location tracking is active</span>
            </div>
        );
    }

    return (
        <div style={{ height: '400px', width: '100%', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border)' }}>
            <MapContainer center={defaultCenter} zoom={defaultZoom} style={{ height: '100%', width: '100%', zIndex: 0 }}>
                {/* Premium Mapbox-like styled tile layer */}
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />

                {mapTrucks.map(truck => (
                    <Marker
                        key={truck._id}
                        position={[truck.location.lat, truck.location.lng]}
                        icon={createCustomIcon(truck.status)}
                    >
                        <Popup className="premium-popup">
                            <div className="truck-popup-content">
                                <div className="truck-popup-header">
                                    <strong>{truck.truckId || truck._id}</strong>
                                    <span className="badge" style={{ fontSize: '0.7em', padding: '2px 6px' }}>{truck.status}</span>
                                </div>

                                <div className="truck-popup-details">
                                    <div className="detail-row">
                                        <Package size={14} />
                                        <span>{truck.crop} ({truck.quantity} {truck.unit})</span>
                                    </div>
                                    <div className="detail-row">
                                        <MapPin size={14} />
                                        {truck.destination ? (
                                            <span>To: {truck.destination}</span>
                                        ) : (
                                            <span>From: {truck.origin}</span>
                                        )}
                                    </div>
                                    {truck.eta && (
                                        <div className="detail-row">
                                            <Clock size={14} />
                                            <span>ETA: {new Date(truck.eta).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default TruckMap;
