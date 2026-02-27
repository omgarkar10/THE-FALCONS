import { useState } from "react";
import {
  Search,
  Plus,
  Download,
  Filter,
  ChevronDown,
  MoreHorizontal,
  ArrowUpDown,
  X,
} from "lucide-react";

const initialInventoryData = [
  { id: 1, crop: "Wheat", variety: "Hard Red Winter", quantity: 2400, unit: "Silo A1", grade: "A", entryDate: "2026-02-15", status: "In Storage", batch: "WH-2026-001" },
  { id: 2, crop: "Rice", variety: "Basmati", quantity: 1850, unit: "Silo A2", grade: "A+", entryDate: "2026-02-12", status: "In Storage", batch: "RC-2026-012" },
  { id: 3, crop: "Corn", variety: "Yellow Dent", quantity: 3200, unit: "Silo B1", grade: "B", entryDate: "2026-02-10", status: "In Storage", batch: "CN-2026-008" },
  { id: 4, crop: "Barley", variety: "Malting", quantity: 980, unit: "Silo B2", grade: "A", entryDate: "2026-02-08", status: "Dispatching", batch: "BL-2026-005" },
  { id: 5, crop: "Soybean", variety: "Non-GMO", quantity: 1500, unit: "Unit C1", grade: "B+", entryDate: "2026-02-05", status: "Quality Check", batch: "SB-2026-003" },
  { id: 6, crop: "Wheat", variety: "Soft White", quantity: 1800, unit: "Unit C2", grade: "A", entryDate: "2026-02-03", status: "In Storage", batch: "WH-2026-002" },
  { id: 7, crop: "Rice", variety: "Jasmine", quantity: 2100, unit: "Warehouse D1", grade: "A+", entryDate: "2026-01-28", status: "In Storage", batch: "RC-2026-011" },
  { id: 8, crop: "Corn", variety: "Sweet Corn", quantity: 750, unit: "Silo A1", grade: "C", entryDate: "2026-01-25", status: "Expired", batch: "CN-2026-007" },
];

const cropPrefixes: Record<string, string> = {
  Wheat: "WH",
  Rice: "RC",
  Corn: "CN",
  Barley: "BL",
  Soybean: "SB",
  Oats: "OT",
  Sorghum: "SG",
};

const cropOptions = ["Wheat", "Rice", "Corn", "Barley", "Soybean", "Oats", "Sorghum"];
const unitOptions = ["Silo A1", "Silo A2", "Silo B1", "Silo B2", "Silo B3", "Unit C1", "Unit C2", "Warehouse D1"];
const gradeOptions = ["A+", "A", "B+", "B", "C"];
const statusOptions = ["In Storage", "Quality Check", "Dispatching"];

const statusStyles: Record<string, string> = {
  "In Storage": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Dispatching: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "Quality Check": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Expired: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const gradeStyles: Record<string, string> = {
  "A+": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  A: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  "B+": "bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400",
  B: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  C: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export function Inventory() {
  const [inventoryData, setInventoryData] = useState(initialInventoryData);
  const [search, setSearch] = useState("");
  const [filterCrop, setFilterCrop] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    crop: "Wheat",
    variety: "",
    quantity: "",
    unit: "Silo A1",
    grade: "A",
    status: "In Storage",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const filtered = inventoryData.filter((item) => {
    const matchSearch =
      item.crop.toLowerCase().includes(search.toLowerCase()) ||
      item.batch.toLowerCase().includes(search.toLowerCase()) ||
      item.variety.toLowerCase().includes(search.toLowerCase());
    const matchCrop = filterCrop === "All" || item.crop === filterCrop;
    const matchStatus = filterStatus === "All" || item.status === filterStatus;
    return matchSearch && matchCrop && matchStatus;
  });

  const crops = ["All", ...new Set(inventoryData.map((i) => i.crop))];
  const statuses = ["All", ...new Set(inventoryData.map((i) => i.status))];

  const generateBatchId = (crop: string) => {
    const prefix = cropPrefixes[crop] || crop.substring(0, 2).toUpperCase();
    const existing = inventoryData.filter((i) => i.crop === crop).length;
    return `${prefix}-2026-${String(existing + 1).padStart(3, "0")}`;
  };

  const resetForm = () => {
    setFormData({ crop: "Wheat", variety: "", quantity: "", unit: "Silo A1", grade: "A", status: "In Storage" });
    setFormErrors({});
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.variety.trim()) errors.variety = "Variety is required";
    if (!formData.quantity || Number(formData.quantity) <= 0) errors.quantity = "Enter a valid quantity";
    if (Number(formData.quantity) > 10000) errors.quantity = "Maximum 10,000 tons per entry";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    const today = new Date().toISOString().split("T")[0];
    const newItem = {
      id: inventoryData.length + 1,
      crop: formData.crop,
      variety: formData.variety.trim(),
      quantity: Number(formData.quantity),
      unit: formData.unit,
      grade: formData.grade,
      entryDate: today,
      status: formData.status,
      batch: generateBatchId(formData.crop),
    };
    setInventoryData((prev) => [newItem, ...prev]);
    setShowAddModal(false);
    resetForm();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1>Inventory Management</h1>
          <p className="text-[14px] text-muted-foreground mt-1">
            Track and manage crop storage inventory
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card text-[13px] hover:bg-muted transition-colors" style={{ fontWeight: 500 }}>
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => { resetForm(); setShowAddModal(true); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-[13px] hover:opacity-90 transition-opacity" style={{ fontWeight: 500 }}>
            <Plus className="w-4 h-4" />
            Add Inventory
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-2xl border border-border p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by crop, batch, or variety..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-input-background border border-border text-[14px] placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <select
                value={filterCrop}
                onChange={(e) => setFilterCrop(e.target.value)}
                className="h-10 pl-10 pr-8 rounded-xl bg-input-background border border-border text-[14px] appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                {crops.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="h-10 pl-4 pr-8 rounded-xl bg-input-background border border-border text-[14px] appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                {statuses.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-5 py-3 text-muted-foreground" style={{ fontWeight: 500 }}>
                  <span className="flex items-center gap-1 cursor-pointer hover:text-foreground">Batch <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="text-left px-5 py-3 text-muted-foreground" style={{ fontWeight: 500 }}>Crop</th>
                <th className="text-left px-5 py-3 text-muted-foreground" style={{ fontWeight: 500 }}>Variety</th>
                <th className="text-left px-5 py-3 text-muted-foreground" style={{ fontWeight: 500 }}>
                  <span className="flex items-center gap-1 cursor-pointer hover:text-foreground">Qty (tons) <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="text-left px-5 py-3 text-muted-foreground" style={{ fontWeight: 500 }}>Unit</th>
                <th className="text-left px-5 py-3 text-muted-foreground" style={{ fontWeight: 500 }}>Grade</th>
                <th className="text-left px-5 py-3 text-muted-foreground" style={{ fontWeight: 500 }}>Entry Date</th>
                <th className="text-left px-5 py-3 text-muted-foreground" style={{ fontWeight: 500 }}>Status</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5" style={{ fontWeight: 500 }}>{item.batch}</td>
                  <td className="px-5 py-3.5">{item.crop}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{item.variety}</td>
                  <td className="px-5 py-3.5" style={{ fontWeight: 500 }}>{item.quantity.toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{item.unit}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2 py-0.5 rounded-md text-[11px] ${gradeStyles[item.grade]}`} style={{ fontWeight: 600 }}>
                      {item.grade}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">{item.entryDate}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] ${statusStyles[item.status]}`} style={{ fontWeight: 500 }}>
                      {item.status}
                    </span>
                  </td>
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
        <div className="flex items-center justify-between px-5 py-3 border-t border-border">
          <p className="text-[13px] text-muted-foreground">
            Showing {filtered.length} of {inventoryData.length} entries
          </p>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 rounded-lg text-[13px] bg-primary text-primary-foreground" style={{ fontWeight: 500 }}>1</button>
            <button className="px-3 py-1.5 rounded-lg text-[13px] text-muted-foreground hover:bg-muted transition-colors">2</button>
            <button className="px-3 py-1.5 rounded-lg text-[13px] text-muted-foreground hover:bg-muted transition-colors">3</button>
          </div>
        </div>
      </div>

      {/* Add Inventory Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div
            className="bg-card rounded-2xl border border-border shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div>
                <h2>Add Inventory</h2>
                <p className="text-[13px] text-muted-foreground mt-0.5">Add a new crop batch to storage</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-xl hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              {/* Crop Type */}
              <div>
                <label className="text-[13px] text-muted-foreground mb-1.5 block">Crop Type</label>
                <select
                  value={formData.crop}
                  onChange={(e) => setFormData((p) => ({ ...p, crop: e.target.value }))}
                  className="w-full h-10 px-4 rounded-xl bg-input-background border border-border text-[14px] appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                >
                  {cropOptions.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Variety */}
              <div>
                <label className="text-[13px] text-muted-foreground mb-1.5 block">Variety</label>
                <input
                  type="text"
                  placeholder="e.g. Hard Red Winter"
                  value={formData.variety}
                  onChange={(e) => {
                    setFormData((p) => ({ ...p, variety: e.target.value }));
                    if (formErrors.variety) setFormErrors((p) => ({ ...p, variety: "" }));
                  }}
                  className={`w-full h-10 px-4 rounded-xl bg-input-background border text-[14px] placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    formErrors.variety ? "border-destructive" : "border-border"
                  }`}
                />
                {formErrors.variety && (
                  <p className="text-[12px] text-destructive mt-1">{formErrors.variety}</p>
                )}
              </div>

              {/* Quantity & Grade row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[13px] text-muted-foreground mb-1.5 block">Quantity (tons)</label>
                  <input
                    type="number"
                    placeholder="0"
                    min="1"
                    max="10000"
                    value={formData.quantity}
                    onChange={(e) => {
                      setFormData((p) => ({ ...p, quantity: e.target.value }));
                      if (formErrors.quantity) setFormErrors((p) => ({ ...p, quantity: "" }));
                    }}
                    className={`w-full h-10 px-4 rounded-xl bg-input-background border text-[14px] placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                      formErrors.quantity ? "border-destructive" : "border-border"
                    }`}
                  />
                  {formErrors.quantity && (
                    <p className="text-[12px] text-destructive mt-1">{formErrors.quantity}</p>
                  )}
                </div>
                <div>
                  <label className="text-[13px] text-muted-foreground mb-1.5 block">Quality Grade</label>
                  <select
                    value={formData.grade}
                    onChange={(e) => setFormData((p) => ({ ...p, grade: e.target.value }))}
                    className="w-full h-10 px-4 rounded-xl bg-input-background border border-border text-[14px] appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                  >
                    {gradeOptions.map((g) => (
                      <option key={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Storage Unit & Status row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[13px] text-muted-foreground mb-1.5 block">Storage Unit</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData((p) => ({ ...p, unit: e.target.value }))}
                    className="w-full h-10 px-4 rounded-xl bg-input-background border border-border text-[14px] appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                  >
                    {unitOptions.map((u) => (
                      <option key={u}>{u}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[13px] text-muted-foreground mb-1.5 block">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData((p) => ({ ...p, status: e.target.value }))}
                    className="w-full h-10 px-4 rounded-xl bg-input-background border border-border text-[14px] appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                  >
                    {statusOptions.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Batch ID Preview */}
              <div className="p-3 rounded-xl bg-secondary/50 border border-primary/10">
                <p className="text-[12px] text-muted-foreground">Auto-generated Batch ID</p>
                <p className="text-[14px] text-primary" style={{ fontWeight: 600 }}>
                  {generateBatchId(formData.crop)}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-2 p-5 pt-0">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2.5 rounded-xl border border-border text-[13px] hover:bg-muted transition-colors"
                style={{ fontWeight: 500 }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-[13px] hover:opacity-90 transition-opacity"
                style={{ fontWeight: 500 }}
              >
                <Plus className="w-4 h-4" />
                Add to Inventory
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}