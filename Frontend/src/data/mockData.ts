import { Warehouse, LayoutDashboard, Package, Thermometer, AlertTriangle, BarChart3, Truck, Shield, Search, ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";

export type NavItem = {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
};

export const navItems: NavItem[] = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "Inventory", path: "/inventory", icon: Package },
  { label: "Monitoring", path: "/monitoring", icon: Thermometer },
  { label: "Alerts", path: "/alerts", icon: AlertTriangle },
  { label: "Analytics", path: "/analytics", icon: BarChart3 },
  { label: "Dispatch", path: "/dispatch", icon: Truck },
  { label: "Consumer", path: "/consumer", icon: ShoppingBag },
];

export const warehouses = [
  { id: "WH-001", name: "Mumbai Central", city: "Mumbai", state: "Maharashtra", capacity: 50000, utilized: 38500, temperature: 22.4, humidity: 45, status: "normal" as const, alerts: 0, products: 142 },
  { id: "WH-002", name: "Delhi North Hub", city: "Delhi", state: "Delhi", capacity: 75000, utilized: 71250, temperature: 28.1, humidity: 62, status: "warning" as const, alerts: 3, products: 218 },
  { id: "WH-003", name: "Bangalore Tech Park", city: "Bangalore", state: "Karnataka", capacity: 40000, utilized: 22000, temperature: 24.8, humidity: 52, status: "normal" as const, alerts: 0, products: 96 },
  { id: "WH-004", name: "Chennai Port Store", city: "Chennai", state: "Tamil Nadu", capacity: 60000, utilized: 58200, temperature: 34.2, humidity: 78, status: "critical" as const, alerts: 7, products: 185 },
  { id: "WH-005", name: "Pune Agri Center", city: "Pune", state: "Maharashtra", capacity: 35000, utilized: 18900, temperature: 21.5, humidity: 41, status: "normal" as const, alerts: 1, products: 73 },
];

export const inventoryBatches = [
  { batchId: "B-20240101", produce: "Wheat", category: "Grains", quantity: 12000, unit: "kg", entryDate: "2024-12-15", source: "Rajasthan", shelfLife: 180, warehouseId: "WH-001", risk: "low" as const },
  { batchId: "B-20240102", produce: "Tomatoes", category: "Vegetables", quantity: 3500, unit: "kg", entryDate: "2025-02-20", source: "Maharashtra", shelfLife: 14, warehouseId: "WH-002", risk: "high" as const },
  { batchId: "B-20240103", produce: "Rice", category: "Grains", quantity: 25000, unit: "kg", entryDate: "2025-01-05", source: "Punjab", shelfLife: 365, warehouseId: "WH-001", risk: "low" as const },
  { batchId: "B-20240104", produce: "Mangoes", category: "Fruits", quantity: 8000, unit: "kg", entryDate: "2025-02-22", source: "Andhra Pradesh", shelfLife: 10, warehouseId: "WH-004", risk: "critical" as const },
  { batchId: "B-20240105", produce: "Onions", category: "Vegetables", quantity: 15000, unit: "kg", entryDate: "2025-01-28", source: "Maharashtra", shelfLife: 30, warehouseId: "WH-003", risk: "medium" as const },
  { batchId: "B-20240106", produce: "Potatoes", category: "Vegetables", quantity: 20000, unit: "kg", entryDate: "2025-02-01", source: "Uttar Pradesh", shelfLife: 60, warehouseId: "WH-005", risk: "low" as const },
  { batchId: "B-20240107", produce: "Bananas", category: "Fruits", quantity: 5000, unit: "kg", entryDate: "2025-02-24", source: "Karnataka", shelfLife: 7, warehouseId: "WH-003", risk: "high" as const },
  { batchId: "B-20240108", produce: "Lentils", category: "Grains", quantity: 18000, unit: "kg", entryDate: "2024-11-20", source: "Madhya Pradesh", shelfLife: 270, warehouseId: "WH-002", risk: "low" as const },
];

export const temperatureData = Array.from({ length: 24 }, (_, i) => ({
  time: `${String(i).padStart(2, "0")}:00`,
  "WH-001": 21 + Math.sin(i / 4) * 2 + Math.random() * 0.5,
  "WH-002": 26 + Math.sin(i / 3) * 3 + Math.random() * 0.8,
  "WH-004": 32 + Math.sin(i / 5) * 2.5 + Math.random() * 1.2,
}));

export const humidityData = Array.from({ length: 24 }, (_, i) => ({
  time: `${String(i).padStart(2, "0")}:00`,
  "WH-001": 44 + Math.sin(i / 6) * 3 + Math.random(),
  "WH-002": 60 + Math.sin(i / 4) * 5 + Math.random() * 2,
  "WH-004": 75 + Math.sin(i / 3) * 4 + Math.random() * 3,
}));

export const alerts = [
  { id: 1, type: "critical" as const, warehouse: "WH-004", message: "Temperature exceeded 34°C – spoilage risk for Mangoes (B-20240104)", time: "2 min ago" },
  { id: 2, type: "critical" as const, warehouse: "WH-004", message: "Humidity at 78% – well above safe threshold of 65%", time: "5 min ago" },
  { id: 3, type: "warning" as const, warehouse: "WH-002", message: "Temperature trending upward – approaching 30°C threshold", time: "15 min ago" },
  { id: 4, type: "warning" as const, warehouse: "WH-002", message: "Tomatoes batch B-20240102 expiring in 3 days", time: "1 hr ago" },
  { id: 5, type: "info" as const, warehouse: "WH-005", message: "Onions batch B-20240105 – 50% shelf life remaining", time: "2 hr ago" },
  { id: 6, type: "critical" as const, warehouse: "WH-004", message: "Bananas batch risk elevated – dispatch recommended", time: "3 hr ago" },
];

export const capacityByCategory = [
  { name: "Grains", value: 55000, fill: "hsl(var(--chart-1))" },
  { name: "Vegetables", value: 38500, fill: "hsl(var(--chart-2))" },
  { name: "Fruits", value: 13000, fill: "hsl(var(--chart-4))" },
  { name: "Pulses", value: 18000, fill: "hsl(var(--chart-5))" },
];
