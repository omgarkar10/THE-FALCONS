import { Download, Calendar } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
} from "recharts";

const storageTrends = [
  { month: "Sep", wheat: 3800, rice: 2600, corn: 2200, barley: 1100 },
  { month: "Oct", wheat: 4100, rice: 2800, corn: 2500, barley: 1200 },
  { month: "Nov", wheat: 4400, rice: 3000, corn: 2700, barley: 1350 },
  { month: "Dec", wheat: 4200, rice: 2900, corn: 2800, barley: 1400 },
  { month: "Jan", wheat: 4000, rice: 3100, corn: 2600, barley: 1450 },
  { month: "Feb", wheat: 4200, rice: 3100, corn: 2800, barley: 1500 },
];

const cropMovement = [
  { month: "Sep", inbound: 1200, outbound: 800 },
  { month: "Oct", inbound: 1500, outbound: 1100 },
  { month: "Nov", inbound: 1800, outbound: 1300 },
  { month: "Dec", inbound: 900, outbound: 1600 },
  { month: "Jan", inbound: 1400, outbound: 1200 },
  { month: "Feb", inbound: 1600, outbound: 1000 },
];

const lossData = [
  { month: "Sep", spoilage: 12, pest: 5, handling: 8 },
  { month: "Oct", spoilage: 15, pest: 8, handling: 6 },
  { month: "Nov", spoilage: 10, pest: 3, handling: 7 },
  { month: "Dec", spoilage: 18, pest: 12, handling: 9 },
  { month: "Jan", spoilage: 8, pest: 4, handling: 5 },
  { month: "Feb", spoilage: 6, pest: 2, handling: 4 },
];

const summaryStats = [
  { label: "Total Throughput", value: "24,500 tons", change: "+8.2%" },
  { label: "Avg Storage Duration", value: "42 days", change: "-3 days" },
  { label: "Loss Rate", value: "0.8%", change: "-0.2%" },
  { label: "Capacity Utilization", value: "78%", change: "+5%" },
];

const tooltipStyle = {
  backgroundColor: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: "12px",
  fontSize: "12px",
};

export function Analytics() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1>Reports & Analytics</h1>
          <p className="text-[14px] text-muted-foreground mt-1">
            Storage trends, crop movement, and loss analytics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-card text-[13px]">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span>Last 6 months</span>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-[13px] hover:opacity-90 transition-opacity" style={{ fontWeight: 500 }}>
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryStats.map((stat) => (
          <div key={stat.label} className="bg-card rounded-2xl border border-border p-4 shadow-sm">
            <p className="text-[12px] text-muted-foreground">{stat.label}</p>
            <p className="text-[22px] mt-1" style={{ fontWeight: 700 }}>{stat.value}</p>
            <p className="text-[12px] text-green-600 dark:text-green-400 mt-1" style={{ fontWeight: 500 }}>{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Storage Trends */}
      <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
        <h3 className="mb-1">Storage Trends</h3>
        <p className="text-[13px] text-muted-foreground mb-4">Inventory levels by crop type (tons)</p>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={storageTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
              <YAxis tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "12px" }} />
              <Line type="monotone" dataKey="wheat" stroke="#1B5E20" strokeWidth={2.5} dot={{ r: 3 }} name="Wheat" />
              <Line type="monotone" dataKey="rice" stroke="#4CAF50" strokeWidth={2.5} dot={{ r: 3 }} name="Rice" />
              <Line type="monotone" dataKey="corn" stroke="#F57C00" strokeWidth={2.5} dot={{ r: 3 }} name="Corn" />
              <Line type="monotone" dataKey="barley" stroke="#FFC107" strokeWidth={2.5} dot={{ r: 3 }} name="Barley" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Crop Movement */}
        <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
          <h3 className="mb-1">Crop Movement</h3>
          <p className="text-[13px] text-muted-foreground mb-4">Inbound vs outbound (tons)</p>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cropMovement}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                <YAxis tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "12px" }} />
                <Bar dataKey="inbound" fill="#1B5E20" radius={[4, 4, 0, 0]} name="Inbound" />
                <Bar dataKey="outbound" fill="#F57C00" radius={[4, 4, 0, 0]} name="Outbound" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Loss/Wastage */}
        <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
          <h3 className="mb-1">Loss & Wastage</h3>
          <p className="text-[13px] text-muted-foreground mb-4">By cause category (tons)</p>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={lossData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                <YAxis tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "12px" }} />
                <Area type="monotone" dataKey="spoilage" stackId="1" stroke="#D32F2F" fill="#D32F2F" fillOpacity={0.3} strokeWidth={2} name="Spoilage" />
                <Area type="monotone" dataKey="pest" stackId="1" stroke="#F57C00" fill="#F57C00" fillOpacity={0.3} strokeWidth={2} name="Pest Damage" />
                <Area type="monotone" dataKey="handling" stackId="1" stroke="#FFC107" fill="#FFC107" fillOpacity={0.3} strokeWidth={2} name="Handling Loss" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
