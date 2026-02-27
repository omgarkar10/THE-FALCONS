import {
  Package,
  Gauge,
  Radio,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const kpis = [
  {
    label: "Total Stock",
    value: "12,450",
    unit: "tons",
    change: "+3.2%",
    up: true,
    icon: Package,
    color: "bg-[#1B5E20]",
  },
  {
    label: "Storage Capacity",
    value: "78",
    unit: "%",
    change: "+1.8%",
    up: true,
    icon: Gauge,
    color: "bg-[#F57C00]",
  },
  {
    label: "Active Sensors",
    value: "342",
    unit: "online",
    change: "99.1%",
    up: true,
    icon: Radio,
    color: "bg-[#2196F3]",
  },
  {
    label: "Critical Alerts",
    value: "7",
    unit: "active",
    change: "-2",
    up: false,
    icon: AlertTriangle,
    color: "bg-[#D32F2F]",
  },
];

const tempHumidityData = [
  { time: "00:00", temp: 22, humidity: 55 },
  { time: "04:00", temp: 21, humidity: 58 },
  { time: "08:00", temp: 23, humidity: 52 },
  { time: "12:00", temp: 26, humidity: 48 },
  { time: "16:00", temp: 25, humidity: 50 },
  { time: "20:00", temp: 23, humidity: 54 },
  { time: "23:59", temp: 22, humidity: 56 },
];

const grainData = [
  { name: "Wheat", value: 4200, color: "#1B5E20" },
  { name: "Rice", value: 3100, color: "#4CAF50" },
  { name: "Corn", value: 2800, color: "#F57C00" },
  { name: "Barley", value: 1500, color: "#FFC107" },
  { name: "Soybean", value: 850, color: "#2196F3" },
];

const recentAlerts = [
  { id: 1, message: "High temperature in Silo B3", severity: "Critical", time: "12 min ago", unit: "Silo B3" },
  { id: 2, message: "Humidity spike in Warehouse A", severity: "Warning", time: "45 min ago", unit: "Warehouse A" },
  { id: 3, message: "CO2 level elevated in Unit C1", severity: "Critical", time: "1 hr ago", unit: "Unit C1" },
  { id: 4, message: "Sensor offline - Unit D4", severity: "Info", time: "2 hrs ago", unit: "Unit D4" },
  { id: 5, message: "Moisture threshold exceeded", severity: "Warning", time: "3 hrs ago", unit: "Silo A1" },
];

const storageUnits = [
  { id: "A1", name: "Silo A1", capacity: 92, status: "normal", crop: "Wheat" },
  { id: "A2", name: "Silo A2", capacity: 78, status: "normal", crop: "Rice" },
  { id: "B1", name: "Silo B1", capacity: 65, status: "normal", crop: "Corn" },
  { id: "B2", name: "Silo B2", capacity: 45, status: "warning", crop: "Wheat" },
  { id: "B3", name: "Silo B3", capacity: 88, status: "critical", crop: "Barley" },
  { id: "C1", name: "Unit C1", capacity: 34, status: "critical", crop: "Soybean" },
  { id: "C2", name: "Unit C2", capacity: 56, status: "normal", crop: "Rice" },
  { id: "D1", name: "Warehouse D1", capacity: 71, status: "normal", crop: "Wheat" },
];

const severityColors: Record<string, string> = {
  Critical: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  Warning: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Info: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
};

const statusColors: Record<string, string> = {
  normal: "bg-green-500",
  warning: "bg-amber-500",
  critical: "bg-red-500",
};

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Dashboard</h1>
          <p className="text-[14px] text-muted-foreground mt-1">
            Real-time warehouse monitoring overview
          </p>
        </div>
        <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
          <TrendingUp className="w-4 h-4" />
          Last updated: 2 min ago
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="bg-card rounded-2xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div
                className={`w-10 h-10 rounded-xl ${kpi.color} flex items-center justify-center`}
              >
                <kpi.icon className="w-5 h-5 text-white" />
              </div>
              <span
                className={`flex items-center gap-1 text-[12px] px-2 py-1 rounded-full ${
                  kpi.up
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                }`}
                style={{ fontWeight: 500 }}
              >
                {kpi.up ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {kpi.change}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-[13px] text-muted-foreground">{kpi.label}</p>
              <p className="text-[28px] mt-1" style={{ fontWeight: 700, lineHeight: 1.2 }}>
                {kpi.value}
                <span className="text-[14px] text-muted-foreground ml-1" style={{ fontWeight: 400 }}>
                  {kpi.unit}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Temperature & Humidity Chart */}
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-5 shadow-sm">
          <h3 className="mb-1">Temperature & Humidity</h3>
          <p className="text-[13px] text-muted-foreground mb-4">Live monitoring - last 24 hours</p>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={tempHumidityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="time" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                <YAxis tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    fontSize: "13px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="temp"
                  stroke="#F57C00"
                  strokeWidth={2.5}
                  dot={false}
                  name="Temperature (°C)"
                />
                <Line
                  type="monotone"
                  dataKey="humidity"
                  stroke="#2196F3"
                  strokeWidth={2.5}
                  dot={false}
                  name="Humidity (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grain Distribution */}
        <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
          <h3 className="mb-1">Grain Distribution</h3>
          <p className="text-[13px] text-muted-foreground mb-4">By crop type (tons)</p>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={grainData}
                  cx="50%"
                  cy="45%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {grainData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: "12px" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    fontSize: "13px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Alerts */}
        <div className="bg-card rounded-2xl border border-border shadow-sm">
          <div className="p-5 pb-3 flex items-center justify-between">
            <h3>Recent Alerts</h3>
            <a href="/dashboard/alerts" className="text-[13px] text-primary hover:underline" style={{ fontWeight: 500 }}>
              View all
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-t border-border text-muted-foreground">
                  <th className="text-left px-5 py-2.5" style={{ fontWeight: 500 }}>Alert</th>
                  <th className="text-left px-5 py-2.5" style={{ fontWeight: 500 }}>Unit</th>
                  <th className="text-left px-5 py-2.5" style={{ fontWeight: 500 }}>Severity</th>
                  <th className="text-left px-5 py-2.5" style={{ fontWeight: 500 }}>Time</th>
                </tr>
              </thead>
              <tbody>
                {recentAlerts.map((alert) => (
                  <tr key={alert.id} className="border-t border-border hover:bg-muted/50 transition-colors">
                    <td className="px-5 py-3">{alert.message}</td>
                    <td className="px-5 py-3 text-muted-foreground">{alert.unit}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-1 rounded-full text-[11px] ${severityColors[alert.severity]}`} style={{ fontWeight: 500 }}>
                        {alert.severity}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{alert.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Warehouse Map */}
        <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
          <h3 className="mb-1">Warehouse Map</h3>
          <p className="text-[13px] text-muted-foreground mb-4">Storage unit overview</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {storageUnits.map((unit) => (
              <div
                key={unit.id}
                className="relative p-3 rounded-xl border border-border bg-muted/30 hover:bg-muted/60 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${statusColors[unit.status]}`} />
                  <span className="text-[12px]" style={{ fontWeight: 600 }}>{unit.name}</span>
                </div>
                <p className="text-[11px] text-muted-foreground">{unit.crop}</p>
                <div className="mt-2 w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${statusColors[unit.status]}`}
                    style={{ width: `${unit.capacity}%` }}
                  />
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">{unit.capacity}% full</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}