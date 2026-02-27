import { useState } from "react";
import {
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  Filter,
  ChevronDown,
  Bell,
  Clock,
} from "lucide-react";

interface Alert {
  id: number;
  message: string;
  detail: string;
  unit: string;
  severity: "Critical" | "Warning" | "Info";
  time: string;
  resolved: boolean;
}

const initialAlerts: Alert[] = [
  { id: 1, message: "High temperature detected", detail: "Temperature reached 35°C in Silo B3, exceeding safe threshold of 30°C", unit: "Silo B3", severity: "Critical", time: "12 min ago", resolved: false },
  { id: 2, message: "Humidity spike detected", detail: "Humidity at 72% in Silo B3, risk of moisture damage to stored grain", unit: "Silo B3", severity: "Critical", time: "15 min ago", resolved: false },
  { id: 3, message: "CO2 level elevated", detail: "CO2 concentration at 580ppm in Unit C1, possible fermentation activity", unit: "Unit C1", severity: "Critical", time: "1 hr ago", resolved: false },
  { id: 4, message: "Moisture threshold exceeded", detail: "Grain moisture content at 17% in Unit C1, exceeds safe level of 14%", unit: "Unit C1", severity: "Warning", time: "2 hrs ago", resolved: false },
  { id: 5, message: "Sensor offline", detail: "Temperature sensor IOT-007 has not responded for 3 hours", unit: "Unit C1", severity: "Warning", time: "3 hrs ago", resolved: false },
  { id: 6, message: "Low battery warning", detail: "Sensor IOT-005 battery at 22%, needs replacement", unit: "Silo B2", severity: "Warning", time: "5 hrs ago", resolved: false },
  { id: 7, message: "Scheduled maintenance due", detail: "Ventilation system in Warehouse D1 is due for quarterly maintenance", unit: "Warehouse D1", severity: "Info", time: "6 hrs ago", resolved: false },
  { id: 8, message: "Storage capacity alert", detail: "Silo A1 at 92% capacity, consider redistribution", unit: "Silo A1", severity: "Warning", time: "8 hrs ago", resolved: true },
  { id: 9, message: "Quality check completed", detail: "Batch RC-2026-012 failed broken grains test, action required", unit: "Silo A2", severity: "Info", time: "12 hrs ago", resolved: true },
  { id: 10, message: "Power fluctuation detected", detail: "Brief power surge recorded in monitoring system, backup activated", unit: "Main System", severity: "Critical", time: "1 day ago", resolved: true },
];

const severityConfig = {
  Critical: {
    icon: AlertTriangle,
    bg: "bg-red-50 dark:bg-red-950/30",
    border: "border-red-200 dark:border-red-800",
    badge: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
    iconColor: "text-red-600 dark:text-red-400",
  },
  Warning: {
    icon: AlertCircle,
    bg: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-200 dark:border-amber-800",
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  Info: {
    icon: Info,
    bg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-200 dark:border-blue-800",
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
};

export function Alerts() {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [filterSeverity, setFilterSeverity] = useState("All");
  const [showResolved, setShowResolved] = useState(false);

  const filtered = alerts.filter((a) => {
    const matchSeverity = filterSeverity === "All" || a.severity === filterSeverity;
    const matchResolved = showResolved || !a.resolved;
    return matchSeverity && matchResolved;
  });

  const criticalCount = alerts.filter((a) => a.severity === "Critical" && !a.resolved).length;
  const warningCount = alerts.filter((a) => a.severity === "Warning" && !a.resolved).length;

  const markResolved = (id: number) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, resolved: true } : a))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1>Alerts</h1>
          <p className="text-[14px] text-muted-foreground mt-1">
            Monitor and manage system alerts and notifications
          </p>
        </div>
        <div className="flex items-center gap-3 text-[13px]">
          <span className="px-3 py-1.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" style={{ fontWeight: 500 }}>
            {criticalCount} Critical
          </span>
          <span className="px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" style={{ fontWeight: 500 }}>
            {warningCount} Warning
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="h-10 pl-10 pr-8 rounded-xl bg-card border border-border text-[14px] appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
          >
            <option>All</option>
            <option>Critical</option>
            <option>Warning</option>
            <option>Info</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>
        <label className="flex items-center gap-2 cursor-pointer text-[14px]">
          <input
            type="checkbox"
            checked={showResolved}
            onChange={(e) => setShowResolved(e.target.checked)}
            className="w-4 h-4 rounded accent-primary"
          />
          Show resolved
        </label>
      </div>

      {/* Alert Cards */}
      <div className="space-y-3">
        {filtered.map((alert) => {
          const config = severityConfig[alert.severity];
          const Icon = config.icon;
          return (
            <div
              key={alert.id}
              className={`rounded-2xl border-2 ${config.border} ${config.bg} p-4 transition-all ${
                alert.resolved ? "opacity-60" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <Icon className={`w-5 h-5 ${config.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="text-[14px]" style={{ fontWeight: 600 }}>{alert.message}</p>
                    <span className={`px-2 py-0.5 rounded-full text-[11px] ${config.badge}`} style={{ fontWeight: 500 }}>
                      {alert.severity}
                    </span>
                    {alert.resolved && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" style={{ fontWeight: 500 }}>
                        <CheckCircle2 className="w-3 h-3" /> Resolved
                      </span>
                    )}
                  </div>
                  <p className="text-[13px] text-muted-foreground mb-2">{alert.detail}</p>
                  <div className="flex flex-wrap items-center gap-4 text-[12px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Bell className="w-3.5 h-3.5" /> {alert.unit}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {alert.time}
                    </span>
                  </div>
                </div>
                {!alert.resolved && (
                  <button
                    onClick={() => markResolved(alert.id)}
                    className="shrink-0 px-3 py-2 rounded-xl text-[12px] bg-card border border-border hover:bg-muted transition-colors"
                    style={{ fontWeight: 500 }}
                  >
                    Mark Resolved
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
          <p className="text-[15px]" style={{ fontWeight: 500 }}>All clear!</p>
          <p className="text-[13px] text-muted-foreground mt-1">No matching alerts found.</p>
        </div>
      )}
    </div>
  );
}
