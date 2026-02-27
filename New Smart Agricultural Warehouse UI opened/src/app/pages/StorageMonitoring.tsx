import { useState } from "react";
import {
  Thermometer,
  Droplets,
  Wind,
  Waves,
  X,
  TrendingUp,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

interface SensorCard {
  id: string;
  unit: string;
  temp: number;
  humidity: number;
  moisture: number;
  co2: number;
  status: "normal" | "warning" | "critical";
}

const sensors: SensorCard[] = [
  { id: "S1", unit: "Silo A1", temp: 24, humidity: 52, moisture: 12.5, co2: 380, status: "normal" },
  { id: "S2", unit: "Silo A2", temp: 26, humidity: 58, moisture: 13.2, co2: 420, status: "normal" },
  { id: "S3", unit: "Silo B1", temp: 22, humidity: 48, moisture: 11.8, co2: 390, status: "normal" },
  { id: "S4", unit: "Silo B2", temp: 30, humidity: 65, moisture: 15.1, co2: 480, status: "warning" },
  { id: "S5", unit: "Silo B3", temp: 35, humidity: 72, moisture: 18.3, co2: 620, status: "critical" },
  { id: "S6", unit: "Unit C1", temp: 33, humidity: 70, moisture: 17.0, co2: 580, status: "critical" },
  { id: "S7", unit: "Unit C2", temp: 25, humidity: 54, moisture: 12.8, co2: 400, status: "normal" },
  { id: "S8", unit: "Warehouse D1", temp: 23, humidity: 50, moisture: 12.0, co2: 370, status: "normal" },
];

const trendData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${String(i).padStart(2, "0")}:00`,
  temp: 22 + Math.sin(i / 3.8) * 4 + Math.random() * 2,
  humidity: 50 + Math.cos(i / 4) * 8 + Math.random() * 3,
  moisture: 12 + Math.sin(i / 5) * 2 + Math.random(),
  co2: 380 + Math.sin(i / 3) * 40 + Math.random() * 20,
}));

const statusBorder: Record<string, string> = {
  normal: "border-green-200 dark:border-green-800",
  warning: "border-amber-300 dark:border-amber-700",
  critical: "border-red-300 dark:border-red-700",
};

const statusBg: Record<string, string> = {
  normal: "",
  warning: "bg-amber-50/50 dark:bg-amber-950/20",
  critical: "bg-red-50/50 dark:bg-red-950/20",
};

const statusDot: Record<string, string> = {
  normal: "bg-green-500",
  warning: "bg-amber-500 animate-pulse",
  critical: "bg-red-500 animate-pulse",
};

function getIndicator(value: number, thresholds: [number, number]) {
  if (value <= thresholds[0]) return "text-green-600 dark:text-green-400";
  if (value <= thresholds[1]) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

export function StorageMonitoring() {
  const [selectedUnit, setSelectedUnit] = useState<SensorCard | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1>Storage Monitoring</h1>
        <p className="text-[14px] text-muted-foreground mt-1">
          Real-time environmental conditions across all storage units
        </p>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-[13px]">
        <span className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500" /> Normal
        </span>
        <span className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Warning
        </span>
        <span className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Critical
        </span>
      </div>

      {/* Sensor Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sensors.map((s) => (
          <div
            key={s.id}
            onClick={() => setSelectedUnit(s)}
            className={`bg-card rounded-2xl border-2 ${statusBorder[s.status]} ${statusBg[s.status]} p-4 shadow-sm hover:shadow-md transition-all cursor-pointer`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${statusDot[s.status]}`} />
                <span className="text-[14px]" style={{ fontWeight: 600 }}>{s.unit}</span>
              </div>
              <span className="text-[11px] text-muted-foreground uppercase tracking-wide" style={{ fontWeight: 500 }}>
                {s.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <Thermometer className={`w-4 h-4 ${getIndicator(s.temp, [28, 33])}`} />
                <div>
                  <p className="text-[11px] text-muted-foreground">Temp</p>
                  <p className={`text-[15px] ${getIndicator(s.temp, [28, 33])}`} style={{ fontWeight: 600 }}>{s.temp}°C</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Droplets className={`w-4 h-4 ${getIndicator(s.humidity, [60, 68])}`} />
                <div>
                  <p className="text-[11px] text-muted-foreground">Humidity</p>
                  <p className={`text-[15px] ${getIndicator(s.humidity, [60, 68])}`} style={{ fontWeight: 600 }}>{s.humidity}%</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Waves className={`w-4 h-4 ${getIndicator(s.moisture, [14, 16])}`} />
                <div>
                  <p className="text-[11px] text-muted-foreground">Moisture</p>
                  <p className={`text-[15px] ${getIndicator(s.moisture, [14, 16])}`} style={{ fontWeight: 600 }}>{s.moisture}%</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Wind className={`w-4 h-4 ${getIndicator(s.co2, [450, 550])}`} />
                <div>
                  <p className="text-[11px] text-muted-foreground">CO2</p>
                  <p className={`text-[15px] ${getIndicator(s.co2, [450, 550])}`} style={{ fontWeight: 600 }}>{s.co2}ppm</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedUnit && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedUnit(null)}>
          <div className="bg-card rounded-2xl border border-border shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-3">
                <span className={`w-3 h-3 rounded-full ${statusDot[selectedUnit.status]}`} />
                <h2>{selectedUnit.unit} - Trend Analysis</h2>
              </div>
              <button onClick={() => setSelectedUnit(null)} className="p-2 rounded-xl hover:bg-muted transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: "Temperature", value: `${selectedUnit.temp}°C`, icon: Thermometer, color: "#F57C00" },
                  { label: "Humidity", value: `${selectedUnit.humidity}%`, icon: Droplets, color: "#2196F3" },
                  { label: "Moisture", value: `${selectedUnit.moisture}%`, icon: Waves, color: "#4CAF50" },
                  { label: "CO2", value: `${selectedUnit.co2}ppm`, icon: Wind, color: "#9C27B0" },
                ].map((stat) => (
                  <div key={stat.label} className="p-3 rounded-xl bg-muted/50 text-center">
                    <stat.icon className="w-5 h-5 mx-auto mb-1" style={{ color: stat.color }} />
                    <p className="text-[11px] text-muted-foreground">{stat.label}</p>
                    <p className="text-[17px]" style={{ fontWeight: 700 }}>{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Trend Charts */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  <h3>24-Hour Trend</h3>
                </div>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="hour" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                      <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                      <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", fontSize: "12px" }} />
                      <Area type="monotone" dataKey="temp" stroke="#F57C00" fill="#F57C00" fillOpacity={0.1} strokeWidth={2} name="Temp (°C)" />
                      <Area type="monotone" dataKey="humidity" stroke="#2196F3" fill="#2196F3" fillOpacity={0.1} strokeWidth={2} name="Humidity (%)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
