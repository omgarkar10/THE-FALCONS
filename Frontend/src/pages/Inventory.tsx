import { inventoryBatches, warehouses } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Package, Filter, Plus, Search } from "lucide-react";
import { useState } from "react";

const riskColors = {
  low: "bg-success/15 text-success",
  medium: "bg-warning/15 text-warning",
  high: "bg-destructive/15 text-destructive",
  critical: "bg-destructive/20 text-destructive font-semibold",
};

const Inventory = () => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const categories = ["all", ...new Set(inventoryBatches.map((b) => b.category))];

  const filtered = inventoryBatches.filter((b) => {
    const matchesSearch = b.produce.toLowerCase().includes(search.toLowerCase()) || b.batchId.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === "all" || b.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Inventory Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Track batches, stock levels, and expiry across warehouses</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> Add Batch
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2 flex-1 max-w-sm">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search batches or products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full"
          />
        </div>
        <div className="flex items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-colors capitalize",
                categoryFilter === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-card rounded-xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Batch ID</th>
                <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Produce</th>
                <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Category</th>
                <th className="text-right px-5 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Quantity</th>
                <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Source</th>
                <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Warehouse</th>
                <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Entry Date</th>
                <th className="text-right px-5 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Shelf Life</th>
                <th className="text-center px-5 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Risk</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((batch, i) => (
                <tr key={batch.batchId} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs font-semibold text-primary">{batch.batchId}</td>
                  <td className="px-5 py-3.5 font-medium text-foreground">{batch.produce}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{batch.category}</td>
                  <td className="px-5 py-3.5 text-right font-mono text-foreground">{batch.quantity.toLocaleString()} {batch.unit}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{batch.source}</td>
                  <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{batch.warehouseId}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{batch.entryDate}</td>
                  <td className="px-5 py-3.5 text-right font-mono text-foreground">{batch.shelfLife}d</td>
                  <td className="px-5 py-3.5 text-center">
                    <span className={cn("text-[10px] font-bold uppercase px-2 py-0.5 rounded-full", riskColors[batch.risk])}>
                      {batch.risk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Inventory;
