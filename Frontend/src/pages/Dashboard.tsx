import { Warehouse, Package, Thermometer, AlertTriangle, TrendingUp, ArrowUpRight } from "lucide-react";
import StatCard from "@/components/StatCard";
import WarehouseCard from "@/components/WarehouseCard";
import AlertItem from "@/components/AlertItem";
import { warehouses, alerts, capacityByCategory } from "@/data/mockData";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const totalCapacity = warehouses.reduce((s, w) => s + w.capacity, 0);
const totalUtilized = warehouses.reduce((s, w) => s + w.utilized, 0);
const totalAlerts = warehouses.reduce((s, w) => s + w.alerts, 0);
const totalProducts = warehouses.reduce((s, w) => s + w.products, 0);

const utilizationData = warehouses.map((w) => ({
  name: w.id,
  utilized: Math.round((w.utilized / w.capacity) * 100),
  free: 100 - Math.round((w.utilized / w.capacity) * 100),
}));

const Dashboard = () => {
  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Warehouse Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Real-time overview of all warehouse operations</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Warehouses" value={warehouses.length} icon={Warehouse} change="+1 this quarter" changeType="positive" index={0} />
        <StatCard label="Total Capacity" value={`${(totalCapacity / 1000).toFixed(0)}T`} icon={Package} change={`${Math.round((totalUtilized / totalCapacity) * 100)}% utilized`} changeType="neutral" index={1} />
        <StatCard label="Active Alerts" value={totalAlerts} icon={AlertTriangle} change="3 critical" changeType="negative" index={2} />
        <StatCard label="Products Tracked" value={totalProducts} icon={TrendingUp} change="+12 this week" changeType="positive" index={3} />
      </div>

      {/* Charts + Alerts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Utilization Chart */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="glass-card rounded-xl p-5 lg:col-span-2"
        >
          <h3 className="text-sm font-semibold text-foreground mb-4">Capacity Utilization by Warehouse</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={utilizationData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="utilized" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Utilized %" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Pie */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="glass-card rounded-xl p-5"
        >
          <h3 className="text-sm font-semibold text-foreground mb-4">Stock by Category</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={capacityByCategory} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {capacityByCategory.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
            {capacityByCategory.map((cat) => (
              <div key={cat.name} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.fill }} />
                <span className="text-[10px] text-muted-foreground">{cat.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Warehouses + Recent Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Warehouse Cards */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Warehouse Status</h3>
            <span className="text-xs text-primary font-medium cursor-pointer hover:underline flex items-center gap-0.5">
              View all <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {warehouses.slice(0, 4).map((wh, i) => (
              <WarehouseCard key={wh.id} warehouse={wh} index={i} />
            ))}
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Recent Alerts</h3>
            <span className="text-xs text-primary font-medium cursor-pointer hover:underline flex items-center gap-0.5">
              View all <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
          <div className="space-y-2">
            {alerts.slice(0, 5).map((alert, i) => (
              <AlertItem key={alert.id} alert={alert} index={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
