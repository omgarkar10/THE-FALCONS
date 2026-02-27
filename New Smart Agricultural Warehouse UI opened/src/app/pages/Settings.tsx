import { useState } from "react";
import {
  Radio,
  Bell,
  Warehouse,
  Plug,
  Save,
  RefreshCw,
  Plus,
  Trash2,
  CheckCircle2,
} from "lucide-react";

interface IoTDevice {
  id: string;
  name: string;
  type: string;
  interval: string;
  enabled: boolean;
}

export function Settings() {
  const [activeTab, setActiveTab] = useState("iot");
  const [saved, setSaved] = useState(false);

  const [iotDevices, setIotDevices] = useState<IoTDevice[]>([
    { id: "IOT-001", name: "Temp Sensor A1-01", type: "Temperature", interval: "30s", enabled: true },
    { id: "IOT-002", name: "Humidity Sensor A1-02", type: "Humidity", interval: "30s", enabled: true },
    { id: "IOT-003", name: "CO2 Sensor A2-01", type: "Gas", interval: "60s", enabled: true },
    { id: "IOT-004", name: "Moisture Sensor B1-01", type: "Moisture", interval: "60s", enabled: true },
    { id: "IOT-005", name: "Temp Sensor B2-01", type: "Temperature", interval: "30s", enabled: false },
  ]);

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    pushNotifications: true,
    criticalOnly: false,
    dailyDigest: true,
    weeklyReport: true,
  });

  const [capacity, setCapacity] = useState({
    totalCapacity: "20000",
    warningThreshold: "85",
    criticalThreshold: "95",
    autoRedistribute: false,
  });

  const [integrations, setIntegrations] = useState({
    erp: { name: "SAP ERP", connected: true, lastSync: "5 min ago" },
    sms: { name: "Twilio SMS", connected: true, lastSync: "Active" },
    weather: { name: "Weather API", connected: false, lastSync: "Not connected" },
    maps: { name: "Google Maps", connected: true, lastSync: "Active" },
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleDevice = (id: string) => {
    setIotDevices((prev) =>
      prev.map((d) => (d.id === id ? { ...d, enabled: !d.enabled } : d))
    );
  };

  const tabs = [
    { id: "iot", label: "IoT Devices", icon: Radio },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "capacity", label: "Capacity", icon: Warehouse },
    { id: "integrations", label: "Integrations", icon: Plug },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Settings</h1>
          <p className="text-[14px] text-muted-foreground mt-1">
            Configure system preferences and integrations
          </p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-[13px] hover:opacity-90 transition-opacity"
          style={{ fontWeight: 500 }}
        >
          {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-card rounded-2xl border border-border p-1.5 shadow-sm overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted"
            }`}
            style={{ fontWeight: 500 }}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* IoT Configuration */}
      {activeTab === "iot" && (
        <div className="bg-card rounded-2xl border border-border shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3>IoT Device Configuration</h3>
              <p className="text-[13px] text-muted-foreground mt-1">Manage sensor settings and polling intervals</p>
            </div>
            <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border text-[13px] hover:bg-muted transition-colors" style={{ fontWeight: 500 }}>
              <Plus className="w-4 h-4" />
              Add Device
            </button>
          </div>
          <div className="space-y-3">
            {iotDevices.map((device) => (
              <div key={device.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleDevice(device.id)}
                    className={`w-10 h-6 rounded-full transition-colors relative ${
                      device.enabled ? "bg-primary" : "bg-switch-background"
                    }`}
                  >
                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${device.enabled ? "left-5" : "left-1"}`} />
                  </button>
                  <div>
                    <p className="text-[13px]" style={{ fontWeight: 500 }}>{device.name}</p>
                    <p className="text-[11px] text-muted-foreground">{device.id} &middot; {device.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <select className="h-8 px-3 rounded-lg border border-border bg-input-background text-[12px] appearance-none cursor-pointer" defaultValue={device.interval}>
                    <option>10s</option>
                    <option>30s</option>
                    <option>60s</option>
                    <option>5m</option>
                  </select>
                  <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notifications */}
      {activeTab === "notifications" && (
        <div className="bg-card rounded-2xl border border-border shadow-sm p-5 space-y-4">
          <div>
            <h3>Notification Settings</h3>
            <p className="text-[13px] text-muted-foreground mt-1">Configure how you receive alerts and updates</p>
          </div>
          <div className="space-y-3">
            {Object.entries(notifications).map(([key, value]) => {
              const labels: Record<string, { title: string; desc: string }> = {
                emailAlerts: { title: "Email Alerts", desc: "Receive alert notifications via email" },
                smsAlerts: { title: "SMS Alerts", desc: "Get critical alerts via SMS" },
                pushNotifications: { title: "Push Notifications", desc: "Browser push notifications for alerts" },
                criticalOnly: { title: "Critical Only", desc: "Only notify for critical severity alerts" },
                dailyDigest: { title: "Daily Digest", desc: "Summary email of daily warehouse activity" },
                weeklyReport: { title: "Weekly Report", desc: "Comprehensive weekly analytics report" },
              };
              const info = labels[key];
              return (
                <div key={key} className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
                  <div>
                    <p className="text-[13px]" style={{ fontWeight: 500 }}>{info.title}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{info.desc}</p>
                  </div>
                  <button
                    onClick={() => setNotifications((prev) => ({ ...prev, [key]: !value }))}
                    className={`w-10 h-6 rounded-full transition-colors relative ${
                      value ? "bg-primary" : "bg-switch-background"
                    }`}
                  >
                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${value ? "left-5" : "left-1"}`} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Capacity */}
      {activeTab === "capacity" && (
        <div className="bg-card rounded-2xl border border-border shadow-sm p-5 space-y-4">
          <div>
            <h3>Warehouse Capacity Setup</h3>
            <p className="text-[13px] text-muted-foreground mt-1">Configure storage limits and thresholds</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[13px] text-muted-foreground mb-1.5 block">Total Capacity (tons)</label>
              <input
                type="number"
                value={capacity.totalCapacity}
                onChange={(e) => setCapacity((p) => ({ ...p, totalCapacity: e.target.value }))}
                className="w-full h-10 px-4 rounded-xl bg-input-background border border-border text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="text-[13px] text-muted-foreground mb-1.5 block">Warning Threshold (%)</label>
              <input
                type="number"
                value={capacity.warningThreshold}
                onChange={(e) => setCapacity((p) => ({ ...p, warningThreshold: e.target.value }))}
                className="w-full h-10 px-4 rounded-xl bg-input-background border border-border text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="text-[13px] text-muted-foreground mb-1.5 block">Critical Threshold (%)</label>
              <input
                type="number"
                value={capacity.criticalThreshold}
                onChange={(e) => setCapacity((p) => ({ ...p, criticalThreshold: e.target.value }))}
                className="w-full h-10 px-4 rounded-xl bg-input-background border border-border text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
              <div>
                <p className="text-[13px]" style={{ fontWeight: 500 }}>Auto Redistribute</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Automatically suggest redistribution at threshold</p>
              </div>
              <button
                onClick={() => setCapacity((p) => ({ ...p, autoRedistribute: !p.autoRedistribute }))}
                className={`w-10 h-6 rounded-full transition-colors relative ${
                  capacity.autoRedistribute ? "bg-primary" : "bg-switch-background"
                }`}
              >
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${capacity.autoRedistribute ? "left-5" : "left-1"}`} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Integrations */}
      {activeTab === "integrations" && (
        <div className="bg-card rounded-2xl border border-border shadow-sm p-5 space-y-4">
          <div>
            <h3>Integration Settings</h3>
            <p className="text-[13px] text-muted-foreground mt-1">Connect external services and APIs</p>
          </div>
          <div className="space-y-3">
            {Object.entries(integrations).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${value.connected ? "bg-green-100 dark:bg-green-900/30" : "bg-gray-100 dark:bg-gray-800"}`}>
                    <Plug className={`w-5 h-5 ${value.connected ? "text-green-600 dark:text-green-400" : "text-gray-400"}`} />
                  </div>
                  <div>
                    <p className="text-[13px]" style={{ fontWeight: 500 }}>{value.name}</p>
                    <p className="text-[11px] text-muted-foreground">{value.lastSync}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {value.connected && (
                    <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                      <RefreshCw className="w-4 h-4 text-muted-foreground" />
                    </button>
                  )}
                  <button
                    className={`px-3 py-2 rounded-xl text-[12px] transition-colors ${
                      value.connected
                        ? "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
                        : "bg-primary text-primary-foreground hover:opacity-90"
                    }`}
                    style={{ fontWeight: 500 }}
                  >
                    {value.connected ? "Disconnect" : "Connect"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
