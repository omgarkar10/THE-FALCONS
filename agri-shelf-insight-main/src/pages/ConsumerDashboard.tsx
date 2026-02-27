import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ShoppingCart, Truck, Clock, Package, Filter, Star, MapPin, CalendarDays, ArrowUpRight, CheckCircle2, AlertCircle } from "lucide-react";
import { warehouses, inventoryBatches } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

// Simulated consumer orders
const consumerOrders = [
  { id: "ORD-001", product: "Wheat", quantity: 500, unit: "kg", warehouse: "WH-001", status: "delivered" as const, date: "2026-02-25", eta: "Delivered" },
  { id: "ORD-002", product: "Rice", quantity: 1000, unit: "kg", warehouse: "WH-001", status: "in_transit" as const, date: "2026-02-26", eta: "Arriving today" },
  { id: "ORD-003", product: "Tomatoes", quantity: 200, unit: "kg", warehouse: "WH-002", status: "processing" as const, date: "2026-02-27", eta: "Est. 2 days" },
  { id: "ORD-004", product: "Potatoes", quantity: 800, unit: "kg", warehouse: "WH-005", status: "pending" as const, date: "2026-02-27", eta: "Awaiting confirmation" },
];

const statusConfig = {
  delivered: { label: "Delivered", color: "bg-success/15 text-success border-success/30" },
  in_transit: { label: "In Transit", color: "bg-primary/15 text-primary border-primary/30" },
  processing: { label: "Processing", color: "bg-warning/15 text-warning border-warning/30" },
  pending: { label: "Pending", color: "bg-muted text-muted-foreground border-border" },
};

const freshnessLabel = (shelfLife: number, entryDate: string) => {
  const entry = new Date(entryDate);
  const now = new Date();
  const daysStored = Math.floor((now.getTime() - entry.getTime()) / (1000 * 60 * 60 * 24));
  const remaining = shelfLife - daysStored;
  const pct = Math.max(0, Math.round((remaining / shelfLife) * 100));
  if (pct > 60) return { text: "Very Fresh", color: "text-success" };
  if (pct > 30) return { text: "Good", color: "text-warning" };
  return { text: "Expiring Soon", color: "text-destructive" };
};

type Tab = "catalog" | "orders" | "tracking";

const ConsumerDashboard = () => {
  const [activeTab, setActiveTab] = useState<Tab>("catalog");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", ...new Set(inventoryBatches.map((b) => b.category))];

  const filteredProducts = inventoryBatches.filter((b) => {
    const matchesSearch = b.produce.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === "All" || b.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const tabs: { key: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: "catalog", label: "Product Catalog", icon: Package },
    { key: "orders", label: "My Orders", icon: ShoppingCart },
    { key: "tracking", label: "Dispatch Tracking", icon: Truck },
  ];

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Consumer Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Browse available produce, place orders, and track deliveries</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Available Products", value: inventoryBatches.length, icon: Package },
          { label: "Active Orders", value: consumerOrders.filter((o) => o.status !== "delivered").length, icon: ShoppingCart },
          { label: "In Transit", value: consumerOrders.filter((o) => o.status === "in_transit").length, icon: Truck },
          { label: "Warehouses", value: warehouses.length, icon: MapPin },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.08 }}
            className="glass-card rounded-xl p-4 flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <stat.icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="stat-value text-xl">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted/50 rounded-lg p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
              activeTab === tab.key
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "catalog" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-2 flex-1 glass-card rounded-lg px-3 py-2">
              <Search className="w-4 h-4 text-muted-foreground shrink-0" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search produce..."
                className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border",
                    selectedCategory === cat
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-muted-foreground border-border hover:border-primary/50"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((batch, i) => {
              const wh = warehouses.find((w) => w.id === batch.warehouseId);
              const freshness = freshnessLabel(batch.shelfLife, batch.entryDate);
              return (
                <motion.div
                  key={batch.batchId}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="glass-card rounded-xl p-4 flex flex-col gap-3 hover:border-primary/30 transition-colors group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-foreground">{batch.produce}</h4>
                      <p className="text-xs text-muted-foreground">{batch.category}</p>
                    </div>
                    <Badge variant="outline" className={cn("text-[10px]", freshness.color)}>
                      {freshness.text}
                    </Badge>
                  </div>

                  <div className="space-y-1.5 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5" />
                      <span>{batch.quantity.toLocaleString()} {batch.unit} available</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{wh?.name || batch.warehouseId} – {batch.source}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CalendarDays className="w-3.5 h-3.5" />
                      <span>Shelf life: {batch.shelfLife} days</span>
                    </div>
                  </div>

                  <button className="mt-auto w-full py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors">
                    Place Demand
                  </button>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {activeTab === "orders" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          <div className="glass-card rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Order ID</th>
                  <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Product</th>
                  <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Quantity</th>
                  <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Warehouse</th>
                  <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Date</th>
                  <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {consumerOrders.map((order, i) => {
                  const st = statusConfig[order.status];
                  return (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3 font-mono text-xs font-medium text-foreground">{order.id}</td>
                      <td className="px-4 py-3 text-foreground">{order.product}</td>
                      <td className="px-4 py-3 text-muted-foreground">{order.quantity} {order.unit}</td>
                      <td className="px-4 py-3 text-muted-foreground">{order.warehouse}</td>
                      <td className="px-4 py-3 text-muted-foreground">{order.date}</td>
                      <td className="px-4 py-3">
                        <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold border", st.color)}>
                          {st.label}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {activeTab === "tracking" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {consumerOrders
            .filter((o) => o.status !== "delivered")
            .map((order, i) => {
              const st = statusConfig[order.status];
              const steps = ["Order Placed", "Processing", "Dispatched", "In Transit", "Delivered"];
              const currentStep =
                order.status === "pending" ? 0
                : order.status === "processing" ? 1
                : order.status === "in_transit" ? 3
                : 4;

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card rounded-xl p-5 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-foreground">{order.product} – {order.quantity} {order.unit}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{order.id} • From {order.warehouse}</p>
                    </div>
                    <div className="text-right">
                      <span className={cn("px-2.5 py-1 rounded-full text-xs font-semibold border", st.color)}>
                        {st.label}
                      </span>
                      <p className="text-[10px] text-muted-foreground mt-1">{order.eta}</p>
                    </div>
                  </div>

                  {/* Progress Steps */}
                  <div className="flex items-center gap-0">
                    {steps.map((step, si) => (
                      <div key={step} className="flex items-center flex-1 last:flex-none">
                        <div className="flex flex-col items-center">
                          <div
                            className={cn(
                              "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-colors",
                              si <= currentStep
                                ? "bg-primary border-primary text-primary-foreground"
                                : "bg-muted border-border text-muted-foreground"
                            )}
                          >
                            {si < currentStep ? (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            ) : (
                              si + 1
                            )}
                          </div>
                          <span className={cn("text-[9px] mt-1 text-center whitespace-nowrap", si <= currentStep ? "text-foreground font-medium" : "text-muted-foreground")}>
                            {step}
                          </span>
                        </div>
                        {si < steps.length - 1 && (
                          <div
                            className={cn(
                              "h-0.5 flex-1 mx-1 rounded-full",
                              si < currentStep ? "bg-primary" : "bg-border"
                            )}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
        </motion.div>
      )}
    </div>
  );
};

export default ConsumerDashboard;
