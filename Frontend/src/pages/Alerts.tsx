import { alerts } from "@/data/mockData";
import AlertItem from "@/components/AlertItem";
import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

const AlertsPage = () => {
  const [filter, setFilter] = useState<"all" | "critical" | "warning" | "info">("all");
  const filtered = filter === "all" ? alerts : alerts.filter((a) => a.type === filter);

  const counts = {
    all: alerts.length,
    critical: alerts.filter((a) => a.type === "critical").length,
    warning: alerts.filter((a) => a.type === "warning").length,
    info: alerts.filter((a) => a.type === "info").length,
  };

  return (
    <div className="space-y-6 max-w-[900px]">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Alerts & Notifications</h1>
        <p className="text-sm text-muted-foreground mt-1">Monitor and respond to warehouse alerts</p>
      </div>

      <div className="flex items-center gap-2">
        {(["all", "critical", "warning", "info"] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium transition-colors capitalize",
              filter === type
                ? type === "critical" ? "bg-destructive text-destructive-foreground"
                : type === "warning" ? "bg-warning text-warning-foreground"
                : type === "info" ? "bg-primary text-primary-foreground"
                : "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            {type} ({counts[type]})
          </button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-2"
      >
        {filtered.map((alert, i) => (
          <AlertItem key={alert.id} alert={alert} index={i} />
        ))}
      </motion.div>
    </div>
  );
};

export default AlertsPage;
