import { useState } from "react";
import {
  Shield,
  Eye,
  Wrench,
  Crown,
  MoreHorizontal,
  Plus,
  Search,
} from "lucide-react";

interface Permission {
  label: string;
  admin: boolean;
  manager: boolean;
  operator: boolean;
  viewer: boolean;
}

const permissions: Permission[] = [
  { label: "View Dashboard", admin: true, manager: true, operator: true, viewer: true },
  { label: "Manage Inventory", admin: true, manager: true, operator: true, viewer: false },
  { label: "Storage Monitoring", admin: true, manager: true, operator: true, viewer: true },
  { label: "IoT Configuration", admin: true, manager: true, operator: false, viewer: false },
  { label: "Manage Logistics", admin: true, manager: true, operator: true, viewer: false },
  { label: "Quality Control", admin: true, manager: true, operator: true, viewer: true },
  { label: "View Analytics", admin: true, manager: true, operator: false, viewer: true },
  { label: "Manage Alerts", admin: true, manager: true, operator: true, viewer: false },
  { label: "User Management", admin: true, manager: false, operator: false, viewer: false },
  { label: "System Settings", admin: true, manager: false, operator: false, viewer: false },
];

const users = [
  { id: 1, name: "John Doe", email: "john@agrovault.com", role: "Admin", status: "Active", lastLogin: "2 min ago", avatar: "JD" },
  { id: 2, name: "Sarah Chen", email: "sarah@agrovault.com", role: "Warehouse Manager", status: "Active", lastLogin: "1 hr ago", avatar: "SC" },
  { id: 3, name: "Mike Johnson", email: "mike@agrovault.com", role: "Operator", status: "Active", lastLogin: "30 min ago", avatar: "MJ" },
  { id: 4, name: "Emily Wilson", email: "emily@agrovault.com", role: "Operator", status: "Active", lastLogin: "3 hrs ago", avatar: "EW" },
  { id: 5, name: "James Brown", email: "james@agrovault.com", role: "Viewer", status: "Inactive", lastLogin: "5 days ago", avatar: "JB" },
  { id: 6, name: "Lisa Park", email: "lisa@agrovault.com", role: "Warehouse Manager", status: "Active", lastLogin: "45 min ago", avatar: "LP" },
];

const roleIcons: Record<string, React.ReactNode> = {
  Admin: <Crown className="w-4 h-4 text-amber-500" />,
  "Warehouse Manager": <Shield className="w-4 h-4 text-blue-500" />,
  Operator: <Wrench className="w-4 h-4 text-green-500" />,
  Viewer: <Eye className="w-4 h-4 text-gray-500" />,
};

const roleBg: Record<string, string> = {
  Admin: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  "Warehouse Manager": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Operator: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Viewer: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
};

const statusBg: Record<string, string> = {
  Active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Inactive: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
};

const avatarBg = [
  "bg-[#1B5E20]", "bg-[#F57C00]", "bg-[#2196F3]", "bg-[#9C27B0]", "bg-[#607D8B]", "bg-[#E91E63]",
];

export function Users() {
  const [permState, setPermState] = useState(permissions);
  const [search, setSearch] = useState("");

  const togglePerm = (index: number, role: "admin" | "manager" | "operator" | "viewer") => {
    if (role === "admin") return; // Admin always has all
    setPermState((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [role]: !p[role] } : p))
    );
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1>Users & Roles</h1>
          <p className="text-[14px] text-muted-foreground mt-1">
            Manage team members and role-based permissions
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-[13px] hover:opacity-90 transition-opacity self-start" style={{ fontWeight: 500 }}>
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {/* User Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-10 pl-10 pr-4 rounded-xl bg-card border border-border text-[14px] placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Users Table */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-5 py-3 text-muted-foreground" style={{ fontWeight: 500 }}>User</th>
                <th className="text-left px-5 py-3 text-muted-foreground" style={{ fontWeight: 500 }}>Role</th>
                <th className="text-left px-5 py-3 text-muted-foreground" style={{ fontWeight: 500 }}>Status</th>
                <th className="text-left px-5 py-3 text-muted-foreground" style={{ fontWeight: 500 }}>Last Login</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, idx) => (
                <tr key={user.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full ${avatarBg[idx % avatarBg.length]} flex items-center justify-center text-white text-[12px]`} style={{ fontWeight: 600 }}>
                        {user.avatar}
                      </div>
                      <div>
                        <p className="text-[13px]" style={{ fontWeight: 500 }}>{user.name}</p>
                        <p className="text-[11px] text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] ${roleBg[user.role]}`} style={{ fontWeight: 500 }}>
                      {roleIcons[user.role]}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] ${statusBg[user.status]}`} style={{ fontWeight: 500 }}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">{user.lastLogin}</td>
                  <td className="px-5 py-3.5">
                    <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                      <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permissions Matrix */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-5 pb-3">
          <h3>Role Permissions</h3>
          <p className="text-[13px] text-muted-foreground mt-1">Toggle permissions for each role</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-t border-border bg-muted/30">
                <th className="text-left px-5 py-3 text-muted-foreground min-w-[200px]" style={{ fontWeight: 500 }}>Permission</th>
                <th className="text-center px-5 py-3 text-muted-foreground" style={{ fontWeight: 500 }}>
                  <span className="flex items-center justify-center gap-1.5">
                    <Crown className="w-3.5 h-3.5 text-amber-500" /> Admin
                  </span>
                </th>
                <th className="text-center px-5 py-3 text-muted-foreground" style={{ fontWeight: 500 }}>
                  <span className="flex items-center justify-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-blue-500" /> Manager
                  </span>
                </th>
                <th className="text-center px-5 py-3 text-muted-foreground" style={{ fontWeight: 500 }}>
                  <span className="flex items-center justify-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-green-500" /> Operator
                  </span>
                </th>
                <th className="text-center px-5 py-3 text-muted-foreground" style={{ fontWeight: 500 }}>
                  <span className="flex items-center justify-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-gray-500" /> Viewer
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {permState.map((perm, idx) => (
                <tr key={perm.label} className="border-t border-border hover:bg-muted/20">
                  <td className="px-5 py-3" style={{ fontWeight: 500 }}>{perm.label}</td>
                  {(["admin", "manager", "operator", "viewer"] as const).map((role) => (
                    <td key={role} className="px-5 py-3 text-center">
                      <button
                        onClick={() => togglePerm(idx, role)}
                        disabled={role === "admin"}
                        className={`w-10 h-6 rounded-full transition-colors relative ${
                          perm[role] ? "bg-primary" : "bg-switch-background"
                        } ${role === "admin" ? "opacity-80 cursor-not-allowed" : "cursor-pointer"}`}
                      >
                        <span
                          className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                            perm[role] ? "left-5" : "left-1"
                          }`}
                        />
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
