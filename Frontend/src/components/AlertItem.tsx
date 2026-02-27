import { cn } from "@/lib/utils";
import { AlertTriangle, AlertCircle, Info } from "lucide-react";
import { motion } from "framer-motion";

interface AlertItemProps {
  alert: {
    id: number;
    type: "critical" | "warning" | "info";
    warehouse: string;
    message: string;
    time: string;
  };
  index?: number;
}

const iconMap = {
  critical: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const AlertItem = ({ alert, index = 0 }: AlertItemProps) => {
  const Icon = iconMap[alert.type];

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={cn(
        "flex items-start gap-3 p-3 rounded-lg border",
        alert.type === "critical" && "bg-destructive/5 border-destructive/20",
        alert.type === "warning" && "bg-warning/5 border-warning/20",
        alert.type === "info" && "bg-primary/5 border-primary/20"
      )}
    >
      <Icon
        className={cn(
          "w-4 h-4 mt-0.5 shrink-0",
          alert.type === "critical" && "text-destructive",
          alert.type === "warning" && "text-warning",
          alert.type === "info" && "text-primary"
        )}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground leading-snug">{alert.message}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] font-mono text-muted-foreground">{alert.warehouse}</span>
          <span className="text-[10px] text-muted-foreground">·</span>
          <span className="text-[10px] text-muted-foreground">{alert.time}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default AlertItem;
