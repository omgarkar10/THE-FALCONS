import {
  ShieldCheck,
  ClipboardCheck,
  AlertCircle,
  CheckCircle2,
  XCircle,
  FileText,
} from "lucide-react";

const qualityTests = [
  { id: "QC-001", batch: "WH-2026-001", crop: "Wheat", test: "Moisture Content", result: "12.5%", threshold: "< 14%", status: "Pass", date: "Feb 27" },
  { id: "QC-002", batch: "WH-2026-001", crop: "Wheat", test: "Protein Level", result: "13.2%", threshold: "> 12%", status: "Pass", date: "Feb 27" },
  { id: "QC-003", batch: "RC-2026-012", crop: "Rice", test: "Broken Grains", result: "8%", threshold: "< 5%", status: "Fail", date: "Feb 26" },
  { id: "QC-004", batch: "CN-2026-008", crop: "Corn", test: "Aflatoxin Level", result: "15ppb", threshold: "< 20ppb", status: "Pass", date: "Feb 26" },
  { id: "QC-005", batch: "BL-2026-005", crop: "Barley", test: "Germination Rate", result: "96%", threshold: "> 95%", status: "Pass", date: "Feb 25" },
  { id: "QC-006", batch: "SB-2026-003", crop: "Soybean", test: "Oil Content", result: "18.5%", threshold: "> 18%", status: "Pass", date: "Feb 25" },
  { id: "QC-007", batch: "CN-2026-007", crop: "Corn", test: "Moisture Content", result: "16.2%", threshold: "< 14%", status: "Fail", date: "Feb 24" },
  { id: "QC-008", batch: "RC-2026-011", crop: "Rice", test: "Milling Recovery", result: "68%", threshold: "> 65%", status: "Pass", date: "Feb 24" },
];

const statusIcon: Record<string, React.ReactNode> = {
  Pass: <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />,
  Fail: <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />,
};

const statusStyle: Record<string, string> = {
  Pass: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Fail: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export function QualityControl() {
  const passCount = qualityTests.filter((t) => t.status === "Pass").length;
  const failCount = qualityTests.filter((t) => t.status === "Fail").length;
  const passRate = Math.round((passCount / qualityTests.length) * 100);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1>Quality Control</h1>
          <p className="text-[14px] text-muted-foreground mt-1">
            Monitor grain quality tests and compliance
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-[13px] hover:opacity-90 transition-opacity self-start" style={{ fontWeight: 500 }}>
          <ClipboardCheck className="w-4 h-4" />
          New Test
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-[12px] text-muted-foreground">Tests Passed</p>
              <p className="text-[24px] text-green-600 dark:text-green-400" style={{ fontWeight: 700 }}>{passCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-[12px] text-muted-foreground">Tests Failed</p>
              <p className="text-[24px] text-red-600 dark:text-red-400" style={{ fontWeight: 700 }}>{failCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-[12px] text-muted-foreground">Pass Rate</p>
              <p className="text-[24px]" style={{ fontWeight: 700 }}>{passRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tests Table */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-5 pb-3 flex items-center justify-between">
          <h3>Recent Quality Tests</h3>
          <button className="flex items-center gap-2 text-[13px] text-primary hover:underline" style={{ fontWeight: 500 }}>
            <FileText className="w-4 h-4" />
            Export Report
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-t border-border bg-muted/30">
                <th className="text-left px-5 py-2.5 text-muted-foreground" style={{ fontWeight: 500 }}>Test ID</th>
                <th className="text-left px-5 py-2.5 text-muted-foreground" style={{ fontWeight: 500 }}>Batch</th>
                <th className="text-left px-5 py-2.5 text-muted-foreground" style={{ fontWeight: 500 }}>Crop</th>
                <th className="text-left px-5 py-2.5 text-muted-foreground" style={{ fontWeight: 500 }}>Test</th>
                <th className="text-left px-5 py-2.5 text-muted-foreground" style={{ fontWeight: 500 }}>Result</th>
                <th className="text-left px-5 py-2.5 text-muted-foreground" style={{ fontWeight: 500 }}>Threshold</th>
                <th className="text-left px-5 py-2.5 text-muted-foreground" style={{ fontWeight: 500 }}>Status</th>
                <th className="text-left px-5 py-2.5 text-muted-foreground" style={{ fontWeight: 500 }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {qualityTests.map((test) => (
                <tr key={test.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3" style={{ fontWeight: 500 }}>{test.id}</td>
                  <td className="px-5 py-3 text-muted-foreground">{test.batch}</td>
                  <td className="px-5 py-3">{test.crop}</td>
                  <td className="px-5 py-3">{test.test}</td>
                  <td className="px-5 py-3" style={{ fontWeight: 500 }}>{test.result}</td>
                  <td className="px-5 py-3 text-muted-foreground">{test.threshold}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] ${statusStyle[test.status]}`} style={{ fontWeight: 500 }}>
                      {statusIcon[test.status]}
                      {test.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{test.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
