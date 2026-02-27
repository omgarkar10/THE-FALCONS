import { motion } from "framer-motion";
import { BarChart3, TrendingDown, Clock, FileDown } from "lucide-react";
import { warehouses, inventoryBatches } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

const storageEfficiency = warehouses.map((w) => ({
  name: w.id,
  utilization: Math.round((w.utilized / w.capacity) * 100),
  avgDays: Math.floor(Math.random() * 30) + 10,
}));

const spoilageTrend = Array.from({ length: 7 }, (_, i) => ({
  day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
  risk: Math.floor(Math.random() * 15) + 5,
  saved: Math.floor(Math.random() * 10) + 2,
}));

const productMovement = [
  { product: "Wheat", movement: "fast", velocity: 85 },
  { product: "Rice", movement: "fast", velocity: 78 },
  { product: "Tomatoes", movement: "fast", velocity: 92 },
  { product: "Potatoes", movement: "medium", velocity: 55 },
  { product: "Onions", movement: "medium", velocity: 48 },
  { product: "Lentils", movement: "slow", velocity: 22 },
  { product: "Mangoes", movement: "fast", velocity: 95 },
  { product: "Bananas", movement: "fast", velocity: 88 },
];

const Analytics = () => {
  return (
    <div className="space-y-6 max-w-[1400px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics & Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">Storage efficiency, spoilage trends, and product movement</p>
        </div>
        <button className="flex items-center gap-2 bg-muted text-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors">
          <FileDown className="w-4 h-4" /> Export PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Storage Efficiency */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-primary" /> Storage Efficiency
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={storageEfficiency} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
              <Bar dataKey="utilization" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Utilization %" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Spoilage Trend */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
            <TrendingDown className="w-4 h-4 text-destructive" /> Spoilage Risk Trend
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={spoilageTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
              <Area type="monotone" dataKey="risk" stroke="hsl(var(--destructive))" fill="hsl(var(--destructive) / 0.1)" name="At Risk" />
              <Area type="monotone" dataKey="saved" stroke="hsl(var(--success))" fill="hsl(var(--success) / 0.1)" name="Saved" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Product Movement */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-primary" /> Product Movement Velocity
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {productMovement.map((p) => (
            <div key={p.product} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{p.product}</p>
                <p className="text-[10px] text-muted-foreground uppercase">{p.movement} moving</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-mono font-bold text-foreground">{p.velocity}</p>
                <p className="text-[10px] text-muted-foreground">units/day</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;
