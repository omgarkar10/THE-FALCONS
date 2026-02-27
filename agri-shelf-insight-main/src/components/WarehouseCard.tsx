import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface WarehouseCardProps {
  warehouse: {
    id: string;
    name: string;
    city: string;
    capacity: number;
    utilized: number;
    temperature: number;
    humidity: number;
    status: "normal" | "warning" | "critical";
    alerts: number;
    products: number;
  };
  index?: number;
}

const WarehouseCard = ({ warehouse, index = 0 }: WarehouseCardProps) => {
  const utilPercent = Math.round((warehouse.utilized / warehouse.capacity) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="glass-card rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={cn("status-dot", `status-${warehouse.status}`)} />
            <span className="text-xs font-mono text-muted-foreground">{warehouse.id}</span>
          </div>
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{warehouse.name}</h3>
          <p className="text-xs text-muted-foreground">{warehouse.city}</p>
        </div>
        {warehouse.alerts > 0 && (
          <span className={cn(
            "text-[10px] font-bold px-2 py-0.5 rounded-full",
            warehouse.status === "critical" ? "bg-destructive/15 text-destructive" : "bg-warning/15 text-warning"
          )}>
            {warehouse.alerts} alert{warehouse.alerts > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Capacity bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-muted-foreground">Capacity</span>
          <span className={cn(
            "font-mono font-semibold",
            utilPercent > 90 ? "text-destructive" : utilPercent > 75 ? "text-warning" : "text-foreground"
          )}>
            {utilPercent}%
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-700",
              utilPercent > 90 ? "bg-destructive" : utilPercent > 75 ? "bg-warning" : "bg-primary"
            )}
            style={{ width: `${utilPercent}%` }}
          />
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Temp</p>
          <p className={cn(
            "text-sm font-mono font-semibold",
            warehouse.temperature > 30 ? "text-destructive" : warehouse.temperature > 26 ? "text-warning" : "text-foreground"
          )}>
            {warehouse.temperature}°C
          </p>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Humidity</p>
          <p className={cn(
            "text-sm font-mono font-semibold",
            warehouse.humidity > 70 ? "text-destructive" : warehouse.humidity > 55 ? "text-warning" : "text-foreground"
          )}>
            {warehouse.humidity}%
          </p>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Items</p>
          <p className="text-sm font-mono font-semibold text-foreground">{warehouse.products}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default WarehouseCard;
