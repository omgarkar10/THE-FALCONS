import {
  Truck,
  ArrowDownLeft,
  ArrowUpRight,
  MapPin,
  Clock,
  Package,
  Calendar,
} from "lucide-react";

const incomingShipments = [
  { id: "SH-IN-001", origin: "Farm District A", crop: "Wheat", quantity: "450 tons", eta: "Today, 2:30 PM", status: "In Transit", truck: "TRK-1045" },
  { id: "SH-IN-002", origin: "Valley Cooperative", crop: "Rice", quantity: "280 tons", eta: "Today, 5:00 PM", status: "Loading", truck: "TRK-1052" },
  { id: "SH-IN-003", origin: "Green Plains Farm", crop: "Corn", quantity: "620 tons", eta: "Tomorrow, 9:00 AM", status: "Scheduled", truck: "TRK-1038" },
];

const outgoingShipments = [
  { id: "SH-OUT-001", destination: "City Mill Co.", crop: "Wheat", quantity: "300 tons", departure: "Today, 11:00 AM", status: "Dispatched", truck: "TRK-1022" },
  { id: "SH-OUT-002", destination: "Export Terminal B", crop: "Barley", quantity: "180 tons", departure: "Today, 3:00 PM", status: "Loading", truck: "TRK-1034" },
  { id: "SH-OUT-003", destination: "Regional Distributor", crop: "Soybean", quantity: "150 tons", departure: "Tomorrow, 8:00 AM", status: "Pending", truck: "TRK-1041" },
];

const dispatchSchedule = [
  { id: 1, shipment: "SH-OUT-004", destination: "Harbor Port C", crop: "Rice", quantity: "500 tons", date: "Feb 28", time: "06:00 AM", priority: "High" },
  { id: 2, shipment: "SH-OUT-005", destination: "Processing Plant D", crop: "Corn", quantity: "320 tons", date: "Feb 28", time: "10:00 AM", priority: "Medium" },
  { id: 3, shipment: "SH-OUT-006", destination: "Retail Warehouse E", crop: "Wheat", quantity: "200 tons", date: "Mar 1", time: "07:00 AM", priority: "Low" },
  { id: 4, shipment: "SH-OUT-007", destination: "Export Terminal A", crop: "Barley", quantity: "400 tons", date: "Mar 1", time: "02:00 PM", priority: "High" },
];

const shipmentStatusStyles: Record<string, string> = {
  "In Transit": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Loading: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Scheduled: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  Dispatched: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Pending: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

const priorityStyles: Record<string, string> = {
  High: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  Medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Low: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

export function Logistics() {
  return (
    <div className="space-y-6">
      <div>
        <h1>Logistics</h1>
        <p className="text-[14px] text-muted-foreground mt-1">
          Manage shipments, dispatches, and delivery tracking
        </p>
      </div>

      {/* Incoming & Outgoing Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Incoming */}
        <div className="bg-card rounded-2xl border border-border shadow-sm">
          <div className="p-5 pb-3 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <ArrowDownLeft className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3>Incoming Shipments</h3>
              <p className="text-[12px] text-muted-foreground">{incomingShipments.length} active</p>
            </div>
          </div>
          <div className="px-5 pb-5 space-y-3">
            {incomingShipments.map((s) => (
              <div key={s.id} className="p-3 rounded-xl border border-border bg-muted/20 hover:bg-muted/40 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-[13px]" style={{ fontWeight: 600 }}>{s.id}</p>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] ${shipmentStatusStyles[s.status]}`} style={{ fontWeight: 500 }}>
                    {s.status}
                  </span>
                </div>
                <div className="space-y-1 text-[12px]">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5" /> {s.origin}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Package className="w-3.5 h-3.5" /> {s.crop} - {s.quantity}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" /> ETA: {s.eta}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Truck className="w-3.5 h-3.5" /> {s.truck}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Outgoing */}
        <div className="bg-card rounded-2xl border border-border shadow-sm">
          <div className="p-5 pb-3 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3>Outgoing Shipments</h3>
              <p className="text-[12px] text-muted-foreground">{outgoingShipments.length} active</p>
            </div>
          </div>
          <div className="px-5 pb-5 space-y-3">
            {outgoingShipments.map((s) => (
              <div key={s.id} className="p-3 rounded-xl border border-border bg-muted/20 hover:bg-muted/40 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-[13px]" style={{ fontWeight: 600 }}>{s.id}</p>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] ${shipmentStatusStyles[s.status]}`} style={{ fontWeight: 500 }}>
                    {s.status}
                  </span>
                </div>
                <div className="space-y-1 text-[12px]">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5" /> {s.destination}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Package className="w-3.5 h-3.5" /> {s.crop} - {s.quantity}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" /> Departure: {s.departure}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Truck className="w-3.5 h-3.5" /> {s.truck}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Truck Tracking Map Placeholder */}
      <div className="bg-card rounded-2xl border border-border shadow-sm p-5">
        <h3 className="mb-1">Truck Tracking</h3>
        <p className="text-[13px] text-muted-foreground mb-4">Live vehicle locations</p>
        <div className="h-[240px] rounded-xl bg-muted/50 border border-border flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-[13px] text-muted-foreground">Map integration placeholder</p>
            <p className="text-[11px] text-muted-foreground mt-1">Connect Google Maps or Mapbox for live tracking</p>
          </div>
        </div>
      </div>

      {/* Dispatch Schedule */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-5 pb-3 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-muted-foreground" />
          <h3>Dispatch Schedule</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-t border-border bg-muted/30">
                <th className="text-left px-5 py-2.5 text-muted-foreground" style={{ fontWeight: 500 }}>Shipment</th>
                <th className="text-left px-5 py-2.5 text-muted-foreground" style={{ fontWeight: 500 }}>Destination</th>
                <th className="text-left px-5 py-2.5 text-muted-foreground" style={{ fontWeight: 500 }}>Crop</th>
                <th className="text-left px-5 py-2.5 text-muted-foreground" style={{ fontWeight: 500 }}>Quantity</th>
                <th className="text-left px-5 py-2.5 text-muted-foreground" style={{ fontWeight: 500 }}>Date</th>
                <th className="text-left px-5 py-2.5 text-muted-foreground" style={{ fontWeight: 500 }}>Time</th>
                <th className="text-left px-5 py-2.5 text-muted-foreground" style={{ fontWeight: 500 }}>Priority</th>
              </tr>
            </thead>
            <tbody>
              {dispatchSchedule.map((item) => (
                <tr key={item.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3" style={{ fontWeight: 500 }}>{item.shipment}</td>
                  <td className="px-5 py-3">{item.destination}</td>
                  <td className="px-5 py-3">{item.crop}</td>
                  <td className="px-5 py-3">{item.quantity}</td>
                  <td className="px-5 py-3 text-muted-foreground">{item.date}</td>
                  <td className="px-5 py-3 text-muted-foreground">{item.time}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] ${priorityStyles[item.priority]}`} style={{ fontWeight: 500 }}>
                      {item.priority}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
