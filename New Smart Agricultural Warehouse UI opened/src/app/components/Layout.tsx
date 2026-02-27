import { useState } from "react";
import { NavLink, Outlet } from "react-router";
import {
  LayoutDashboard,
  Package,
  Thermometer,
  Radio,
  Truck,
  ShieldCheck,
  BarChart3,
  Bell,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Search,
  Sun,
  Moon,
  Wheat,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/dashboard/inventory", icon: Package, label: "Inventory" },
  { to: "/dashboard/storage", icon: Thermometer, label: "Storage Monitoring" },
  { to: "/dashboard/sensors", icon: Radio, label: "IoT Sensors" },
  { to: "/dashboard/logistics", icon: Truck, label: "Logistics" },
  { to: "/dashboard/quality", icon: ShieldCheck, label: "Quality Control" },
  { to: "/dashboard/analytics", icon: BarChart3, label: "Reports & Analytics" },
  { to: "/dashboard/alerts", icon: Bell, label: "Alerts" },
  { to: "/dashboard/users", icon: Users, label: "Users & Roles" },
  { to: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleDark = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static z-50 h-full bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-300 ${
          collapsed ? "w-[72px]" : "w-[260px]"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <Wheat className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <span className="text-[15px] tracking-tight text-white" style={{ fontWeight: 600 }}>
              AgroVault
            </span>
          )}
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/dashboard"}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-[14px] ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                } ${collapsed ? "justify-center" : ""}`
              }
              style={{ fontWeight: 500 }}
            >
              <item.icon className="w-[20px] h-[20px] shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Collapse Toggle */}
        <div className="hidden lg:flex p-3 border-t border-sidebar-border">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors text-[13px]"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:px-6 gap-4">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-xl hover:bg-muted transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-[280px] h-10 pl-10 pr-4 rounded-xl bg-input-background border border-border text-[14px] placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleDark}
              className="p-2.5 rounded-xl hover:bg-muted transition-colors"
            >
              {darkMode ? (
                <Sun className="w-[18px] h-[18px] text-muted-foreground" />
              ) : (
                <Moon className="w-[18px] h-[18px] text-muted-foreground" />
              )}
            </button>
            <button className="relative p-2.5 rounded-xl hover:bg-muted transition-colors">
              <Bell className="w-[18px] h-[18px] text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
            </button>
            <div className="ml-2 flex items-center gap-3 pl-3 border-l border-border">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-[13px]" style={{ fontWeight: 600 }}>
                JD
              </div>
              <div className="hidden md:block">
                <p className="text-[13px]" style={{ fontWeight: 500 }}>John Doe</p>
                <p className="text-[11px] text-muted-foreground">Warehouse Manager</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}