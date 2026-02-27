import { temperatureData, humidityData, warehouses } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Thermometer, Droplets, AlertTriangle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { useState } from "react";

const warehouseColors: Record<string, string> = {
  "WH-001": "hsl(var(--chart-1))",
  "WH-002": "hsl(var(--chart-2))",
  "WH-004": "hsl(var(--chart-3))",
};

const Monitoring = () => {
  const [selectedWarehouse, setSelectedWarehouse] = useState<string | null>(null);

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Environmental Monitoring</h1>
        <p className="text-sm text-muted-foreground mt-1">Temperature and humidity tracking across warehouses</p>
      </div>

      {/* Live Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {warehouses.filter(w => ["WH-001", "WH-002", "WH-004"].includes(w.id)).map((wh, i) => (
          <motion.div
            key={wh.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            onClick={() => setSelectedWarehouse(selectedWarehouse === wh.id ? null : wh.id)}
            className={cn(
              "glass-card rounded-xl p-5 cursor-pointer transition-all",
              selectedWarehouse === wh.id && "ring-2 ring-primary"
            )}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className={cn("status-dot", `status-${wh.status}`)} />
                <span className="font-mono text-xs text-muted-foreground">{wh.id}</span>
              </div>
              <span className="text-xs font-medium text-foreground">{wh.name}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Thermometer className={cn("w-4 h-4", wh.temperature > 30 ? "text-destructive" : wh.temperature > 26 ? "text-warning" : "text-primary")} />
                <div>
                  <p className="text-lg font-mono font-bold text-foreground">{wh.temperature}°C</p>
                  <p className="text-[10px] text-muted-foreground">Temperature</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Droplets className={cn("w-4 h-4", wh.humidity > 70 ? "text-destructive" : wh.humidity > 55 ? "text-warning" : "text-primary")} />
                <div>
                  <p className="text-lg font-mono font-bold text-foreground">{wh.humidity}%</p>
                  <p className="text-[10px] text-muted-foreground">Humidity</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Temperature Chart */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-xl p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-primary" /> Temperature – Last 24 Hours
          </h3>
          <div className="flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-warning" />
            <span className="text-[10px] text-muted-foreground">Threshold: 30°C</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={temperatureData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} interval={3} />
            <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} domain={[15, 40]} />
            <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
            <ReferenceLine y={30} stroke="hsl(var(--destructive))" strokeDasharray="5 5" label={{ value: "Max", fill: "hsl(var(--destructive))", fontSize: 10 }} />
            {Object.keys(warehouseColors).map((id) =>
              (!selectedWarehouse || selectedWarehouse === id) && (
                <Line key={id} type="monotone" dataKey={id} stroke={warehouseColors[id]} strokeWidth={2} dot={false} />
              )
            )}
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Humidity Chart */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card rounded-xl p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Droplets className="w-4 h-4 text-primary" /> Humidity – Last 24 Hours
          </h3>
          <div className="flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-warning" />
            <span className="text-[10px] text-muted-foreground">Threshold: 65%</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={humidityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} interval={3} />
            <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} domain={[30, 90]} />
            <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
            <ReferenceLine y={65} stroke="hsl(var(--destructive))" strokeDasharray="5 5" label={{ value: "Max", fill: "hsl(var(--destructive))", fontSize: 10 }} />
            {Object.keys(warehouseColors).map((id) =>
              (!selectedWarehouse || selectedWarehouse === id) && (
                <Line key={id} type="monotone" dataKey={id} stroke={warehouseColors[id]} strokeWidth={2} dot={false} />
              )
            )}
          </LineChart>
        </ResponsiveContainer>
        {/* Legend */}
        <div className="flex items-center gap-4 mt-3">
          {Object.entries(warehouseColors).map(([id, color]) => (
            <div key={id} className="flex items-center gap-1.5">
              <span className="w-3 h-1 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-[10px] text-muted-foreground font-mono">{id}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Monitoring;
