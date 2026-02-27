import { Outlet } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import { Bell, Search } from "lucide-react";
import { alerts } from "@/data/mockData";

const AppLayout = () => {
  const criticalCount = alerts.filter((a) => a.type === "critical").length;

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-card/50 backdrop-blur-sm sticky top-0 z-30">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search warehouses, batches, products..."
              className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              {criticalCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                  {criticalCount}
                </span>
              )}
            </button>
            <div className="text-right hidden sm:block">
              <p className="text-xs font-medium text-foreground">Feb 27, 2026</p>
              <p className="text-[10px] text-muted-foreground">Last sync: 2 min ago</p>
            </div>
          </div>
        </header>
        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
