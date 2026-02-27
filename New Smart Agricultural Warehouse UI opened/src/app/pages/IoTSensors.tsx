import { useState } from "react";
import {
  Radio,
  Wifi,
  WifiOff,
  Battery,
  BatteryLow,
  BatteryWarning,
  Signal,
  RefreshCw,
  Settings,
  X,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";

interface SensorDevice {
  id: string;
  name: string;
  type: string;
  unit: string;
  status: string;
  battery: number;
  signal: number;
  lastPing: string;
  pollingInterval: string;
  alertThresholdHigh: string;
  alertThresholdLow: string;
  enabled: boolean;
}

const initialSensorDevices: SensorDevice[] = [
  { id: "IOT-001", name: "Temp Sensor A1-01", type: "Temperature", unit: "Silo A1", status: "online", battery: 92, signal: 98, lastPing: "30s ago", pollingInterval: "30s", alertThresholdHigh: "35", alertThresholdLow: "5", enabled: true },
  { id: "IOT-002", name: "Humidity Sensor A1-02", type: "Humidity", unit: "Silo A1", status: "online", battery: 85, signal: 95, lastPing: "45s ago", pollingInterval: "30s", alertThresholdHigh: "70", alertThresholdLow: "20", enabled: true },
  { id: "IOT-003", name: "CO2 Sensor A2-01", type: "Gas", unit: "Silo A2", status: "online", battery: 78, signal: 88, lastPing: "1m ago", pollingInterval: "60s", alertThresholdHigh: "600", alertThresholdLow: "200", enabled: true },
  { id: "IOT-004", name: "Moisture Sensor B1-01", type: "Moisture", unit: "Silo B1", status: "online", battery: 45, signal: 72, lastPing: "2m ago", pollingInterval: "60s", alertThresholdHigh: "16", alertThresholdLow: "8", enabled: true },
  { id: "IOT-005", name: "Temp Sensor B2-01", type: "Temperature", unit: "Silo B2", status: "warning", battery: 22, signal: 55, lastPing: "5m ago", pollingInterval: "30s", alertThresholdHigh: "35", alertThresholdLow: "5", enabled: true },
  { id: "IOT-006", name: "Multi Sensor B3-01", type: "Multi", unit: "Silo B3", status: "online", battery: 67, signal: 82, lastPing: "1m ago", pollingInterval: "30s", alertThresholdHigh: "40", alertThresholdLow: "0", enabled: true },
  { id: "IOT-007", name: "Temp Sensor C1-01", type: "Temperature", unit: "Unit C1", status: "offline", battery: 5, signal: 0, lastPing: "3h ago", pollingInterval: "30s", alertThresholdHigh: "35", alertThresholdLow: "5", enabled: false },
  { id: "IOT-008", name: "Humidity Sensor C2-01", type: "Humidity", unit: "Unit C2", status: "online", battery: 91, signal: 96, lastPing: "30s ago", pollingInterval: "30s", alertThresholdHigh: "70", alertThresholdLow: "20", enabled: true },
  { id: "IOT-009", name: "CO2 Sensor D1-01", type: "Gas", unit: "Warehouse D1", status: "online", battery: 88, signal: 90, lastPing: "1m ago", pollingInterval: "60s", alertThresholdHigh: "600", alertThresholdLow: "200", enabled: true },
  { id: "IOT-010", name: "Moisture Sensor D1-02", type: "Moisture", unit: "Warehouse D1", status: "maintenance", battery: 100, signal: 0, lastPing: "1d ago", pollingInterval: "60s", alertThresholdHigh: "16", alertThresholdLow: "8", enabled: false },
];

const unitOptions = ["Silo A1", "Silo A2", "Silo B1", "Silo B2", "Silo B3", "Unit C1", "Unit C2", "Warehouse D1"];
const pollingOptions = ["10s", "30s", "60s", "5m", "15m"];
const typeUnits: Record<string, string> = {
  Temperature: "°C",
  Humidity: "%",
  Gas: "ppm",
  Moisture: "%",
  Multi: "",
};

const statusStyle: Record<string, { bg: string; text: string; dot: string }> = {
  online: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-400", dot: "bg-green-500" },
  offline: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-700 dark:text-red-400", dot: "bg-red-500" },
  warning: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-400", dot: "bg-amber-500" },
  maintenance: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-400", dot: "bg-blue-500" },
};

function BatteryIcon({ level }: { level: number }) {
  if (level < 20) return <BatteryLow className="w-4 h-4 text-red-500" />;
  if (level < 50) return <BatteryWarning className="w-4 h-4 text-amber-500" />;
  return <Battery className="w-4 h-4 text-green-500" />;
}

export function IoTSensors() {
  const [sensorDevices, setSensorDevices] = useState(initialSensorDevices);
  const [configSensor, setConfigSensor] = useState<SensorDevice | null>(null);
  const [configForm, setConfigForm] = useState<SensorDevice | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const onlineCount = sensorDevices.filter((s) => s.status === "online").length;
  const offlineCount = sensorDevices.filter((s) => s.status === "offline").length;

  const openConfig = (sensor: SensorDevice) => {
    setConfigSensor(sensor);
    setConfigForm({ ...sensor });
    setSaveSuccess(false);
  };

  const handleSaveConfig = () => {
    if (!configForm) return;
    setSensorDevices((prev) =>
      prev.map((s) => (s.id === configForm.id ? { ...configForm } : s))
    );
    setSaveSuccess(true);
    setTimeout(() => {
      setConfigSensor(null);
      setConfigForm(null);
      setSaveSuccess(false);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1>IoT Sensors</h1>
          <p className="text-[14px] text-muted-foreground mt-1">
            Manage and monitor connected sensor devices
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-[13px] hover:opacity-90 transition-opacity self-start" style={{ fontWeight: 500 }}>
          <RefreshCw className="w-4 h-4" />
          Sync All
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-card rounded-2xl border border-border p-4 shadow-sm">
          <p className="text-[12px] text-muted-foreground">Total Devices</p>
          <p className="text-[24px] mt-1" style={{ fontWeight: 700 }}>{sensorDevices.length}</p>
        </div>
        <div className="bg-card rounded-2xl border border-border p-4 shadow-sm">
          <p className="text-[12px] text-muted-foreground">Online</p>
          <p className="text-[24px] mt-1 text-green-600 dark:text-green-400" style={{ fontWeight: 700 }}>{onlineCount}</p>
        </div>
        <div className="bg-card rounded-2xl border border-border p-4 shadow-sm">
          <p className="text-[12px] text-muted-foreground">Offline</p>
          <p className="text-[24px] mt-1 text-red-600 dark:text-red-400" style={{ fontWeight: 700 }}>{offlineCount}</p>
        </div>
        <div className="bg-card rounded-2xl border border-border p-4 shadow-sm">
          <p className="text-[12px] text-muted-foreground">Avg Battery</p>
          <p className="text-[24px] mt-1" style={{ fontWeight: 700 }}>
            {Math.round(sensorDevices.reduce((sum, s) => sum + s.battery, 0) / sensorDevices.length)}%
          </p>
        </div>
      </div>

      {/* Sensor Device Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sensorDevices.map((sensor) => {
          const style = statusStyle[sensor.status];
          return (
            <div key={sensor.id} className="bg-card rounded-2xl border border-border p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {sensor.status === "online" ? (
                    <Wifi className="w-5 h-5 text-green-500" />
                  ) : sensor.status === "offline" ? (
                    <WifiOff className="w-5 h-5 text-red-500" />
                  ) : (
                    <Radio className="w-5 h-5 text-amber-500" />
                  )}
                  <div>
                    <p className="text-[13px]" style={{ fontWeight: 600 }}>{sensor.name}</p>
                    <p className="text-[11px] text-muted-foreground">{sensor.id}</p>
                  </div>
                </div>
                <span className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] ${style.bg} ${style.text}`} style={{ fontWeight: 500 }}>
                  <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                  {sensor.status}
                </span>
              </div>

              <div className="space-y-2 text-[12px]">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location</span>
                  <span style={{ fontWeight: 500 }}>{sensor.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <span style={{ fontWeight: 500 }}>{sensor.type}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Battery</span>
                  <span className="flex items-center gap-1.5">
                    <BatteryIcon level={sensor.battery} />
                    <span style={{ fontWeight: 500 }}>{sensor.battery}%</span>
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Signal</span>
                  <span className="flex items-center gap-1.5">
                    <Signal className="w-3.5 h-3.5 text-muted-foreground" />
                    <span style={{ fontWeight: 500 }}>{sensor.signal}%</span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Ping</span>
                  <span className="text-muted-foreground">{sensor.lastPing}</span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-border flex gap-2">
                <button
                  onClick={() => openConfig(sensor)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[12px] bg-muted hover:bg-muted/80 transition-colors" style={{ fontWeight: 500 }}>
                  <Settings className="w-3.5 h-3.5" /> Configure
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[12px] bg-primary/10 text-primary hover:bg-primary/20 transition-colors" style={{ fontWeight: 500 }}>
                  <RefreshCw className="w-3.5 h-3.5" /> Refresh
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Configure Modal */}
      {configSensor && configForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => { setConfigSensor(null); setConfigForm(null); }}>
          <div
            className="bg-card rounded-2xl border border-border shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                  <Settings className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <h2>Configure Sensor</h2>
                  <p className="text-[13px] text-muted-foreground mt-0.5">{configSensor.id}</p>
                </div>
              </div>
              <button onClick={() => { setConfigSensor(null); setConfigForm(null); }} className="p-2 rounded-xl hover:bg-muted transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Success Overlay */}
            {saveSuccess ? (
              <div className="p-12 flex flex-col items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-7 h-7 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-[15px]" style={{ fontWeight: 600 }}>Configuration Saved</p>
                <p className="text-[13px] text-muted-foreground mt-1">Settings applied to {configForm.name}</p>
              </div>
            ) : (
              <>
                {/* Body */}
                <div className="p-5 space-y-5">
                  {/* Device Info */}
                  <div className="p-3 rounded-xl bg-muted/40 border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      {configForm.status === "online" ? (
                        <Wifi className="w-4 h-4 text-green-500" />
                      ) : configForm.status === "offline" ? (
                        <WifiOff className="w-4 h-4 text-red-500" />
                      ) : (
                        <Radio className="w-4 h-4 text-amber-500" />
                      )}
                      <span className="text-[13px]" style={{ fontWeight: 600 }}>{configForm.name}</span>
                      <span className={`ml-auto flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] ${statusStyle[configForm.status].bg} ${statusStyle[configForm.status].text}`} style={{ fontWeight: 500 }}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusStyle[configForm.status].dot}`} />
                        {configForm.status}
                      </span>
                    </div>
                    <div className="flex gap-4 text-[12px] text-muted-foreground">
                      <span>Battery: {configForm.battery}%</span>
                      <span>Signal: {configForm.signal}%</span>
                      <span>Last: {configForm.lastPing}</span>
                    </div>
                  </div>

                  {/* Device Name */}
                  <div>
                    <label className="text-[13px] text-muted-foreground mb-1.5 block">Device Name</label>
                    <input
                      type="text"
                      value={configForm.name}
                      onChange={(e) => setConfigForm((p) => p ? { ...p, name: e.target.value } : p)}
                      className="w-full h-10 px-4 rounded-xl bg-input-background border border-border text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  {/* Location & Type */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[13px] text-muted-foreground mb-1.5 block">Location</label>
                      <div className="relative">
                        <select
                          value={configForm.unit}
                          onChange={(e) => setConfigForm((p) => p ? { ...p, unit: e.target.value } : p)}
                          className="w-full h-10 px-4 rounded-xl bg-input-background border border-border text-[14px] appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                        >
                          {unitOptions.map((u) => <option key={u}>{u}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="text-[13px] text-muted-foreground mb-1.5 block">Sensor Type</label>
                      <input
                        type="text"
                        value={configForm.type}
                        disabled
                        className="w-full h-10 px-4 rounded-xl bg-input-background border border-border text-[14px] text-muted-foreground cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Polling Interval */}
                  <div>
                    <label className="text-[13px] text-muted-foreground mb-1.5 block">Polling Interval</label>
                    <div className="flex gap-2">
                      {pollingOptions.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setConfigForm((p) => p ? { ...p, pollingInterval: opt } : p)}
                          className={`flex-1 py-2 rounded-xl text-[13px] border transition-colors ${
                            configForm.pollingInterval === opt
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-card border-border hover:bg-muted"
                          }`}
                          style={{ fontWeight: 500 }}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Alert Thresholds */}
                  <div>
                    <label className="text-[13px] text-muted-foreground mb-1.5 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Alert Thresholds {typeUnits[configForm.type] && `(${typeUnits[configForm.type]})`}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] text-muted-foreground mb-1 block">Low Threshold</label>
                        <input
                          type="number"
                          value={configForm.alertThresholdLow}
                          onChange={(e) => setConfigForm((p) => p ? { ...p, alertThresholdLow: e.target.value } : p)}
                          className="w-full h-10 px-4 rounded-xl bg-input-background border border-border text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-muted-foreground mb-1 block">High Threshold</label>
                        <input
                          type="number"
                          value={configForm.alertThresholdHigh}
                          onChange={(e) => setConfigForm((p) => p ? { ...p, alertThresholdHigh: e.target.value } : p)}
                          className="w-full h-10 px-4 rounded-xl bg-input-background border border-border text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Enabled Toggle */}
                  <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
                    <div>
                      <p className="text-[13px]" style={{ fontWeight: 500 }}>Sensor Enabled</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">Disable to stop data collection from this sensor</p>
                    </div>
                    <button
                      onClick={() => setConfigForm((p) => p ? { ...p, enabled: !p.enabled } : p)}
                      className={`w-10 h-6 rounded-full transition-colors relative ${
                        configForm.enabled ? "bg-primary" : "bg-switch-background"
                      }`}
                    >
                      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${configForm.enabled ? "left-5" : "left-1"}`} />
                    </button>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-2 p-5 pt-0">
                  <button
                    onClick={() => { setConfigSensor(null); setConfigForm(null); }}
                    className="px-4 py-2.5 rounded-xl border border-border text-[13px] hover:bg-muted transition-colors"
                    style={{ fontWeight: 500 }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveConfig}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-[13px] hover:opacity-90 transition-opacity"
                    style={{ fontWeight: 500 }}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Save Configuration
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}