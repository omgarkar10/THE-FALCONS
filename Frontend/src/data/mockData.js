// Mock data structured to mirror MongoDB document shapes

export const mockInventory = [
    { _id: '1', name: 'Organic Wheat', category: 'Grains', location: 'Silo A', quantity: 2450, unit: 'tons', qualityStatus: 'Good', lastChecked: '2026-02-27T10:30:00Z', temperature: 22.1, humidity: 58 },
    { _id: '2', name: 'Basmati Rice', category: 'Grains', location: 'Silo B', quantity: 1800, unit: 'tons', qualityStatus: 'Warning', lastChecked: '2026-02-27T09:15:00Z', temperature: 24.5, humidity: 68 },
    { _id: '3', name: 'Yellow Corn', category: 'Grains', location: 'Silo C', quantity: 3100, unit: 'tons', qualityStatus: 'Good', lastChecked: '2026-02-27T11:00:00Z', temperature: 21.8, humidity: 55 },
    { _id: '4', name: 'Soybean', category: 'Oilseeds', location: 'Silo D', quantity: 950, unit: 'tons', qualityStatus: 'Critical', lastChecked: '2026-02-26T16:45:00Z', temperature: 28.3, humidity: 75 },
    { _id: '5', name: 'Fresh Apples', category: 'Fruits', location: 'Cold Room 1', quantity: 420, unit: 'tons', qualityStatus: 'Good', lastChecked: '2026-02-27T08:00:00Z', temperature: 2.5, humidity: 90 },
    { _id: '6', name: 'Potatoes', category: 'Vegetables', location: 'Cold Room 2', quantity: 680, unit: 'tons', qualityStatus: 'Good', lastChecked: '2026-02-27T07:30:00Z', temperature: 8.0, humidity: 85 },
    { _id: '7', name: 'Cotton Bales', category: 'Fibers', location: 'Warehouse B', quantity: 1200, unit: 'bales', qualityStatus: 'Good', lastChecked: '2026-02-26T14:00:00Z', temperature: 23.0, humidity: 45 },
    { _id: '8', name: 'Sunflower Seeds', category: 'Oilseeds', location: 'Silo E', quantity: 560, unit: 'tons', qualityStatus: 'Warning', lastChecked: '2026-02-27T06:00:00Z', temperature: 25.1, humidity: 62 },
];

export const mockSensorReadings = {
    temperature: [
        { time: 'Mon', siloA: 22.1, siloB: 24.5, siloC: 21.8, coldRoom: 2.5 },
        { time: 'Tue', siloA: 22.4, siloB: 24.2, siloC: 22.0, coldRoom: 2.8 },
        { time: 'Wed', siloA: 22.0, siloB: 23.8, siloC: 21.5, coldRoom: 2.3 },
        { time: 'Thu', siloA: 22.8, siloB: 24.8, siloC: 22.3, coldRoom: 3.0 },
        { time: 'Fri', siloA: 22.3, siloB: 24.1, siloC: 21.9, coldRoom: 2.6 },
        { time: 'Sat', siloA: 23.1, siloB: 25.2, siloC: 22.7, coldRoom: 2.9 },
        { time: 'Sun', siloA: 22.6, siloB: 24.6, siloC: 22.1, coldRoom: 2.4 },
    ],
    humidity: [
        { time: 'Mon', siloA: 58, siloB: 68, siloC: 55, coldRoom: 90 },
        { time: 'Tue', siloA: 60, siloB: 66, siloC: 57, coldRoom: 88 },
        { time: 'Wed', siloA: 57, siloB: 64, siloC: 54, coldRoom: 91 },
        { time: 'Thu', siloA: 62, siloB: 70, siloC: 58, coldRoom: 89 },
        { time: 'Fri', siloA: 59, siloB: 67, siloC: 56, coldRoom: 90 },
        { time: 'Sat', siloA: 63, siloB: 72, siloC: 60, coldRoom: 87 },
        { time: 'Sun', siloA: 61, siloB: 69, siloC: 57, coldRoom: 92 },
    ],
};

export const mockAlerts = [
    { _id: '1', type: 'Temperature', severity: 'critical', location: 'Silo D', message: 'Temperature exceeded 28°C threshold', timestamp: '2026-02-27T11:45:00Z', acknowledged: false },
    { _id: '2', type: 'Humidity', severity: 'warning', location: 'Silo B', message: 'Humidity level rising above 65%', timestamp: '2026-02-27T10:30:00Z', acknowledged: false },
    { _id: '3', type: 'Stock Level', severity: 'info', location: 'Cold Room 1', message: 'Apple stock below 500 tons', timestamp: '2026-02-27T09:15:00Z', acknowledged: true },
    { _id: '4', type: 'Quality', severity: 'warning', location: 'Silo E', message: 'Sunflower seed moisture content elevated', timestamp: '2026-02-27T08:00:00Z', acknowledged: false },
    { _id: '5', type: 'Sensor', severity: 'critical', location: 'Silo D', message: 'CO2 sensor reading anomaly detected', timestamp: '2026-02-27T07:30:00Z', acknowledged: true },
    { _id: '6', type: 'Maintenance', severity: 'info', location: 'Loading Dock', message: 'Scheduled maintenance in 2 days', timestamp: '2026-02-27T06:00:00Z', acknowledged: true },
];

export const mockSiloStatus = [
    { id: 'silo-a', name: 'Silo A', crop: 'Wheat', status: 'normal', capacity: 78, temperature: 22.4, humidity: 64.2, co2: 412 },
    { id: 'silo-b', name: 'Silo B', crop: 'Rice', status: 'warning', capacity: 85, temperature: 24.5, humidity: 68.1, co2: 458 },
    { id: 'silo-c', name: 'Silo C', crop: 'Corn', status: 'normal', capacity: 62, temperature: 21.8, humidity: 55.3, co2: 395 },
    { id: 'silo-d', name: 'Silo D', crop: 'Soybean', status: 'critical', capacity: 45, temperature: 28.3, humidity: 75.0, co2: 520 },
    { id: 'silo-e', name: 'Silo E', crop: 'Sunflower', status: 'warning', capacity: 55, temperature: 25.1, humidity: 62.0, co2: 430 },
    { id: 'cold-1', name: 'Cold Room 1', crop: 'Apples', status: 'normal', capacity: 70, temperature: 2.5, humidity: 90.0, co2: 320 },
    { id: 'cold-2', name: 'Cold Room 2', crop: 'Potatoes', status: 'normal', capacity: 68, temperature: 8.0, humidity: 85.0, co2: 340 },
    { id: 'loading', name: 'Loading Dock', crop: 'Various', status: 'active', capacity: 30, temperature: 23.0, humidity: 50.0, co2: 400 },
];

export const mockDashboardStats = {
    totalStock: 11160,
    capacityUsed: 72,
    activeSensors: 10,
    criticalAlerts: 3,
    stockTrend: '+5.2%',
    capacityTrend: '+2.1%',
    sensorTrend: '-1',
    alertTrend: '+2',
};

export const mockIoTSensors = [
    { id: 'IOT-001', name: 'Temp Sensor A1-01', location: 'Silo A1', type: 'Temperature', battery: 92, signal: 98, lastPing: '30s ago', status: 'online', pingInterval: 60, thresholds: { min: 15, max: 28 }, firmware: 'v1.2.4' },
    { id: 'IOT-002', name: 'Humidity Sensor A1-02', location: 'Silo A1', type: 'Humidity', battery: 85, signal: 95, lastPing: '45s ago', status: 'online', pingInterval: 120, thresholds: { min: 40, max: 70 }, firmware: 'v1.2.4' },
    { id: 'IOT-003', name: 'CO2 Sensor A2-01', location: 'Silo A2', type: 'Gas', battery: 78, signal: 88, lastPing: '1m ago', status: 'online', pingInterval: 180, thresholds: { min: 300, max: 600 }, firmware: 'v1.1.8' },
    { id: 'IOT-004', name: 'Moisture Sensor B1-01', location: 'Silo B1', type: 'Moisture', battery: 45, signal: 72, lastPing: '2m ago', status: 'online', pingInterval: 300, thresholds: { min: 10, max: 30 }, firmware: 'v2.0.1' },
    { id: 'IOT-005', name: 'Temp Sensor B2-01', location: 'Silo B2', type: 'Temperature', battery: 22, signal: 55, lastPing: '5m ago', status: 'warning', pingInterval: 60, thresholds: { min: 15, max: 28 }, firmware: 'v1.2.4' },
    { id: 'IOT-006', name: 'Multi Sensor B3-01', location: 'Silo B3', type: 'Multi', battery: 67, signal: 82, lastPing: '1m ago', status: 'online', pingInterval: 60, thresholds: { min: 0, max: 100 }, firmware: 'v2.1.0' },
    { id: 'IOT-007', name: 'Temp Sensor C1-01', location: 'Unit C1', type: 'Temperature', battery: 0, signal: 0, lastPing: '2h ago', status: 'offline', pingInterval: 60, thresholds: { min: 15, max: 28 }, firmware: 'v1.2.2' },
    { id: 'IOT-008', name: 'Humidity Sensor C2-01', location: 'Unit C2', type: 'Humidity', battery: 88, signal: 91, lastPing: '3m ago', status: 'online', pingInterval: 120, thresholds: { min: 40, max: 70 }, firmware: 'v1.2.4' },
    { id: 'IOT-009', name: 'CO2 Sensor D1-01', location: 'Warehouse D1', type: 'Gas', battery: 75, signal: 86, lastPing: '1m ago', status: 'online', pingInterval: 180, thresholds: { min: 300, max: 600 }, firmware: 'v1.1.8' },
    { id: 'IOT-010', name: 'Vibration Sensor E1-01', location: 'Conveyor E1', type: 'Vibration', battery: 52, signal: 68, lastPing: '10m ago', status: 'warning', pingInterval: 10, thresholds: { min: 0, max: 5 }, firmware: 'v3.0.1' },
];

export const mockGrainDistribution = [
    { name: 'Wheat', value: 2450, fill: '#155e2b' },
    { name: 'Rice', value: 1800, fill: '#22c55e' },
    { name: 'Corn', value: 3100, fill: '#f06418' },
    { name: 'Soybean', value: 950, fill: '#f59e0b' },
    { name: 'Sunflower', value: 560, fill: '#3b82f6' },
    { name: 'Other', value: 2300, fill: '#94a3b8' },
];

export const mockAnalytics = {
    throughput: { value: 1240, unit: 'tons/day', trend: '+8.3%' },
    avgStorageDuration: { value: 45, unit: 'days', trend: '-3.2%' },
    lossRate: { value: 1.2, unit: '%', trend: '-0.5%' },
    capacityUtilization: { value: 72, unit: '%', trend: '+2.1%' },
    storageTrends: [
        { month: 'Sep', wheat: 2100, rice: 1500, corn: 2800, soybean: 900 },
        { month: 'Oct', wheat: 2200, rice: 1600, corn: 2900, soybean: 850 },
        { month: 'Nov', wheat: 2350, rice: 1700, corn: 3000, soybean: 920 },
        { month: 'Dec', wheat: 2400, rice: 1750, corn: 3050, soybean: 940 },
        { month: 'Jan', wheat: 2380, rice: 1780, corn: 3080, soybean: 930 },
        { month: 'Feb', wheat: 2450, rice: 1800, corn: 3100, soybean: 950 },
    ],
    lossAnalysis: [
        { month: 'Sep', spoilage: 18, pest: 8, handling: 12 },
        { month: 'Oct', spoilage: 15, pest: 10, handling: 9 },
        { month: 'Nov', spoilage: 12, pest: 6, handling: 11 },
        { month: 'Dec', spoilage: 14, pest: 7, handling: 8 },
        { month: 'Jan', spoilage: 10, pest: 5, handling: 10 },
        { month: 'Feb', spoilage: 8, pest: 4, handling: 7 },
    ],
};

// Consumer-specific mock data
export const mockConsumerData = {
    myStock: [
        { _id: '1', name: 'Organic Wheat', location: 'Silo A', quantity: 350, quality: 'Premium', storageCost: 245, storedSince: '2026-01-15T00:00:00Z' },
        { _id: '2', name: 'Basmati Rice', location: 'Silo B', quantity: 200, quality: 'Standard', storageCost: 180, storedSince: '2026-02-01T00:00:00Z' },
        { _id: '3', name: 'Fresh Apples', location: 'Cold Room 1', quantity: 80, quality: 'Premium', storageCost: 320, storedSince: '2026-02-10T00:00:00Z' },
    ],
    stats: {
        totalStock: 630,
        activeShipments: 3,
        avgQuality: 92,
        monthlyCost: 745,
        stockTrend: '+12%',
        shipmentTrend: '+1',
        qualityTrend: '+2%',
        costTrend: '-5%',
    },
    shipments: [
        { _id: '1', type: 'inbound', item: 'Organic Wheat', quantity: 100, origin: 'Punjab Farm Co-op', destination: 'Silo A', status: 'in-transit', eta: '2026-02-28T14:00:00Z', createdAt: '2026-02-25T10:00:00Z' },
        { _id: '2', type: 'outbound', item: 'Basmati Rice', quantity: 50, origin: 'Silo B', destination: 'Mumbai Wholesale', status: 'delivered', eta: '2026-02-26T09:00:00Z', createdAt: '2026-02-23T08:00:00Z' },
        { _id: '3', type: 'inbound', item: 'Fresh Apples', quantity: 30, origin: 'Kashmir Orchards', destination: 'Cold Room 1', status: 'pending', eta: '2026-03-02T12:00:00Z', createdAt: '2026-02-27T06:00:00Z' },
        { _id: '4', type: 'outbound', item: 'Organic Wheat', quantity: 75, origin: 'Silo A', destination: 'Delhi Retail', status: 'processing', eta: '2026-03-01T10:00:00Z', createdAt: '2026-02-27T07:00:00Z' },
    ],
    qualityReports: [
        { _id: '1', item: 'Organic Wheat', batch: 'WH-2026-001', moistureContent: 12.5, proteinLevel: 11.8, grade: 'A', inspectionDate: '2026-02-25T10:00:00Z', status: 'passed' },
        { _id: '2', item: 'Basmati Rice', batch: 'RC-2026-003', moistureContent: 13.2, proteinLevel: 7.5, grade: 'B+', inspectionDate: '2026-02-24T14:00:00Z', status: 'passed' },
        { _id: '3', item: 'Fresh Apples', batch: 'AP-2026-008', moistureContent: 84.0, proteinLevel: 0.3, grade: 'A+', inspectionDate: '2026-02-26T09:00:00Z', status: 'passed' },
    ],
    notifications: [
        { _id: '1', type: 'shipment', message: 'Your wheat shipment is in transit — ETA Feb 28', timestamp: '2026-02-27T10:00:00Z', read: false },
        { _id: '2', type: 'quality', message: 'Quality report available for Basmati Rice batch RC-2026-003', timestamp: '2026-02-27T09:00:00Z', read: false },
        { _id: '3', type: 'stock', message: 'Apple stock condition: Excellent (2.5°C, 90% humidity)', timestamp: '2026-02-27T08:00:00Z', read: true },
        { _id: '4', type: 'billing', message: 'Monthly storage invoice generated — ₹745', timestamp: '2026-02-26T18:00:00Z', read: true },
    ],
    stockBreakdown: [
        { name: 'Wheat', value: 350, fill: '#155e2b' },
        { name: 'Rice', value: 200, fill: '#22c55e' },
        { name: 'Apples', value: 80, fill: '#f06418' },
    ],
};

// Logistics mock data
export const mockLogistics = {
    incomingShipments: [
        { _id: 'SH-IN-001', status: 'In Transit', origin: 'Farm District A', crop: 'Wheat', variety: 'HD-2967', quantity: 450, unit: 'tons', eta: '2026-02-27T17:00:00Z', truckId: 'TRK-1045', location: { lat: 28.7041, lng: 77.1025 } },
        { _id: 'SH-IN-002', status: 'Loading', origin: 'River Valley Farms', crop: 'Rice', variety: 'Basmati', quantity: 280, unit: 'tons', eta: '2026-02-28T09:00:00Z', truckId: 'TRK-1052', location: { lat: 28.5355, lng: 77.3910 } },
        { _id: 'SH-IN-003', status: 'Scheduled', origin: 'Green Plains Farm', crop: 'Corn', variety: 'Yellow', quantity: 620, unit: 'tons', eta: '2026-03-01T09:00:00Z', truckId: 'TRK-1038' },
    ],
    outgoingShipments: [
        { _id: 'SH-OUT-001', status: 'Dispatched', destination: 'City Mill Co.', crop: 'Wheat', variety: 'Organic', quantity: 300, unit: 'tons', departure: '2026-02-27T10:00:00Z', truckId: 'TRK-1029', location: { lat: 28.4595, lng: 77.0266 } },
        { _id: 'SH-OUT-002', status: 'Loading', destination: 'Metro Distributors', crop: 'Rice', variety: 'Basmati', quantity: 180, unit: 'tons', departure: '2026-02-27T15:00:00Z', truckId: 'TRK-1034', location: { lat: 28.6139, lng: 77.2090 } },
        { _id: 'SH-OUT-003', status: 'Pending', destination: 'Regional Distributor', crop: 'Soybean', variety: 'Standard', quantity: 150, unit: 'tons', departure: '2026-03-01T08:00:00Z', truckId: 'TRK-1041' },
    ],
    dispatchSchedule: [
        { _id: 'SH-OUT-004', destination: 'Harbor Port C', crop: 'Rice', quantity: 500, unit: 'tons', date: '2026-02-28', time: '06:00 AM', priority: 'High' },
        { _id: 'SH-OUT-005', destination: 'Processing Plant D', crop: 'Corn', quantity: 320, unit: 'tons', date: '2026-02-28', time: '10:00 AM', priority: 'Medium' },
        { _id: 'SH-OUT-006', destination: 'Retail Warehouse E', crop: 'Wheat', quantity: 200, unit: 'tons', date: '2026-03-01', time: '07:00 AM', priority: 'Low' },
        { _id: 'SH-OUT-007', destination: 'Export Terminal A', crop: 'Barley', quantity: 400, unit: 'tons', date: '2026-03-01', time: '02:00 PM', priority: 'High' },
    ],
    stats: {
        totalInbound: 3,
        totalOutbound: 3,
        inTransit: 4,
        trucksActive: 6,
    },
};

// Warehouse capacity and contact data for consumer view
export const mockWarehouseDirectory = [
    {
        _id: '1',
        name: 'AgroVault Central Hub',
        location: 'Sector 15, Gurgaon, Haryana',
        totalCapacity: 15000,
        usedCapacity: 11160,
        units: 8,
        contact: { phone: '+91 124-456-7890', email: 'central@agrovault.io', manager: 'Rajesh Kumar' },
        crops: ['Wheat', 'Rice', 'Corn', 'Soybean'],
        status: 'operational',
    },
    {
        _id: '2',
        name: 'AgroVault Cold Storage',
        location: 'APMC Yard, Nashik, Maharashtra',
        totalCapacity: 5000,
        usedCapacity: 3200,
        units: 4,
        contact: { phone: '+91 253-234-5678', email: 'nashik@agrovault.io', manager: 'Priya Sharma' },
        crops: ['Apples', 'Grapes', 'Potatoes', 'Tomatoes'],
        status: 'operational',
    },
    {
        _id: '3',
        name: 'AgroVault Grain Terminal',
        location: 'Kandla Port, Kutch, Gujarat',
        totalCapacity: 25000,
        usedCapacity: 18500,
        units: 12,
        contact: { phone: '+91 2836-223-456', email: 'kandla@agrovault.io', manager: 'Amit Patel' },
        crops: ['Wheat', 'Rice', 'Barley', 'Cotton'],
        status: 'operational',
    },
    {
        _id: '4',
        name: 'AgroVault South Region',
        location: 'Industrial Area, Kochi, Kerala',
        totalCapacity: 8000,
        usedCapacity: 4800,
        units: 6,
        contact: { phone: '+91 484-567-8901', email: 'kochi@agrovault.io', manager: 'Sunita Nair' },
        crops: ['Spices', 'Coconut', 'Rice', 'Rubber'],
        status: 'maintenance',
    },
    {
        _id: '5',
        name: 'AgroVault Punjab Hub',
        location: 'Grain Market, Ludhiana, Punjab',
        totalCapacity: 20000,
        usedCapacity: 16000,
        units: 10,
        contact: { phone: '+91 161-345-6789', email: 'ludhiana@agrovault.io', manager: 'Harpreet Singh' },
        crops: ['Wheat', 'Rice', 'Corn', 'Mustard'],
        status: 'operational',
    },
];
