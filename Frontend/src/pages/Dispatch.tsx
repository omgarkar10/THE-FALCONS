import { motion } from "framer-motion";
import { Truck, Package, MapPin, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const dispatches = [
  { id: "D-001", batchId: "B-20240102", produce: "Tomatoes", quantity: "1,500 kg", from: "WH-002", to: "Azadpur Mandi, Delhi", status: "in_transit" as const, date: "2025-02-27", urgency: "high" as const },
  { id: "D-002", batchId: "B-20240104", produce: "Mangoes", quantity: "3,000 kg", from: "WH-004", to: "Koyambedu Market, Chennai", status: "pending" as const, date: "2025-02-27", urgency: "critical" as const },
  { id: "D-003", batchId: "B-20240107", produce: "Bananas", quantity: "2,000 kg", from: "WH-003", to: "KR Market, Bangalore", status: "delivered" as const, date: "2025-02-26", urgency: "medium" as const },
  { id: "D-004", batchId: "B-20240105", produce: "Onions", quantity: "5,000 kg", from: "WH-003", to: "APMC Vashi, Mumbai", status: "in_transit" as const, date: "2025-02-27", urgency: "low" as const },
];

const statusConfig = {
  pending: { label: "Pending", color: "bg-warning/15 text-warning", icon: Clock },
  in_transit: { label: "In Transit", color: "bg-primary/15 text-primary", icon: Truck },
  delivered: { label: "Delivered", color: "bg-success/15 text-success", icon: CheckCircle2 },
};

const urgencyConfig = {
  low: "text-muted-foreground",
  medium: "text-warning",
  high: "text-destructive",
  critical: "text-destructive font-bold",
};

const Dispatch = () => {
  return (
    <div className="space-y-6 max-w-[1200px]">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dispatch & Distribution</h1>
          <p className="text-sm text-muted-foreground mt-1">Track outbound shipments and smart dispatch recommendations</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
          <Truck className="w-4 h-4" /> New Dispatch
        </button>
      </div>

      <div className="space-y-3">
        {dispatches.map((d, i) => {
          const status = statusConfig[d.status];
          const StatusIcon = status.icon;
          return (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card rounded-xl p-5"
            >
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs text-muted-foreground">{d.id}</span>
                      <span className="text-[10px] text-muted-foreground">·</span>
                      <span className="font-mono text-xs text-muted-foreground">{d.batchId}</span>
                    </div>
                    <h3 className="font-semibold text-foreground">{d.produce} — {d.quantity}</h3>
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                      <span className="font-mono">{d.from}</span>
                      <span>→</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{d.to}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn("text-[10px] uppercase font-bold", urgencyConfig[d.urgency])}>{d.urgency}</span>
                  <span className={cn("flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full", status.color)}>
                    <StatusIcon className="w-3 h-3" /> {status.label}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Dispatch;
